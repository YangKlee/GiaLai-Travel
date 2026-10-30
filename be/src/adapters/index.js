import { setTimeout as delay } from 'node:timers/promises';
import { AppError } from '../shared/app-error.js';

export function createMailAdapter({
  mode = 'disabled',
  send,
  maxAttempts = 2,
  retryDelayMs = 20,
} = {}) {
  if (!['disabled', 'outbox', 'smtp'].includes(mode)) throw new TypeError('Invalid mail adapter mode');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 3) {
    throw new TypeError('maxAttempts must be 1..3');
  }
  if (mode === 'smtp' && typeof send !== 'function') {
    throw new TypeError('SMTP mail adapter requires a send(message) transport');
  }
  const outbox = [];
  return {
    mode,
    enabled: mode !== 'disabled',
    simulated: mode === 'outbox',
    outbox,
    async sendPasswordReset({ to, displayName, resetUrl, expiresAt, requestId }) {
      if (mode === 'disabled') {
        throw new AppError(503, 'MAIL_UNAVAILABLE', 'Dịch vụ gửi thư khôi phục chưa được cấu hình.');
      }
      if (mode === 'outbox') {
        if (outbox.length >= 100) outbox.shift();
        outbox.push({ to, displayName, resetUrl, expiresAt, requestId, simulated: true });
        return { delivered: false, simulated: true, attempts: 1 };
      }
      let lastError;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await send({ to, displayName, resetUrl, expiresAt, requestId, attempt });
          return { delivered: true, simulated: false, attempts: attempt };
        } catch (error) {
          lastError = error;
          if (attempt < maxAttempts) await delay(retryDelayMs * attempt);
        }
      }
      const failure = new Error('MAIL_DELIVERY_FAILED');
      failure.cause = lastError;
      throw failure;
    },
  };
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const SPEED_KMH_BY_MODE = {
  WALK: 4.5,
  MOTORBIKE: 35,
  CAR: 40,
  TAXI: 40,
  BUS: 28,
  MIXED: 32,
};

const COST_PER_KM_BY_MODE = {
  WALK: 0,
  MOTORBIKE: 3000,
  CAR: 8000,
  TAXI: 12000,
  BUS: 0, // fixed 15k
  MIXED: 8000,
};

export function estimateDefaultRouteLeg({
  fromLat,
  fromLon,
  toLat,
  toLon,
  transportMode = 'MOTORBIKE',
}) {
  const distanceMeters = Math.max(50, calculateHaversineDistance(fromLat, fromLon, toLat, toLon));
  const speed = SPEED_KMH_BY_MODE[transportMode] ?? 35;
  const rawSeconds = Math.round((distanceMeters / (speed * 1000)) * 3600);
  const durationSeconds = Math.max(300, rawSeconds); // at least 5 mins

  let estimatedCostVnd = 0;
  const distanceKm = distanceMeters / 1000;
  if (transportMode === 'BUS') {
    estimatedCostVnd = 15000;
  } else if (transportMode === 'WALK') {
    estimatedCostVnd = 0;
  } else {
    const rate = COST_PER_KM_BY_MODE[transportMode] ?? 5000;
    const minCost = transportMode === 'MOTORBIKE' ? 10000 : 25000;
    estimatedCostVnd = Math.max(minCost, Math.round((distanceKm * rate) / 1000) * 1000);
  }

  return {
    distanceMeters,
    durationSeconds,
    transportMode,
    provider: 'gialai-haversine-engine',
    sourceReference: 'Ước tính khoảng cách trắc địa Gia Lai v1',
    verifiedAt: new Date().toISOString(),
    estimatedCostVnd,
  };
}

export function createRoutingAdapter({ estimateLeg, provider = null, mode = 'unconfigured' } = {}) {
  const isEnabled = typeof estimateLeg === 'function' || mode === 'local';
  return {
    enabled: isEnabled,
    provider: provider || (mode === 'local' ? 'gialai-haversine-engine' : null),
    async estimateRouteLeg(input) {
      if (!isEnabled) {
        throw new AppError(503, 'ROUTING_UNAVAILABLE', 'Dịch vụ ước tính tuyến đường chưa được cấu hình.');
      }
      if (typeof estimateLeg === 'function') {
        return estimateLeg(input);
      }
      return estimateDefaultRouteLeg(input);
    },
  };
}

export function buildItineraryPrompt({
  startDate,
  daysCount,
  partySize,
  totalBudgetVnd,
  origin,
  transportMode,
  preferences,
  places = [],
  events = [],
}) {
  const catalogSnippet = places.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    referencePriceVnd: p.referencePriceVnd,
    lat: p.latitude,
    lon: p.longitude,
    duration: p.typicalDurationMinutes || 90,
  }));
  const eventsSnippet = events.map((e) => ({
    id: e.id,
    title: e.title,
    placeId: e.placeId,
    startsAt: e.startsAt,
    endsAt: e.endsAt,
  }));

  return `Bạn là Chuyên gia Du lịch Gia Lai.
Nhiệm vụ: Lập lịch trình thông minh tối ưu cho du khách với các ràng buộc:
- Ngày khởi hành: ${startDate} (${daysCount} ngày)
- Đoàn: ${partySize} khách
- Ngân sách tối đa: ${totalBudgetVnd} VND (nghiêm cấm vượt ngân sách, phải tính vé * số khách + chi phí di chuyển)
- Điểm xuất phát: (${origin.latitude}, ${origin.longitude}) - ${origin.label || 'Trung tâm Pleiku'}
- Phương tiện: ${transportMode}
- Sở thích: ${JSON.stringify(preferences || {})}

Danh sách địa điểm khả dụng:
${JSON.stringify(catalogSnippet)}

Danh sách sự kiện diễn ra:
${JSON.stringify(eventsSnippet)}

Hãy tạo lịch trình khả thi, không trùng lặp thời gian di chuyển và giờ mở cửa.`;
}

export function generatePromptEngineProposal({
  startDate,
  daysCount,
  partySize,
  totalBudgetVnd,
  origin,
  transportMode,
  preferences = {},
  places = [],
  events = [],
  routingAdapter,
}) {
  const promptText = buildItineraryPrompt({
    startDate,
    daysCount,
    partySize,
    totalBudgetVnd,
    origin,
    transportMode,
    preferences,
    places,
    events,
  });

  // Filter or sort places according to preferences
  const preferredCategories = preferences.categories ?? [];
  const sortedPlaces = [...places].sort((a, b) => {
    const aMatch = preferredCategories.includes(a.category) ? 1 : 0;
    const bMatch = preferredCategories.includes(b.category) ? 1 : 0;
    return bMatch - aMatch;
  });

  const stopsPerDay = preferences.pace === 'RELAXED' ? 2 : preferences.pace === 'FAST' ? 4 : 3;
  const days = [];
  const usedRevisionIds = [];
  let placeIndex = 0;

  const baseDate = new Date(`${startDate}T00:00:00.000Z`);

  for (let dayNo = 1; dayNo <= daysCount; dayNo++) {
    const travelDateObj = new Date(baseDate.getTime() + (dayNo - 1) * 86400000);
    const dateStr = travelDateObj.toISOString().slice(0, 10);

    const dayStops = [];
    const dayLegs = [];
    let currentEpochMs = new Date(`${dateStr}T08:00:00.000Z`).getTime();
    let prevLat = origin.latitude;
    let prevLon = origin.longitude;

    for (let s = 1; s <= stopsPerDay; s++) {
      if (sortedPlaces.length === 0) break;
      const place = sortedPlaces[placeIndex % sortedPlaces.length];
      placeIndex++;

      if (place.revisionId && !usedRevisionIds.includes(place.revisionId)) {
        usedRevisionIds.push(place.revisionId);
      }

      const legEstimate = routingAdapter
        ? routingAdapter.estimateDefaultLeg
          ? routingAdapter.estimateDefaultLeg({
              fromLat: prevLat,
              fromLon: prevLon,
              toLat: place.latitude,
              toLon: place.longitude,
              transportMode,
            })
          : estimateDefaultRouteLeg({
              fromLat: prevLat,
              fromLon: prevLon,
              toLat: place.latitude,
              toLon: place.longitude,
              transportMode,
            })
        : estimateDefaultRouteLeg({
            fromLat: prevLat,
            fromLon: prevLon,
            toLat: place.latitude,
            toLon: place.longitude,
            transportMode,
          });

      const arriveEpochMs = currentEpochMs + legEstimate.durationSeconds * 1000;
      const durationMinutes = place.typicalDurationMinutes || 90;
      const departEpochMs = arriveEpochMs + durationMinutes * 60000;

      const arrivesAt = new Date(arriveEpochMs).toISOString();
      const departsAt = new Date(departEpochMs).toISOString();

      const unitPrice = Number(place.referencePriceVnd || 0);
      const ticketCost = unitPrice * partySize;

      dayStops.push({
        placeId: place.id,
        contentRevisionId: place.revisionId,
        placeTitle: place.title,
        sequenceNo: s,
        arrivesAt,
        departsAt,
        estimatedCostVnd: ticketCost,
        note: `Tham quan ${place.title}`,
      });

      dayLegs.push({
        fromStopSequence: s === 1 ? null : s - 1,
        toStopSequence: s,
        distanceMeters: legEstimate.distanceMeters,
        durationSeconds: legEstimate.durationSeconds,
        transportMode,
        provider: legEstimate.provider,
        sourceReference: legEstimate.sourceReference,
        estimatedCostVnd: legEstimate.estimatedCostVnd,
      });

      prevLat = place.latitude;
      prevLon = place.longitude;
      // Add a small 15-minute buffer between stops or lunch break
      const bufferMinutes = s === 1 && stopsPerDay > 2 ? 45 : 15;
      currentEpochMs = departEpochMs + bufferMinutes * 60000;
    }

    days.push({
      dayNumber: dayNo,
      travelDate: dateStr,
      stops: dayStops,
      legs: dayLegs,
    });
  }

  return {
    promptText,
    provider: 'gialai-ai-planner',
    modelName: 'gialai-planner-v1',
    promptVersion: '2026-v1',
    usedRevisionIds,
    days,
  };
}

export function createAiAdapter({
  generateProposal,
  provider = null,
  model = null,
  mode = 'unconfigured',
} = {}) {
  const isEnabled = typeof generateProposal === 'function' || mode === 'prompt-engine';
  return {
    enabled: isEnabled,
    provider: provider || (mode === 'prompt-engine' ? 'gialai-ai-planner' : null),
    model: model || (mode === 'prompt-engine' ? 'gialai-planner-v1' : null),
    async generateItineraryProposal(context) {
      if (!isEnabled) {
        throw new AppError(503, 'AI_UNAVAILABLE', 'Dịch vụ tạo lịch trình AI chưa được cấu hình.');
      }
      if (typeof generateProposal === 'function') {
        return generateProposal(context);
      }
      return generatePromptEngineProposal(context);
    },
  };
}

export function createStorageAdapter({ storeObject, readObject, removeObject } = {}) {
  return {
    enabled: typeof storeObject === 'function' && typeof readObject === 'function',
    async put(asset) {
      if (typeof storeObject !== 'function') {
        throw new AppError(503, 'STORAGE_UNAVAILABLE', 'Kho lưu trữ tệp chưa được cấu hình.');
      }
      return storeObject(asset);
    },
    async get(storageKey) {
      if (typeof readObject !== 'function') {
        throw new AppError(503, 'STORAGE_UNAVAILABLE', 'Kho lưu trữ tệp chưa được cấu hình.');
      }
      return readObject(storageKey);
    },
    async remove(storageKey) {
      if (typeof removeObject === 'function') await removeObject(storageKey);
    },
  };
}
