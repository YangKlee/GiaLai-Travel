import { Op, col, fn, where } from 'sequelize';
import { serializeUtc } from '../../shared/time.js';
import { serializeVnd } from '../../shared/money.js';
import { effectiveEventStatus } from '../../shared/event-status.js';

const placeAttributes = [
  'id',
  'category',
  'ward_id',
  'latitude',
  'longitude',
  'reference_price_vnd',
  'typical_duration_minutes',
  'best_time_to_visit',
  'updated_at',
];

function includePublishedContent(models, kind, alias = 'content') {
  return {
    association: models[
      alias === 'content'
        ? kind === 'PLACE'
          ? 'Places'
          : kind === 'AUDIO'
            ? 'AudioGuides'
            : kind === 'EVENT'
              ? 'Events'
              : kind === 'SERVICE'
                ? 'Services'
                : 'Partners'
        : 'Partners'
    ].associations.content,
    required: true,
    attributes: ['id'],
    where: { kind, visibility: 'PUBLIC' },
    include: [
      {
        association: models.ContentItems.associations.published_revision,
        required: true,
        attributes: ['id', 'source_reference', 'payload', 'created_at'],
        where: { status: 'PUBLISHED', content_id: { [Op.col]: `${alias}.id` } },
        include: [
          {
            association: models.ContentRevisions.associations.content_translations,
            required: true,
            duplicating: false,
            attributes: ['title', 'body', 'transcript', 'language_code', 'audio_asset_id'],
            where: { language_code: 'vi' },
          },
        ],
      },
    ],
  };
}

function includePublishedPlace(models) {
  return [
    {
      association: models.Places.associations.region,
      required: true,
      attributes: ['id', 'name'],
      where: { phase: { [Op.in]: [1, 2] } },
    },
    {
      association: models.Places.associations.ward,
      required: false,
      attributes: ['id', 'name'],
    },
    includePublishedContent(models, 'PLACE'),
  ];
}

function serializePlace(instance) {
  const row = instance.get({ plain: true });
  const revision = row.content.published_revision;
  const translation = revision.content_translations[0];
  const payload =
    typeof revision.payload === 'string'
      ? safeParse(revision.payload)
      : revision.payload || {};
  return {
    id: row.id,
    title: translation.title,
    description: translation.body,
    category: row.category,
    region: { id: row.region.id, name: row.region.name },
    ward: row.ward ? { id: row.ward.id, name: row.ward.name } : null,
    wardId: row.ward_id || null,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    referencePriceVnd:
      row.reference_price_vnd === null ? null : String(row.reference_price_vnd),
    typicalDurationMinutes: row.typical_duration_minutes,
    bestTimeToVisit: row.best_time_to_visit || null,
    sourceReference: revision.source_reference,
    bannerUrl: payload.bannerUrl || null,
    imageUrl: payload.imageUrl || payload.bannerUrl || null,
    updatedAt: serializeUtc(row.updated_at),
  };
}

function serializeAudioGuide(instance) {
  const row = instance.get({ plain: true });
  const revision = row.content.published_revision;
  const translation = revision.content_translations[0];
  const payload =
    typeof revision.payload === 'string'
      ? safeParse(revision.payload)
      : revision.payload || {};
  return {
    id: row.id,
    placeId: row.place_id,
    title: translation.title,
    description: translation.body,
    transcript: translation.transcript ?? null,
    languageCode: translation.language_code || 'vi',
    audioUrl:
      payload?.audioUrl ||
      (translation.audio_asset_id ? `/api/v1/media/${translation.audio_asset_id}` : null),
    premiumOnly: Boolean(row.premium_only),
    sourceReference: revision.source_reference,
  };
}

function serializeEvent(instance, placeMap) {
  const row = instance.get({ plain: true });
  const revision = row.content.published_revision;
  const translation = revision.content_translations[0];
  const payload =
    typeof revision.payload === 'string'
      ? safeParse(revision.payload)
      : revision.payload || {};
  const placeInfo = placeMap?.get(row.place_id);
  return {
    id: row.id,
    placeId: row.place_id,
    placeTitle: placeInfo?.title ?? '',
    region: placeInfo?.region ?? null,
    title: translation.title,
    description: translation.body,
    startsAt: serializeUtc(row.starts_at),
    endsAt: serializeUtc(row.ends_at),
    eventStatus: effectiveEventStatus(row.event_status, row.ends_at),
    sourceReference: revision.source_reference,
    bannerUrl: payload.bannerUrl || null,
    imageUrl: payload.imageUrl || payload.bannerUrl || null,
    updatedAt: serializeUtc(revision.created_at),
  };
}

function serializeService(instance, { partnerMap, placeMap, slotsByService }) {
  const row = instance.get({ plain: true });
  const revision = row.content.published_revision;
  const translation = revision.content_translations[0];
  const partnerInfo = partnerMap?.get(row.partner_id);
  const placeInfo = row.place_id ? placeMap?.get(row.place_id) : null;
  const slots = (slotsByService?.get(row.id) ?? []).map((slot) => {
    const capacity = Number(slot.capacity);
    const heldQuantity = Number(slot.held_quantity);
    const soldQuantity = Number(slot.sold_quantity);
    return {
      id: slot.id,
      serviceId: slot.service_id,
      startsAt: serializeUtc(slot.starts_at),
      endsAt: serializeUtc(slot.ends_at),
      capacity,
      heldQuantity,
      soldQuantity,
      availableQuantity: Math.max(0, capacity - heldQuantity - soldQuantity),
    };
  });
  return {
    id: row.id,
    placeId: row.place_id ?? null,
    placeTitle: placeInfo?.title ?? null,
    partnerId: row.partner_id,
    partnerName: partnerInfo?.title ?? 'Đối tác Gia Lai',
    title: translation.title,
    description: translation.body,
    serviceType: row.service_type,
    priceUnit: row.price_unit,
    unitPriceVnd: serializeVnd(row.unit_price_vnd),
    active: Boolean(row.active),
    sourceReference: revision.source_reference,
    updatedAt: serializeUtc(row.updated_at),
    slots,
  };
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export function createCatalogRepository(database) {
  async function loadPublishedPlacesMap(placeIds, transaction) {
    const { models } = database;
    const uniqueIds = [...new Set(placeIds.filter(Boolean))];
    if (uniqueIds.length === 0) return new Map();
    const rows = await models.Places.findAll({
      where: { id: { [Op.in]: uniqueIds } },
      attributes: placeAttributes,
      include: includePublishedPlace(models),
      transaction,
      subQuery: false,
    });
    return new Map(rows.map((r) => [r.id, serializePlace(r)]));
  }

  async function loadActivePartnersMap(partnerIds, transaction) {
    const { models } = database;
    const uniqueIds = [...new Set(partnerIds.filter(Boolean))];
    if (uniqueIds.length === 0) return new Map();
    const rows = await models.Partners.findAll({
      where: { id: { [Op.in]: uniqueIds }, status: 'ACTIVE' },
      include: [includePublishedContent(models, 'PARTNER')],
      transaction,
      subQuery: false,
    });
    return new Map(
      rows.map((r) => {
        const plain = r.get({ plain: true });
        const translation = plain.content.published_revision.content_translations[0];
        return [plain.id, { id: plain.id, title: translation.title }];
      }),
    );
  }

  async function queryAudioGuidesForPlace(placeId, transaction) {
    const { models } = database;
    const rows = await models.AudioGuides.findAll({
      where: { place_id: placeId },
      include: [includePublishedContent(models, 'AUDIO')],
      order: [['id', 'ASC']],
      transaction,
      subQuery: false,
    });
    return rows.map(serializeAudioGuide);
  }

  async function queryEventsForPlace(placeId, placeDto, transaction) {
    const { models } = database;
    const rows = await models.Events.findAll({
      where: { place_id: placeId },
      include: [includePublishedContent(models, 'EVENT')],
      order: [['starts_at', 'ASC'], ['id', 'ASC']],
      transaction,
      subQuery: false,
    });
    const placeMap = new Map([[placeId, placeDto]]);
    return rows.map((row) => serializeEvent(row, placeMap));
  }

  async function queryServicesForPlace(placeId, placeDto, transaction) {
    const { models } = database;
    const rows = await models.Services.findAll({
      where: { place_id: placeId, active: true },
      include: [includePublishedContent(models, 'SERVICE')],
      order: [['id', 'ASC']],
      transaction,
      subQuery: false,
    });
    if (rows.length === 0) return [];
    const partnerMap = await loadActivePartnersMap(
      rows.map((r) => r.partner_id),
      transaction,
    );
    const activeRows = rows.filter((r) => partnerMap.has(r.partner_id));
    if (activeRows.length === 0) return [];
    const slots = await models.ServiceSlots.findAll({
      where: { service_id: { [Op.in]: activeRows.map((r) => r.id) } },
      order: [['starts_at', 'ASC'], ['id', 'ASC']],
      transaction,
    });
    const slotsByService = new Map();
    for (const slot of slots) {
      const list = slotsByService.get(slot.service_id) ?? [];
      list.push(slot);
      slotsByService.set(slot.service_id, list);
    }
    const placeMap = new Map([[placeId, placeDto]]);
    return activeRows.map((row) =>
      serializeService(row, { partnerMap, placeMap, slotsByService }),
    );
  }

  return {
    dataset: 'live',
    async list(query) {
      const { models } = database;
      const conditions = {};
      if (query.category) conditions.category = query.category;
      if (query.regionId) conditions.region_id = query.regionId;
      if (query.minPrice !== undefined || query.maxPrice !== undefined)
        conditions.reference_price_vnd = {
          ...(query.minPrice !== undefined ? { [Op.gte]: query.minPrice } : {}),
          ...(query.maxPrice !== undefined ? { [Op.lte]: query.maxPrice } : {}),
        };
      if (query.q)
        conditions[Op.and] = where(
          fn('LOCATE', query.q, col('content.published_revision.content_translations.title')),
          { [Op.gt]: 0 },
        );
      const titleOrder = [
        col('content.published_revision.content_translations.title'),
        'ASC',
      ];
      const order =
        query.sort === 'price-asc'
          ? [
              [fn('ISNULL', col('Places.reference_price_vnd')), 'ASC'],
              ['reference_price_vnd', 'ASC'],
              titleOrder,
              ['id', 'ASC'],
            ]
          : [titleOrder, ['id', 'ASC']];
      return database.transaction(async (transaction) => {
        const options = {
          where: conditions,
          include: includePublishedPlace(models),
          transaction,
          subQuery: false,
        };
        const total = await models.Places.count({
          ...options,
          distinct: true,
          col: 'id',
        });
        const rows = await models.Places.findAll({
          ...options,
          attributes: placeAttributes,
          order,
          limit: query.pageSize,
          offset: (query.page - 1) * query.pageSize,
        });
        return { data: rows.map(serializePlace), total };
      });
    },
    async findById(id) {
      const { models } = database;
      return database.transaction(async (transaction) => {
        const row = await models.Places.findOne({
          where: { id },
          attributes: placeAttributes,
          include: includePublishedPlace(models),
          transaction,
          subQuery: false,
        });
        if (!row) return null;
        const placeDto = serializePlace(row);
        const [hours, closures, audioGuides, events, services] = await Promise.all([
          models.PlaceOpeningHours.findAll({
            where: { place_id: id },
            attributes: ['weekday', 'opens_at', 'closes_at', 'crosses_midnight'],
            order: [
              ['weekday', 'ASC'],
              ['opens_at', 'ASC'],
            ],
            transaction,
          }),
          models.PlaceClosures.findAll({
            where: { place_id: id },
            attributes: ['id', 'starts_at', 'ends_at', 'reason', 'source_reference'],
            order: [['starts_at', 'ASC']],
            transaction,
          }),
          queryAudioGuidesForPlace(id, transaction),
          queryEventsForPlace(id, placeDto, transaction),
          queryServicesForPlace(id, placeDto, transaction),
        ]);
        return {
          ...placeDto,
          openingHours: hours.map((hour) => ({
            weekday: hour.weekday,
            opensAt: hour.opens_at,
            closesAt: hour.closes_at,
            crossesMidnight: Boolean(hour.crosses_midnight),
          })),
          closures: closures.map((closure) => ({
            id: closure.id,
            startsAt: serializeUtc(closure.starts_at),
            endsAt: serializeUtc(closure.ends_at),
            reason: closure.reason,
            sourceReference: closure.source_reference,
          })),
          audioGuides,
          events,
          services,
        };
      });
    },
    async catalog() {
      const { models } = database;
      const rows = await models.Places.findAll({
        attributes: ['id', 'category'],
        include: includePublishedPlace(models),
      });
      return {
        categoryCodes: [...new Set(rows.map((row) => row.category))],
        regions: [
          ...new Map(
            rows.map((row) => [
              row.region.id,
              { id: row.region.id, name: row.region.name },
            ]),
          ).values(),
        ],
      };
    },
    async findAudioGuidesByPlaceId(placeId) {
      const { models } = database;
      return database.transaction(async (transaction) => {
        const place = await models.Places.findOne({
          where: { id: placeId },
          attributes: ['id'],
          include: includePublishedPlace(models),
          transaction,
          subQuery: false,
        });
        if (!place) return null;
        return queryAudioGuidesForPlace(placeId, transaction);
      });
    },
    async listEvents(query) {
      const { models } = database;
      return database.transaction(async (transaction) => {
        const conditions = {};
        if (query.placeId) conditions.place_id = query.placeId;
        if (query.q) {
          conditions[Op.and] = where(
            fn('LOCATE', query.q, col('content.published_revision.content_translations.title')),
            { [Op.gt]: 0 },
          );
        }
        const rows = await models.Events.findAll({
          where: conditions,
          include: [includePublishedContent(models, 'EVENT')],
          order: [
            ['starts_at', 'ASC'],
            ['id', 'ASC'],
          ],
          transaction,
          subQuery: false,
        });
        const placeMap = await loadPublishedPlacesMap(
          rows.map((r) => r.place_id),
          transaction,
        );
        const visible = rows.filter((r) => {
          if (query.status && effectiveEventStatus(r.event_status, r.ends_at) !== query.status) return false;
          const place = placeMap.get(r.place_id);
          if (!place) return false;
          if (query.regionId && place.region.id !== query.regionId) return false;
          return true;
        });
        const sliced = visible.slice(
          (query.page - 1) * query.pageSize,
          query.page * query.pageSize,
        );
        return {
          data: sliced.map((row) => serializeEvent(row, placeMap)),
          total: visible.length,
        };
      });
    },
    async findEventById(id) {
      const { models } = database;
      return database.transaction(async (transaction) => {
        const row = await models.Events.findOne({
          where: { id },
          include: [includePublishedContent(models, 'EVENT')],
          transaction,
          subQuery: false,
        });
        if (!row) return null;
        const placeMap = await loadPublishedPlacesMap([row.place_id], transaction);
        if (!placeMap.has(row.place_id)) return null;
        return serializeEvent(row, placeMap);
      });
    },
    async listServices(query) {
      const { models } = database;
      return database.transaction(async (transaction) => {
        const conditions = { active: true };
        if (query.placeId) conditions.place_id = query.placeId;
        if (query.serviceType) conditions.service_type = query.serviceType;
        if (query.q) {
          conditions[Op.and] = where(
            fn('LOCATE', query.q, col('content.published_revision.content_translations.title')),
            { [Op.gt]: 0 },
          );
        }
        const rows = await models.Services.findAll({
          where: conditions,
          include: [includePublishedContent(models, 'SERVICE')],
          order: [['id', 'ASC']],
          transaction,
          subQuery: false,
        });
        const partnerMap = await loadActivePartnersMap(
          rows.map((r) => r.partner_id),
          transaction,
        );
        const placeMap = await loadPublishedPlacesMap(
          rows.map((r) => r.place_id),
          transaction,
        );
        const visible = rows.filter(
          (r) =>
            partnerMap.has(r.partner_id) &&
            (!r.place_id || placeMap.has(r.place_id)),
        );
        const sliced = visible.slice(
          (query.page - 1) * query.pageSize,
          query.page * query.pageSize,
        );
        const slots =
          sliced.length > 0
            ? await models.ServiceSlots.findAll({
                where: { service_id: { [Op.in]: sliced.map((r) => r.id) } },
                order: [
                  ['starts_at', 'ASC'],
                  ['id', 'ASC'],
                ],
                transaction,
              })
            : [];
        const slotsByService = new Map();
        for (const slot of slots) {
          const list = slotsByService.get(slot.service_id) ?? [];
          list.push(slot);
          slotsByService.set(slot.service_id, list);
        }
        return {
          data: sliced.map((row) =>
            serializeService(row, { partnerMap, placeMap, slotsByService }),
          ),
          total: visible.length,
        };
      });
    },
    async findServiceById(id) {
      const { models } = database;
      return database.transaction(async (transaction) => {
        const row = await models.Services.findOne({
          where: { id, active: true },
          include: [includePublishedContent(models, 'SERVICE')],
          transaction,
          subQuery: false,
        });
        if (!row) return null;
        const partnerMap = await loadActivePartnersMap([row.partner_id], transaction);
        if (!partnerMap.has(row.partner_id)) return null;
        const placeMap = row.place_id
          ? await loadPublishedPlacesMap([row.place_id], transaction)
          : new Map();
        if (row.place_id && !placeMap.has(row.place_id)) return null;
        const slots = await models.ServiceSlots.findAll({
          where: { service_id: row.id },
          order: [
            ['starts_at', 'ASC'],
            ['id', 'ASC'],
          ],
          transaction,
        });
        const slotsByService = new Map([[row.id, slots]]);
        return serializeService(row, { partnerMap, placeMap, slotsByService });
      });
    },
  };
}
