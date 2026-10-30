import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { generateKeyPairSync, randomUUID } from 'node:crypto';
import { isolatedDatabase } from './database-helper.js';
import { createApp } from '../src/app.js';
import { createMailAdapter } from '../src/adapters/index.js';
import { appendNotification, listAuditLogs } from '../src/shared/audit.js';
import { createJobRunner } from '../src/jobs/job-runner.js';

async function authFixture(t, { mail = createMailAdapter({ mode: 'outbox' }), clock } = {}) {
  const { database } = await isolatedDatabase(t);
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const auth = { privateKey, publicKeys: new Map([['integration', publicKey]]), kid: 'integration',
    issuer: 'integration-api', audience: 'integration-web', origins: ['http://localhost:5173'],
    secure: false, accessSeconds: 900, sessionMilliseconds: 7 * 86400_000, resetMilliseconds: 15 * 60_000 };
  const server = createApp({ database, auth, mail, clock }).listen(0, '127.0.0.1');
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
  return { database, mail, request, credentials, cookie, register, login };
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
  const roles = f.database.models.UserRoles; const createRole = roles.create;
  try {
    roles.create = async () => { throw new Error('injected-role-failure'); };
    const failed = await f.request('/register', { body: { ...f.credentials, email: 'rollback@example.test' } });
    assert.equal(failed.status, 503);
    assert.equal(await f.database.models.Users.count({ where: { email_key: 'rollback@example.test' } }), 0);
  } finally { roles.create = createRole; }
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

test('Auth/MariaDB: expired DB sessions and refresh tokens are rejected despite a valid signed JWT', async (t) => {
  const f = await authFixture(t); await f.register(); const session = await f.login();
  const created = new Date(Date.now() - 3 * 86400_000); const expiry = new Date(Date.now() - 86400_000);
  await f.database.models.AuthSessions.update({ created_at: created, expires_at: expiry }, { where: {} });
  await f.database.models.AuthRefreshTokens.update({ created_at: created, expires_at: expiry }, { where: {} });
  assert.equal((await f.request('/me', { method: 'GET', access: session.data.accessToken })).status, 401);
  assert.equal((await f.request('/refresh', { cookie: session.cookie })).status, 401);
});

test('Auth/MariaDB: repeated failed logins are rate limited with Retry-After', async (t) => {
  const f = await authFixture(t); await f.register();
  for (let i = 0; i < 5; i++) assert.equal((await f.request('/login', { body: { email: f.credentials.email, password: 'wrong-password' } })).status, 401);
  const limited = await f.request('/login', { body: { email: f.credentials.email, password: 'wrong-password' } });
  assert.equal(limited.status, 429); assert.ok(Number(limited.headers.get('retry-after')) > 0);
});

test('Auth/MariaDB: password reset uniform response, 15m boundary, concurrent single-use, session revocation and SMTP failure', async (t) => {
  let currentNow = new Date('2026-10-30T02:00:00.000Z');
  const f = await authFixture(t, { clock: () => currentNow });
  await f.register();
  const activeSession = await f.login();

  const missingResp = await f.request('/forgot-password', { body: { email: 'missing@example.test' } });
  const existingResp = await f.request('/forgot-password', { body: { email: f.credentials.email } });
  assert.equal(missingResp.status, 202);
  assert.equal(existingResp.status, 202);
  assert.deepEqual(await missingResp.json(), await existingResp.json());
  assert.equal(f.mail.outbox.length, 1);

  const firstToken = new URL(f.mail.outbox[0].resetUrl).searchParams.get('token');
  const storedReset = await f.database.models.PasswordResetTokens.findOne();
  assert.equal(storedReset.token_hash.length, 32);
  assert.ok(!storedReset.token_hash.equals(Buffer.from(firstToken)));

  // Exact 15-minute boundary must be rejected.
  currentNow = new Date('2026-10-30T02:15:00.000Z');
  const expiredAttempt = await f.request('/reset-password', {
    body: { token: firstToken, password: 'New integration password 🌿' },
  });
  assert.equal(expiredAttempt.status, 400);

  // Issue a fresh token and submit two concurrent reset requests.
  const secondForgot = await f.request('/forgot-password', { body: { email: f.credentials.email } });
  assert.equal(secondForgot.status, 202);
  const secondToken = new URL(f.mail.outbox[1].resetUrl).searchParams.get('token');
  currentNow = new Date('2026-10-30T02:29:59.000Z');
  const newPassword = 'Updated integration password 🌿';
  const concurrent = await Promise.all([
    f.request('/reset-password', { body: { token: secondToken, password: newPassword } }),
    f.request('/reset-password', { body: { token: secondToken, password: newPassword } }),
  ]);
  assert.deepEqual(concurrent.map((r) => r.status).sort(), [200, 400]);

  // Reuse is rejected and all prior sessions are revoked.
  assert.equal((await f.request('/reset-password', { body: { token: secondToken, password: newPassword } })).status, 400);
  assert.equal((await f.request('/me', { method: 'GET', access: activeSession.data.accessToken })).status, 401);
  assert.equal((await f.request('/refresh', { cookie: activeSession.cookie })).status, 401);
  assert.equal((await f.request('/login', { body: { email: f.credentials.email, password: f.credentials.password } })).status, 401);
  assert.equal((await f.request('/login', { body: { email: f.credentials.email, password: newPassword } })).status, 200);

  // SMTP transport failure never claims delivery success and invalidates the unsent token.
  const failingMail = createMailAdapter({
    mode: 'smtp',
    maxAttempts: 2,
    retryDelayMs: 1,
    send: async () => { throw new Error('smtp-connection-refused'); },
  });
  const fSmtp = await authFixture(t, { mail: failingMail });
  await fSmtp.register();
  const smtpResp = await fSmtp.request('/forgot-password', { body: { email: fSmtp.credentials.email } });
  assert.equal(smtpResp.status, 202);
  const deliveryLogs = await fSmtp.database.models.AuditLogs.findAll({
    where: { action: 'AUTH_PASSWORD_RESET_DELIVERY' },
  });
  assert.equal(deliveryLogs.length, 1);
  assert.equal(deliveryLogs[0].result, 'FAILURE');
  const unsentReset = await fSmtp.database.models.PasswordResetTokens.findOne();
  assert.ok(unsentReset.used_at !== null);
});

test('Audit & Jobs/MariaDB: notification idempotency, admin-only audit read, advisory lock and expired auth cleanup', async (t) => {
  let currentNow = new Date('2026-10-30T03:00:00.000Z');
  const f = await authFixture(t, { clock: () => currentNow });
  const user = await f.register();
  await f.login();

  // Notification helper is idempotent per (user_id, event_key).
  await f.database.transaction(async (transaction) => {
    const first = await appendNotification(f.database, transaction, {
      userId: user.id, eventKey: 'welcome:1', kind: 'ACCOUNT', title: 'Chào mừng', body: 'Nội dung',
    });
    const second = await appendNotification(f.database, transaction, {
      userId: user.id, eventKey: 'welcome:1', kind: 'ACCOUNT', title: 'Chào mừng', body: 'Nội dung',
    });
    assert.equal(first.id, second.id);
  });
  assert.equal(await f.database.models.Notifications.count({ where: { user_id: user.id } }), 1);

  // Regular tourist cannot read audit logs; admin can read them.
  await assert.rejects(
    () => listAuditLogs(f.database, { actorUser: { id: user.id, roles: ['TOURIST'] } }),
    { status: 403 },
  );
  const logs = await listAuditLogs(f.database, { actorUser: { id: user.id, roles: ['ADMIN'] } });
  assert.ok(logs.data.length >= 2);

  // Two concurrent job runners never execute the same job simultaneously.
  let executions = 0;
  const runnerA = createJobRunner({ database: f.database, clock: () => currentNow });
  const runnerB = createJobRunner({ database: f.database, clock: () => currentNow });
  const slowHandler = async () => {
    executions++;
    await new Promise((resolve) => setTimeout(resolve, 80));
    return { ran: true };
  };
  runnerA.register('slow-lock-check', slowHandler);
  runnerB.register('slow-lock-check', slowHandler);
  const [run1, run2] = await Promise.all([
    runnerA.run('slow-lock-check'),
    runnerB.run('slow-lock-check'),
  ]);
  assert.deepEqual([run1.status, run2.status].sort(), ['COMPLETED', 'SKIPPED']);
  assert.equal(executions, 1);

  // Expired auth cleanup deletes expired reset tokens and expired sessions, keeping active sessions.
  await f.request('/forgot-password', { body: { email: f.credentials.email } });
  const expiredSessionId = randomUUID();
  await f.database.models.AuthSessions.create({
    id: expiredSessionId,
    user_id: user.id,
    created_at: new Date('2026-10-20T00:00:00.000Z'),
    expires_at: new Date('2026-10-27T00:00:00.000Z'),
  });
  await f.database.models.AuthRefreshTokens.create({
    id: randomUUID(),
    session_id: expiredSessionId,
    token_hash: Buffer.alloc(32, 7),
    created_at: new Date('2026-10-20T00:00:00.000Z'),
    expires_at: new Date('2026-10-27T00:00:00.000Z'),
  });
  currentNow = new Date('2026-10-30T03:20:00.000Z');
  const cleanupOutcome = await runnerA.run('cleanup-expired-auth');
  assert.equal(cleanupOutcome.status, 'COMPLETED');
  assert.equal(cleanupOutcome.summary.expiredResets, 1);
  assert.equal(cleanupOutcome.summary.deletedSessions, 1);
  assert.equal(await f.database.models.AuthSessions.count({ where: { id: expiredSessionId } }), 0);
  assert.equal(await f.database.models.AuthSessions.count({ where: { user_id: user.id } }), 1);
});
