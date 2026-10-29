import { createApp } from './app.js';
import { loadConfig } from './config/env.js';
import { createLogger } from './config/logger.js';

const config = loadConfig();
const logger = createLogger(config.logLevel);

const app = createApp({ clientOrigin: config.clientOrigins, trustProxyHops: config.trustProxyHops, logger });
const server = app.listen(config.port);
server.requestTimeout = 60_000;
server.headersTimeout = 15_000;
server.on('listening', () => logger.info({ port: config.port }, 'API listening'));
server.on('error', (error) => {
  logger.error({ errorCode: error.code }, 'HTTP server failed');
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    server.close();
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
