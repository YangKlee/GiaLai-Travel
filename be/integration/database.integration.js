import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import mysql from 'mysql2/promise';
import { fn } from 'sequelize';
import { createDatabase } from '../src/db/database.js';
import { once } from 'node:events';
import { isolatedDatabase, localTestConfig } from './database-helper.js';
import { migrate, migrationStatus, currentSchema } from '../src/db/migrations.js';
import { serializeUtc } from '../src/shared/time.js';
import { createCatalogRepository } from '../src/modules/catalog/catalog.repository.js';
import { createApp } from '../src/app.js';
import { bootstrapAdmin } from '../src/modules/auth/bootstrap.js';
import { verifyPassword } from '../src/shared/password.js';

test('MariaDB: fresh baseline, repeat-safe migration, ledger checksum and concurrent lock', async (t) => {
  const { admin, name } = await isolatedDatabase(t);
  const [[server]] = await admin.query('SELECT VERSION() AS version');
  console.log(`Integration database: ${server.version}`);
  assert.deepEqual((await migrate(admin, 'up')).map((row) => row.version), ['000-current', '001-jwt-auth']);
  await assert.rejects(migrate(admin, 'init'), /INITIALIZATION_REQUIRES_EMPTY_DATABASE/);
  const other = await mysql.createConnection({ ...localTestConfig, database: name });
  try {
    // A migration callback intentionally pauses with its connection lock held.
    const originalQuery = admin.query.bind(admin);
    let release;
    let held;
    const locked = new Promise((resolve) => { held = resolve; });
    const resume = new Promise((resolve) => { release = resolve; });
    admin.query = async (...args) => {
      if (args[0] === "SET time_zone = '+00:00'") { held(); await resume; }
      return originalQuery(...args);
    };
    const running = migrate(admin, 'up');
    await locked;
    await assert.rejects(migrate(other, 'up'), /MIGRATION_ALREADY_RUNNING/);
    release();
    await running;
    admin.query = originalQuery;
    await admin.execute("UPDATE schema_migrations SET checksum = REPEAT('0', 64) WHERE version = '001-jwt-auth'");
    await assert.rejects(migrate(admin, 'up'), /MIGRATION_CHECKSUM_MISMATCH/);
  } finally { await other.end(); }
});

test('MariaDB: legacy GUID migration revokes sessions and matches the new auth structure', async (t) => {
  const { admin } = await isolatedDatabase(t, { initialize: false });
  const legacy = currentSchema
    .replace(/CREATE TABLE auth_refresh_tokens \([\s\S]*?\) ENGINE=InnoDB[^;]+;/, '')
    .replace('CREATE TABLE auth_sessions (', 'CREATE TABLE auth_sessions (\n    token_hash BINARY(32) NOT NULL UNIQUE,');
  await admin.query(legacy);
  const userId = randomUUID(); const sessionId = randomUUID();
  await admin.execute('INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)', [userId, 'legacy@example.test', 'unused-fixture', 'Legacy']);
  await admin.execute('INSERT INTO auth_sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, DATE_ADD(UTC_TIMESTAMP(6), INTERVAL 7 DAY))', [sessionId, userId, Buffer.alloc(32, 1)]);
  await migrate(admin, 'baseline', 'legacy-guid');
  await migrate(admin, 'up');
  const [[session]] = await admin.execute('SELECT revoked_at FROM auth_sessions WHERE id = ?', [sessionId]);
  assert.ok(session.revoked_at);
  const [columns] = await admin.query('SHOW COLUMNS FROM auth_sessions');
  assert.ok(!columns.some((column) => column.Field === 'token_hash'));
  assert.equal((await migrationStatus(admin)).length, 2);
  const [refreshColumns] = await admin.query('SHOW COLUMNS FROM auth_refresh_tokens');
  assert.ok(refreshColumns.some((column) => column.Field === 'used_at'));
  await migrate(admin, 'up');
});

test('MariaDB: imported current baseline is adopted; interrupted DDL never silently replays', async (t) => {
  const { admin } = await isolatedDatabase(t, { initialize: false });
  await admin.query(currentSchema);
  await migrate(admin, 'baseline', 'current');
  await admin.execute("UPDATE schema_migrations SET state = 'FAILED' WHERE version = '001-jwt-auth'");
  await assert.rejects(migrate(admin, 'up'), /MIGRATION_INCOMPLETE/);
});

test('MariaDB: UTC, Unicode/JSON/GUID, large money, rollback, publication gates and API round trip', async (t) => {
  const { database, admin } = await isolatedDatabase(t);
  const userId = randomUUID(); const regionId = randomUUID(); const placeId = randomUUID();
  const contentId = randomUUID(); const revisionId = randomUUID();
  const { Users, Regions, ContentItems, ContentRevisions, ContentTranslations, Places } = database.models;
  await database.transaction(async (transaction) => {
    await Users.create({ id: userId, email: 'integration@example.test', password_hash: 'unused-fixture', display_name: 'Du khách 🌿', preferences: { interests: ['Văn hóa', 'Thiên nhiên'] } }, { transaction });
    await Regions.create({ id: regionId, code: 'TEST_REGION', name: 'Vùng kiểm thử' }, { transaction });
    await ContentItems.create({ id: contentId, kind: 'PLACE', created_by: userId }, { transaction });
    await ContentRevisions.create({ id: revisionId, content_id: contentId, revision_no: 1, status: 'PUBLISHED', source_reference: 'Integration fixture', payload: {}, submitted_by: userId, reviewed_by: userId, reviewed_at: new Date() }, { transaction });
    await ContentTranslations.create({ revision_id: revisionId, language_code: 'vi', title: 'Điểm 🌿 kiểm thử', body: 'Mô tả có dấu' }, { transaction });
    await Places.create({ id: placeId, content_id: contentId, region_id: regionId, category: 'NATURE', latitude: '13.983300', longitude: '108.000000', reference_price_vnd: '9007199254740993' }, { transaction });
  });
  const [[user]] = await admin.execute('SELECT id, display_name, preferences FROM users WHERE id = ?', [userId]);
  assert.equal(user.id, userId); assert.equal(user.display_name, 'Du khách 🌿');
  const preferences = typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences;
  assert.deepEqual(preferences.interests, ['Văn hóa', 'Thiên nhiên']);
  const persisted = await Users.findByPk(userId);
  assert.match(serializeUtc(persisted.created_at), /Z$/);
  await assert.rejects(database.transaction(async (transaction) => {
    await Users.update({ display_name: 'Should roll back' }, { where: { id: userId }, transaction });
    throw new Error('injected failure');
  }), /injected failure/);
  assert.equal((await Users.findByPk(userId)).display_name, 'Du khách 🌿');
  const repository = createCatalogRepository(database);
  assert.equal(await repository.findById(placeId), null);
  await ContentItems.update({ visibility: 'PUBLIC', published_revision_id: revisionId }, { where: { id: contentId } });
  const detail = await repository.findById(placeId);
  assert.equal(detail.referencePriceVnd, '9007199254740993');
  assert.deepEqual(detail.openingHours, []);
  assert.equal(detail.latitude, 13.9833);
  const list = await repository.list({ q: 'Điểm', page: 1, pageSize: 6, sort: 'price-asc', minPrice: '9007199254740992' });
  assert.equal(list.total, 1);
  assert.equal((await repository.list({ q: '%', page: 1, pageSize: 6, sort: 'name' })).total, 0);
  assert.equal((await repository.list({ q: "%' OR 1=1; --_", page: 1, pageSize: 6, sort: 'name' })).total, 0);
  assert.equal((await repository.catalog()).regions[0].id, regionId);
  await assert.rejects(Users.update({ email_key: 'forged@example.test' }, { where: { id: userId } }), /GENERATED_COLUMN_READ_ONLY/);
  const server = createApp({ database }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/places/${placeId}`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.dataset, 'live'); assert.equal(body.data.referencePriceVnd, '9007199254740993');
  } finally { await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }); }
  await ContentItems.update({ visibility: 'HIDDEN' }, { where: { id: contentId } });
  assert.equal(await repository.findById(placeId), null);
});

test('MariaDB: timed-out Sequelize query discards its connection and the pool recovers', async (t) => {
  const { config } = await isolatedDatabase(t);
  const database = createDatabase({ ...config, queryTimeout: 200 });
  try {
    await assert.rejects(database.models.Roles.findAll({ attributes: [[fn('SLEEP', 2), 'waited']], limit: 1 }),
      (error) => error.original?.code === 'PROTOCOL_SEQUENCE_TIMEOUT');
    await database.checkReadiness();
    assert.equal(await database.models.Roles.count(), 5);
  } finally { await database.close(); }
});

test('MariaDB: admin bootstrap is explicit, hashed, atomic and never promotes an existing account', async (t) => {
  const { database } = await isolatedDatabase(t);
  const credentials = { email: 'admin@example.test', password: 'Integration-only password!', displayName: 'Quản trị kiểm thử' };
  const result = await bootstrapAdmin(database, credentials);
  const user = await database.models.Users.findByPk(result.id);
  assert.ok(await verifyPassword(credentials.password, user.password_hash));
  assert.equal((await database.models.UserRoles.findOne({ where: { user_id: result.id } })).role_code, 'ADMIN');
  assert.equal(await database.models.AuditLogs.count({ where: { action: 'ADMIN_BOOTSTRAP' } }), 1);
  await assert.rejects(bootstrapAdmin(database, credentials), /ACCOUNT_ALREADY_EXISTS_NO_ROLE_CHANGED/);
  assert.equal(await database.models.Users.count(), 1);
});
