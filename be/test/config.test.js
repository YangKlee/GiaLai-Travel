import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Writable } from 'node:stream';
import { loadConfig } from '../src/config/env.js';
import { createLogger } from '../src/config/logger.js';

const fixture = { DB_HOST: 'localhost', DB_NAME: 'test', DB_USER: 'test', DB_PASSWORD: 'fixture-secret' };

test('config validates boundaries without exposing supplied values', () => {
  assert.equal(loadConfig(fixture).database.port, 3306);
  assert.deepEqual(loadConfig({ ...fixture, CLIENT_ORIGIN: 'http://localhost:5173,https://example.test' }).clientOrigins,
    ['http://localhost:5173', 'https://example.test']);
  for (const PORT of ['0', '65536', 'abc', '1.5']) assert.throws(() => loadConfig({ ...fixture, PORT }));
  assert.throws(() => loadConfig({ ...fixture, DB_PASSWORD: undefined }), /DB_PASSWORD/);
  assert.throws(() => loadConfig({ ...fixture, CLIENT_ORIGIN: 'javascript:fixture-secret' }), (error) => {
    assert.ok(!error.message.includes('fixture-secret'));
    return true;
  });
  assert.throws(() => loadConfig({ ...fixture, DB_SSL_CA: 'ca.pem' }), /DB_SSL/);
});

test('logger redacts credentials from structured fields', () => {
  let output = '';
  const destination = new Writable({ write(chunk, _encoding, done) { output += chunk; done(); } });
  const logger = createLogger('info', destination);
  logger.info({ password: 'fixture-secret', database: { password: 'fixture-secret' }, req: { headers: { authorization: 'fixture-secret', cookie: 'fixture-secret' } } });
  assert.ok(!output.includes('fixture-secret'));
  assert.ok(output.includes('[REDACTED]'));
});
