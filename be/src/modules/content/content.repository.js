import { randomUUID } from 'node:crypto';
import { Op } from 'sequelize';
import { serializeUtc } from '../../shared/time.js';

export function createContentRepository(database) {
  const {
    AudioGuides,
    ContentItems,
    ContentRevisions,
    ContentTranslations,
    Events,
    MediaAssets,
    Partners,
    PlaceClosures,
    PlaceOpeningHours,
    Places,
    Regions,
    ServiceSlots,
    Services,
    ItineraryStops,
  } = database.models;

  function safeParse(value) {
    if (!value) return {};
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value;
  }

  return {
    listMediaAssets: () =>
      MediaAssets.findAll({
        order: [
          ['created_at', 'DESC'],
          ['id', 'ASC'],
        ],
        limit: 100,
      }),
    mediaAssetById: (id, transaction) => MediaAssets.findByPk(id, { transaction }),
    createMediaAsset: (values, transaction) => MediaAssets.create(values, { transaction }),
    listRegions: () =>
      Regions.findAll({
        where: { phase: 1 },
        order: [['name', 'ASC']],
      }),
    listContents: async (query) => {
      const whereClause = {};
      if (query.kind) whereClause.kind = query.kind;
      if (query.visibility) whereClause.visibility = query.visibility;
      const total = await ContentItems.count({ where: whereClause });
      const rows = await ContentItems.findAll({
        where: whereClause,
        include: [
          {
            association: ContentItems.associations.content_revisions,
            required: false,
            include: [
              {
                association: ContentRevisions.associations.content_translations,
                required: false,
              },
            ],
          },
          { association: ContentItems.associations.place, required: false },
          { association: ContentItems.associations.audio_guide, required: false },
          { association: ContentItems.associations.event, required: false },
          { association: ContentItems.associations.partner, required: false },
          { association: ContentItems.associations.service, required: false },
        ],
        order: [
          ['updated_at', 'DESC'],
          ['id', 'ASC'],
        ],
        limit: query.pageSize,
        offset: (query.page - 1) * query.pageSize,
      });
      return { rows, total };
    },
    contentById: (id, transaction, lock = false) =>
      ContentItems.findOne({
        where: { id },
        include: [
          {
            association: ContentItems.associations.content_revisions,
            required: false,
            include: [
              {
                association: ContentRevisions.associations.content_translations,
                required: false,
              },
            ],
          },
          { association: ContentItems.associations.place, required: false },
          { association: ContentItems.associations.audio_guide, required: false },
          { association: ContentItems.associations.event, required: false },
          { association: ContentItems.associations.partner, required: false },
          { association: ContentItems.associations.service, required: false },
        ],
        ...(lock ? { lock: transaction.LOCK.UPDATE } : {}),
        transaction,
      }),
    lockContentItem: (id, transaction) =>
      ContentItems.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      }),
    revisionsByContent: (contentId, transaction) =>
      ContentRevisions.findAll({
        where: { content_id: contentId },
        order: [['revision_no', 'DESC']],
        transaction,
      }),
    revisionById: (contentId, revisionId, transaction, lock = false) =>
      ContentRevisions.findOne({
        where: { id: revisionId, content_id: contentId },
        include: [
          {
            association: ContentRevisions.associations.content_translations,
            required: false,
          },
        ],
        ...(lock ? { lock: transaction.LOCK.UPDATE } : {}),
        transaction,
      }),
    createContentItem: (values, transaction) => ContentItems.create(values, { transaction }),
    createRevision: (values, transaction) => ContentRevisions.create(values, { transaction }),
    createTranslation: (values, transaction) => ContentTranslations.create(values, { transaction }),
    placeById: (id, transaction) => Places.findByPk(id, { transaction }),
    createPlaceClosure: (values, transaction) => PlaceClosures.create(values, { transaction }),
    syncProjection: async (contentItem, revision, payload, now, transaction) => {
      const kind = contentItem.kind;
      if (kind === 'PLACE') {
        const existing = await Places.findOne({
          where: { content_id: contentItem.id },
          transaction,
        });
        const placeValues = {
          region_id: payload.regionId,
          category: payload.category,
          latitude: payload.latitude,
          longitude: payload.longitude,
          reference_price_vnd:
            payload.referencePriceVnd === undefined || payload.referencePriceVnd === null
              ? null
              : String(payload.referencePriceVnd),
          typical_duration_minutes:
            payload.typicalDurationMinutes === undefined ? null : payload.typicalDurationMinutes,
          updated_at: now,
        };
        let placeId;
        if (existing) {
          await existing.update(placeValues, { transaction });
          placeId = existing.id;
        } else {
          const created = await Places.create(
            {
              id: payload.placeId || randomUUID(),
              content_id: contentItem.id,
              ...placeValues,
            },
            { transaction },
          );
          placeId = created.id;
        }
        if (Array.isArray(payload.openingHours)) {
          await PlaceOpeningHours.destroy({ where: { place_id: placeId }, transaction });
          if (payload.openingHours.length > 0) {
            await PlaceOpeningHours.bulkCreate(
              payload.openingHours.map((item) => ({
                id: randomUUID(),
                place_id: placeId,
                weekday: item.weekday,
                opens_at: item.opensAt.length === 5 ? `${item.opensAt}:00` : item.opensAt,
                closes_at: item.closesAt.length === 5 ? `${item.closesAt}:00` : item.closesAt,
                crosses_midnight: Boolean(item.crossesMidnight),
              })),
              { transaction },
            );
          }
        }
        return { projectionType: 'PLACE', projectionId: placeId };
      }

      if (kind === 'AUDIO') {
        const existing = await AudioGuides.findOne({
          where: { content_id: contentItem.id },
          transaction,
        });
        if (existing) {
          await existing.update(
            {
              place_id: payload.placeId,
              premium_only: Boolean(payload.premiumOnly),
            },
            { transaction },
          );
          return { projectionType: 'AUDIO_GUIDE', projectionId: existing.id };
        }
        const created = await AudioGuides.create(
          {
            id: payload.audioGuideId || randomUUID(),
            content_id: contentItem.id,
            place_id: payload.placeId,
            premium_only: Boolean(payload.premiumOnly),
          },
          { transaction },
        );
        return { projectionType: 'AUDIO_GUIDE', projectionId: created.id };
      }

      if (kind === 'EVENT') {
        const existing = await Events.findOne({
          where: { content_id: contentItem.id },
          transaction,
        });
        const eventValues = {
          place_id: payload.placeId,
          starts_at: new Date(payload.startsAt),
          ends_at: new Date(payload.endsAt),
          event_status: payload.eventStatus || 'SCHEDULED',
        };
        if (existing) {
          await existing.update(eventValues, { transaction });
          return { projectionType: 'EVENT', projectionId: existing.id };
        }
        const created = await Events.create(
          {
            id: payload.eventId || randomUUID(),
            content_id: contentItem.id,
            ...eventValues,
          },
          { transaction },
        );
        return { projectionType: 'EVENT', projectionId: created.id };
      }

      if (kind === 'PARTNER') {
        const existing = await Partners.findOne({
          where: { content_id: contentItem.id },
          transaction,
        });
        const partnerValues = {
          status: payload.status || 'ACTIVE',
          contact_email: payload.contactEmail ?? null,
          contact_phone: payload.contactPhone ?? null,
        };
        if (existing) {
          await existing.update(partnerValues, { transaction });
          return { projectionType: 'PARTNER', projectionId: existing.id };
        }
        const created = await Partners.create(
          {
            id: payload.partnerId || randomUUID(),
            content_id: contentItem.id,
            ...partnerValues,
            created_at: now,
          },
          { transaction },
        );
        return { projectionType: 'PARTNER', projectionId: created.id };
      }

      if (kind === 'SERVICE') {
        const existing = await Services.findOne({
          where: { content_id: contentItem.id },
          transaction,
        });
        const serviceValues = {
          partner_id: payload.partnerId,
          place_id: payload.placeId ?? null,
          service_type: payload.serviceType,
          price_unit: payload.priceUnit,
          unit_price_vnd: String(payload.unitPriceVnd),
          active: payload.active !== false,
          updated_at: now,
        };
        let serviceId;
        if (existing) {
          await existing.update(serviceValues, { transaction });
          serviceId = existing.id;
        } else {
          const created = await Services.create(
            {
              id: payload.serviceId || randomUUID(),
              content_id: contentItem.id,
              ...serviceValues,
            },
            { transaction },
          );
          serviceId = created.id;
        }
        if (Array.isArray(payload.slots) && payload.slots.length > 0) {
          for (const slotInput of payload.slots) {
            const startsAt = new Date(slotInput.startsAt);
            const endsAt = new Date(slotInput.endsAt);
            const existingSlot = slotInput.id
              ? await ServiceSlots.findOne({
                  where: { id: slotInput.id, service_id: serviceId },
                  lock: transaction.LOCK.UPDATE,
                  transaction,
                })
              : await ServiceSlots.findOne({
                  where: {
                    service_id: serviceId,
                    starts_at: startsAt,
                    ends_at: endsAt,
                  },
                  lock: transaction.LOCK.UPDATE,
                  transaction,
                });
            if (existingSlot) {
              const committed =
                Number(existingSlot.held_quantity) + Number(existingSlot.sold_quantity);
              if (slotInput.capacity >= committed) {
                await existingSlot.update(
                  { capacity: slotInput.capacity, updated_at: now },
                  { transaction },
                );
              }
            } else {
              await ServiceSlots.create(
                {
                  id: slotInput.id || randomUUID(),
                  service_id: serviceId,
                  starts_at: startsAt,
                  ends_at: endsAt,
                  capacity: slotInput.capacity,
                  held_quantity: 0,
                  sold_quantity: 0,
                  updated_at: now,
                },
                { transaction },
              );
            }
          }
        }
        return { projectionType: 'SERVICE', projectionId: serviceId };
      }

      return { projectionType: 'ARTICLE', projectionId: contentItem.id };
    },
    findPartners: () =>
      Partners.findAll({
        include: [
          {
            association: Partners.associations.content,
            required: true,
            include: [
              {
                association: ContentItems.associations.published_revision,
                required: false,
                include: [
                  {
                    association: ContentRevisions.associations.content_translations,
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
        order: [['created_at', 'DESC']],
      }),
    findPlaces: () =>
      Places.findAll({
        include: [
          {
            association: Places.associations.content,
            required: true,
            include: [
              {
                association: ContentItems.associations.published_revision,
                required: false,
                include: [
                  {
                    association: ContentRevisions.associations.content_translations,
                    required: false,
                  },
                ],
              },
            ],
          },
          { association: Places.associations.region, required: false },
        ],
        order: [['updated_at', 'DESC']],
      }),
    overlappingSlots: (serviceId, startsAt, endsAt, excludeSlotId, transaction) =>
      ServiceSlots.findAll({
        where: {
          service_id: serviceId,
          ...(excludeSlotId ? { id: { [Op.ne]: excludeSlotId } } : {}),
          starts_at: { [Op.lt]: endsAt },
          ends_at: { [Op.gt]: startsAt },
        },
        transaction,
      }),

    listAdminPlaces: async ({ q, category, regionId, page = 1, pageSize = 50 } = {}) => {
      const whereClause = {};
      if (category) whereClause.category = category;
      if (regionId) whereClause.region_id = regionId;

      const rows = await Places.findAll({
        where: whereClause,
        include: [
          {
            association: Places.associations.content,
            required: true,
            include: [
              {
                association: ContentItems.associations.published_revision,
                required: false,
                include: [
                  {
                    association: ContentRevisions.associations.content_translations,
                    required: false,
                    where: { language_code: 'vi' },
                  },
                ],
              },
            ],
          },
          { association: Places.associations.region, required: false },
          { association: Places.associations.place_opening_hours, required: false },
        ],
        order: [['updated_at', 'DESC'], ['id', 'ASC']],
      });

      let items = rows.map((p) => {
        const plain = p.get({ plain: true });
        const content = plain.content || {};
        const rev = content.published_revision || {};
        const trans = rev.content_translations?.[0] || {};
        const payload = safeParse(rev.payload);
        return {
          id: plain.id,
          contentId: plain.content_id,
          title: trans.title || `Địa điểm ${plain.id.slice(0, 8)}`,
          description: trans.body || '',
          category: plain.category,
          regionId: plain.region_id,
          regionName: plain.region?.name || 'Gia Lai',
          latitude: Number(plain.latitude),
          longitude: Number(plain.longitude),
          referencePriceVnd: plain.reference_price_vnd ? String(plain.reference_price_vnd) : null,
          typicalDurationMinutes: plain.typical_duration_minutes,
          bannerUrl: payload.bannerUrl || null,
          imageUrl: payload.imageUrl || payload.bannerUrl || null,
          sourceReference: rev.source_reference || null,
          visibility: content.visibility || 'PUBLIC',
          openingHours: (plain.place_opening_hours || []).map((h) => ({
            weekday: h.weekday,
            opensAt: h.opens_at,
            closesAt: h.closes_at,
            crossesMidnight: Boolean(h.crosses_midnight),
          })),
          updatedAt: serializeUtc(plain.updated_at),
        };
      });

      if (q) {
        const queryLower = q.toLowerCase();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower),
        );
      }

      const total = items.length;
      const paginated = items.slice((page - 1) * pageSize, page * pageSize);
      return { rows: paginated, total };
    },

    getAdminPlaceById: async (id, transaction) => {
      const p = await Places.findByPk(id, {
        include: [
          {
            association: Places.associations.content,
            required: true,
            include: [
              {
                association: ContentItems.associations.published_revision,
                required: false,
                include: [
                  {
                    association: ContentRevisions.associations.content_translations,
                    required: false,
                    where: { language_code: 'vi' },
                  },
                ],
              },
            ],
          },
          { association: Places.associations.region, required: false },
          { association: Places.associations.place_opening_hours, required: false },
        ],
        transaction,
      });
      if (!p) return null;
      const plain = p.get({ plain: true });
      const content = plain.content || {};
      const rev = content.published_revision || {};
      const trans = rev.content_translations?.[0] || {};
      const payload = safeParse(rev.payload);
      return {
        id: plain.id,
        contentId: plain.content_id,
        title: trans.title || `Địa điểm ${plain.id.slice(0, 8)}`,
        description: trans.body || '',
        category: plain.category,
        regionId: plain.region_id,
        regionName: plain.region?.name || 'Gia Lai',
        latitude: Number(plain.latitude),
        longitude: Number(plain.longitude),
        referencePriceVnd: plain.reference_price_vnd ? String(plain.reference_price_vnd) : null,
        typicalDurationMinutes: plain.typical_duration_minutes,
        bannerUrl: payload.bannerUrl || null,
        imageUrl: payload.imageUrl || payload.bannerUrl || null,
        sourceReference: rev.source_reference || null,
        visibility: content.visibility || 'PUBLIC',
        openingHours: (plain.place_opening_hours || []).map((h) => ({
          weekday: h.weekday,
          opensAt: h.opens_at,
          closesAt: h.closes_at,
          crossesMidnight: Boolean(h.crosses_midnight),
        })),
        updatedAt: serializeUtc(plain.updated_at),
      };
    },

    listAdminEvents: async ({ q, status, placeId, page = 1, pageSize = 50 } = {}) => {
      const whereClause = {};
      if (status) whereClause.event_status = status;
      if (placeId) whereClause.place_id = placeId;

      const rows = await Events.findAll({
        where: whereClause,
        include: [
          {
            association: Events.associations.content,
            required: true,
            include: [
              {
                association: ContentItems.associations.published_revision,
                required: false,
                include: [
                  {
                    association: ContentRevisions.associations.content_translations,
                    required: false,
                    where: { language_code: 'vi' },
                  },
                ],
              },
            ],
          },
          {
            association: Events.associations.place,
            required: false,
            include: [
              { association: Places.associations.region, required: false },
              {
                association: Places.associations.content,
                required: false,
                include: [
                  {
                    association: ContentItems.associations.published_revision,
                    required: false,
                    include: [
                      {
                        association: ContentRevisions.associations.content_translations,
                        required: false,
                        where: { language_code: 'vi' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [['starts_at', 'DESC'], ['id', 'ASC']],
      });

      let items = rows.map((e) => {
        const plain = e.get({ plain: true });
        const content = plain.content || {};
        const rev = content.published_revision || {};
        const trans = rev.content_translations?.[0] || {};
        const payload = safeParse(rev.payload);
        const place = plain.place || {};
        const placeTrans = place.content?.published_revision?.content_translations?.[0];
        const placeTitle = placeTrans?.title || (place.id ? `Địa điểm #${place.id.slice(0, 8)}` : '');
        return {
          id: plain.id,
          contentId: plain.content_id,
          placeId: plain.place_id,
          placeTitle,
          regionName: place.region?.name || 'Gia Lai',
          title: trans.title || `Sự kiện ${plain.id.slice(0, 8)}`,
          description: trans.body || '',
          startsAt: serializeUtc(plain.starts_at),
          endsAt: serializeUtc(plain.ends_at),
          eventStatus: plain.event_status,
          bannerUrl: payload.bannerUrl || null,
          imageUrl: payload.imageUrl || payload.bannerUrl || null,
          sourceReference: rev.source_reference || null,
          visibility: content.visibility || 'PUBLIC',
          updatedAt: serializeUtc(plain.synced_at || rev.created_at || new Date()),
        };
      });

      if (q) {
        const queryLower = q.toLowerCase();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(queryLower) ||
            item.description.toLowerCase().includes(queryLower) ||
            item.placeTitle.toLowerCase().includes(queryLower),
        );
      }

      const total = items.length;
      const paginated = items.slice((page - 1) * pageSize, page * pageSize);
      return { rows: paginated, total };
    },

    getAdminEventById: async (id, transaction) => {
      const e = await Events.findByPk(id, {
        include: [
          {
            association: Events.associations.content,
            required: true,
            include: [
              {
                association: ContentItems.associations.published_revision,
                required: false,
                include: [
                  {
                    association: ContentRevisions.associations.content_translations,
                    required: false,
                    where: { language_code: 'vi' },
                  },
                ],
              },
            ],
          },
          {
            association: Events.associations.place,
            required: false,
            include: [
              { association: Places.associations.region, required: false },
              {
                association: Places.associations.content,
                required: false,
                include: [
                  {
                    association: ContentItems.associations.published_revision,
                    required: false,
                    include: [
                      {
                        association: ContentRevisions.associations.content_translations,
                        required: false,
                        where: { language_code: 'vi' },
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
      if (!e) return null;
      const plain = e.get({ plain: true });
      const content = plain.content || {};
      const rev = content.published_revision || {};
      const trans = rev.content_translations?.[0] || {};
      const payload = safeParse(rev.payload);
      const place = plain.place || {};
      const placeTrans = place.content?.published_revision?.content_translations?.[0];
      const placeTitle = placeTrans?.title || (place.id ? `Địa điểm #${place.id.slice(0, 8)}` : '');
      return {
        id: plain.id,
        contentId: plain.content_id,
        placeId: plain.place_id,
        placeTitle,
        regionName: place.region?.name || 'Gia Lai',
        title: trans.title || `Sự kiện ${plain.id.slice(0, 8)}`,
        description: trans.body || '',
        startsAt: serializeUtc(plain.starts_at),
        endsAt: serializeUtc(plain.ends_at),
        eventStatus: plain.event_status,
        bannerUrl: payload.bannerUrl || null,
        imageUrl: payload.imageUrl || payload.bannerUrl || null,
        sourceReference: rev.source_reference || null,
        visibility: content.visibility || 'PUBLIC',
        updatedAt: serializeUtc(plain.synced_at || rev.created_at || new Date()),
      };
    },
  };
}
