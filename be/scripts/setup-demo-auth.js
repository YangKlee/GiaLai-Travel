import mysql from 'mysql2/promise';
import { randomBytes } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { migrate } from '../src/db/migrations.js';
import { generateAuthKeyFiles } from '../src/config/key-files.js';

const output = fileURLToPath(new URL('../.env.demo-auth', import.meta.url));
let connection; let created = false; let userCreated = false;
const suffix = randomBytes(6).toString('hex');
const name = `gialai_demo_${suffix}`; const runtimeUser = `glt_demo_${suffix}`;
try {
  if (existsSync(output)) throw new Error('DEMO_AUTH_CONFIG_EXISTS_NO_CHANGES');
  const host = process.env.DEMO_DB_HOST || '127.0.0.1';
  if (host !== '127.0.0.1') throw new Error('DEMO_SETUP_REQUIRES_LOOPBACK_DATABASE');
  const port = Number(process.env.DEMO_DB_PORT || 3307);
  connection = await mysql.createConnection({ host, port, user: process.env.DEMO_DB_USER || 'root',
    password: process.env.DEMO_DB_PASSWORD || '', multipleStatements: true, dateStrings: true, connectTimeout: 5000 });
  // Administrative setup only: own fresh DB and a runtime account without DDL grants.
  await connection.query(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`); created = true;
  await connection.changeUser({ database: name });
  await migrate(connection, 'init');
  const password = randomBytes(32).toString('hex');
  await connection.query("CREATE USER ?@'127.0.0.1' IDENTIFIED BY ?", [runtimeUser, password]); userCreated = true;
  await connection.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON \`${name}\`.* TO ?@'127.0.0.1'`, [runtimeUser]);
  const keyDirectory = `.local/auth-demo-${suffix}`;
  generateAuthKeyFiles(fileURLToPath(new URL(`../${keyDirectory}/`, import.meta.url)));
  const environment = { NODE_ENV: 'development', PORT: '3000', CLIENT_ORIGIN: 'http://localhost:5173,http://127.0.0.1:5173',
    DB_HOST: host, DB_PORT: String(port), DB_NAME: name, DB_USER: runtimeUser, DB_PASSWORD: password,
    AUTH_ENABLED: 'true', AUTH_KEY_ID: `demo-${suffix}`, AUTH_PRIVATE_KEY_FILE: `${keyDirectory}/private.pem`,
    AUTH_ISSUER: 'gialai-travel-local', AUTH_AUDIENCE: 'gialai-travel-web', AUTH_COOKIE_SECURE: 'false' };
  writeFileSync(output, Object.entries(environment).map(([key, value]) => `${key}=${value}`).join('\n') + '\n', { flag: 'wx', mode: 0o600 });
  console.log(JSON.stringify({ status: 'configured', config: 'be/.env.demo-auth', note: 'Fresh local DB, DML-only runtime account, private keys outside Git. No default app account; register in the UI.' }));
} catch (error) {
  if (connection && created && /^gialai_demo_[a-f0-9]{12}$/.test(name)) {
    await connection.query(`DROP DATABASE \`${name}\``).catch(() => {});
    if (userCreated) await connection.query("DROP USER ?@'127.0.0.1'", [runtimeUser]).catch(() => {});
  }
  console.error(JSON.stringify({ status: 'failed', code: /^[A-Z][A-Z0-9_]+$/.test(error.message) ? error.message : error.code || 'DEMO_SETUP_FAILED' }));
  process.exitCode = 1;
} finally { await connection?.end(); }
