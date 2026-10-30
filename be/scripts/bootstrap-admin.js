import { loadConfig } from '../src/config/env.js';
import { createDatabase } from '../src/db/database.js';
import { bootstrapAdmin } from '../src/modules/auth/bootstrap.js';

const input = { email: process.env.BOOTSTRAP_ADMIN_EMAIL, password: process.env.BOOTSTRAP_ADMIN_PASSWORD, displayName: process.env.BOOTSTRAP_ADMIN_NAME };
delete process.env.BOOTSTRAP_ADMIN_PASSWORD;
let database;
try {
  database = createDatabase(loadConfig().database);
  const result = await bootstrapAdmin(database, input);
  console.log(JSON.stringify({ status: 'created', ...result }));
} catch (error) {
  console.error(JSON.stringify({ status: 'failed', code: /^[A-Z][A-Z0-9_]+$/.test(error.message) ? error.message : error.code || 'ADMIN_BOOTSTRAP_FAILED' }));
  process.exitCode = 1;
} finally { input.password = undefined; await database?.close(); }
