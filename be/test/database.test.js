import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDatabase, buildPoolOptions } from '../src/db/database.js';
import { calculateTotalVnd, serializeVnd } from '../src/shared/money.js';
import { createId, guidSchema } from '../src/shared/identifiers.js';

const config = { host: 'localhost', port: 3306, user: 'fixture', password: 'fixture',
  database: 'fixture', connectionLimit: 2, connectTimeout: 1000, queryTimeout: 1000, ssl: false };

function fixture({ executeError, commitError, rollbackError, initializeError } = {}) {
  const events = [];
  let executions = 0;
  const connection = {
    async query(options) {
      events.push(options.sql);
      if (initializeError) throw initializeError;
      return [[], []];
    },
    async execute(options, parameters) {
      events.push(['execute', options.sql, parameters]);
      if (executeError && executions++ === 0) throw executeError;
      return [[{ total: '18446744073709551615' }], []];
    },
    async beginTransaction() { events.push('begin'); },
    async commit() { events.push('commit'); if (commitError) throw commitError; },
    async rollback() { events.push('rollback'); if (rollbackError) throw rollbackError; },
    release() { events.push('release'); },
    destroy() { events.push('destroy'); },
  };
  const pool = { async getConnection() { return connection; }, async end() { events.push('end'); } };
  return { events, database: createDatabase(config, { pool }) };
}

test('pool preserves BIGINT and UTC; query uses bound parameters and releases connection', async () => {
  const options = buildPoolOptions(config);
  assert.equal(options.supportBigNumbers, true);
  assert.equal(options.bigNumberStrings, true);
  assert.equal(options.dateStrings, true);
  assert.equal(options.multipleStatements, false);
  assert.equal(options.timezone, 'Z');
  assert.equal(buildPoolOptions({ ...config, ssl: true }).ssl.rejectUnauthorized, true);
  const { database, events } = fixture();
  const rows = await database.execute('SELECT ? AS total', ['18446744073709551615']);
  assert.equal(rows[0].total, '18446744073709551615');
  assert.deepEqual(events, ["SET time_zone = '+00:00'", ['execute', 'SELECT ? AS total', ['18446744073709551615']], 'release']);
  await database.close();
  assert.equal(events.at(-1), 'end');
});

test('transaction commits result and rolls back rejected work before releasing', async () => {
  const success = fixture();
  assert.equal(await success.database.transaction(async (tx) => (await tx.execute('SELECT 1'))[0].total), '18446744073709551615');
  assert.deepEqual(success.events.slice(-2), ['commit', 'release']);
  const failure = fixture();
  await assert.rejects(failure.database.transaction(async () => { throw new Error('validation failed'); }), /validation failed/);
  assert.deepEqual(failure.events.slice(-2), ['rollback', 'release']);
  assert.ok(!failure.events.includes('commit'));
});

test('deadlock retries are bounded; unknown commit result is never replayed', async () => {
  const deadlock = Object.assign(new Error('deadlock'), { code: 'ER_LOCK_DEADLOCK' });
  const recover = fixture({ executeError: deadlock });
  await recover.database.transaction((tx) => tx.execute('UPDATE fixture SET value = ?', [1]), { maxRetries: 1 });
  assert.equal(recover.events.filter((event) => event === 'begin').length, 2);
  assert.equal(recover.events.filter((event) => event === 'commit').length, 1);
  const noRetry = fixture({ executeError: deadlock });
  await assert.rejects(noRetry.database.transaction((tx) => tx.execute('UPDATE fixture SET value = ?', [1])), /deadlock/);
  assert.equal(noRetry.events.filter((event) => event === 'begin').length, 1);
  const unknown = fixture({ commitError: Object.assign(new Error('connection lost'), { code: 'ECONNRESET' }) });
  let calls = 0;
  await assert.rejects(unknown.database.transaction(async () => { calls++; }, { maxRetries: 3 }), /connection lost/);
  assert.equal(calls, 1);
  assert.equal(unknown.events.at(-1), 'destroy');
});

test('initialization or rollback failures discard connections rather than reuse uncertain state', async () => {
  const initial = fixture({ initializeError: new Error('UTC init failed') });
  await assert.rejects(initial.database.execute('SELECT 1'), /UTC init failed/);
  assert.deepEqual(initial.events, ["SET time_zone = '+00:00'", 'destroy']);
  const failedRollback = fixture({ rollbackError: new Error('rollback failed') });
  await assert.rejects(failedRollback.database.transaction(async () => { throw new Error('work failed'); }), /work failed/);
  assert.equal(failedRollback.events.at(-1), 'destroy');
  assert.ok(!failedRollback.events.includes('release'));
  const timedOut = fixture({ executeError: Object.assign(new Error('timeout'), { code: 'PROTOCOL_SEQUENCE_TIMEOUT' }) });
  await assert.rejects(timedOut.database.execute('SELECT 1'), /timeout/);
  assert.equal(timedOut.events.at(-1), 'destroy');
});

test('GUIDs are lowercase strings and money calculations stay exact above Number safe range', () => {
  const id = createId();
  assert.equal(guidSchema.parse(id), id);
  assert.equal(guidSchema.safeParse(id.toUpperCase()).success, false);
  assert.equal(serializeVnd('18446744073709551615'), '18446744073709551615');
  assert.equal(calculateTotalVnd('9007199254740993', 3), '27021597764222979');
  for (const value of [Number.MAX_SAFE_INTEGER + 1, -1, 1.5, '1e3', null]) assert.throws(() => serializeVnd(value));
  assert.throws(() => calculateTotalVnd('100', 0));
});
