import mysql from 'mysql2/promise';
import { loadConfig } from '../src/config/env.js';
import { migrate, migrationStatus } from '../src/db/migrations.js';

const [action = 'status', baselineKind] = process.argv.slice(2);
let connection;
try {
  if (!['status', 'init', 'baseline', 'up'].includes(action)) throw new Error('USE_STATUS_INIT_BASELINE_OR_UP');
  if (action !== 'status' && (!process.env.MIGRATION_DB_USER || process.env.MIGRATION_DB_PASSWORD === undefined)) throw new Error('SEPARATE_MIGRATION_CREDENTIALS_REQUIRED');
  const { database } = loadConfig({ ...process.env,
    ...(action === 'status' ? {} : { DB_USER: process.env.MIGRATION_DB_USER, DB_PASSWORD: process.env.MIGRATION_DB_PASSWORD }),
  });
  connection = await mysql.createConnection({ host: database.host, port: database.port, user: database.user,
    password: database.password, database: database.database, charset: 'utf8mb4', dateStrings: true,
    connectTimeout: database.connectTimeout, multipleStatements: true,
    ...(database.ssl ? { ssl: { rejectUnauthorized: true,
      ...(database.sslCaPath ? { ca: (await import('node:fs')).readFileSync(database.sslCaPath) } : {}),
    } } : {}),
  });
  const migrations = action === 'status' ? await migrationStatus(connection) : await migrate(connection, action, baselineKind);
  console.log(JSON.stringify({ status: 'ok', action, migrations }, null, 2));
} catch (error) {
  // Never expose driver SQL, bound values or connection strings.
  const code = /^[A-Z][A-Z0-9_]+$/.test(error.message) ? error.message : error.code || 'MIGRATION_FAILED';
  console.error(JSON.stringify({ status: 'failed', code }));
  process.exitCode = 1;
} finally { await connection?.end(); }
