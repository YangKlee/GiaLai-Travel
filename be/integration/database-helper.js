import mysql from 'mysql2/promise';
import { randomBytes } from 'node:crypto';
import { createDatabase } from '../src/db/database.js';
import { migrate } from '../src/db/migrations.js';

export const localTestConfig = {
  host: process.env.INTEGRATION_DB_HOST || '127.0.0.1',
  port: Number(process.env.INTEGRATION_DB_PORT || 3307),
  user: process.env.INTEGRATION_DB_USER || 'root',
  password: process.env.INTEGRATION_DB_PASSWORD || '',
};

export async function isolatedDatabase(t, { initialize = true } = {}) {
  if (!['127.0.0.1', 'localhost', '::1'].includes(localTestConfig.host)) throw new Error('Integration tests require a local disposable database server.');
  const name = `gialai_test_${randomBytes(10).toString('hex')}`;
  const admin = await mysql.createConnection({ ...localTestConfig, multipleStatements: true, charset: 'utf8mb4', dateStrings: true });
  await admin.query(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await admin.changeUser({ database: name });
  const config = { ...localTestConfig, database: name, connectionLimit: 5, connectTimeout: 5000, queryTimeout: 5000, ssl: false };
  const database = createDatabase(config);
  t.after(async () => {
    await database.close();
    // Only the random database created by this invocation can be dropped.
    if (!/^gialai_test_[a-f0-9]{20}$/.test(name)) throw new Error('Unexpected test database name');
    try { await admin.query(`DROP DATABASE \`${name}\``); } finally { await admin.end(); }
  });
  if (initialize) await migrate(admin, 'init');
  return { name, database, admin, config };
}
