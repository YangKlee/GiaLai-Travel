import { randomUUID } from 'node:crypto';
import { Op } from 'sequelize';

export function createItineraryRepository(database) {
  const {
    Places,
    PlaceOpeningHours,
    PlaceClosures,
    ContentItems,
    ContentRevisions,
    ContentTranslations,
    Events,
    Itineraries,
    ItineraryRevisions,
    ItineraryDays,
    ItineraryStops,
    ItineraryLegs,
    AiRequests,
    AiRequestSources,
  } = database.models;

  return {
    async findPublicPlacesForPlanning(categories) {
      const whereCategory =
        Array.isArray(categories) && categories.length > 0 ? { category: { [Op.in]: categories } } : {};

      return Places.findAll({
        where: whereCategory,
        include: [
          {
            model: ContentItems,
            as: 'content',
            where: { visibility: 'PUBLIC' },
            required: true,
            include: [
              {
                model: ContentRevisions,
                as: 'published_revision',
                include: [
                  {
                    model: ContentTranslations,
                    as: 'content_translations',
                    where: { language_code: 'vi' },
                    required: false,
                  },
                ],
              },
            ],
          },
          {
            model: PlaceOpeningHours,
            as: 'place_opening_hours',
            required: false,
          },
        ],
      });
    },

    async findPublicEventsForPlanning(startDate, endDate) {
      return Events.findAll({
        where: {
          event_status: 'SCHEDULED',
          starts_at: { [Op.lte]: new Date(endDate) },
          ends_at: { [Op.gte]: new Date(startDate) },
        },
        include: [
          {
            model: ContentItems,
            as: 'content',
            where: { visibility: 'PUBLIC' },
            required: true,
            include: [
              {
                model: ContentRevisions,
                as: 'published_revision',
                include: [
                  {
                    model: ContentTranslations,
                    as: 'content_translations',
                    where: { language_code: 'vi' },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });
    },

    async findPlaceClosures(placeIds) {
      if (!placeIds || placeIds.length === 0) return [];
      return PlaceClosures.findAll({
        where: { place_id: { [Op.in]: placeIds } },
      });
    },

    async findPublicPlacesByIds(placeIds) {
      if (!placeIds || placeIds.length === 0) return [];
      return Places.findAll({
        where: { id: { [Op.in]: placeIds } },
        include: [
          {
            model: ContentItems,
            as: 'content',
            where: { visibility: 'PUBLIC' },
            required: true,
            include: [
              {
                model: ContentRevisions,
                as: 'published_revision',
                include: [
                  {
                    model: ContentTranslations,
                    as: 'content_translations',
                    where: { language_code: 'vi' },
                    required: false,
                  },
                ],
              },
            ],
          },
          {
            model: PlaceOpeningHours,
            as: 'place_opening_hours',
            required: false,
          },
        ],
      });
    },

    async findPublicEventsByIds(eventIds) {
      if (!eventIds || eventIds.length === 0) return [];
      return Events.findAll({
        where: { id: { [Op.in]: eventIds } },
        include: [
          {
            model: ContentItems,
            as: 'content',
            where: { visibility: 'PUBLIC' },
            required: true,
            include: [
              {
                model: ContentRevisions,
                as: 'published_revision',
                include: [
                  {
                    model: ContentTranslations,
                    as: 'content_translations',
                    where: { language_code: 'vi' },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });
    },

    async createAiRequestRecord(
      {
        id = randomUUID(),
        userId,
        itineraryId = null,
        purpose = 'GENERATE',
        provider,
        modelName,
        promptVersion = '2026-v1',
        status = 'SUCCEEDED',
        inputContext,
        outputPayload,
        latencyMs = 120,
        costVnd = 0,
        now = new Date(),
      },
      sourceRevisionIds = [],
      transaction,
    ) {
      const created = await AiRequests.create(
        {
          id,
          user_id: userId,
          itinerary_id: itineraryId,
          purpose,
          provider,
          model_name: modelName,
          prompt_version: promptVersion,
          status,
          input_context: inputContext,
          output_payload: outputPayload,
          latency_ms: latencyMs,
          cost_vnd: costVnd,
          created_at: now,
          completed_at: now,
        },
        { transaction },
      );

      for (const revId of sourceRevisionIds) {
        if (revId) {
          await AiRequestSources.create(
            {
              ai_request_id: id,
              content_revision_id: revId,
            },
            { transaction },
          );
        }
      }

      return created;
    },

    async listUserItineraries(userId) {
      return Itineraries.findAll({
        where: {
          owner_id: userId,
          deleted_at: null,
        },
        order: [['updated_at', 'DESC']],
        include: [
          {
            model: ItineraryRevisions,
            as: 'current_revision',
          },
        ],
      });
    },

    async findUserItinerary(userId, itineraryId, transaction) {
      const itinerary = await Itineraries.findOne({
        where: {
          id: itineraryId,
          owner_id: userId,
          deleted_at: null,
        },
        include: [
          {
            model: ItineraryRevisions,
            as: 'current_revision',
            include: [
              {
                model: ItineraryDays,
                as: 'itinerary_days',
                include: [
                  {
                    model: ItineraryStops,
                    as: 'itinerary_stops',
                    include: [
                      {
                        model: Places,
                        as: 'place',
                        include: [
                          {
                            model: ContentItems,
                            as: 'content',
                            include: [
                              {
                                model: ContentRevisions,
                                as: 'published_revision',
                                include: [
                                  {
                                    model: ContentTranslations,
                                    as: 'content_translations',
                                    where: { language_code: 'vi' },
                                    required: false,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        transaction,
      });

      if (!itinerary) return null;

      // Also load legs for all days
      const days = itinerary.current_revision?.itinerary_days ?? [];
      const dayIds = days.map((d) => d.id);
      let legs = [];
      if (dayIds.length > 0) {
        legs = await ItineraryLegs.findAll({
          where: { day_id: { [Op.in]: dayIds } },
          transaction,
        });
      }

      return { itinerary, legs };
    },

    async lockItinerary(itineraryId, userId, transaction) {
      return Itineraries.findOne({
        where: { id: itineraryId, owner_id: userId, deleted_at: null },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
    },

    async createItineraryWithRevision(
      {
        itineraryId = randomUUID(),
        userId,
        name,
        startDate,
        daysCount,
        partySize,
        totalBudgetVnd,
        estimatedTotalVnd,
        origin,
        transportMode,
        preferences,
        warnings = [],
        aiRequestId = null,
        days = [],
        now = new Date(),
      },
      transaction,
    ) {
      const revisionId = randomUUID();

      await Itineraries.create(
        {
          id: itineraryId,
          owner_id: userId,
          name,
          current_revision_id: null, // set after revision created
          lock_version: 0,
          created_at: now,
          updated_at: now,
        },
        { transaction },
      );

      await ItineraryRevisions.create(
        {
          id: revisionId,
          itinerary_id: itineraryId,
          revision_no: 1,
          start_date: startDate,
          day_count: daysCount,
          traveler_count: partySize,
          budget_vnd: String(totalBudgetVnd),
          estimated_total_vnd: String(estimatedTotalVnd),
          departure_latitude: origin.latitude,
          departure_longitude: origin.longitude,
          transport_mode: transportMode,
          preferences: preferences ?? {},
          warnings: warnings.length > 0 ? warnings : null,
          ai_request_id: aiRequestId,
          created_by: userId,
          validated_at: now,
          created_at: now,
        },
        { transaction },
      );

      await this.insertRevisionDaysAndStops(revisionId, days, now, transaction);

      await Itineraries.update(
        { current_revision_id: revisionId, updated_at: now },
        { where: { id: itineraryId }, transaction },
      );

      return itineraryId;
    },

    async insertRevisionDaysAndStops(revisionId, days, now, transaction) {
      for (const day of days) {
        const dayId = randomUUID();
        await ItineraryDays.create(
          {
            id: dayId,
            revision_id: revisionId,
            day_number: day.dayNumber,
            travel_date: day.travelDate,
          },
          { transaction },
        );

        const stopIdMap = new Map(); // sequenceNo -> stopId
        for (const stop of day.stops || []) {
          const stopId = randomUUID();
          stopIdMap.set(stop.sequenceNo, stopId);

          await ItineraryStops.create(
            {
              id: stopId,
              day_id: dayId,
              place_id: stop.placeId,
              content_revision_id: stop.contentRevisionId,
              event_id: stop.eventId || null,
              sequence_no: stop.sequenceNo,
              arrives_at: new Date(stop.arrivesAt),
              departs_at: new Date(stop.departsAt),
              estimated_cost_vnd: String(stop.estimatedCostVnd || 0),
              note: stop.note || null,
            },
            { transaction },
          );
        }

        for (const leg of day.legs || []) {
          const toStopId = stopIdMap.get(leg.toStopSequence);
          if (!toStopId) continue;
          const fromStopId = leg.fromStopSequence ? stopIdMap.get(leg.fromStopSequence) : null;

          await ItineraryLegs.create(
            {
              id: randomUUID(),
              day_id: dayId,
              from_stop_id: fromStopId,
              to_stop_id: toStopId,
              distance_meters: leg.distanceMeters,
              duration_seconds: leg.durationSeconds,
              transport_mode: leg.transportMode,
              provider: leg.provider || 'haversine-engine',
              source_reference: leg.sourceReference || 'Ước tính khoảng cách trắc địa',
              verified_at: now,
              estimated_cost_vnd: String(leg.estimatedCostVnd || 0),
            },
            { transaction },
          );
        }
      }
    },

    async appendRevisionWithLock(
      itinerary,
      {
        userId,
        name,
        startDate,
        daysCount,
        partySize,
        totalBudgetVnd,
        estimatedTotalVnd,
        origin,
        transportMode,
        preferences,
        warnings = [],
        aiRequestId = null,
        days = [],
        now = new Date(),
      },
      transaction,
    ) {
      const count = await ItineraryRevisions.count({
        where: { itinerary_id: itinerary.id },
        transaction,
      });
      const nextRevisionNo = count + 1;
      const revisionId = randomUUID();

      await ItineraryRevisions.create(
        {
          id: revisionId,
          itinerary_id: itinerary.id,
          revision_no: nextRevisionNo,
          start_date: startDate,
          day_count: daysCount,
          traveler_count: partySize,
          budget_vnd: String(totalBudgetVnd),
          estimated_total_vnd: String(estimatedTotalVnd),
          departure_latitude: origin.latitude,
          departure_longitude: origin.longitude,
          transport_mode: transportMode,
          preferences: preferences ?? {},
          warnings: warnings.length > 0 ? warnings : null,
          ai_request_id: aiRequestId,
          created_by: userId,
          validated_at: now,
          created_at: now,
        },
        { transaction },
      );

      await this.insertRevisionDaysAndStops(revisionId, days, now, transaction);

      const nextLockVersion = itinerary.lock_version + 1;
      await itinerary.update(
        {
          ...(name ? { name } : {}),
          current_revision_id: revisionId,
          lock_version: nextLockVersion,
          updated_at: now,
        },
        { transaction },
      );

      return { revisionId, nextLockVersion, nextRevisionNo };
    },

    async renameItinerary(itineraryId, userId, name) {
      const [affected] = await Itineraries.update(
        { name, updated_at: new Date() },
        { where: { id: itineraryId, owner_id: userId, deleted_at: null } },
      );
      return affected > 0;
    },

    async softDeleteItinerary(itineraryId, userId, now = new Date()) {
      const [affected] = await Itineraries.update(
        { deleted_at: now },
        { where: { id: itineraryId, owner_id: userId, deleted_at: null } },
      );
      return affected > 0;
    },
  };
}
