import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import SequelizeAuto from 'sequelize-auto';
import { loadConfig } from '../src/config/env.js';
import { buildDialectOptions } from '../src/db/database.js';
import { prepareGeneratedModels } from './prepare-generated-models.js';

// Reverse engineer live metadata only; never call sync() or execute schema.sql.
const output = fileURLToPath(new URL('../src/db/models/', import.meta.url));
let auto;
let stage = 'configuration';
try {
  if (existsSync(output)) throw Object.assign(new Error('Output exists'), { code: 'OUTPUT_EXISTS' });
  const { database } = loadConfig();
  stage = 'connection';
  const { ssl, ...dialectOptions } = buildDialectOptions(database);
  auto = new SequelizeAuto(database.database, database.user, database.password, {
    host: database.host,
    port: database.port,
    dialect: 'mysql',
    dialectOptions: { ...dialectOptions, ...(ssl ? { ssl } : {}) },
    directory: output,
    lang: 'esm',
    caseModel: 'p',
    caseFile: 'o',
    caseProp: 'o',
    views: false,
    skipTables: ['schema_migrations'],
    logging: false,
    closeConnectionAutomatically: false,
    pool: { max: 1, min: 0, acquire: database.connectTimeout, idle: 1000 },
    retry: { max: 0 },
    additional: { timestamps: false, freezeTableName: true },
  });
  await auto.sequelize.authenticate();
  stage = 'metadata';
  // sequelize-auto 0.8 catches metadata failures and logs them instead of
  // rejecting. Capture them before writing so a partial scaffold cannot pass.
  const metadataErrors = [];
  const originalError = console.error;
  let result;
  try {
    console.error = (...errors) => metadataErrors.push(...errors);
    result = await auto.build();
  } finally {
    console.error = originalError;
  }
  if (metadataErrors.length) throw metadataErrors[0];
  if (!Object.keys(result.tables).length) {
    throw Object.assign(new Error('No tables found'), { code: 'NO_TABLES' });
  }
  result = auto.relate(result);
  result.text = auto.generate(result);
  stage = 'write';
  await auto.write(result);
  prepareGeneratedModels(output);
  console.log(JSON.stringify({ status: 'scaffolded', tableCount: Object.keys(result.tables).length, output }));
} catch (error) {
  // Do not print raw driver errors: they can contain connection details.
  const code = error.original?.code || error.parent?.code || error.code ||
    (stage === 'configuration' ? 'INVALID_CONFIG' : 'SCAFFOLD_FAILED');
  const configMessage = stage === 'configuration' && /^Invalid environment configuration: [A-Z_, ]+$/.test(error.message)
    ? error.message : undefined;
  console.error(JSON.stringify({ status: 'scaffold_failed', stage, code, ...(configMessage ? { message: configMessage } : {}),
    hint: code === 'OUTPUT_EXISTS'
      ? 'Move the existing src/db/models directory before regenerating; custom models are never overwritten.'
      : code === 'INVALID_CONFIG'
        ? 'Check required env fields. An explicit empty DB_PASSWORD is allowed only for local development/test.'
        : 'Verify DB environment, remote MySQL access, host/port and metadata permissions. No schema/data changes were requested.',
  }));
  process.exitCode = 1;
} finally {
  if (auto) await auto.sequelize.close();
}
