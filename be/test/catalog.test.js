import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { createApp } from '../src/app.js';
import { createDemoCatalogRepository } from '../demo/catalog.repository.js';
import { demoPlaces } from '../demo/places.js';
import { createCatalogRepository } from '../src/modules/catalog/catalog.repository.js';

async function serve(t, dependencies) {
  const server = createApp(dependencies).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  return `http://127.0.0.1:${server.address().port}/api/v1`;
}

test('catalog API combines filters, pagination, detail and preserves null versus zero', async (t) => {
  const base = await serve(t, { catalogRepository: createDemoCatalogRepository() });
  const catalog = await (await fetch(`${base}/catalog`)).json();
  assert.equal(catalog.dataset, 'demo');
  assert.equal(catalog.data.regions.length, 2);
  const response = await fetch(`${base}/places?category=CULTURE&maxPrice=0&pageSize=1`);
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(result.meta, { page: 1, pageSize: 1, total: 1, totalPages: 1 });
  assert.equal(result.data[0].referencePriceVnd, '0');
  const detail = await (await fetch(`${base}/places/${demoPlaces[0].id}`)).json();
  assert.equal(detail.data.referencePriceVnd, null);
  assert.deepEqual(detail.data.openingHours, []);
  assert.equal(detail.data.latitude, null);
  const search = await (await fetch(`${base}/places?q=bien%20ho`)).json();
  assert.deepEqual(search.data.map((place) => place.id), [demoPlaces[0].id]);
  const empty = await (await fetch(`${base}/places?page=999`)).json();
  assert.deepEqual(empty.data, []);
  assert.equal(empty.meta.total, demoPlaces.length);
});

test('invalid filters and GUIDs are 422; unavailable detail is 404', async (t) => {
  const base = await serve(t, { catalogRepository: createDemoCatalogRepository() });
  for (const query of ['page=0', 'pageSize=101', 'category=ADMIN', 'minPrice=abc', 'minPrice=-1',
    'minPrice=01', 'minPrice=18446744073709551616', 'minPrice=10&maxPrice=5', 'q=a&q=b',
    'category=NATURE&category=CULTURE', 'sort=sql', 'regionId=oops', 'unknown=value']) {
    const response = await fetch(`${base}/places?${query}`);
    assert.equal(response.status, 422, query);
    const body = await response.json();
    assert.equal(body.error.code, 'VALIDATION_ERROR');
    assert.ok(body.error.fields.length > 0);
  }
  assert.equal((await fetch(`${base}/places/not-an-id`)).status, 422);
  assert.equal((await fetch(`${base}/places/10000000-0000-4000-8000-000000000099`)).status, 404);
});

test('database failure never silently supplies demo data or exposes connection details', async (t) => {
  const base = await serve(t, { database: {
    async execute() { throw new Error('secret-connection-string'); },
    async transaction() { throw new Error('secret-connection-string'); },
  } });
  for (const path of ['/catalog', '/places', `/places/${demoPlaces[0].id}`]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 503);
    const text = await response.text();
    assert.ok(!text.includes('secret-connection-string'));
    assert.equal(JSON.parse(text).error.code, 'CATALOG_UNAVAILABLE');
  }
});

test('SQL repository binds hostile search, applies publication gates and uses deterministic pagination', async () => {
  const calls = [];
  const tx = { async execute(sql, parameters) {
    calls.push({ sql, parameters });
    return sql.includes('COUNT(*)') ? [{ total: 0 }] : [];
  } };
  const repository = createCatalogRepository({ transaction: (work) => work(tx) });
  const q = "%' OR 1=1; --_=";
  const result = await repository.list({ q, page: 2, pageSize: 3, sort: 'price-asc' });
  assert.deepEqual(result, { data: [], total: 0 });
  for (const { sql, parameters } of calls) {
    assert.ok(!sql.includes(q));
    assert.ok(sql.includes("c.visibility = 'PUBLIC'"));
    assert.ok(sql.includes("cr.status = 'PUBLISHED'"));
    assert.ok(sql.includes('cr.id = c.published_revision_id AND cr.content_id = c.id'));
    assert.ok(sql.includes('r.phase = 1'));
    assert.equal(parameters[0], "%=%' OR 1==1; --=_==%");
  }
  assert.match(calls[1].sql, /ORDER BY .*p.id LIMIT \? OFFSET \?/);
  assert.deepEqual(calls[1].parameters.slice(-2), [3, 3]);
  // An unpublished/nonexistent row does not trigger an opening-hours query.
  calls.length = 0;
  assert.equal(await repository.findById(demoPlaces[0].id), null);
  assert.equal(calls.length, 1);
});
