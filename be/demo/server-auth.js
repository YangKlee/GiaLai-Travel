import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config/env.js';
import { loadAuthConfig } from '../src/config/auth.js';
import { createDatabase } from '../src/db/database.js';
import { createLogger } from '../src/config/logger.js';
import {
  createAiAdapterFromConfig,
  createMailAdapter,
  createRoutingAdapter,
} from '../src/adapters/index.js';
import { createDemoCatalogRepository } from './catalog.repository.js';

if (process.env.NODE_ENV === 'production') throw new Error('Demo server cannot run in production.');
const config = loadConfig(); const auth = loadAuthConfig(config);
if (!auth) throw new Error('Run setup:demo:auth before starting the account demo.');
const database = createDatabase(config.database); const logger = createLogger('info');
const mail = createMailAdapter({ mode: 'outbox' });
const aiAdapter = createAiAdapterFromConfig(config.ai);
const routingAdapter = createRoutingAdapter({ mode: 'local' });
try {
  await database.checkReadiness();
  const server = createApp({
    database,
    auth,
    mail,
    aiAdapter,
    routingAdapter,
    clientOrigin: config.clientOrigins,
    catalogRepository: createDemoCatalogRepository(),
    logger,
  }).listen(config.port, '127.0.0.1');
  server.on('listening', () => logger.info({ port: config.port }, 'Local account demo: real Sequelize auth, sample catalog'));
  server.on('error', async (error) => { logger.error({ errorCode: error.code }, 'Demo failed'); process.exitCode = 1; await database.close(); });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
    server.close(async () => { await database.close(); }); server.closeAllConnections();
  });
} catch (error) { logger.error({ errorCode: error.original?.code || 'DEMO_DB_UNAVAILABLE' }, 'Account demo failed'); process.exitCode = 1; await database.close(); }
