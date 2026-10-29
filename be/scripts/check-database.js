import { readFileSync } from 'node:fs';
import { loadConfig } from '../src/config/env.js';
import { createDatabase } from '../src/db/database.js';

const config = loadConfig();
const database = createDatabase(config.database);
try {
  const [server] = await database.execute('SELECT VERSION() AS version, DATABASE() AS database_name, @@session.time_zone AS time_zone');
  const tables = await database.execute('SELECT table_name AS name, table_type AS type FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name');
  const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8');
  const expected = [...schema.matchAll(/^CREATE TABLE (\w+)/gm)].map((match) => match[1]);
  const names = new Set(tables.filter((table) => table.type === 'BASE TABLE').map((table) => table.name));
  const missing = expected.filter((name) => !names.has(name));
  const viewFound = tables.some((table) => table.name === 'b2g_released_metrics' && table.type === 'VIEW');
  console.log(JSON.stringify({ status: missing.length || !viewFound ? 'schema_incomplete' : 'connected',
    ...server, tableCount: names.size, expectedTableCount: expected.length,
    missingTables: missing, reportingViewPresent: viewFound,
    note: 'Read-only check: no schema/data modified. This is not a column/index/constraint diff.',
  }, null, 2));
  if (missing.length || !viewFound) process.exitCode = 1;
} catch (error) {
  const hints = {
    ETIMEDOUT: 'Check remote MySQL access, firewall, host and port.',
    ECONNREFUSED: 'MySQL port is not accepting connections from this machine.',
    ENOTFOUND: 'Database hostname could not be resolved.',
    ER_ACCESS_DENIED_ERROR: 'Verify database credentials and remote host access grants.',
    ER_DBACCESS_DENIED_ERROR: 'Grant the database user access to the selected database.',
    ER_BAD_DB_ERROR: 'Create/select the database in cPanel before connecting.',
  };
  console.error(JSON.stringify({ status: 'connection_failed', code: error.code || 'UNKNOWN', hint: hints[error.code] || 'Check server configuration and TLS settings.' }));
  process.exitCode = 1;
} finally { await database.close(); }
