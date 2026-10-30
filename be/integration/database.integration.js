import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateKeyPairSync, randomUUID } from 'node:crypto';
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
import { hashPassword, verifyPassword } from '../src/shared/password.js';
import { createJobRunner } from '../src/jobs/job-runner.js';

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

test('MariaDB: CMS content revision workflow, media validation, audio guides, events and partner services', async (t) => {
  const { database } = await isolatedDatabase(t);
  const regionId = randomUUID();
  await database.models.Regions.create({ id: regionId, code: 'PLEIKU', name: 'Pleiku & phụ cận' });

  const adminCredentials = {
    email: 'cms-admin@example.test',
    password: 'Admin-CMS-password-🌿!',
    displayName: 'Biên tập viên CMS',
  };
  await bootstrapAdmin(database, adminCredentials);

  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const auth = {
    privateKey,
    publicKeys: new Map([['integration', publicKey]]),
    kid: 'integration',
    issuer: 'integration-api',
    audience: 'integration-web',
    origins: ['http://localhost:5173'],
    secure: false,
    accessSeconds: 900,
    sessionMilliseconds: 7 * 86400_000,
    resetMilliseconds: 15 * 60_000,
  };

  const server = createApp({ database, auth }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  try {
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'X-CSRF-Protection': '1',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email: adminCredentials.email, password: adminCredentials.password }),
    });
    assert.equal(loginRes.status, 200);
    const {
      data: { accessToken },
    } = await loginRes.json();
    const authHeaders = {
      Origin: 'http://localhost:5173',
      'X-CSRF-Protection': '1',
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    };

    // 1. Media Asset validation: reject path traversal, script payload, and mismatched magic bytes
    const traversalMedia = await fetch(`${baseUrl}/api/v1/admin/media-assets`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        mediaType: 'IMAGE',
        mimeType: 'image/png',
        storageKey: '../etc/passwd.png',
        byteSize: 120,
        sha256Hex: 'a'.repeat(64),
        sourceReference: 'https://gialai.gov.vn/media',
        licenseNote: 'CC-BY-4.0',
      }),
    });
    assert.equal(traversalMedia.status, 422);

    const scriptMedia = await fetch(`${baseUrl}/api/v1/admin/media-assets`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        mediaType: 'IMAGE',
        mimeType: 'image/png',
        storageKey: 'uploads/bad.png',
        contentBase64: Buffer.from('<script>alert(1)</script>').toString('base64'),
        sourceReference: 'https://gialai.gov.vn/media',
        licenseNote: 'CC-BY-4.0',
      }),
    });
    assert.equal(scriptMedia.status, 422);

    // Valid WAV audio asset
    const validWavBuffer = Buffer.from(
      'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=',
      'base64',
    );
    const audioAssetRes = await fetch(`${baseUrl}/api/v1/admin/media-assets`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        mediaType: 'AUDIO',
        mimeType: 'audio/wav',
        storageKey: 'audio/bien-ho-vi.wav',
        contentBase64: validWavBuffer.toString('base64'),
        sourceReference: 'https://gialai.gov.vn/audio',
        licenseNote: 'Sở Du lịch Gia Lai',
        offlineAllowed: true,
      }),
    });
    assert.equal(audioAssetRes.status, 201);
    const { data: audioAsset } = await audioAssetRes.json();

    // 2. Create PLACE content (initially PENDING -> not visible in public /places)
    const placeCreateRes = await fetch(`${baseUrl}/api/v1/admin/contents`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        kind: 'PLACE',
        title: 'Biển Hồ T’Nưng V1',
        body: 'Đôi mắt Pleiku giữa cao nguyên bazan.',
        sourceReference: 'https://gialai.gov.vn/bien-ho',
        submitImmediately: true,
        payload: {
          regionId,
          category: 'NATURE',
          latitude: 14.0462,
          longitude: 108.0002,
          referencePriceVnd: '20000',
          typicalDurationMinutes: 90,
          openingHours: [{ weekday: 1, opensAt: '07:00:00', closesAt: '17:30:00' }],
        },
      }),
    });
    assert.equal(placeCreateRes.status, 201);
    const { data: placeContentV1 } = await placeCreateRes.json();
    assert.equal(placeContentV1.visibility, 'DRAFT');

    const beforeApprovePlaces = await (await fetch(`${baseUrl}/api/v1/places`)).json();
    assert.equal(beforeApprovePlaces.data.length, 0);

    // Approve PLACE revision #1 -> atomically updates published_revision_id and projection
    const approvePlaceRes = await fetch(
      `${baseUrl}/api/v1/admin/contents/${placeContentV1.id}/revisions/${placeContentV1.revisions[0].id}/review`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ decision: 'APPROVE' }),
      },
    );
    assert.equal(approvePlaceRes.status, 200);
    const { data: approvedPlaceContent } = await approvePlaceRes.json();
    assert.equal(approvedPlaceContent.visibility, 'PUBLIC');
    const placeId = approvedPlaceContent.projectionId;
    assert.ok(placeId);

    // 3. Create Revision #2 (PENDING) and verify public endpoint still serves Revision #1
    const rev2Res = await fetch(`${baseUrl}/api/v1/admin/contents/${placeContentV1.id}/revisions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Biển Hồ T’Nưng V2 (Chưa duyệt)',
        body: 'Bản nháp đang chờ duyệt không được ghi đè bản công khai.',
        sourceReference: 'https://gialai.gov.vn/bien-ho-v2',
        submitImmediately: true,
        payload: {
          regionId,
          category: 'NATURE',
          latitude: 14.0462,
          longitude: 108.0002,
          referencePriceVnd: '50000',
          typicalDurationMinutes: 120,
        },
      }),
    });
    assert.equal(rev2Res.status, 201);
    const { data: placeWithRev2 } = await rev2Res.json();
    const rev2 = placeWithRev2.revisions.find((r) => r.revisionNo === 2);

    const publicPlaceDuringRev2 = await (await fetch(`${baseUrl}/api/v1/places/${placeId}`)).json();
    assert.equal(publicPlaceDuringRev2.data.title, 'Biển Hồ T’Nưng V1');

    // Reject Revision #2 without reason -> 422; with reason -> 200 REJECTED while V1 stays live
    const rejectMissingReason = await fetch(
      `${baseUrl}/api/v1/admin/contents/${placeContentV1.id}/revisions/${rev2.id}/review`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ decision: 'REJECT' }),
      },
    );
    assert.equal(rejectMissingReason.status, 422);

    const rejectRev2Res = await fetch(
      `${baseUrl}/api/v1/admin/contents/${placeContentV1.id}/revisions/${rev2.id}/review`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          decision: 'REJECT',
          rejectionReason: 'Chưa có văn bản xác nhận tăng giá vé tham khảo.',
        }),
      },
    );
    assert.equal(rejectRev2Res.status, 200);

    // 4. Create & Approve AUDIO, EVENT, PARTNER, SERVICE (with slots)
    const audioCreate = await (
      await fetch(`${baseUrl}/api/v1/admin/contents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          kind: 'AUDIO',
          title: 'Thuyết minh Biển Hồ tiếng Việt',
          body: 'Giới thiệu lịch sử miệng núi lửa Biển Hồ.',
          transcript: 'Biển Hồ Pleiku nguyên là miệng núi lửa đã ngừng hoạt động hàng triệu năm.',
          audioAssetId: audioAsset.id,
          sourceReference: 'https://gialai.gov.vn/audio-bien-ho',
          submitImmediately: true,
          payload: { placeId, premiumOnly: false },
        }),
      })
    ).json();
    await fetch(
      `${baseUrl}/api/v1/admin/contents/${audioCreate.data.id}/revisions/${audioCreate.data.revisions[0].id}/review`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ decision: 'APPROVE' }),
      },
    );

    const eventCreate = await (
      await fetch(`${baseUrl}/api/v1/admin/contents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          kind: 'EVENT',
          title: 'Lễ hội Hoa Dã Quỳ - Núi lửa Chư Đăng Ya',
          body: 'Tuần lễ văn hóa du lịch và trình diễn cồng chiêng.',
          sourceReference: 'https://gialai.gov.vn/le-hoi-da-quy',
          submitImmediately: true,
          payload: {
            placeId,
            startsAt: '2026-11-10T01:00:00.000Z',
            endsAt: '2026-11-12T10:00:00.000Z',
            eventStatus: 'SCHEDULED',
          },
        }),
      })
    ).json();
    await fetch(
      `${baseUrl}/api/v1/admin/contents/${eventCreate.data.id}/revisions/${eventCreate.data.revisions[0].id}/review`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ decision: 'APPROVE' }),
      },
    );

    const partnerCreate = await (
      await fetch(`${baseUrl}/api/v1/admin/contents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          kind: 'PARTNER',
          title: 'HTX Du lịch Cộng đồng Pleiku',
          body: 'Đơn vị lữ hành bản địa.',
          sourceReference: 'https://gialai.gov.vn/partner-pleiku',
          submitImmediately: true,
          payload: { status: 'ACTIVE', contactEmail: 'htx@pleiku.test' },
        }),
      })
    ).json();
    const approvedPartner = await (
      await fetch(
        `${baseUrl}/api/v1/admin/contents/${partnerCreate.data.id}/revisions/${partnerCreate.data.revisions[0].id}/review`,
        {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ decision: 'APPROVE' }),
        },
      )
    ).json();
    const partnerId = approvedPartner.data.projectionId;

    const serviceCreate = await (
      await fetch(`${baseUrl}/api/v1/admin/contents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          kind: 'SERVICE',
          title: 'Trải nghiệm thuyền độc mộc & cà phê Biển Hồ',
          body: 'Ngắm bình minh và thưởng thức cà phê nguyên bản.',
          sourceReference: 'https://gialai.gov.vn/service-bien-ho',
          submitImmediately: true,
          payload: {
            partnerId,
            placeId,
            serviceType: 'EXPERIENCE',
            priceUnit: 'khách',
            unitPriceVnd: '250000',
            active: true,
            slots: [
              {
                startsAt: '2026-11-15T00:00:00.000Z',
                endsAt: '2026-11-15T03:00:00.000Z',
                capacity: 10,
              },
            ],
          },
        }),
      })
    ).json();
    const approvedService = await (
      await fetch(
        `${baseUrl}/api/v1/admin/contents/${serviceCreate.data.id}/revisions/${serviceCreate.data.revisions[0].id}/review`,
        {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ decision: 'APPROVE' }),
        },
      )
    ).json();
    const serviceId = approvedService.data.projectionId;

    // 5. Verify enriched Place detail, Audio Guides, Events, and Services endpoints
    const enrichedPlaceRes = await fetch(`${baseUrl}/api/v1/places/${placeId}`);
    assert.equal(enrichedPlaceRes.status, 200);
    const enrichedPlace = (await enrichedPlaceRes.json()).data;
    assert.equal(enrichedPlace.audioGuides.length, 1);
    assert.equal(
      enrichedPlace.audioGuides[0].transcript,
      'Biển Hồ Pleiku nguyên là miệng núi lửa đã ngừng hoạt động hàng triệu năm.',
    );
    assert.equal(enrichedPlace.events.length, 1);
    assert.equal(enrichedPlace.services.length, 1);
    assert.equal(enrichedPlace.services[0].slots[0].availableQuantity, 10);

    const eventsListRes = await fetch(`${baseUrl}/api/v1/events`);
    assert.equal(eventsListRes.status, 200);
    assert.equal((await eventsListRes.json()).data.length, 1);

    const serviceDetailRes = await fetch(`${baseUrl}/api/v1/services/${serviceId}`);
    assert.equal(serviceDetailRes.status, 200);
    assert.equal((await serviceDetailRes.json()).data.unitPriceVnd, '250000');

    // 6. Hiding content removes it from public endpoints immediately
    const hideEventRes = await fetch(
      `${baseUrl}/api/v1/admin/contents/${eventCreate.data.id}/visibility`,
      {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ visibility: 'HIDDEN' }),
      },
    );
    assert.equal(hideEventRes.status, 200);
    const eventsAfterHide = await (await fetch(`${baseUrl}/api/v1/events`)).json();
    assert.equal(eventsAfterHide.data.length, 0);
  } finally {
    await new Promise((resolve) => {
      server.close(resolve);
      server.closeAllConnections();
    });
  }
});

test('MariaDB: AI itinerary proposal (7 inputs), independent validator, revalidation and saved itineraries CRUD', async (t) => {
  const { database } = await isolatedDatabase(t);
  const regionId = randomUUID();
  await database.models.Regions.create({ id: regionId, code: 'PLEIKU', name: 'Pleiku & phụ cận' });

  // 1. Create a published POI and a closure
  const adminCredentials = {
    email: 'tourist-planner@example.test',
    password: 'Planner-test-password-🌿!',
    displayName: 'Du khách Lập lịch',
  };
  await bootstrapAdmin(database, adminCredentials);

  const { createAiAdapter, createRoutingAdapter } = await import('../src/adapters/index.js');
  const aiAdapter = createAiAdapter({ mode: 'prompt-engine' });
  const routingAdapter = createRoutingAdapter({ mode: 'local' });

  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const auth = {
    privateKey,
    publicKeys: new Map([['integration', publicKey]]),
    kid: 'integration',
    issuer: 'integration-api',
    audience: 'integration-web',
    origins: ['http://localhost:5173'],
    secure: false,
    accessSeconds: 900,
    sessionMilliseconds: 7 * 86400_000,
    resetMilliseconds: 15 * 60_000,
  };

  const server = createApp({ database, auth, aiAdapter, routingAdapter }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'X-CSRF-Protection': '1',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email: adminCredentials.email, password: adminCredentials.password }),
    });
    const {
      data: { accessToken },
    } = await loginRes.json();
    const authHeaders = {
      Origin: 'http://localhost:5173',
      'X-CSRF-Protection': '1',
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    };

    // Create 2 published places
    const p1Res = await fetch(`${baseUrl}/api/v1/admin/contents`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        kind: 'PLACE',
        title: 'Biển Hồ Pleiku',
        body: 'Thắng cảnh Biển Hồ T’Nưng.',
        sourceReference: 'https://gialai.gov.vn/bien-ho',
        submitImmediately: true,
        payload: {
          regionId,
          category: 'NATURE',
          latitude: 14.0462,
          longitude: 108.0002,
          referencePriceVnd: '20000',
          typicalDurationMinutes: 90,
          openingHours: [{ weekday: 1, opensAt: '07:00:00', closesAt: '17:30:00' }],
        },
      }),
    });
    const p1 = (await p1Res.json()).data;
    await fetch(`${baseUrl}/api/v1/admin/contents/${p1.id}/revisions/${p1.revisions[0].id}/review`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ decision: 'APPROVE' }),
    });

    const p2Res = await fetch(`${baseUrl}/api/v1/admin/contents`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        kind: 'PLACE',
        title: 'Chùa Minh Thành',
        body: 'Kiến trúc tâm linh độc đáo Pleiku.',
        sourceReference: 'https://gialai.gov.vn/chua-minh-thanh',
        submitImmediately: true,
        payload: {
          regionId,
          category: 'CULTURE',
          latitude: 13.9667,
          longitude: 107.9833,
          referencePriceVnd: '0',
          typicalDurationMinutes: 60,
          openingHours: [{ weekday: 1, opensAt: '07:30:00', closesAt: '18:00:00' }],
        },
      }),
    });
    const p2 = (await p2Res.json()).data;
    await fetch(`${baseUrl}/api/v1/admin/contents/${p2.id}/revisions/${p2.revisions[0].id}/review`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ decision: 'APPROVE' }),
    });

    // 2. Generate AI proposal (POST /api/v1/itinerary-proposals) with 7 inputs
    const proposalRes = await fetch(`${baseUrl}/api/v1/itinerary-proposals`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        startDate: '2026-11-02',
        daysCount: 2,
        partySize: 2,
        totalBudgetVnd: '2000000',
        origin: {
          latitude: 13.9833,
          longitude: 108.0,
          label: 'Quảng trường Đại Đoàn Kết, TP. Pleiku',
        },
        transportMode: 'MOTORBIKE',
        preferences: {
          categories: ['NATURE', 'CULTURE'],
          pace: 'BALANCED',
          dietaryNotes: 'Ưu tiên cà phê Pleiku',
        },
      }),
    });
    assert.equal(proposalRes.status, 200);
    const { data: proposal } = await proposalRes.json();
    assert.equal(proposal.daysCount, 2);
    assert.equal(proposal.days.length, 2);
    assert.ok(proposal.isValid);
    assert.ok(proposal.aiRequestId);
    assert.ok(Number(proposal.estimatedTotalVnd) > 0);
    assert.ok(Number(proposal.estimatedTotalVnd) <= 2000000);

    // Verify AI request was logged in ai_requests and ai_request_sources
    const aiReqCount = await database.models.AiRequests.count({
      where: { id: proposal.aiRequestId },
    });
    assert.equal(aiReqCount, 1);
    const aiSourcesCount = await database.models.AiRequestSources.count({
      where: { ai_request_id: proposal.aiRequestId },
    });
    assert.ok(aiSourcesCount >= 1);

    // 3. Revalidate proposal with modified times (POST /api/v1/itinerary-proposals/revalidate)
    const revalidateRes = await fetch(`${baseUrl}/api/v1/itinerary-proposals/revalidate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        startDate: proposal.startDate,
        daysCount: proposal.daysCount,
        partySize: proposal.partySize,
        totalBudgetVnd: '10000', // Intentionally very low budget to trigger warning
        origin: proposal.origin,
        transportMode: proposal.transportMode,
        preferences: proposal.preferences,
        days: proposal.days,
      }),
    });
    assert.equal(revalidateRes.status, 200);
    const { data: revalidated } = await revalidateRes.json();
    assert.ok(revalidated.warnings.some((w) => w.includes('vượt ngân sách')));

    // 4. Save to My Itineraries (POST /api/v1/me/itineraries)
    const saveRes = await fetch(`${baseUrl}/api/v1/me/itineraries`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Hành trình Pleiku 2N1Đ',
        startDate: proposal.startDate,
        daysCount: proposal.daysCount,
        partySize: proposal.partySize,
        totalBudgetVnd: proposal.totalBudgetVnd,
        origin: proposal.origin,
        transportMode: proposal.transportMode,
        preferences: proposal.preferences,
        aiRequestId: proposal.aiRequestId,
        days: proposal.days,
      }),
    });
    assert.equal(saveRes.status, 201);
    const { data: savedItinerary } = await saveRes.json();
    assert.equal(savedItinerary.name, 'Hành trình Pleiku 2N1Đ');
    assert.equal(savedItinerary.lockVersion, 0);
    assert.equal(savedItinerary.revision.days.length, 2);

    // 5. List and Get detail
    const listRes = await fetch(`${baseUrl}/api/v1/me/itineraries`, { headers: authHeaders });
    assert.equal(listRes.status, 200);
    const { data: userItineraries } = await listRes.json();
    assert.equal(userItineraries.length, 1);
    assert.equal(userItineraries[0].id, savedItinerary.id);

    const getDetailRes = await fetch(`${baseUrl}/api/v1/me/itineraries/${savedItinerary.id}`, {
      headers: authHeaders,
    });
    assert.equal(getDetailRes.status, 200);
    const { data: detail } = await getDetailRes.json();
    assert.equal(detail.revision.days[0].stops.length, proposal.days[0].stops.length);

    // 6. Optimistic concurrency conflict check (PUT /api/v1/me/itineraries/:id/revisions)
    // Stale lock_version returns 409
    const conflictRes = await fetch(
      `${baseUrl}/api/v1/me/itineraries/${savedItinerary.id}/revisions`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          baseLockVersion: 999, // Stale!
          name: 'Tên sửa đổi xung đột',
          startDate: proposal.startDate,
          daysCount: proposal.daysCount,
          partySize: proposal.partySize,
          totalBudgetVnd: proposal.totalBudgetVnd,
          origin: proposal.origin,
          transportMode: proposal.transportMode,
          days: proposal.days,
        }),
      },
    );
    assert.equal(conflictRes.status, 409);

    // Correct lock_version: 0 succeeds and increments lock_version to 1
    const updateRes = await fetch(
      `${baseUrl}/api/v1/me/itineraries/${savedItinerary.id}/revisions`,
      {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          baseLockVersion: 0,
          name: 'Hành trình Pleiku 2N1Đ (Đã cập nhật #2)',
          startDate: proposal.startDate,
          daysCount: proposal.daysCount,
          partySize: proposal.partySize,
          totalBudgetVnd: proposal.totalBudgetVnd,
          origin: proposal.origin,
          transportMode: proposal.transportMode,
          days: proposal.days,
        }),
      },
    );
    assert.equal(updateRes.status, 200);
    const { data: updatedItinerary } = await updateRes.json();
    assert.equal(updatedItinerary.lockVersion, 1);
    assert.equal(updatedItinerary.name, 'Hành trình Pleiku 2N1Đ (Đã cập nhật #2)');

    // 7. Rename (PATCH /api/v1/me/itineraries/:id)
    const renameRes = await fetch(`${baseUrl}/api/v1/me/itineraries/${savedItinerary.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ name: 'Chuyến đi Pleiku mùa thu' }),
    });
    assert.equal(renameRes.status, 200);

    // 8. Copy (POST /api/v1/me/itineraries/:id/copy)
    const copyRes = await fetch(`${baseUrl}/api/v1/me/itineraries/${savedItinerary.id}/copy`, {
      method: 'POST',
      headers: authHeaders,
    });
    assert.equal(copyRes.status, 201);
    const { data: copiedItinerary } = await copyRes.json();
    assert.ok(copiedItinerary.name.startsWith('[Bản sao]'));
    assert.notEqual(copiedItinerary.id, savedItinerary.id);

    // 9. Soft-delete (DELETE /api/v1/me/itineraries/:id)
    const delRes = await fetch(`${baseUrl}/api/v1/me/itineraries/${savedItinerary.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert.equal(delRes.status, 200);

    const getDeletedRes = await fetch(`${baseUrl}/api/v1/me/itineraries/${savedItinerary.id}`, {
      headers: authHeaders,
    });
    assert.equal(getDeletedRes.status, 404);
  } finally {
    await new Promise((resolve) => {
      server.close(resolve);
      server.closeAllConnections();
    });
  }
});

test('MariaDB: Booking lifecycle — quote, lead-time check, admin review/capacity hold, mock payment attempt, cancel with 100% refund, complete with mock commission, and expire overdue bookings job', async (t) => {
  const { database } = await isolatedDatabase(t);
  const regionId = randomUUID();
  await database.models.Regions.create({ id: regionId, code: 'PLEIKU', name: 'Pleiku & phụ cận' });

  // 1. Create Admin & Tourist users
  const adminCredentials = {
    email: 'booking-admin@example.test',
    password: 'Booking-admin-password-🌿!',
    displayName: 'Quản trị viên Đặt chỗ',
  };
  await bootstrapAdmin(database, adminCredentials);

  const touristPassword = 'Tourist-test-password-🌿!';
  const touristHash = await hashPassword(touristPassword);
  const touristUser = await database.models.Users.create({
    id: randomUUID(),
    email: 'tourist-booker@example.test',
    password_hash: touristHash,
    display_name: 'Du khách Đặt tour',
    status: 'ACTIVE',
  });
  await database.models.UserRoles.create({
    user_id: touristUser.id,
    role_code: 'TOURIST',
  });

  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const auth = {
    privateKey,
    publicKeys: new Map([['integration', publicKey]]),
    kid: 'integration',
    issuer: 'integration-api',
    audience: 'integration-web',
    origins: ['http://localhost:5173'],
    secure: false,
    accessSeconds: 900,
    sessionMilliseconds: 7 * 86400_000,
    resetMilliseconds: 15 * 60_000,
  };

  const server = createApp({ database, auth }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    // 2. Login Admin and Tourist
    const adminLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'X-CSRF-Protection': '1',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email: adminCredentials.email, password: adminCredentials.password }),
    });
    const { data: { accessToken: adminToken } } = await adminLoginRes.json();
    const adminHeaders = {
      Origin: 'http://localhost:5173',
      'X-CSRF-Protection': '1',
      Authorization: `Bearer ${adminToken}`,
      'content-type': 'application/json',
    };

    const touristLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'X-CSRF-Protection': '1',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email: touristUser.email, password: touristPassword }),
    });
    const { data: { accessToken: touristToken } } = await touristLoginRes.json();
    const touristHeaders = {
      Origin: 'http://localhost:5173',
      'X-CSRF-Protection': '1',
      Authorization: `Bearer ${touristToken}`,
      'content-type': 'application/json',
    };

    // 3. Create published Partner and Service with slots
    const partnerCreate = await (
      await fetch(`${baseUrl}/api/v1/admin/contents`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          kind: 'PARTNER',
          title: 'HTX Du lịch Cộng đồng Pleiku',
          body: 'Đơn vị lữ hành bản địa Gia Lai.',
          sourceReference: 'https://gialai.gov.vn/partner-booking-test',
          submitImmediately: true,
        }),
      })
    ).json();
    const approvedPartner = await (
      await fetch(
        `${baseUrl}/api/v1/admin/contents/${partnerCreate.data.id}/revisions/${partnerCreate.data.revisions[0].id}/review`,
        {
          method: 'POST',
          headers: adminHeaders,
          body: JSON.stringify({ decision: 'APPROVE' }),
        },
      )
    ).json();
    const partnerId = approvedPartner.data.projectionId;

    const futureStart = new Date(Date.now() + 48 * 3600_000); // +48 hours
    const futureEnd = new Date(Date.now() + 52 * 3600_000);   // +52 hours
    const shortStart = new Date(Date.now() + 10 * 3600_000);  // +10 hours (< 24h30m)
    const shortEnd = new Date(Date.now() + 12 * 3600_000);

    const serviceCreate = await (
      await fetch(`${baseUrl}/api/v1/admin/contents`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          kind: 'SERVICE',
          title: 'Tour Trekking Chư Đang Ya Mùa Dã Quỳ',
          body: 'Trải nghiệm leo núi lửa Chư Đang Ya ngắm hoa dã quỳ nở rộ.',
          sourceReference: 'https://gialai.gov.vn/service-chu-dang-ya',
          submitImmediately: true,
          payload: {
            partnerId,
            serviceType: 'EXPERIENCE',
            priceUnit: 'khách',
            unitPriceVnd: '350000',
            active: true,
            slots: [
              {
                startsAt: futureStart.toISOString(),
                endsAt: futureEnd.toISOString(),
                capacity: 10,
              },
              {
                startsAt: shortStart.toISOString(),
                endsAt: shortEnd.toISOString(),
                capacity: 10,
              },
            ],
          },
        }),
      })
    ).json();

    const approvedService = await (
      await fetch(
        `${baseUrl}/api/v1/admin/contents/${serviceCreate.data.id}/revisions/${serviceCreate.data.revisions[0].id}/review`,
        {
          method: 'POST',
          headers: adminHeaders,
          body: JSON.stringify({ decision: 'APPROVE' }),
        },
      )
    ).json();
    const serviceId = approvedService.data.projectionId;

    const serviceDetailRes = await fetch(`${baseUrl}/api/v1/services/${serviceId}`);
    assert.equal(serviceDetailRes.status, 200);
    const serviceDetail = (await serviceDetailRes.json()).data;
    const validSlot = serviceDetail.slots.find((s) => new Date(s.startsAt) > new Date(Date.now() + 25 * 3600_000));
    const shortSlot = serviceDetail.slots.find((s) => new Date(s.startsAt) < new Date(Date.now() + 20 * 3600_000));
    assert.ok(validSlot);
    assert.ok(shortSlot);

    // 4. Test POST /api/v1/booking-quotes
    const quoteRes = await fetch(`${baseUrl}/api/v1/booking-quotes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        serviceId,
        slotId: validSlot.id,
        quantity: 2,
      }),
    });
    assert.equal(quoteRes.status, 200);
    const { data: quote } = await quoteRes.json();
    assert.equal(quote.unitPriceVnd, '350000');
    assert.equal(quote.totalVnd, '700000');
    assert.equal(quote.availableQuantity, 10);
    assert.equal(quote.isAvailable, true);

    // 5. Test Rule BE-20: Insufficient lead time (< 24h30m) -> 422
    const shortBookingRes = await fetch(`${baseUrl}/api/v1/bookings`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({
        serviceId,
        slotId: shortSlot.id,
        quantity: 2,
        contactName: 'Du Khách Ngắn Hạn',
        contactEmail: 'tourist@example.test',
        idempotencyKey: 'idem-short-lead-1',
      }),
    });
    assert.equal(shortBookingRes.status, 422);
    const shortErr = await shortBookingRes.json();
    assert.equal(shortErr.error.code, 'INSUFFICIENT_LEAD_TIME');

    // 6. Test Capacity exceeded -> 409
    const overCapacityRes = await fetch(`${baseUrl}/api/v1/bookings`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({
        serviceId,
        slotId: validSlot.id,
        quantity: 15, // Slot capacity is 10
        contactName: 'Du Khách Quá Tải',
        contactEmail: 'tourist@example.test',
        idempotencyKey: 'idem-over-cap-1',
      }),
    });
    assert.equal(overCapacityRes.status, 409);
    const capErr = await overCapacityRes.json();
    assert.equal(capErr.error.code, 'SLOT_CAPACITY_EXCEEDED');

    // 7. Test Valid Booking creation -> status CHO_DUYET
    const createBookingRes = await fetch(`${baseUrl}/api/v1/bookings`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({
        serviceId,
        slotId: validSlot.id,
        quantity: 2,
        contactName: 'Du Khách Mẫu',
        contactEmail: 'tourist-booker@example.test',
        contactPhone: '0905123456',
        idempotencyKey: 'idem-booking-valid-1',
      }),
    });
    assert.equal(createBookingRes.status, 201);
    const { data: booking1 } = await createBookingRes.json();
    assert.equal(booking1.status, 'CHO_DUYET');
    assert.equal(booking1.quantity, 2);
    assert.equal(booking1.totalVnd, '700000');
    assert.ok(booking1.reviewDeadline);

    // Verify slot capacity is NOT yet held during CHO_DUYET
    const slotCheck1 = await database.models.ServiceSlots.findByPk(validSlot.id);
    assert.equal(slotCheck1.held_quantity, 0);
    assert.equal(slotCheck1.sold_quantity, 0);

    // 8. Admin reviews and approves booking -> CHO_THANH_TOAN & capacity held
    const reviewRes = await fetch(`${baseUrl}/api/v1/admin/bookings/${booking1.id}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ decision: 'APPROVE' }),
    });
    assert.equal(reviewRes.status, 200);
    const { data: approvedBooking1 } = await reviewRes.json();
    assert.equal(approvedBooking1.status, 'CHO_THANH_TOAN');
    assert.ok(approvedBooking1.paymentDeadline);

    // Verify slot capacity held_quantity = 2
    const slotCheck2 = await database.models.ServiceSlots.findByPk(validSlot.id);
    assert.equal(slotCheck2.held_quantity, 2);
    assert.equal(slotCheck2.sold_quantity, 0);

    // 9. Tourist mock payment attempt FAILED
    const payFailRes = await fetch(`${baseUrl}/api/v1/bookings/${booking1.id}/payment-attempts`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({
        outcome: 'FAILED',
        idempotencyKey: 'pay-fail-1',
      }),
    });
    assert.equal(payFailRes.status, 200);
    const { data: bookingAfterFail } = await payFailRes.json();
    assert.equal(bookingAfterFail.status, 'CHO_THANH_TOAN'); // Still waiting for valid payment

    // 10. Tourist mock payment attempt SUCCEEDED -> DA_XAC_NHAN
    const paySuccessRes = await fetch(`${baseUrl}/api/v1/bookings/${booking1.id}/payment-attempts`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({
        outcome: 'SUCCEEDED',
        idempotencyKey: 'pay-success-1',
      }),
    });
    assert.equal(paySuccessRes.status, 200);
    const { data: confirmedBooking1 } = await paySuccessRes.json();
    assert.equal(confirmedBooking1.status, 'DA_XAC_NHAN');

    // Verify slot: held_quantity -> 0, sold_quantity -> 2
    const slotCheck3 = await database.models.ServiceSlots.findByPk(validSlot.id);
    assert.equal(slotCheck3.held_quantity, 0);
    assert.equal(slotCheck3.sold_quantity, 2);

    // 11. Tourist cancels booking prior to starts_at -> 100% mock refund & inventory returned
    const cancelRes = await fetch(`${baseUrl}/api/v1/bookings/${booking1.id}/cancel`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({ reason: 'Thay đổi kế hoạch du lịch' }),
    });
    assert.equal(cancelRes.status, 200);
    const { data: cancelledBooking1 } = await cancelRes.json();
    assert.equal(cancelledBooking1.status, 'DA_HUY');
    assert.ok(cancelledBooking1.cancelledAt);

    // Verify slot inventory released: sold_quantity -> 0
    const slotCheck4 = await database.models.ServiceSlots.findByPk(validSlot.id);
    assert.equal(slotCheck4.held_quantity, 0);
    assert.equal(slotCheck4.sold_quantity, 0);

    // Verify 100% refund record created in DB
    const refunds = await database.models.Refunds.findAll({ where: { booking_id: booking1.id } });
    assert.equal(refunds.length, 1);
    assert.equal(String(refunds[0].amount_vnd), '700000');
    assert.equal(refunds[0].status, 'HOAN_GIA_LAP_THANH_CONG');
    assert.equal(refunds[0].is_mock, true);

    // 12. Create Booking 2 and test Admin completion & mock commission
    const createBooking2Res = await fetch(`${baseUrl}/api/v1/bookings`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({
        serviceId,
        slotId: validSlot.id,
        quantity: 3,
        contactName: 'Du Khách Nhóm 2',
        contactEmail: 'tourist-group@example.test',
        idempotencyKey: 'idem-booking-valid-2',
      }),
    });
    assert.equal(createBooking2Res.status, 201);
    const { data: booking2 } = await createBooking2Res.json();

    // Admin approve & tourist pay
    await fetch(`${baseUrl}/api/v1/admin/bookings/${booking2.id}/review`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ decision: 'APPROVE' }),
    });
    await fetch(`${baseUrl}/api/v1/bookings/${booking2.id}/payment-attempts`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({ outcome: 'SUCCEEDED', idempotencyKey: 'pay-success-2' }),
    });

    // Try complete before ends_at -> 422 SERVICE_NOT_ENDED
    const prematureComplete = await fetch(`${baseUrl}/api/v1/admin/bookings/${booking2.id}/complete`, {
      method: 'POST',
      headers: adminHeaders,
    });
    assert.equal(prematureComplete.status, 422);

    // Fast-forward booking2 to the past in DB to satisfy ck_booking_complete and ck_booking_time constraints
    const pastCreated = new Date(Date.now() - 48 * 3600_000);
    const pastReview = new Date(Date.now() - 24 * 3600_000);
    const pastStartsAt = new Date(Date.now() - 5 * 3600_000);
    const pastEndsAt = new Date(Date.now() - 3600_000);
    await database.models.Bookings.update(
      {
        created_at: pastCreated,
        review_deadline: pastReview,
        starts_at: pastStartsAt,
        ends_at: pastEndsAt,
      },
      { where: { id: booking2.id } },
    );

    const validComplete = await fetch(`${baseUrl}/api/v1/admin/bookings/${booking2.id}/complete`, {
      method: 'POST',
      headers: adminHeaders,
    });
    assert.equal(validComplete.status, 200);
    const { data: completedBooking2 } = await validComplete.json();
    assert.equal(completedBooking2.status, 'HOAN_THANH');
    assert.ok(completedBooking2.completedAt);

    // Verify commission: 3 * 350,000 = 1,050,000; 10% commission = 105,000 VND
    const commissions = await database.models.Commissions.findAll({ where: { booking_id: booking2.id } });
    assert.equal(commissions.length, 1);
    assert.equal(String(commissions[0].base_amount_vnd), '1050000');
    assert.equal(String(commissions[0].amount_vnd), '105000');
    assert.equal(commissions[0].is_mock, true);

    // 13. Test Background Job 'expire-bookings'
    // Create an overdue review booking
    const pastReviewDeadline = new Date(Date.now() - 3600_000);
    const overdueBooking = await database.models.Bookings.create({
      id: randomUUID(),
      customer_id: touristUser.id,
      service_id: serviceId,
      slot_id: validSlot.id,
      status: 'CHO_DUYET',
      quantity: 1,
      unit_price_vnd: '350000',
      total_vnd: '350000',
      commission_percent: 10.0,
      policy_snapshot: {},
      service_snapshot: { title: 'Test' },
      contact_name: 'Overdue Test',
      contact_email: 'overdue@test.local',
      starts_at: futureStart,
      ends_at: futureEnd,
      review_deadline: pastReviewDeadline,
      idempotency_key: 'overdue-idem-1',
      lock_version: 0,
      created_at: new Date(Date.now() - 86400_000),
      updated_at: new Date(Date.now() - 86400_000),
    });

    const jobRunner = createJobRunner({ database });
    const jobResult = await jobRunner.run('expire-bookings');
    assert.equal(jobResult.status, 'COMPLETED');
    assert.ok(jobResult.summary.expiredCount >= 1);

    const reloadedOverdue = await database.models.Bookings.findByPk(overdueBooking.id);
    assert.equal(reloadedOverdue.status, 'HET_HAN');

    // 14. Test BE-26: Notifications list, unread count, mark read, mark all read
    const notifsRes = await fetch(`${baseUrl}/api/v1/me/notifications`, { headers: touristHeaders });
    assert.equal(notifsRes.status, 200);
    const { data: userNotifs, meta: notifsMeta } = await notifsRes.json();
    assert.ok(userNotifs.length >= 1);
    assert.ok(notifsMeta.unreadCount >= 1);

    const firstNotifId = userNotifs[0].id;
    const markReadRes = await fetch(`${baseUrl}/api/v1/me/notifications/${firstNotifId}/read`, {
      method: 'PATCH',
      headers: touristHeaders,
    });
    assert.equal(markReadRes.status, 200);
    const { data: readNotif } = await markReadRes.json();
    assert.ok(readNotif.readAt);

    const markAllReadRes = await fetch(`${baseUrl}/api/v1/me/notifications/read-all`, {
      method: 'POST',
      headers: touristHeaders,
    });
    assert.equal(markAllReadRes.status, 200);

    const unreadCountRes = await fetch(`${baseUrl}/api/v1/me/notifications/unread-count`, {
      headers: touristHeaders,
    });
    assert.equal(unreadCountRes.status, 200);
    assert.equal((await unreadCountRes.json()).data.unreadCount, 0);

    // 15. Test BE-26: Content Issue Reporting & Admin review
    const issueReportRes = await fetch(`${baseUrl}/api/v1/issues`, {
      method: 'POST',
      headers: touristHeaders,
      body: JSON.stringify({
        contentId: serviceCreate.data.id,
        category: 'OUTDATED_PRICE',
        description: 'Giá dịch vụ tour leo núi đã thay đổi so với thực tế.',
      }),
    });
    assert.equal(issueReportRes.status, 201);
    const { data: createdIssue } = await issueReportRes.json();
    assert.equal(createdIssue.status, 'NEW');
    assert.equal(createdIssue.category, 'OUTDATED_PRICE');

    // Admin reviews issue
    const adminReviewIssueRes = await fetch(`${baseUrl}/api/v1/admin/issues/${createdIssue.id}`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({
        status: 'ACCEPTED',
        response: 'Cảm ơn phản ánh. Ban quản trị đã liên hệ đối tác cập nhật giá.',
      }),
    });
    assert.equal(adminReviewIssueRes.status, 200);
    const { data: reviewedIssue } = await adminReviewIssueRes.json();
    assert.equal(reviewedIssue.status, 'ACCEPTED');
    assert.ok(reviewedIssue.response);

    // 16. Test BE-26: Admin audit logs querying
    const auditLogsRes = await fetch(`${baseUrl}/api/v1/admin/audit-logs?pageSize=10`, {
      headers: adminHeaders,
    });
    assert.equal(auditLogsRes.status, 200);
    const { data: logs } = await auditLogsRes.json();
    assert.ok(logs.length >= 1);
    assert.ok(logs[0].action);
    assert.ok(logs[0].correlationId);
  } finally {
    await new Promise((resolve) => {
      server.close(resolve);
      server.closeAllConnections();
    });
  }
});
