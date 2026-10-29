import { Router } from 'express';
import { createHealthController } from '../modules/health/health.controller.js';

export function createApiRouter(dependencies) {
  const router = Router();
  const health = createHealthController(dependencies);
  router.get('/health', health.live);
  router.get('/ready', health.ready);
  router.get('/v1/health', health.live);
  router.get('/v1/ready', health.ready);
  return router;
}
