import { Router } from 'express';
import { createHealthController } from '../modules/health/health.controller.js';
import { createCatalogRouter } from '../modules/catalog/catalog.routes.js';
import { createAuthRouter } from '../modules/auth/auth.routes.js';

export function createApiRouter(dependencies) {
  const router = Router();
  const health = createHealthController(dependencies);
  router.get('/health', health.live);
  router.get('/ready', health.ready);
  router.get('/v1/health', health.live);
  router.get('/v1/ready', health.ready);
  router.use('/v1', createCatalogRouter(dependencies));
  router.use('/v1/auth', createAuthRouter(dependencies));
  return router;
}
