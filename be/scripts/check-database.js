import { loadConfig } from '../src/config/env.js';
import { createDatabase } from '../src/db/database.js';

let database;
try {
  database = createDatabase(loadConfig().database);
  await database.checkReadiness();
  const names = new Set(await database.sequelize.getQueryInterface().showAllTables());
  const expected = Object.values(database.models).map((model) => model.tableName);
  const missing = expected.filter((name) => !names.has(name));
  console.log(JSON.stringify({ status: missing.length ? 'schema_incomplete' : 'connected',
    orm: 'sequelize', version: await database.sequelize.databaseVersion(), expectedTableCount: expected.length,
    missingTables: missing, reportingViewPresent: names.has('b2g_released_metrics'),
    note: 'Read-only model/table inventory, not a full schema diff.',
  }, null, 2));
  if (missing.length || !names.has('b2g_released_metrics')) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ status: 'connection_failed', code: error.original?.code || error.code || 'DB_CHECK_FAILED' }));
  process.exitCode = 1;
} finally { await database?.close(); }
