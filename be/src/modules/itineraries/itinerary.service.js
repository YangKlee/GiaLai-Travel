import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { appendAudit } from '../../shared/audit.js';
import { resolveNow, serializeUtc } from '../../shared/time.js';
import {
  buildGoogleMapsDayRouteUrl,
  buildGoogleMapsDirectionsUrl,
} from '../../adapters/index.js';
import { createItineraryRepository } from './itinerary.repository.js';
import { validateProposalSchedule } from './itinerary.validator.js';

function requireUser(actor) {
  if (!actor || !actor.user || !actor.user.id) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Vui lòng đăng nhập để thực hiện chức năng này.');
  }
}

function mapPlaceRow(p) {
  const plain = p.get ? p.get({ plain: true }) : p;
  const rev = plain.content?.published_revision;
  const translation = rev?.content_translations?.[0];

  return {
    id: plain.id,
    contentId: plain.content_id,
    revisionId: rev?.id ?? null,
    title: translation?.title ?? plain.id,
    category: plain.category,
    latitude: Number(plain.latitude),
    longitude: Number(plain.longitude),
    referencePriceVnd: plain.reference_price_vnd ? String(plain.reference_price_vnd) : '0',
    typicalDurationMinutes: plain.typical_duration_minutes ?? 90,
    openingHours: plain.place_opening_hours ?? [],
  };
}

function mapEventRow(e) {
  const plain = e.get ? e.get({ plain: true }) : e;
  const rev = plain.content?.published_revision;
  const translation = rev?.content_translations?.[0];
  return {
    id: plain.id,
    contentId: plain.content_id,
    revisionId: rev?.id ?? null,
    placeId: plain.place_id,
    title: translation?.title ?? plain.id,
    startsAt: serializeUtc(plain.starts_at),
    endsAt: serializeUtc(plain.ends_at),
    ticketPriceVnd: '0',
  };
}

function formatItineraryDetail(itinerary, legs = []) {
  const plain = itinerary.get ? itinerary.get({ plain: true }) : itinerary;
  const rev = plain.current_revision;
  const origin = rev
    ? {
        latitude: Number(rev.departure_latitude),
        longitude: Number(rev.departure_longitude),
      }
    : { latitude: 13.9833, longitude: 108.0 };
  const transportMode = rev?.transport_mode || 'MOTORBIKE';

  const legsByDayId = new Map();
  for (const leg of legs) {
    const lPlain = leg.get ? leg.get({ plain: true }) : leg;
    const dayId = lPlain.day_id;
    if (!legsByDayId.has(dayId)) legsByDayId.set(dayId, []);
    legsByDayId.get(dayId).push({
      id: lPlain.id,
      fromStopId: lPlain.from_stop_id,
      toStopId: lPlain.to_stop_id,
      distanceMeters: Number(lPlain.distance_meters),
      durationSeconds: Number(lPlain.duration_seconds),
      transportMode: lPlain.transport_mode,
      provider: lPlain.provider,
      sourceReference: lPlain.source_reference,
      estimatedCostVnd: Number(lPlain.estimated_cost_vnd),
    });
  }

  const days = (rev?.itinerary_days ?? [])
    .sort((a, b) => a.day_number - b.day_number)
    .map((d) => {
      const stops = (d.itinerary_stops ?? [])
        .sort((a, b) => a.sequence_no - b.sequence_no)
        .map((s) => {
          const meta = s.cost_breakdown && typeof s.cost_breakdown === 'object' ? s.cost_breakdown : {};
          const lat =
            meta.latitude != null
              ? Number(meta.latitude)
              : s.place?.latitude != null
                ? Number(s.place.latitude)
                : null;
          const lon =
            meta.longitude != null
              ? Number(meta.longitude)
              : s.place?.longitude != null
                ? Number(s.place.longitude)
                : null;
          return {
            id: s.id,
            placeId: s.place_id,
            placeTitle:
              meta.placeTitle ||
              s.place?.content?.published_revision?.content_translations?.[0]?.title ||
              'Địa điểm',
            placeCategory: meta.placeCategory || s.place?.category || undefined,
            activityType: meta.activityType || undefined,
            latitude: lat,
            longitude: lon,
            contentRevisionId: s.content_revision_id,
            eventId: s.event_id ?? null,
            sequenceNo: s.sequence_no,
            arrivesAt: serializeUtc(s.arrives_at),
            departsAt: serializeUtc(s.departs_at),
            estimatedCostVnd: Number(s.estimated_cost_vnd),
            note: s.note ?? null,
          };
        });

      const stopById = new Map(stops.map((st) => [st.id, st]));
      const rawDayLegs = legsByDayId.get(d.id) ?? [];
      const enrichedLegs = rawDayLegs.map((l, lIdx) => {
        const fromStop = l.fromStopId ? stopById.get(l.fromStopId) : null;
        const toStop = l.toStopId ? stopById.get(l.toStopId) : stops[lIdx] ?? null;
        const fromLat = fromStop?.latitude ?? origin.latitude;
        const fromLon = fromStop?.longitude ?? origin.longitude;
        const toLat = toStop?.latitude ?? origin.latitude;
        const toLon = toStop?.longitude ?? origin.longitude;
        return {
          ...l,
          fromStopSequence: fromStop ? fromStop.sequenceNo : null,
          toStopSequence: toStop ? toStop.sequenceNo : lIdx + 1,
          fromLabel: fromStop ? fromStop.placeTitle : 'Điểm xuất phát',
          toLabel: toStop ? toStop.placeTitle : 'Điểm đến',
          fromLatitude: fromLat,
          fromLongitude: fromLon,
          toLatitude: toLat,
          toLongitude: toLon,
          googleMapsDirectionsUrl: buildGoogleMapsDirectionsUrl({
            fromLat,
            fromLon,
            toLat,
            toLon,
            transportMode: l.transportMode || transportMode,
          }),
        };
      });

      return {
        id: d.id,
        dayNumber: d.day_number,
        travelDate: d.travel_date,
        googleMapsDayRouteUrl: buildGoogleMapsDayRouteUrl({
          origin,
          stops,
          transportMode,
        }),
        stops,
        legs: enrichedLegs,
      };
    });

  return {
    id: plain.id,
    ownerId: plain.owner_id,
    name: plain.name,
    lockVersion: plain.lock_version,
    currentRevisionId: plain.current_revision_id,
    createdAt: serializeUtc(plain.created_at),
    updatedAt: serializeUtc(plain.updated_at),
    revision: rev
      ? {
          id: rev.id,
          revisionNo: rev.revision_no,
          startDate: rev.start_date,
          daysCount: rev.day_count,
          partySize: rev.traveler_count,
          budgetVnd: rev.budget_vnd,
          totalBudgetVnd: rev.budget_vnd,
          estimatedTotalVnd: rev.estimated_total_vnd,
          origin,
          transportMode,
          preferences: rev.preferences ?? {},
          warnings: rev.warnings ?? [],
          violations: [],
          isValid: true,
          aiRequestId: rev.ai_request_id ?? null,
          validatedAt: serializeUtc(rev.validated_at),
          createdAt: serializeUtc(rev.created_at),
          days,
        }
      : null,
  };
}

export function createItineraryService(database, { aiAdapter, routingAdapter, clock } = {}) {
  const repository = createItineraryRepository(database);

  async function safe(work) {
    try {
      return await work();
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error?.name === 'SequelizeUniqueConstraintError') {
        throw new AppError(409, 'ITINERARY_CONFLICT', 'Xung đột dữ liệu lịch trình hoặc phiên bản.');
      }
      throw new AppError(
        503,
        'ITINERARY_UNAVAILABLE',
        'Hệ thống lịch trình AI đang tạm gián đoạn. Vui lòng thử lại sau.',
      );
    }
  }

  return {
    proposeItinerary: (actor, input) =>
      safe(async () => {
        const categories = input.preferences?.categories ?? [];
        const selectedPlaceIds =
          input.selectedPlaceIds ?? input.preferences?.selectedPlaceIds ?? [];
        const customPrompt =
          input.customPrompt ??
          input.preferences?.customPrompt ??
          input.preferences?.dietaryNotes ??
          null;

        const baseDate = new Date(`${input.startDate}T00:00:00.000Z`);
        const endDate = new Date(baseDate.getTime() + input.daysCount * 86400000).toISOString();

        const [placesRaw, eventsRaw] = await Promise.all([
          repository.findPublicPlacesForPlanning(categories, selectedPlaceIds),
          repository.findPublicEventsForPlanning(input.startDate, endDate),
        ]);

        const places = placesRaw.map(mapPlaceRow);
        const events = eventsRaw.map(mapEventRow);
        const closures = await repository.findPlaceClosures(places.map((p) => p.id));

        const placesMap = new Map(places.map((p) => [p.id, p]));
        const eventsMap = new Map(events.map((e) => [e.id, e]));

        if (!aiAdapter || !aiAdapter.enabled) {
          throw new AppError(503, 'AI_UNAVAILABLE', 'Dịch vụ tạo lịch trình AI chưa được cấu hình.');
        }

        const mergedPreferences = {
          ...(input.preferences ?? {}),
          ...(selectedPlaceIds.length > 0 ? { selectedPlaceIds } : {}),
          ...(customPrompt ? { customPrompt } : {}),
        };

        const aiContext = {
          startDate: input.startDate,
          daysCount: input.daysCount,
          partySize: input.partySize,
          totalBudgetVnd: input.totalBudgetVnd,
          origin: input.origin,
          transportMode: input.transportMode,
          preferences: mergedPreferences,
          selectedPlaceIds,
          customPrompt,
          places,
          events,
          routingAdapter,
        };

        const aiStartTime = Date.now();
        const aiResult = await aiAdapter.generateItineraryProposal(aiContext);
        const latencyMs = Date.now() - aiStartTime;

        const validationResult = validateProposalSchedule({
          input,
          days: aiResult.days,
          placesMap,
          eventsMap,
          closuresList: closures,
          routingAdapter,
        });

        let aiRequestId = null;
        const now = resolveNow(clock);

        if (actor?.user?.id) {
          aiRequestId = randomUUID();
          await repository.createAiRequestRecord(
            {
              id: aiRequestId,
              userId: actor.user.id,
              purpose: 'GENERATE',
              provider: aiResult.provider || 'google-gemini',
              modelName: aiResult.modelName || 'gemini-3.1-flash-lite',
              promptVersion: aiResult.promptVersion || '2026-v2',
              status: 'SUCCEEDED',
              inputContext: {
                startDate: input.startDate,
                daysCount: input.daysCount,
                partySize: input.partySize,
                totalBudgetVnd: String(input.totalBudgetVnd),
                origin: input.origin,
                transportMode: input.transportMode,
                preferences: mergedPreferences,
              },
              outputPayload: {
                estimatedTotalVnd: validationResult.estimatedTotalVnd,
                daysCount: validationResult.days.length,
                warningsCount: validationResult.warnings.length,
              },
              latencyMs,
              costVnd: 0,
              now,
            },
            aiResult.usedRevisionIds ?? [],
          );
        }

        return {
          data: {
            startDate: input.startDate,
            daysCount: input.daysCount,
            partySize: input.partySize,
            totalBudgetVnd: String(input.totalBudgetVnd),
            estimatedTotalVnd: validationResult.estimatedTotalVnd,
            origin: input.origin,
            transportMode: input.transportMode,
            preferences: mergedPreferences,
            warnings: validationResult.warnings,
            violations: validationResult.violations,
            isValid: validationResult.isValid,
            aiRequestId,
            aiProvider: aiResult.provider,
            aiModel: aiResult.modelName,
            summary: aiResult.summary || null,
            promptExcerpt: aiResult.promptText ? aiResult.promptText.slice(0, 500) : null,
            days: validationResult.days,
          },
        };
      }),

    revalidateProposal: (input) =>
      safe(async () => {
        const placeIds = [];
        const eventIds = [];
        for (const day of input.days || []) {
          for (const stop of day.stops || []) {
            if (stop.placeId && !placeIds.includes(stop.placeId)) placeIds.push(stop.placeId);
            if (stop.eventId && !eventIds.includes(stop.eventId)) eventIds.push(stop.eventId);
          }
        }

        const [placesRaw, eventsRaw, closures] = await Promise.all([
          repository.findPublicPlacesByIds(placeIds),
          repository.findPublicEventsByIds(eventIds),
          repository.findPlaceClosures(placeIds),
        ]);

        const places = placesRaw.map(mapPlaceRow);
        const events = eventsRaw.map(mapEventRow);
        const placesMap = new Map(places.map((p) => [p.id, p]));
        const eventsMap = new Map(events.map((e) => [e.id, e]));

        const validationResult = validateProposalSchedule({
          input,
          days: input.days,
          placesMap,
          eventsMap,
          closuresList: closures,
          routingAdapter,
        });

        return {
          data: {
            startDate: input.startDate,
            daysCount: input.daysCount,
            partySize: input.partySize,
            totalBudgetVnd: String(input.totalBudgetVnd),
            estimatedTotalVnd: validationResult.estimatedTotalVnd,
            origin: input.origin,
            transportMode: input.transportMode,
            preferences: input.preferences ?? {},
            warnings: validationResult.warnings,
            violations: validationResult.violations,
            isValid: validationResult.isValid,
            days: validationResult.days,
          },
        };
      }),

    listMyItineraries: (actor) =>
      safe(async () => {
        requireUser(actor);
        const items = await repository.listUserItineraries(actor.user.id);
        return {
          data: items.map((it) => {
            const plain = it.get({ plain: true });
            const rev = plain.current_revision;
            return {
              id: plain.id,
              name: plain.name,
              lockVersion: plain.lock_version,
              currentRevisionId: plain.current_revision_id,
              startDate: rev?.start_date ?? null,
              daysCount: rev?.day_count ?? 1,
              partySize: rev?.traveler_count ?? 1,
              totalBudgetVnd: rev?.budget_vnd ?? '0',
              estimatedTotalVnd: rev?.estimated_total_vnd ?? '0',
              createdAt: serializeUtc(plain.created_at),
              updatedAt: serializeUtc(plain.updated_at),
            };
          }),
        };
      }),

    getMyItinerary: (actor, id) =>
      safe(async () => {
        requireUser(actor);
        const result = await repository.findUserItinerary(actor.user.id, id);
        if (!result) {
          throw new AppError(404, 'ITINERARY_NOT_FOUND', 'Không tìm thấy chuyến đi yêu cầu.');
        }
        return { data: formatItineraryDetail(result.itinerary, result.legs) };
      }),

    createMyItinerary: (actor, input, requestId) =>
      safe(async () => {
        requireUser(actor);
        const now = resolveNow(clock);

        const placeIds = [];
        for (const day of input.days) {
          for (const stop of day.stops) {
            if (stop.placeId && !placeIds.includes(stop.placeId)) placeIds.push(stop.placeId);
          }
        }
        const [placesRaw, closures] = await Promise.all([
          repository.findPublicPlacesByIds(placeIds),
          repository.findPlaceClosures(placeIds),
        ]);
        const places = placesRaw.map(mapPlaceRow);
        const placesMap = new Map(places.map((p) => [p.id, p]));

        const validation = validateProposalSchedule({
          input,
          days: input.days,
          placesMap,
          closuresList: closures,
          routingAdapter,
        });

        const itineraryId = await database.transaction(async (transaction) => {
          const id = await repository.createItineraryWithRevision(
            {
              userId: actor.user.id,
              name: input.name,
              startDate: input.startDate,
              daysCount: input.daysCount,
              partySize: input.partySize,
              totalBudgetVnd: input.totalBudgetVnd,
              estimatedTotalVnd: validation.estimatedTotalVnd,
              origin: input.origin,
              transportMode: input.transportMode,
              preferences: input.preferences,
              warnings: validation.warnings,
              aiRequestId: input.aiRequestId,
              days: validation.days,
              now,
            },
            transaction,
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ITINERARY_CREATE',
            targetType: 'ITINERARY',
            targetId: id,
            requestId,
            metadata: { name: input.name, daysCount: input.daysCount },
          });

          return id;
        });

        const result = await repository.findUserItinerary(actor.user.id, itineraryId);
        return { data: formatItineraryDetail(result.itinerary, result.legs) };
      }),

    updateMyItineraryRevision: (actor, id, input, requestId) =>
      safe(async () => {
        requireUser(actor);
        const now = resolveNow(clock);

        const placeIds = [];
        for (const day of input.days) {
          for (const stop of day.stops) {
            if (stop.placeId && !placeIds.includes(stop.placeId)) placeIds.push(stop.placeId);
          }
        }
        const [placesRaw, closures] = await Promise.all([
          repository.findPublicPlacesByIds(placeIds),
          repository.findPlaceClosures(placeIds),
        ]);
        const places = placesRaw.map(mapPlaceRow);
        const placesMap = new Map(places.map((p) => [p.id, p]));

        const validation = validateProposalSchedule({
          input,
          days: input.days,
          placesMap,
          closuresList: closures,
          routingAdapter,
        });

        await database.transaction(async (transaction) => {
          const locked = await repository.lockItinerary(id, actor.user.id, transaction);
          if (!locked) {
            throw new AppError(404, 'ITINERARY_NOT_FOUND', 'Không tìm thấy chuyến đi để cập nhật.');
          }

          if (locked.lock_version !== input.baseLockVersion) {
            throw new AppError(
              409,
              'LOCK_VERSION_CONFLICT',
              `Chuyến đi đã được cập nhật bởi một phiên làm việc khác (Phiên bản máy chủ: #${locked.lock_version}, phiên bản gửi lên: #${input.baseLockVersion}). Vui lòng tải lại trước khi lưu tiếp.`,
            );
          }

          const { nextRevisionNo, nextLockVersion } = await repository.appendRevisionWithLock(
            locked,
            {
              userId: actor.user.id,
              name: input.name,
              startDate: input.startDate,
              daysCount: input.daysCount,
              partySize: input.partySize,
              totalBudgetVnd: input.totalBudgetVnd,
              estimatedTotalVnd: validation.estimatedTotalVnd,
              origin: input.origin,
              transportMode: input.transportMode,
              preferences: input.preferences,
              warnings: validation.warnings,
              aiRequestId: input.aiRequestId,
              days: validation.days,
              now,
            },
            transaction,
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ITINERARY_REVISION_UPDATE',
            targetType: 'ITINERARY',
            targetId: id,
            requestId,
            metadata: { revisionNo: nextRevisionNo, lockVersion: nextLockVersion },
          });
        });

        const result = await repository.findUserItinerary(actor.user.id, id);
        return { data: formatItineraryDetail(result.itinerary, result.legs) };
      }),

    renameMyItinerary: (actor, id, input) =>
      safe(async () => {
        requireUser(actor);
        const success = await repository.renameItinerary(id, actor.user.id, input.name);
        if (!success) {
          throw new AppError(404, 'ITINERARY_NOT_FOUND', 'Không tìm thấy chuyến đi.');
        }
        return { data: { id, name: input.name } };
      }),

    copyMyItinerary: (actor, id, requestId) =>
      safe(async () => {
        requireUser(actor);
        const sourceResult = await repository.findUserItinerary(actor.user.id, id);
        if (!sourceResult) {
          throw new AppError(404, 'ITINERARY_NOT_FOUND', 'Không tìm thấy chuyến đi nguồn để sao chép.');
        }

        const source = sourceResult.itinerary.get({ plain: true });
        const rev = source.current_revision;
        if (!rev) {
          throw new AppError(400, 'EMPTY_ITINERARY', 'Chuyến đi nguồn chưa có phiên bản lịch trình.');
        }

        const newName = `[Bản sao] ${source.name}`.slice(0, 255);
        const days = (rev.itinerary_days ?? []).map((d) => ({
          dayNumber: d.day_number,
          travelDate: d.travel_date,
          stops: (d.itinerary_stops ?? []).map((s) => {
            const meta =
              s.cost_breakdown && typeof s.cost_breakdown === 'object' ? s.cost_breakdown : {};
            return {
              placeId: s.place_id,
              placeTitle: meta.placeTitle || undefined,
              placeCategory: meta.placeCategory || undefined,
              activityType: meta.activityType || undefined,
              latitude: meta.latitude ?? undefined,
              longitude: meta.longitude ?? undefined,
              contentRevisionId: s.content_revision_id,
              eventId: s.event_id,
              sequenceNo: s.sequence_no,
              arrivesAt: serializeUtc(s.arrives_at),
              departsAt: serializeUtc(s.departs_at),
              estimatedCostVnd: Number(s.estimated_cost_vnd),
              note: s.note,
            };
          }),
          legs: [],
        }));

        const now = resolveNow(clock);
        const newItineraryId = await database.transaction(async (transaction) => {
          const newId = await repository.createItineraryWithRevision(
            {
              userId: actor.user.id,
              name: newName,
              startDate: rev.start_date,
              daysCount: rev.day_count,
              partySize: rev.traveler_count,
              totalBudgetVnd: rev.budget_vnd,
              estimatedTotalVnd: rev.estimated_total_vnd,
              origin: {
                latitude: Number(rev.departure_latitude),
                longitude: Number(rev.departure_longitude),
              },
              transportMode: rev.transport_mode,
              preferences: rev.preferences,
              warnings: rev.warnings ?? [],
              aiRequestId: null,
              days,
              now,
            },
            transaction,
          );

          await appendAudit(database, transaction, {
            actorId: actor.user.id,
            action: 'ITINERARY_COPY',
            targetType: 'ITINERARY',
            targetId: newId,
            requestId,
            metadata: { sourceId: id, newName },
          });

          return newId;
        });

        const clonedResult = await repository.findUserItinerary(actor.user.id, newItineraryId);
        return { data: formatItineraryDetail(clonedResult.itinerary, clonedResult.legs) };
      }),

    deleteMyItinerary: (actor, id, requestId) =>
      safe(async () => {
        requireUser(actor);
        const now = resolveNow(clock);
        const success = await repository.softDeleteItinerary(id, actor.user.id, now);
        if (!success) {
          throw new AppError(404, 'ITINERARY_NOT_FOUND', 'Không tìm thấy chuyến đi để xóa.');
        }
        await appendAudit(database, null, {
          actorId: actor.user.id,
          action: 'ITINERARY_SOFT_DELETE',
          targetType: 'ITINERARY',
          targetId: id,
          requestId,
        });
        return { data: { id, deleted: true } };
      }),
  };
}
