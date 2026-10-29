import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { createLogger } from './config/logger.js';
import { createDatabase } from './db/database.js';

const config = loadConfig();
const logger = createLogger(config.logLevel);
const database = createDatabase(config.database);

const app = createApp({ clientOrigin: config.clientOrigins, trustProxyHops: config.trustProxyHops, database, logger });
const server = app.listen(config.port);
server.requestTimeout = 60_000;
server.headersTimeout = 15_000;
server.on('listening', () => logger.info({ port: config.port }, 'API listening'));
server.on('error', async (error) => {
  logger.error({ errorCode: error.code }, 'HTTP server failed');
  process.exitCode = 1;
  await database.close();
});

let stopping = false;
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    if (stopping) return;
    stopping = true;
    logger.info({ signal }, 'shutting down');
    const forceExit = setTimeout(() => process.exit(1), 10_000);
    forceExit.unref();
    server.close(async () => {
      try { await database.close(); }
      catch { process.exitCode = 1; }
      finally { clearTimeout(forceExit); }
    });
  });
}
