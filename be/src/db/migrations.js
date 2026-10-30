import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const currentSchema = readFileSync(new URL('../../schema.sql', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
const jwtSql = readFileSync(new URL('../../migrations/001-jwt-auth.sql', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
const digest = (text) => createHash('sha256').update(text).digest('hex');
const currentTables = [...currentSchema.matchAll(/^CREATE TABLE (\w+)/gm)].map((match) => match[1]).sort();
const knownChecksums = {
  '000-current': digest(currentSchema),
  '000-legacy-guid': digest('GiaLaiTravel legacy GUID baseline v1:58 tables; auth_sessions.token_hash BINARY(32); no auth_refresh_tokens'),
  '001-jwt-auth': digest(jwtSql),
};

async function tables(connection) {
  const [rows] = await connection.execute('SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = ?', ['BASE TABLE']);
  return rows.map((row) => row.name).filter((name) => name !== 'schema_migrations').sort();
}

export async function verifyBaseline(connection, kind) {
  const expected = currentTables.filter((name) => kind !== 'legacy-guid' || name !== 'auth_refresh_tokens');
  if (JSON.stringify(await tables(connection)) !== JSON.stringify(expected)) throw new Error('BASELINE_TABLE_MISMATCH');
  const [columns] = await connection.execute(`SELECT table_name AS tableName, column_name AS name,
    data_type AS type, character_maximum_length AS length, extra
    FROM information_schema.columns WHERE table_schema = DATABASE()
    AND table_name IN ('users', 'auth_sessions', 'auth_refresh_tokens')`);
  const column = (table, name) => columns.find((item) => item.tableName === table && item.name === name);
  for (const table of ['users', 'auth_sessions', ...(kind === 'current' ? ['auth_refresh_tokens'] : [])]) {
    if (column(table, 'id')?.type !== 'char' || Number(column(table, 'id')?.length) !== 36) throw new Error('BASELINE_GUID_MISMATCH');
  }
  const oldHash = column('auth_sessions', 'token_hash');
  if (kind === 'legacy-guid' ? oldHash?.type !== 'binary' || Number(oldHash?.length) !== 32 : Boolean(oldHash)) throw new Error('BASELINE_AUTH_MISMATCH');
  if (!column('users', 'email_key')?.extra.toLowerCase().includes('generated')) throw new Error('BASELINE_GENERATED_COLUMN_MISMATCH');
  if (kind === 'current') {
    const hash = column('auth_refresh_tokens', 'token_hash');
    if (hash?.type !== 'binary' || Number(hash?.length) !== 32 || !column('auth_refresh_tokens', 'used_at')) throw new Error('BASELINE_REFRESH_MISMATCH');
    const [keys] = await connection.execute(`SELECT constraint_type AS type FROM information_schema.table_constraints
      WHERE constraint_schema = DATABASE() AND table_name = 'auth_refresh_tokens'`);
    for (const type of ['FOREIGN KEY', 'UNIQUE', 'CHECK']) if (!keys.some((key) => key.type === type)) throw new Error('BASELINE_REFRESH_CONSTRAINT_MISMATCH');
  }
  const [views] = await connection.execute(`SELECT table_name FROM information_schema.views
    WHERE table_schema = DATABASE() AND table_name = 'b2g_released_metrics'`);
  if (!views.length) throw new Error('BASELINE_VIEW_MISMATCH');
}

async function ledgerExists(connection) {
  const [rows] = await connection.execute(`SELECT table_name FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name = 'schema_migrations'`);
  return rows.length > 0;
}

export async function migrationStatus(connection) {
  if (!(await ledgerExists(connection))) return [];
  const [rows] = await connection.query('SELECT version, checksum, state, applied_at AS appliedAt FROM schema_migrations ORDER BY version');
  for (const row of rows) {
    if (knownChecksums[row.version] !== row.checksum) throw new Error('MIGRATION_CHECKSUM_MISMATCH');
    if (row.state !== 'APPLIED') throw new Error('MIGRATION_INCOMPLETE_RESTORE_OR_RECONCILE_REQUIRED');
  }
  return rows;
}

async function createLedger(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    checksum CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    state ENUM('RUNNING','APPLIED','FAILED') NOT NULL,
    applied_at DATETIME(6) NULL
  ) ENGINE=InnoDB`);
}

async function record(connection, version, state) {
  await connection.execute('INSERT INTO schema_migrations (version, checksum, state, applied_at) VALUES (?, ?, ?, IF(? = ?, UTC_TIMESTAMP(6), NULL))',
    [version, knownChecksums[version], state, state, 'APPLIED']);
}

async function apply(connection, version, sql, verify) {
  await record(connection, version, 'RUNNING');
  try {
    // Trusted repository SQL only. DDL auto-commits; an incomplete run is never replayed.
    await connection.query(sql);
    await verify();
    await connection.execute("UPDATE schema_migrations SET state = 'APPLIED', applied_at = UTC_TIMESTAMP(6) WHERE version = ?", [version]);
  } catch (error) {
    await connection.execute("UPDATE schema_migrations SET state = 'FAILED' WHERE version = ?", [version]).catch(() => {});
    throw error;
  }
}

export async function migrate(connection, action, baselineKind) {
  if (!['init', 'baseline', 'up'].includes(action)) throw new Error('INVALID_MIGRATION_ACTION');
  if (action === 'baseline' && !['current', 'legacy-guid'].includes(baselineKind)) throw new Error('BASELINE_KIND_REQUIRED');
  const [[{ name }]] = await connection.query('SELECT DATABASE() AS name');
  if (!name || ['mysql', 'sys', 'performance_schema', 'information_schema'].includes(name.toLowerCase())) throw new Error('APPLICATION_DATABASE_REQUIRED');
  const lockName = `gialai:migrate:${digest(name).slice(0, 32)}`;
  const [[{ acquired }]] = await connection.execute('SELECT GET_LOCK(?, 0) AS acquired', [lockName]);
  if (Number(acquired) !== 1) throw new Error('MIGRATION_ALREADY_RUNNING');
  try {
    await connection.query("SET time_zone = '+00:00'");
    const history = await migrationStatus(connection);
    if (action === 'init') {
      if (history.length || (await tables(connection)).length) throw new Error('INITIALIZATION_REQUIRES_EMPTY_DATABASE');
      await createLedger(connection);
      await apply(connection, '000-current', currentSchema, () => verifyBaseline(connection, 'current'));
      await record(connection, '001-jwt-auth', 'APPLIED');
    } else if (action === 'baseline') {
      if (history.length) throw new Error('BASELINE_ALREADY_RECORDED');
      await verifyBaseline(connection, baselineKind);
      await createLedger(connection);
      await record(connection, `000-${baselineKind}`, 'APPLIED');
      if (baselineKind === 'current') await record(connection, '001-jwt-auth', 'APPLIED');
    } else {
      if (!history.length) throw new Error('RECORD_BASELINE_BEFORE_MIGRATING');
      if (!history.some((row) => row.version === '001-jwt-auth')) {
        await verifyBaseline(connection, 'legacy-guid');
        await apply(connection, '001-jwt-auth', jwtSql, () => verifyBaseline(connection, 'current'));
      }
      await verifyBaseline(connection, 'current');
    }
    return migrationStatus(connection);
  } finally { await connection.execute('SELECT RELEASE_LOCK(?)', [lockName]); }
}
