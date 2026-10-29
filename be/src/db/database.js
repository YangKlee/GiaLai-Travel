import mysql from 'mysql2/promise';
import { readFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

export function buildPoolOptions(config) {
  return {
    host: config.host, port: config.port, database: config.database,
    user: config.user, password: config.password,
    connectionLimit: config.connectionLimit, connectTimeout: config.connectTimeout,
    waitForConnections: true, queueLimit: 20,
    charset: 'utf8mb4_unicode_ci', timezone: 'Z',
    supportBigNumbers: true, bigNumberStrings: true,
    dateStrings: true, multipleStatements: false, enableKeepAlive: true,
    ...(config.ssl ? { ssl: { rejectUnauthorized: true,
      ...(config.sslCaPath ? { ca: readFileSync(config.sslCaPath, 'utf8') } : {}),
    } } : {}),
  };
}

export function createDatabase(config, { pool = mysql.createPool(buildPoolOptions(config)) } = {}) {
  const queryTimeout = config.queryTimeout;
  async function getConnection() {
    const connection = await pool.getConnection();
    try {
      await connection.query({ sql: "SET time_zone = '+00:00'", timeout: queryTimeout });
      return connection;
    } catch (error) { connection.destroy(); throw error; }
  }
  async function execute(sql, parameters = []) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute({ sql, timeout: queryTimeout }, parameters);
      return rows;
    } finally { connection.release(); }
  }
  // Only retry DB-only callbacks; no outbound calls or other side effects.
  async function transaction(work, { maxRetries = 0 } = {}) {
    if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 3) throw new TypeError('maxRetries must be 0..3');
    for (let attempt = 0; ; attempt++) {
      const connection = await getConnection();
      let began = false;
      let committed = false;
      let commitAttempted = false;
      let reusable = true;
      try {
        await connection.beginTransaction();
        began = true;
        const result = await work({ execute: async (sql, parameters = []) => {
          const [rows] = await connection.execute({ sql, timeout: queryTimeout }, parameters);
          return rows;
        } });
        commitAttempted = true;
        await connection.commit();
        committed = true;
        return result;
      } catch (error) {
        if (began && !committed) {
          try { await connection.rollback(); } catch { reusable = false; }
        }
        // Lost COMMIT acknowledgement has an unknown outcome; never replay here.
        const retry = !commitAttempted && reusable && attempt < maxRetries &&
          ['ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'].includes(error.code);
        if (!retry) throw error;
      } finally {
        if (reusable) connection.release(); else connection.destroy();
      }
      await delay(25 * (attempt + 1));
    }
  }
  return { execute, transaction,
    async checkReadiness() { await execute('SELECT 1 AS connected'); },
    close: () => pool.end(),
  };
}
