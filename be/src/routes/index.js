import { Router } from 'express';
import { createHealthController } from '../modules/health/health.controller.js';
import { createCatalogRouter } from '../modules/catalog/catalog.routes.js';
import { createAuthRouter } from '../modules/auth/auth.routes.js';
import { createAuthService } from '../modules/auth/auth.service.js';
import { createUsersRouter } from '../modules/users/users.routes.js';
import { createContentRouter } from '../modules/content/content.routes.js';
import {
  createItineraryProposalsRouter,
  createMyItinerariesRouter,
} from '../modules/itineraries/itinerary.routes.js';

export function createApiRouter(dependencies) {
  const router = Router();
  const health = createHealthController(dependencies);
  const authService = dependencies.auth
    ? createAuthService(dependencies.database, dependencies.auth, {
        mail: dependencies.mail,
        clock: dependencies.clock,
        logger: dependencies.logger,
      })
    : null;
  const aiAdapter = dependencies.aiAdapter || dependencies.ai;
  const routingAdapter = dependencies.routingAdapter || dependencies.routing;

  router.get('/health', health.live);
  router.get('/ready', health.ready);
  router.get('/v1/health', health.live);
  router.get('/v1/ready', health.ready);
  router.use('/v1', createCatalogRouter(dependencies));
  if (dependencies.database?.models) {
    router.use(
      '/v1',
      createItineraryProposalsRouter({
        ...dependencies,
        authService,
        aiAdapter,
        routingAdapter,
      }),
    );
  }
  router.use('/v1/auth', createAuthRouter({ ...dependencies, authService }));
  router.use('/v1/me', createUsersRouter({ ...dependencies, authService }));
  if (dependencies.database?.models) {
    router.use(
      '/v1/me/itineraries',
      createMyItinerariesRouter({
        ...dependencies,
        authService,
        aiAdapter,
        routingAdapter,
      }),
    );
  }
  if (dependencies.database?.models && authService) {
    router.use('/v1/admin', createContentRouter({ ...dependencies, authService }));
  }
  return router;
}
