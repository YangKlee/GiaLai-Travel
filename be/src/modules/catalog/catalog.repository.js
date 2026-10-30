import { Op, col, fn, where } from 'sequelize';
import { serializeUtc } from '../../shared/time.js';

const placeAttributes = ['id', 'category', 'latitude', 'longitude', 'reference_price_vnd', 'typical_duration_minutes', 'updated_at'];

function includePublished(models) {
  return [
    { association: models.Places.associations.region, required: true, attributes: ['id', 'name'], where: { phase: 1 } },
    { association: models.Places.associations.content, required: true, attributes: ['id'], where: { kind: 'PLACE', visibility: 'PUBLIC' }, include: [
      { association: models.ContentItems.associations.published_revision, required: true,
        attributes: ['id', 'source_reference'], where: { status: 'PUBLISHED', content_id: { [Op.col]: 'content.id' } }, include: [
          { association: models.ContentRevisions.associations.content_translations, required: true, duplicating: false,
            attributes: ['title', 'body'], where: { language_code: 'vi' } },
        ] },
    ] },
  ];
}

function serialize(instance) {
  const row = instance.get({ plain: true });
  const revision = row.content.published_revision;
  const translation = revision.content_translations[0];
  return {
    id: row.id, title: translation.title, description: translation.body, category: row.category,
    region: { id: row.region.id, name: row.region.name },
    latitude: Number(row.latitude), longitude: Number(row.longitude),
    referencePriceVnd: row.reference_price_vnd === null ? null : String(row.reference_price_vnd),
    typicalDurationMinutes: row.typical_duration_minutes, sourceReference: revision.source_reference,
    updatedAt: serializeUtc(row.updated_at),
  };
}

export function createCatalogRepository(database) {
  return {
    dataset: 'live',
    async list(query) {
      const { models } = database;
      const conditions = {};
      if (query.category) conditions.category = query.category;
      if (query.regionId) conditions.region_id = query.regionId;
      if (query.minPrice !== undefined || query.maxPrice !== undefined) conditions.reference_price_vnd = {
        ...(query.minPrice !== undefined ? { [Op.gte]: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { [Op.lte]: query.maxPrice } : {}),
      };
      if (query.q) conditions[Op.and] = where(fn('LOCATE', query.q, col('content.published_revision.content_translations.title')), { [Op.gt]: 0 });
      const titleOrder = [col('content.published_revision.content_translations.title'), 'ASC'];
      const order = query.sort === 'price-asc'
        ? [[fn('ISNULL', col('Places.reference_price_vnd')), 'ASC'], ['reference_price_vnd', 'ASC'], titleOrder, ['id', 'ASC']]
        : [titleOrder, ['id', 'ASC']];
      return database.transaction(async (transaction) => {
        const options = { where: conditions, include: includePublished(models), transaction, subQuery: false };
        const total = await models.Places.count({ ...options, distinct: true, col: 'id' });
        const rows = await models.Places.findAll({ ...options, attributes: placeAttributes, order,
          limit: query.pageSize, offset: (query.page - 1) * query.pageSize });
        return { data: rows.map(serialize), total };
      });
    },
    async findById(id) {
      const { models } = database;
      return database.transaction(async (transaction) => {
        const row = await models.Places.findOne({ where: { id }, attributes: placeAttributes, include: includePublished(models), transaction, subQuery: false });
        if (!row) return null;
        const hours = await models.PlaceOpeningHours.findAll({ where: { place_id: id },
          attributes: ['weekday', 'opens_at', 'closes_at', 'crosses_midnight'], order: [['weekday', 'ASC'], ['opens_at', 'ASC']], transaction });
        return { ...serialize(row), openingHours: hours.map((hour) => ({ weekday: hour.weekday,
          opensAt: hour.opens_at, closesAt: hour.closes_at, crossesMidnight: Boolean(hour.crosses_midnight) })) };
      });
    },
    async catalog() {
      const { models } = database;
      const rows = await models.Places.findAll({ attributes: ['id', 'category'], include: includePublished(models) });
      return {
        categoryCodes: [...new Set(rows.map((row) => row.category))],
        regions: [...new Map(rows.map((row) => [row.region.id, { id: row.region.id, name: row.region.name }])).values()],
      };
    },
  };
}
