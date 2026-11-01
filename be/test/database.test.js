import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDatabase, buildDialectOptions } from '../src/db/database.js';
import { calculateTotalVnd, serializeVnd } from '../src/shared/money.js';
import { createId, guidSchema } from '../src/shared/identifiers.js';

const config = { host: 'localhost', port: 3307, user: 'fixture', password: 'fixture',
  database: 'fixture', connectionLimit: 2, connectTimeout: 1000, queryTimeout: 1000, ssl: false };

test('Sequelize uses scaffold models, UTC, exact money and isolated model classes per connection', async () => {
  const first = createDatabase(config); const second = createDatabase(config);
  try {
    assert.equal(first.sequelize.options.timezone, '+00:00');
    assert.equal(first.sequelize.options.logging, false);
    assert.equal(first.sequelize.options.retry.max, 0);
    assert.equal(Object.keys(first.models).length, 60);
    assert.equal(first.models.Users.sequelize, first.sequelize);
    assert.equal(second.models.Users.sequelize, second.sequelize);
    assert.notEqual(first.models.Users, second.models.Users);
    assert.equal(first.models.Places.associations.content.target, first.models.ContentItems);
    const options = buildDialectOptions(config);
    assert.equal(options.bigNumberStrings, true); assert.equal(options.multipleStatements, false);
    assert.equal(buildDialectOptions({ ...config, ssl: true }).ssl.rejectUnauthorized, true);
  } finally { await Promise.all([first.close(), second.close()]); }
});

test('GUIDs and money stay exact above Number safe range', () => {
  const id = createId();
  assert.equal(guidSchema.parse(id), id);
  assert.equal(guidSchema.safeParse(id.toUpperCase()).success, false);
  assert.equal(serializeVnd('18446744073709551615'), '18446744073709551615');
  assert.equal(calculateTotalVnd('9007199254740993', 3), '27021597764222979');
  for (const value of [Number.MAX_SAFE_INTEGER + 1, -1, 1.5, '1e3', null]) assert.throws(() => serializeVnd(value));
});
