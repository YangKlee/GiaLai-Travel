import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createLogger } from './config/logger.js';
import { requestContext } from './middleware/request-context.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { createApiRouter } from './routes/index.js';

export function createApp({
  clientOrigin = 'http://localhost:5173', trustProxyHops = 0,
  serveStatic = false, staticDir,
  database, catalogRepository, auth, mail, clock, ai, aiAdapter, routing, routingAdapter, logger = createLogger('silent'),
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  if (trustProxyHops > 0) app.set('trust proxy', trustProxyHops);
  app.use(requestContext(logger));
  app.use(helmet({ contentSecurityPolicy: serveStatic ? false : undefined }));
  app.use(cors({ origin: clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.use(
    '/api',
    createApiRouter({
      database,
      catalogRepository,
      auth,
      mail,
      clock,
      ai,
      aiAdapter,
      routing,
      routingAdapter,
      logger,
    }),
  );

  if (serveStatic) {
    const candidates = [
      staticDir,
      path.resolve(process.cwd(), '../fe/dist'),
      path.resolve(process.cwd(), 'fe/dist'),
      path.resolve(process.cwd(), 'dist'),
    ].filter(Boolean);
    const resolvedDir = candidates.find((dir) => fs.existsSync(dir));
    if (resolvedDir) {
      logger.info({ staticDir: resolvedDir }, 'serving frontend static files');
      app.use(express.static(resolvedDir));
      app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api') && req.accepts('html')) {
          return res.sendFile(path.join(resolvedDir, 'index.html'));
        }
        return next();
      });
    } else {
      logger.warn('SERVE_STATIC is enabled but no dist directory was found');
    }
  }

  app.use(notFound);
  app.use(errorHandler(logger));

  return app;
}
