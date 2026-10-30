import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { generateKeyPairSync } from 'node:crypto';
import { isolatedDatabase } from './database-helper.js';
import { createApp } from '../src/app.js';

async function authFixture(t) {
  const { database } = await isolatedDatabase(t);
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const auth = { privateKey, publicKeys: new Map([['integration', publicKey]]), kid: 'integration',
    issuer: 'integration-api', audience: 'integration-web', origins: ['http://localhost:5173'],
    secure: false, accessSeconds: 900, sessionMilliseconds: 7 * 86400_000 };
  const server = createApp({ database, auth }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const url = `http://127.0.0.1:${server.address().port}/api/v1/auth`;
  const credentials = { email: 'visitor@example.test', password: 'Integration password 🌿', displayName: 'Du khách 🌿' };
  const request = (path, { body, cookie, access, headers, method = 'POST' } = {}) => fetch(`${url}${path}`, {
    method, headers: { Origin: 'http://localhost:5173', 'X-CSRF-Protection': '1', 'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}), ...(access ? { Authorization: `Bearer ${access}` } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const cookie = (response) => response.headers.get('set-cookie')?.split(';')[0];
  async function register() { const response = await request('/register', { body: credentials }); assert.equal(response.status, 201); return (await response.json()).data; }
  async function login() {
    const response = await request('/login', { body: { email: credentials.email, password: credentials.password } });
    assert.equal(response.status, 200, await response.clone().text());
    return { response, cookie: cookie(response), data: (await response.json()).data };
  }
  return { database, request, credentials, cookie, register, login };
}

test('Auth/MariaDB: registration, normalized uniqueness, CSRF, cookie flags and current user', async (t) => {
  const f = await authFixture(t);
  for (const headers of [{ Origin: 'https://evil.example' }, { 'X-CSRF-Protection': '' }, { Origin: '' }]) {
    assert.equal((await f.request('/register', { body: f.credentials, headers })).status, 403);
  }
  assert.equal((await f.request('/register', { body: { ...f.credentials, roles: ['ADMIN'] } })).status, 422);
  assert.equal((await f.request('/register', { body: { ...f.credentials, password: 'short' } })).status, 422);
  const user = await f.register();
  assert.equal((await f.request('/register', { body: { ...f.credentials, email: ' Visitor@Example.TEST ' } })).status, 409);
  assert.equal((await f.request('/login', { body: { email: f.credentials.email, password: 'wrong-password' } })).status, 401);
  const session = await f.login();
  const flags = session.response.headers.get('set-cookie');
  assert.match(flags, /HttpOnly/); assert.match(flags, /SameSite=Lax/); assert.match(flags, /Path=\/api\/v1\/auth/);
  assert.equal(session.response.headers.get('cache-control'), 'no-store');
  assert.equal(session.response.headers.get('access-control-allow-credentials'), 'true');
  assert.equal(session.data.user.id, user.id); assert.deepEqual(session.data.user.roles, ['TOURIST']);
  const me = await f.request('/me', { method: 'GET', access: session.data.accessToken });
  assert.equal(me.status, 200);
  const text = await me.text(); assert.ok(!text.includes('password')); assert.ok(!text.includes('refreshToken'));
  assert.equal((await f.request('/me', { method: 'GET' })).status, 401);
  const refresh = await f.database.models.AuthRefreshTokens.findOne();
  assert.equal(refresh.token_hash.length, 32); assert.ok(!refresh.token_hash.equals(Buffer.from(session.cookie.split('=')[1])));
});

test('Auth/MariaDB: refresh rotates once; replay commits session revocation', async (t) => {
  const f = await authFixture(t); await f.register(); const initial = await f.login();
  const rotated = await f.request('/refresh', { cookie: initial.cookie });
  assert.equal(rotated.status, 200);
  assert.notEqual(f.cookie(rotated), initial.cookie);
  const next = (await rotated.json()).data;
  const replay = await f.request('/refresh', { cookie: initial.cookie });
  assert.equal(replay.status, 401); assert.match(replay.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/);
  assert.equal((await f.request('/me', { method: 'GET', access: next.accessToken })).status, 401);
  assert.equal((await f.request('/refresh', { cookie: f.cookie(rotated) })).status, 401);
  assert.equal(await f.database.models.AuditLogs.count({ where: { action: 'AUTH_REFRESH_REUSE' } }), 1);
});

test('Auth/MariaDB: concurrent refresh produces one rotation and revokes the replayed session', async (t) => {
  const f = await authFixture(t); await f.register(); const initial = await f.login();
  const responses = await Promise.all([f.request('/refresh', { cookie: initial.cookie }), f.request('/refresh', { cookie: initial.cookie })]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 401]);
  const winner = (await responses.find((response) => response.status === 200).json()).data;
  assert.equal((await f.request('/me', { method: 'GET', access: winner.accessToken })).status, 401);
});

test('Auth/MariaDB: logout is idempotent, roles are current and account lock is immediate', async (t) => {
  const f = await authFixture(t); const user = await f.register(); const session = await f.login();
  await f.database.models.UserRoles.destroy({ where: { user_id: user.id } });
  assert.deepEqual((await (await f.request('/me', { method: 'GET', access: session.data.accessToken })).json()).data.user.roles, []);
  await f.database.models.Users.update({ status: 'LOCKED' }, { where: { id: user.id } });
  assert.equal((await f.request('/me', { method: 'GET', access: session.data.accessToken })).status, 401);
  assert.equal((await f.request('/refresh', { cookie: session.cookie })).status, 401);
  assert.equal((await f.request('/logout', { cookie: session.cookie, access: 'expired.jwt.value' })).status, 204);
  assert.equal((await f.request('/logout', { cookie: session.cookie })).status, 204);
  assert.equal((await f.request('/logout')).status, 204);
});

test('Auth/MariaDB: DB failures fail closed; partial login writes roll back', async (t) => {
  const f = await authFixture(t); await f.register();
  const model = f.database.models.AuthRefreshTokens;
  const original = model.create;
  try {
    model.create = async () => { throw new Error('secret-database-details'); };
    const response = await f.request('/login', { body: { email: f.credentials.email, password: f.credentials.password } });
    assert.equal(response.status, 503); assert.ok(!(await response.text()).includes('secret-database-details'));
    assert.equal(await f.database.models.AuthSessions.count(), 0);
  } finally { model.create = original; }
  const session = await f.login();
  const sessions = f.database.models.AuthSessions; const read = sessions.findOne;
  try {
    sessions.findOne = async () => { throw new Error('secret-connection'); };
    assert.equal((await f.request('/me', { method: 'GET', access: session.data.accessToken })).status, 503);
  } finally { sessions.findOne = read; }
});

test('Auth/MariaDB: repeated failed logins are rate limited with Retry-After', async (t) => {
  const f = await authFixture(t); await f.register();
  for (let i = 0; i < 5; i++) assert.equal((await f.request('/login', { body: { email: f.credentials.email, password: 'wrong-password' } })).status, 401);
  const limited = await f.request('/login', { body: { email: f.credentials.email, password: 'wrong-password' } });
  assert.equal(limited.status, 429); assert.ok(Number(limited.headers.get('retry-after')) > 0);
});
