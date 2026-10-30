import { z } from 'zod';
import { createApp } from '../src/app.js';
import { createLogger } from '../src/config/logger.js';
import { createDemoCatalogRepository } from './catalog.repository.js';

// No .env loading, DB connection or production fallback. Opt in with dev:demo.
if (process.env.NODE_ENV === 'production') throw new Error('Demo server cannot run in production.');
const port = z.coerce.number().int().min(1).max(65535).parse(process.env.PORT || 3000);
const logger = createLogger('info');
const server = createApp({ catalogRepository: createDemoCatalogRepository(), logger }).listen(port, '127.0.0.1');
server.on('listening', () => logger.info({ port, dataset: 'demo' }, 'Demo API listening; sample data only, no database connected'));
server.on('error', (error) => { logger.error({ errorCode: error.code }, 'Demo server failed'); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  server.close();
  server.closeAllConnections();
});
