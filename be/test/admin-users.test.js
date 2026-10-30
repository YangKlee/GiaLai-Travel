import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createAdminUsersService } from '../src/modules/users/admin-users.service.js';
import { adminUserCreateSchema, adminUserUpdateSchema } from '../src/modules/users/admin-users.schema.js';
import { verifyPassword } from '../src/shared/password.js';

const now = new Date('2026-10-30T08:00:00Z');
function fixture() {
  const users = new Map();
  let roles = [];
  const audit = [];
  const revoked = [];
  const resets = [];
  function row(values) {
    const item = { created_at: now, updated_at: now, status: 'ACTIVE', ...values,
      get: () => now, update: async function (changes) { Object.assign(this, changes); return this; } };
    users.set(item.id, item);
    return item;
  }
  const admin = row({ id: randomUUID(), display_name: 'Admin', email: 'admin@example.test' });
  roles.push({ user_id: admin.id, role_code: 'ADMIN' });
  const database = {
    transaction: work => work({ LOCK: { UPDATE: 'UPDATE' } }),
    models: {
      Users: { findByPk: async id => users.get(id), create: async values => row(values),
        findAndCountAll: async () => ({ rows: [...users.values()].filter(user => user.status !== 'ANONYMIZED'), count: [...users.values()].filter(user => user.status !== 'ANONYMIZED').length }) },
      Roles: { findByPk: async () => ({ code: 'ADMIN' }) },
      UserRoles: { findAll: async ({ where }) => {
          const ids = Object.getOwnPropertySymbols(where.user_id).flatMap(key => where.user_id[key]);
          return roles.filter(role => ids.includes(role.user_id));
        },
        destroy: async ({ where }) => { roles = roles.filter(role => role.user_id !== where.user_id); },
        bulkCreate: async values => { roles.push(...values); } },
      AuthSessions: { update: async (values, options) => revoked.push({ values, options }) },
      PasswordResetTokens: { update: async (values, options) => resets.push({ values, options }) },
      AuditLogs: { create: async values => audit.push(values) },
    },
  };
  return { service: createAdminUsersService(database, { clock: () => now }), actor: { user: admin, roles: ['ADMIN'] }, users, audit, revoked, resets };
}
const input = { email: 'visitor@example.test', displayName: 'Du khách', phone: null, password: 'Strong password 123', status: 'ACTIVE', roles: ['TOURIST'] };

test('admin users: validate roles, password, email and immutable server fields', () => {
  assert.equal(adminUserCreateSchema.parse({ ...input, email: ' Visitor@Example.TEST ' }).email, input.email);
  for (const patch of [{ roles: [] }, { roles: ['OWNER'] }, { password: 'short' }, { status: 'ANONYMIZED' }, { id: randomUUID() }]) {
    assert.equal(adminUserCreateSchema.safeParse({ ...input, ...patch }).success, false);
  }
  const { password: _password, ...update } = input;
  assert.equal(adminUserUpdateSchema.safeParse(update).success, true);
});

test('admin users: CRUD hashes credentials, revokes access, audits and anonymizes without leaking secrets', async () => {
  const f = fixture();
  const created = await f.service.create(f.actor, input, 'request-1');
  const id = created.data.id;
  assert.equal(await verifyPassword(input.password, f.users.get(id).password_hash), true);
  assert.equal(JSON.stringify(created).includes('password'), false);
  assert.equal((await f.service.get(f.actor, id)).data.displayName, input.displayName);
  const updated = await f.service.update(f.actor, id, { ...input, password: undefined, roles: ['PARTNER'], status: 'LOCKED', displayName: 'Đối tác' }, 'request-2');
  assert.deepEqual(updated.data.roles, ['PARTNER']);
  assert.equal(updated.data.status, 'LOCKED');
  assert.equal(f.revoked.length, 1);
  assert.equal(f.resets.length, 1);
  await f.service.delete(f.actor, id, 'request-3');
  assert.equal(f.users.get(id).status, 'ANONYMIZED');
  assert.equal(f.users.get(id).email, null);
  assert.equal(f.users.get(id).password_hash, null);
  assert.equal((await f.service.list(f.actor, { page: 1, pageSize: 20 })).data.some(user => user.id === id), false);
  await assert.rejects(f.service.get(f.actor, id), error => error.status === 404);
  assert.deepEqual(f.audit.map(item => item.action), ['ADMIN_USER_CREATE', 'ADMIN_USER_UPDATE', 'ADMIN_USER_DELETE']);
  assert.equal(JSON.stringify(f.audit).includes(input.email), false);
});

test('admin users: deny non-admin, self deletion, self lock and self demotion', async () => {
  const f = fixture();
  await assert.rejects(f.service.list({ user: f.actor.user, roles: ['TOURIST'] }, {}), error => error.status === 403);
  await assert.rejects(f.service.delete(f.actor, f.actor.user.id), error => error.code === 'SELF_DELETE');
  for (const changes of [{ status: 'LOCKED', roles: ['ADMIN'] }, { status: 'ACTIVE', roles: ['TOURIST'] }]) {
    await assert.rejects(f.service.update(f.actor, f.actor.user.id, { ...input, ...changes }), error => error.code === 'SELF_ADMIN_CHANGE');
  }
  assert.equal(f.audit.length, 0);
  assert.equal(f.revoked.length, 0);
});
