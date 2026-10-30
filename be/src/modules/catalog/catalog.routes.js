import { Router } from 'express';
import { validate } from '../../shared/validation.js';
import { createCatalogRepository } from './catalog.repository.js';
import { createCatalogService } from './catalog.service.js';
import { createCatalogController } from './catalog.controller.js';
import {
  eventParamsSchema,
  eventQuerySchema,
  placeParamsSchema,
  placeQuerySchema,
  serviceParamsSchema,
  serviceQuerySchema,
} from './catalog.schema.js';

export function createCatalogRouter({ database, catalogRepository }) {
  const router = Router();
  const controller = createCatalogController(
    createCatalogService(catalogRepository ?? createCatalogRepository(database)),
  );
  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  router.get('/catalog', controller.catalog);
  router.get('/places', validate(placeQuerySchema, 'query'), controller.list);
  router.get('/places/:id', validate(placeParamsSchema, 'params'), controller.detail);
  router.get(
    '/places/:id/audio-guides',
    validate(placeParamsSchema, 'params'),
    controller.placeAudioGuides,
  );
  router.get('/events', validate(eventQuerySchema, 'query'), controller.listEvents);
  router.get('/events/:id', validate(eventParamsSchema, 'params'), controller.eventDetail);
  router.get('/services', validate(serviceQuerySchema, 'query'), controller.listServices);
  router.get('/services/:id', validate(serviceParamsSchema, 'params'), controller.serviceDetail);
  return router;
}
