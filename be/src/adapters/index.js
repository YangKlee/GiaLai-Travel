import fs from 'node:fs';
import path from 'node:path';
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
  const nLat1 = Number(lat1 ?? 13.9833);
  const nLon1 = Number(lon1 ?? 108.0);
  const nLat2 = Number(lat2 ?? 13.9833);
  const nLon2 = Number(lon2 ?? 108.0);
  const R = 6371000; // meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(nLat2 - nLat1);
  const dLon = toRad(nLon2 - nLon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(nLat1)) * Math.cos(toRad(nLat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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

export function toGoogleMapsTravelMode(transportMode = 'MOTORBIKE') {
  if (transportMode === 'WALK') return 'walking';
  if (transportMode === 'BUS') return 'transit';
  return 'driving';
}

export function buildGoogleMapsDirectionsUrl({
  fromLat,
  fromLon,
  toLat,
  toLon,
  transportMode = 'MOTORBIKE',
}) {
  const oLat = Number(fromLat ?? 13.9833).toFixed(6);
  const oLon = Number(fromLon ?? 108.0).toFixed(6);
  const dLat = Number(toLat ?? 13.9833).toFixed(6);
  const dLon = Number(toLon ?? 108.0).toFixed(6);
  const travelmode = toGoogleMapsTravelMode(transportMode);
  return `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLon}&destination=${dLat},${dLon}&travelmode=${travelmode}`;
}

export function buildGoogleMapsDayRouteUrl({ origin, stops = [], transportMode = 'MOTORBIKE' }) {
  const validStops = stops.filter(
    (s) => s && s.latitude != null && s.longitude != null && !Number.isNaN(Number(s.latitude)),
  );
  if (validStops.length === 0) {
    const oLat = Number(origin?.latitude ?? 13.9833).toFixed(6);
    const oLon = Number(origin?.longitude ?? 108.0).toFixed(6);
    return `https://www.google.com/maps/search/?api=1&query=${oLat},${oLon}`;
  }
  const oLat = Number(origin?.latitude ?? 13.9833).toFixed(6);
  const oLon = Number(origin?.longitude ?? 108.0).toFixed(6);
  const last = validStops[validStops.length - 1];
  const dLat = Number(last.latitude).toFixed(6);
  const dLon = Number(last.longitude).toFixed(6);
  const travelmode = toGoogleMapsTravelMode(transportMode);
  const waypoints = validStops
    .slice(0, -1)
    .map((s) => `${Number(s.latitude).toFixed(6)},${Number(s.longitude).toFixed(6)}`)
    .join('|');
  const wpParam = waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : '';
  return `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLon}&destination=${dLat},${dLon}${wpParam}&travelmode=${travelmode}`;
}

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
    sourceReference: 'Khoảng cách & lộ trình Google Maps Gia Lai',
    verifiedAt: new Date().toISOString(),
    estimatedCostVnd,
    googleMapsDirectionsUrl: buildGoogleMapsDirectionsUrl({
      fromLat,
      fromLon,
      toLat,
      toLon,
      transportMode,
    }),
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
  selectedPlaceIds = [],
  customPrompt = null,
  places = [],
  events = [],
}) {
  const resolvedSelectedIds =
    Array.isArray(selectedPlaceIds) && selectedPlaceIds.length > 0
      ? selectedPlaceIds
      : preferences?.selectedPlaceIds ?? [];
  const resolvedCustomPrompt =
    customPrompt || preferences?.customPrompt || preferences?.dietaryNotes || '';

  const catalogSnippet = places.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    referencePriceVnd: p.referencePriceVnd,
    lat: p.latitude,
    lon: p.longitude,
    durationMinutes: p.typicalDurationMinutes || 90,
    bestTimeToVisit: p.bestTimeToVisit || null,
  }));
  const eventsSnippet = events.map((e) => ({
    id: e.id,
    title: e.title,
    placeId: e.placeId,
    startsAt: e.startsAt,
    endsAt: e.endsAt,
  }));

  const preselectedTitles = places
    .filter((p) => resolvedSelectedIds.includes(p.id))
    .map((p) => `${p.title} (ID: ${p.id}, Loại: ${p.category}, Tọa độ: ${p.latitude},${p.longitude})`);

  return `Bạn là Chuyên gia Lập kế hoạch Du lịch Thông minh tỉnh Gia Lai.
Nhiệm vụ: Tạo lộ trình du lịch chi tiết theo từng khung giờ trong ngày (bao gồm đầy đủ giờ đến/đi, khoảng cách, thời gian di chuyển thực tế, địa điểm ăn sáng/ăn trưa/ăn tối/cà phê/nghỉ ngơi và các điểm tham quan) dựa trên yêu cầu của du khách:
- Ngày khởi hành: ${startDate} (${daysCount} ngày)
- Số khách: ${partySize} người
- Ngân sách tối đa: ${totalBudgetVnd} VND (tổng chi phí vé + ăn uống + di chuyển của cả đoàn phải phù hợp ngân sách)
- Điểm xuất phát: (${origin.latitude}, ${origin.longitude}) - ${origin.label || 'TP. Pleiku'}
- Phương tiện di chuyển: ${transportMode}
- Sở thích & Nhịp độ: ${JSON.stringify(preferences || {})}
${resolvedCustomPrompt ? `- Yêu cầu chi tiết của du khách: "${resolvedCustomPrompt}"` : ''}
${
  preselectedTitles.length > 0
    ? `- Các địa điểm du khách đã chọn trước (bắt buộc đưa vào lộ trình): ${preselectedTitles.join('; ')}`
    : ''
}

Danh sách các địa điểm trong CSDL Gia Lai:
${JSON.stringify(catalogSnippet)}

Danh sách sự kiện diễn ra:
${JSON.stringify(eventsSnippet)}

Yêu cầu bắt buộc:
1. Múi giờ tại Gia Lai là GMT+7 (UTC+7). Trường "arrivesAt" và "departsAt" trả về chuỗi ISO 8601 UTC (YYYY-MM-DDTHH:mm:ss.000Z) được quy đổi chính xác từ giờ Việt Nam (Ví dụ: 07:00 sáng giờ VN = 00:00:00.000Z; 07:30 sáng giờ VN = 00:30:00.000Z; 08:00 sáng giờ VN = 01:00:00.000Z; 11:30 trưa giờ VN = 04:30:00.000Z; 18:00 tối giờ VN = 11:00:00.000Z).
2. Lịch trình mỗi ngày phải thực tế, liền mạch theo thời gian: có ăn sáng (VD 07:00-07:30), thời gian xuất phát di chuyển thực tế giữa các điểm (VD 07:30-08:00 di chuyển), tham quan buổi sáng, ăn trưa & nghỉ trưa, tham quan buổi chiều, ăn tối & nghỉ đêm.
3. TỐI ƯU HÓA THEO "THỜI GIAN VÀNG" (bestTimeToVisit):
   - Trong danh sách các địa điểm CSDL Gia Lai, mỗi địa điểm có thông tin "bestTimeToVisit" ghi rõ khoảng thời gian đẹp nhất trong ngày hoặc trong năm (Ví dụ: "05:30 - 07:30 (Săn mây, ngắm bình minh)", "16:30 - 18:00 (Ngắm hoàng hôn rực rỡ)", "Buổi sáng 07:00 - 09:30 (Khí hậu mát mẻ)", "Buổi tối 18:30 - 21:30 (Chợ đêm, ẩm thực, dạo mát)").
   - AI BẮT BUỘC PHẢI DỰA VÀO "bestTimeToVisit" ĐỂ XẾP KHUNG GIỜ GHÉ THĂM ("arrivesAt" - "departsAt") TRÙNG KHỚP HOẶC TỐI ƯU NHẤT:
     + Địa điểm có thời gian vàng bình minh / săn mây / sáng sớm (Biển Hồ, Chư Đang Ya, Hàng thông trăm tuổi...): xếp vào khung giờ sáng sớm (05:30 - 08:30 sáng).
     + Địa điểm có thời gian vàng hoàng hôn / chiều tà (Đập Tân Sơn, Hồ Ayun Hạ, Đồi thông...): xếp vào khung giờ cuối buổi chiều (16:00 - 18:00 chiều).
     + Địa điểm có thời gian vàng buổi tối / chợ đêm (Quảng trường Đại Đoàn Kết, Chợ đêm Pleiku...): xếp vào buổi tối (sau 18:30 tối).
     + Các điểm văn hóa, bảo tàng, chùa chiền hoặc quán cà phê nghỉ chân: xếp xen kẽ giữa trưa hoặc đầu giờ chiều để tránh nắng gắt.
   - Trong trường "note" của mỗi điểm dừng (stop), ghi rõ lý do xếp giờ và nhấn mạnh thời gian vàng (Ví dụ: "✨ Thời gian vàng: 05:30 - 07:30 · Đến lúc 06:00 để săn mây và đón bình minh tuyệt đẹp trên mặt hồ").
4. Với mỗi điểm dừng (stop):
   - Nếu là địa điểm tham quan có trong Danh sách CSDL: điền đúng "placeId" từ Danh sách CSDL.
   - Nếu là địa điểm ăn sáng / ăn trưa / ăn tối / cà phê / khách sạn lưu trú thực tế tại Gia Lai (như Phở khô Ngọc Sơn, Gà nướng cơm lam, Cà phê Pleiku, Khách sạn/Homestay...): ghi rõ tên địa điểm thực tế vào "placeTitle", tọa độ thực tế vào "latitude" và "longitude", và gán "placeId" bằng ID của địa điểm CSDL gần đó nhất.
   - Cung cấp "distanceMeters" (khoảng cách mét từ điểm trước đó), "durationSeconds" (thời gian di chuyển thực tế tính bằng giây từ điểm trước đó), "transportCostVnd" (chi phí di chuyển chặng đó) và "estimatedCostVnd" (chi phí ăn uống/vé tại điểm dừng cho cả đoàn).
5. Trả về DUY NHẤT một đối tượng JSON hợp lệ theo đúng cấu trúc sau:
{
  "summary": "Tóm tắt lộ trình chi tiết do AI thiết kế",
  "days": [
    {
      "dayNumber": 1,
      "travelDate": "${startDate}",
      "daySummary": "Tóm tắt hành trình Ngày 1",
      "stops": [
        {
          "placeId": "uuid-tu-danh-sach-csdl",
          "placeTitle": "Tên địa điểm ăn uống / tham quan / nghỉ ngơi",
          "placeCategory": "FOOD | NATURE | CULTURE | ADVENTURE | STAY | OTHER",
          "activityType": "BREAKFAST | CAFE | VISIT | LUNCH | DINNER | STAY",
          "latitude": 13.981,
          "longitude": 108.002,
          "sequenceNo": 1,
          "arrivesAt": "${startDate}T00:00:00.000Z",
          "departsAt": "${startDate}T00:30:00.000Z",
          "estimatedCostVnd": 100000,
          "distanceMeters": 1500,
          "durationSeconds": 300,
          "transportCostVnd": 10000,
          "bestTimeToVisit": "Thời gian vàng của địa điểm nếu có",
          "note": "✨ Thời gian vàng: ... · Mô tả hoạt động chi tiết"
        }
      ]
    }
  ]
}`;
}

function extractJsonObject(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1].trim() : trimmed;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
  try {
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
  } catch {
    return null;
  }
}

export function normalizeAiProposalSchedule({
  rawDays = [],
  summary = null,
  startDate,
  origin,
  transportMode = 'MOTORBIKE',
  places = [],
}) {
  const placesById = new Map(places.map((p) => [p.id, p]));
  const usedRevisionIds = [];
  const baseDate = new Date(`${startDate}T00:00:00.000Z`);
  const normalizedDays = [];

  for (let dIdx = 0; dIdx < rawDays.length; dIdx++) {
    const rawDay = rawDays[dIdx] || {};
    const dayNo = Number(rawDay.dayNumber || dIdx + 1);
    const expectedDateStr = new Date(baseDate.getTime() + (dayNo - 1) * 86400000)
      .toISOString()
      .slice(0, 10);
    const dateStr =
      typeof rawDay.travelDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDay.travelDate)
        ? rawDay.travelDate
        : expectedDateStr;

    const rawStops = Array.isArray(rawDay.stops) ? rawDay.stops : [];
    const dayStops = [];
    const dayLegs = [];

    let prevLat = Number(origin?.latitude ?? 13.9833);
    let prevLon = Number(origin?.longitude ?? 108.0);
    let prevLabel = origin?.label || 'Điểm xuất phát';
    let prevDepartIso = null;

    for (let sIdx = 0; sIdx < rawStops.length; sIdx++) {
      const rawStop = rawStops[sIdx] || {};
      let dbPlace = placesById.get(rawStop.placeId);
      if (!dbPlace && rawStop.placeTitle) {
        const lowerTitle = String(rawStop.placeTitle).toLowerCase();
        dbPlace = places.find((p) => p.title.toLowerCase().includes(lowerTitle));
      }
      if (!dbPlace && places.length > 0) {
        // Find nearest DB place by coordinates for foreign-key reference only
        const stopLat = Number(rawStop.latitude ?? prevLat);
        const stopLon = Number(rawStop.longitude ?? prevLon);
        let best = places[0];
        let bestDist = Infinity;
        for (const candidate of places) {
          const d = calculateHaversineDistance(stopLat, stopLon, candidate.latitude, candidate.longitude);
          if (d < bestDist) {
            bestDist = d;
            best = candidate;
          }
        }
        dbPlace = best;
      }

      const placeId = dbPlace?.id || rawStop.placeId;
      if (!placeId) continue;

      if (dbPlace?.revisionId && !usedRevisionIds.includes(dbPlace.revisionId)) {
        usedRevisionIds.push(dbPlace.revisionId);
      }

      const seqNo = dayStops.length + 1;
      // Strictly preserve AI's returned placeTitle, category, coordinates, times, cost, and note!
      const placeTitle = rawStop.placeTitle || dbPlace?.title || placeId;
      const placeCategory = rawStop.placeCategory || dbPlace?.category || 'OTHER';
      const toLat =
        rawStop.latitude != null && !Number.isNaN(Number(rawStop.latitude))
          ? Number(rawStop.latitude)
          : Number(dbPlace?.latitude ?? prevLat);
      const toLon =
        rawStop.longitude != null && !Number.isNaN(Number(rawStop.longitude))
          ? Number(rawStop.longitude)
          : Number(dbPlace?.longitude ?? prevLon);

      const arrivesAt = new Date(rawStop.arrivesAt).toISOString();
      const departsAt = new Date(rawStop.departsAt).toISOString();
      const estimatedCostVnd =
        rawStop.estimatedCostVnd != null ? Number(rawStop.estimatedCostVnd) : 0;

      const distanceMeters =
        rawStop.distanceMeters != null && Number(rawStop.distanceMeters) > 0
          ? Math.round(Number(rawStop.distanceMeters))
          : Math.max(50, calculateHaversineDistance(prevLat, prevLon, toLat, toLon));

      const durationSeconds =
        rawStop.durationSeconds != null && Number(rawStop.durationSeconds) > 0
          ? Math.round(Number(rawStop.durationSeconds))
          : Math.max(300, Math.round((distanceMeters / (35 * 1000)) * 3600));

      const transportCostVnd =
        rawStop.transportCostVnd != null ? Number(rawStop.transportCostVnd) : 0;

      const legDepartsAt =
        prevDepartIso ||
        new Date(Date.parse(arrivesAt) - durationSeconds * 1000).toISOString();

      dayStops.push({
        placeId,
        contentRevisionId: dbPlace?.revisionId ?? null,
        placeTitle,
        placeCategory,
        latitude: toLat,
        longitude: toLon,
        activityType: rawStop.activityType || 'VISIT',
        sequenceNo: seqNo,
        arrivesAt,
        departsAt,
        estimatedCostVnd,
        bestTimeToVisit: rawStop.bestTimeToVisit || dbPlace?.bestTimeToVisit || null,
        note: rawStop.note || null,
      });

      dayLegs.push({
        fromStopSequence: seqNo === 1 ? null : seqNo - 1,
        toStopSequence: seqNo,
        fromLabel: prevLabel,
        toLabel: placeTitle,
        fromLatitude: prevLat,
        fromLongitude: prevLon,
        toLatitude: toLat,
        toLongitude: toLon,
        departsAt: legDepartsAt,
        arrivesAt,
        distanceMeters,
        durationSeconds,
        transportMode,
        provider: 'ai-google-maps-route',
        sourceReference: 'Lộ trình AI & Google Maps',
        estimatedCostVnd: transportCostVnd,
        googleMapsDirectionsUrl: buildGoogleMapsDirectionsUrl({
          fromLat: prevLat,
          fromLon: prevLon,
          toLat,
          toLon,
          transportMode,
        }),
      });

      prevLat = toLat;
      prevLon = toLon;
      prevLabel = placeTitle;
      prevDepartIso = departsAt;
    }

    normalizedDays.push({
      dayNumber: dayNo,
      travelDate: dateStr,
      daySummary: rawDay.daySummary || null,
      googleMapsDayRouteUrl: buildGoogleMapsDayRouteUrl({
        origin,
        stops: dayStops,
        transportMode,
      }),
      stops: dayStops,
      legs: dayLegs,
    });
  }

  return {
    summary,
    usedRevisionIds,
    days: normalizedDays,
  };
}

function resolveGeminiModelCandidates(requestedModel) {
  const normalized =
    requestedModel === 'gemini-3.0-flash-lite'
      ? 'gemini-3.1-flash-lite'
      : requestedModel || 'gemini-3.1-flash-lite';
  return [...new Set([normalized, 'gemini-3.1-flash-lite', 'gemini-2.5-flash'])];
}

export async function callGeminiItineraryApi({
  apiKey,
  model = 'gemini-3.1-flash-lite',
  promptText,
  fetchImpl = globalThis.fetch,
}) {
  const candidates = resolveGeminiModelCandidates(model);
  let lastError = null;

  for (const candidateModel of candidates) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      candidateModel,
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (response.status === 404 && candidateModel !== candidates[candidates.length - 1]) {
      lastError = new Error(`GEMINI_HTTP_404_${candidateModel}`);
      continue;
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`GEMINI_HTTP_${response.status}: ${errText.slice(0, 200)}`);
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = extractJsonObject(text);
    if (!parsed || !Array.isArray(parsed.days)) {
      throw new Error('GEMINI_INVALID_JSON_SCHEMA');
    }
    return { parsed, usedModel: candidateModel };
  }

  throw lastError || new Error('GEMINI_UNAVAILABLE');
}

export async function callOpenAiItineraryApi({
  apiKey,
  model = 'gpt-4o-mini',
  baseUrl = 'https://api.openai.com/v1',
  promptText,
  fetchImpl = globalThis.fetch,
}) {
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Bạn là trợ lý AI chuyên lập lộ trình du lịch thông minh tỉnh Gia Lai. Luôn trả về duy nhất một đối tượng JSON hợp lệ theo yêu cầu.',
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OPENAI_HTTP_${response.status}`);
  }

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content || '';
  const parsed = extractJsonObject(text);
  if (!parsed || !Array.isArray(parsed.days)) {
    throw new Error('OPENAI_INVALID_JSON_SCHEMA');
  }
  return parsed;
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

  const preferredCategories = preferences?.categories ?? [];
  const sortedPlaces = [...places].sort((a, b) => {
    const aMatch = preferredCategories.includes(a.category) ? 1 : 0;
    const bMatch = preferredCategories.includes(b.category) ? 1 : 0;
    return bMatch - aMatch;
  });

  function getTimeSlotAffinity(p) {
    const text = (p.bestTimeToVisit || '').toLowerCase();
    if (
      text.includes('sáng') ||
      text.includes('bình minh') ||
      text.includes('mây') ||
      text.includes('05:') ||
      text.includes('06:') ||
      text.includes('07:') ||
      text.includes('08:')
    ) {
      return 'MORNING';
    }
    if (
      text.includes('hoàng hôn') ||
      text.includes('tối') ||
      text.includes('đêm') ||
      text.includes('chợ đêm') ||
      text.includes('16:30') ||
      text.includes('17:') ||
      text.includes('18:') ||
      text.includes('19:') ||
      text.includes('20:')
    ) {
      return 'EVENING';
    }
    return 'MIDDAY';
  }

  const stopsPerDay =
    preferences?.pace === 'RELAXED' ? 2 : preferences?.pace === 'FAST' ? 4 : 3;
  const days = [];
  const usedRevisionIds = [];
  const pickedPlaceIds = new Set();

  const baseDate = new Date(`${startDate}T00:00:00.000Z`);

  for (let dayNo = 1; dayNo <= daysCount; dayNo++) {
    const travelDateObj = new Date(baseDate.getTime() + (dayNo - 1) * 86400000);
    const dateStr = travelDateObj.toISOString().slice(0, 10);

    const dayStops = [];
    const dayLegs = [];
    let currentEpochMs = new Date(`${dateStr}T01:00:00.000Z`).getTime();
    let prevLat = origin.latitude;
    let prevLon = origin.longitude;

    for (let s = 1; s <= stopsPerDay; s++) {
      if (sortedPlaces.length === 0) break;

      const targetAffinity = s === 1 ? 'MORNING' : s === stopsPerDay ? 'EVENING' : 'MIDDAY';
      let place = sortedPlaces.find(
        (p) => !pickedPlaceIds.has(p.id) && getTimeSlotAffinity(p) === targetAffinity,
      );
      if (!place) {
        place = sortedPlaces.find((p) => !pickedPlaceIds.has(p.id));
      }
      if (!place) {
        place = sortedPlaces[(dayNo * stopsPerDay + s) % sortedPlaces.length];
      }
      pickedPlaceIds.add(place.id);

      if (place.revisionId && !usedRevisionIds.includes(place.revisionId)) {
        usedRevisionIds.push(place.revisionId);
      }

      const legEstimate =
        routingAdapter && typeof routingAdapter.estimateDefaultLeg === 'function'
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
            });

      const arriveEpochMs = currentEpochMs + legEstimate.durationSeconds * 1000;
      const durationMinutes = place.typicalDurationMinutes || 90;
      const departEpochMs = arriveEpochMs + durationMinutes * 60000;

      const arrivesAt = new Date(arriveEpochMs).toISOString();
      const departsAt = new Date(departEpochMs).toISOString();

      const unitPrice = Number(place.referencePriceVnd || 0);
      const ticketCost = unitPrice * partySize;

      const stopNote = place.bestTimeToVisit
        ? `Tham quan ${place.title} · ✨ Thời gian vàng: ${place.bestTimeToVisit}`
        : `Tham quan ${place.title}`;

      dayStops.push({
        placeId: place.id,
        contentRevisionId: place.revisionId,
        placeTitle: place.title,
        placeCategory: place.category,
        latitude: Number(place.latitude),
        longitude: Number(place.longitude),
        sequenceNo: s,
        arrivesAt,
        departsAt,
        estimatedCostVnd: ticketCost,
        bestTimeToVisit: place.bestTimeToVisit || null,
        note: stopNote,
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
        googleMapsDirectionsUrl: legEstimate.googleMapsDirectionsUrl,
      });

      prevLat = place.latitude;
      prevLon = place.longitude;
      const bufferMinutes = s === 1 && stopsPerDay > 2 ? 45 : 15;
      currentEpochMs = departEpochMs + bufferMinutes * 60000;
    }

    days.push({
      dayNumber: dayNo,
      travelDate: dateStr,
      googleMapsDayRouteUrl: buildGoogleMapsDayRouteUrl({
        origin,
        stops: dayStops,
        transportMode,
      }),
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

function readLiveEnvConfig() {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'be', '.env'),
  ];
  const parsed = {};
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const rawLine of content.split(/\r?\n/)) {
          const line = rawLine.trim();
          if (!line || line.startsWith('#')) continue;
          const eqIdx = line.indexOf('=');
          if (eqIdx === -1) continue;
          const k = line.slice(0, eqIdx).trim();
          const v = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          parsed[k] = v;
        }
      } catch {
        // ignore
      }
      break;
    }
  }
  return parsed;
}

export function createAiAdapter({
  generateProposal,
  provider = null,
  model = null,
  mode = 'unconfigured',
  geminiApiKey = '',
  geminiModel = '',
  openaiApiKey = '',
  openaiModel = '',
  openaiBaseUrl = '',
  fetchImpl = globalThis.fetch,
} = {}) {
  const isEnabled =
    typeof generateProposal === 'function' ||
    ['prompt-engine', 'auto', 'gemini', 'openai'].includes(mode);

  return {
    enabled: isEnabled,
    provider: provider || (mode === 'prompt-engine' ? 'gialai-ai-planner' : 'google-gemini'),
    model: model || geminiModel || 'gemini-3.1-flash-lite',
    async generateItineraryProposal(context) {
      if (!isEnabled) {
        throw new AppError(503, 'AI_UNAVAILABLE', 'Dịch vụ tạo lịch trình AI chưa được cấu hình.');
      }
      if (typeof generateProposal === 'function') {
        return generateProposal(context);
      }
      if (mode === 'prompt-engine') {
        return generatePromptEngineProposal(context);
      }

      const liveEnv = readLiveEnvConfig();
      const activeGeminiKey =
        geminiApiKey || liveEnv.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
      const activeGeminiModel =
        geminiModel || liveEnv.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
      const activeOpenAiKey =
        openaiApiKey || liveEnv.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
      const activeOpenAiModel =
        openaiModel || liveEnv.OPENAI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const activeOpenAiBaseUrl =
        openaiBaseUrl ||
        liveEnv.OPENAI_BASE_URL ||
        process.env.OPENAI_BASE_URL ||
        'https://api.openai.com/v1';

      const promptText = buildItineraryPrompt(context);
      const useGemini =
        (mode === 'gemini' || mode === 'auto') && Boolean(activeGeminiKey);
      const useOpenAi =
        (mode === 'openai' || (mode === 'auto' && !useGemini)) && Boolean(activeOpenAiKey);

      if (useGemini) {
        try {
          const { parsed, usedModel } = await callGeminiItineraryApi({
            apiKey: activeGeminiKey,
            model: activeGeminiModel,
            promptText,
            fetchImpl,
          });
          const normalized = normalizeAiProposalSchedule({
            rawDays: parsed.days,
            summary: parsed.summary || null,
            startDate: context.startDate,
            origin: context.origin,
            transportMode: context.transportMode,
            places: context.places,
          });
          return {
            promptText,
            provider: 'google-gemini',
            modelName: usedModel,
            promptVersion: '2026-v2',
            summary: normalized.summary,
            usedRevisionIds: normalized.usedRevisionIds,
            days: normalized.days,
          };
        } catch (error) {
          throw new AppError(
            503,
            'AI_PROVIDER_ERROR',
            `Lỗi khi gọi Google Gemini API: ${error.message}`,
          );
        }
      }

      if (useOpenAi) {
        try {
          const parsed = await callOpenAiItineraryApi({
            apiKey: activeOpenAiKey,
            model: activeOpenAiModel,
            baseUrl: activeOpenAiBaseUrl,
            promptText,
            fetchImpl,
          });
          const normalized = normalizeAiProposalSchedule({
            rawDays: parsed.days,
            summary: parsed.summary || null,
            startDate: context.startDate,
            origin: context.origin,
            transportMode: context.transportMode,
            places: context.places,
          });
          return {
            promptText,
            provider: 'openai',
            modelName: activeOpenAiModel,
            promptVersion: '2026-v2',
            summary: normalized.summary,
            usedRevisionIds: normalized.usedRevisionIds,
            days: normalized.days,
          };
        } catch (error) {
          throw new AppError(
            503,
            'AI_PROVIDER_ERROR',
            `Lỗi khi gọi OpenAI API: ${error.message}`,
          );
        }
      }

      throw new AppError(
        503,
        'AI_UNAVAILABLE',
        'Chưa cấu hình GEMINI_API_KEY hoặc OPENAI_API_KEY trong file .env.',
      );
    },
  };
}

export function createAiAdapterFromConfig(aiConfig = {}, options = {}) {
  const providerMode = aiConfig.provider || 'auto';
  return createAiAdapter({
    mode: providerMode,
    geminiApiKey: aiConfig.geminiApiKey || process.env.GEMINI_API_KEY || '',
    geminiModel: aiConfig.geminiModel || process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
    openaiApiKey: aiConfig.openaiApiKey || process.env.OPENAI_API_KEY || '',
    openaiModel: aiConfig.openaiModel || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    openaiBaseUrl:
      aiConfig.openaiBaseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    ...options,
  });
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
