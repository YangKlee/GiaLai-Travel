import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { createApp } from '../src/app.js';

test('API health, CORS, 404 và JSON không hợp lệ', async (t) => {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const health = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: 'http://localhost:5173' },
  });
  assert.equal(health.status, 200);
  assert.equal(health.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.deepEqual(await health.json(), { status: 'ok', service: 'gialai-travel-api' });

  const missing = await fetch(`${baseUrl}/api/missing`);
  assert.equal(missing.status, 404);
  assert.equal(typeof (await missing.json()).error.message, 'string');

  const invalid = await fetch(`${baseUrl}/api/health`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  });
  assert.equal(invalid.status, 400);
  const invalidBody = await invalid.json();
  assert.equal(invalidBody.error.code, 'INVALID_JSON');
  assert.equal(invalidBody.error.message, 'Yêu cầu không hợp lệ.');
  assert.equal(invalidBody.error.requestId, invalid.headers.get('x-request-id'));
  assert.equal(health.headers.get('x-powered-by'), null);
  assert.equal(health.headers.get('x-content-type-options'), 'nosniff');
});

test('readiness phản ánh DB và không trả thông tin kết nối', async (t) => {
  let connected = true;
  const database = { async checkReadiness() {
    if (!connected) throw new Error('sensitive-database-detail');
  } };
  const server = createApp({ database }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const url = `http://127.0.0.1:${server.address().port}/api/v1/ready`;
  const ready = await fetch(url);
  assert.equal(ready.status, 200);
  assert.equal(ready.headers.get('cache-control'), 'no-store');
  assert.equal((await ready.json()).checks.database, 'up');
  connected = false;
  const down = await fetch(url);
  assert.equal(down.status, 503);
  const body = await down.text();
  assert.equal(JSON.parse(body).checks.database, 'down');
  assert.ok(!body.includes('sensitive-database-detail'));
});
