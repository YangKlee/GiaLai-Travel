const fromPublished = `FROM places p
  JOIN content_items c ON c.id = p.content_id
  JOIN content_revisions cr ON cr.id = c.published_revision_id AND cr.content_id = c.id
  JOIN content_translations t ON t.revision_id = cr.id AND t.language_code = 'vi'
  JOIN regions r ON r.id = p.region_id`;
const publicOnly = "c.kind = 'PLACE' AND c.visibility = 'PUBLIC' AND cr.status = 'PUBLISHED' AND r.phase = 1";
const columns = `p.id, t.title, t.body AS description, p.category,
  r.id AS regionId, r.name AS regionName, p.latitude, p.longitude,
  CAST(p.reference_price_vnd AS CHAR) AS referencePriceVnd,
  p.typical_duration_minutes AS typicalDurationMinutes,
  cr.source_reference AS sourceReference, p.updated_at AS updatedAt`;

function serialize(row) {
  return {
    id: row.id, title: row.title, description: row.description, category: row.category,
    region: { id: row.regionId, name: row.regionName },
    latitude: Number(row.latitude), longitude: Number(row.longitude),
    referencePriceVnd: row.referencePriceVnd === null ? null : String(row.referencePriceVnd),
    typicalDurationMinutes: row.typicalDurationMinutes, sourceReference: row.sourceReference,
    updatedAt: new Date(`${row.updatedAt.replace(' ', 'T')}Z`).toISOString(),
  };
}

function filters(query) {
  const clauses = [publicOnly];
  const parameters = [];
  if (query.q) {
    // '=' is the LIKE escape character, independent of NO_BACKSLASH_ESCAPES.
    clauses.push("t.title LIKE ? ESCAPE '='");
    parameters.push(`%${query.q.replace(/[=%_]/g, '=$&')}%`);
  }
  if (query.category) { clauses.push('p.category = ?'); parameters.push(query.category); }
  if (query.regionId) { clauses.push('p.region_id = ?'); parameters.push(query.regionId); }
  if (query.minPrice !== undefined) { clauses.push('p.reference_price_vnd >= CAST(? AS UNSIGNED)'); parameters.push(query.minPrice); }
  if (query.maxPrice !== undefined) { clauses.push('p.reference_price_vnd <= CAST(? AS UNSIGNED)'); parameters.push(query.maxPrice); }
  return { where: clauses.join(' AND '), parameters };
}

export function createCatalogRepository(database) {
  return {
    dataset: 'live',
    async list(query) {
      const { where, parameters } = filters(query);
      const order = query.sort === 'price-asc'
        ? 'p.reference_price_vnd IS NULL, p.reference_price_vnd, t.title, p.id' : 't.title, p.id';
      // Both reads use the same transaction (default MariaDB REPEATABLE READ).
      return database.transaction(async (tx) => {
        const [count] = await tx.execute(`SELECT COUNT(*) AS total ${fromPublished} WHERE ${where}`, parameters);
        const rows = await tx.execute(`SELECT ${columns} ${fromPublished} WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
          [...parameters, query.pageSize, (query.page - 1) * query.pageSize]);
        return { data: rows.map(serialize), total: Number(count.total) };
      });
    },
    async findById(id) {
      return database.transaction(async (tx) => {
        const [row] = await tx.execute(`SELECT ${columns} ${fromPublished} WHERE ${publicOnly} AND p.id = ?`, [id]);
        if (!row) return null;
        const hours = await tx.execute(`SELECT weekday, opens_at AS opensAt, closes_at AS closesAt,
          crosses_midnight AS crossesMidnight FROM place_opening_hours WHERE place_id = ? ORDER BY weekday, opens_at`, [id]);
        return { ...serialize(row), openingHours: hours.map((hour) => ({ ...hour, crossesMidnight: Boolean(hour.crossesMidnight) })) };
      });
    },
    async catalog() {
      const rows = await database.execute(`SELECT DISTINCT p.category, r.id AS regionId, r.name AS regionName ${fromPublished} WHERE ${publicOnly} ORDER BY r.name, p.category`);
      return {
        categoryCodes: [...new Set(rows.map((row) => row.category))],
        regions: [...new Map(rows.map((row) => [row.regionId, { id: row.regionId, name: row.regionName }])).values()],
      };
    },
  };
}
