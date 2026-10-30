import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createLogger } from './config/logger.js';
import { requestContext } from './middleware/request-context.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { createApiRouter } from './routes/index.js';

export function createApp({
  clientOrigin = 'http://localhost:5173', trustProxyHops = 0,
  database, catalogRepository, auth, logger = createLogger('silent'),
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  if (trustProxyHops > 0) app.set('trust proxy', trustProxyHops);
  app.use(requestContext(logger));
  app.use(helmet());
  app.use(cors({ origin: clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api', createApiRouter({ database, catalogRepository, auth, logger }));
  app.use(notFound);
  app.use(errorHandler(logger));

  return app;
}
