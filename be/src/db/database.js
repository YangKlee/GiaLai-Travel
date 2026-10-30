import mysql from 'mysql2';
import { Sequelize, Transaction } from 'sequelize';
import { readFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import initModels from './models/init-models.js';

export function buildDialectOptions(config) {
  return {
    supportBigNumbers: true, bigNumberStrings: true, decimalNumbers: false,
    connectTimeout: config.connectTimeout, multipleStatements: false, enableKeepAlive: true,
    ...(config.ssl ? { ssl: { rejectUnauthorized: true,
      ...(config.sslCaPath ? { ca: readFileSync(config.sslCaPath, 'utf8') } : {}),
    } } : {}),
  };
}

function timedDriver(timeout) {
  return { ...mysql, createConnection(options) {
    const connection = mysql.createConnection(options);
    for (const method of ['query', 'execute']) {
      const run = connection[method].bind(connection);
      connection[method] = (input, ...args) => {
        const callback = args.at(-1);
        if (typeof callback === 'function') args[args.length - 1] = (error, ...results) => {
          if (error?.code === 'PROTOCOL_SEQUENCE_TIMEOUT') connection.destroy();
          callback(error, ...results);
        };
        return run(typeof input === 'string' ? { sql: input, timeout } : { timeout, ...input }, ...args);
      };
    }
    return connection;
  } };
}

export function createDatabase(config) {
  const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host, port: config.port, dialect: 'mysql',
    dialectModule: timedDriver(config.queryTimeout), dialectOptions: buildDialectOptions(config),
    timezone: '+00:00', logging: false, logQueryParameters: false, retry: { max: 0 },
    pool: { min: 0, max: config.connectionLimit, acquire: config.connectTimeout, idle: 10000 },
    define: { timestamps: false, freezeTableName: true, charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' },
  });
  const models = initModels(sequelize);
  const generated = { Users: ['email_key'], PaymentAttempts: ['successful_booking_id', 'successful_purchase_id'] };
  for (const [name, fields] of Object.entries(generated)) {
    models[name].addHook('beforeSave', (instance) => {
      if (fields.some((field) => instance.changed(field))) throw new Error('GENERATED_COLUMN_READ_ONLY');
    });
    models[name].addHook('beforeBulkUpdate', (options) => {
      if (fields.some((field) => Object.hasOwn(options.attributes, field))) throw new Error('GENERATED_COLUMN_READ_ONLY');
    });
  }
  return {
    sequelize, models,
    async transaction(work, { maxRetries = 0 } = {}) {
      if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 3) throw new TypeError('maxRetries must be 0..3');
      for (let attempt = 0; ; attempt++) {
        let commitAttempted = false;
        try {
          return await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ }, async (transaction) => {
            const result = await work(transaction);
            commitAttempted = true;
            return result;
          });
        } catch (error) {
          const code = error.original?.code;
          if (commitAttempted || attempt >= maxRetries || !['ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'].includes(code)) throw error;
          await delay(25 * (attempt + 1));
        }
      }
    },
    checkReadiness: () => sequelize.authenticate(),
    close: () => sequelize.close(),
  };
}
