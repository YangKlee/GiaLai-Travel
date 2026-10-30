import { Router } from 'express';
import { validate } from '../../shared/validation.js';
import { createCatalogRepository } from './catalog.repository.js';
import { createCatalogService } from './catalog.service.js';
import { createCatalogController } from './catalog.controller.js';
import { placeQuerySchema, placeParamsSchema } from './catalog.schema.js';

export function createCatalogRouter({ database, catalogRepository }) {
  const router = Router();
  const controller = createCatalogController(createCatalogService(catalogRepository ?? createCatalogRepository(database)));
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  router.get('/catalog', controller.catalog);
  router.get('/places', validate(placeQuerySchema, 'query'), controller.list);
  router.get('/places/:id', validate(placeParamsSchema, 'params'), controller.detail);
  return router;
}
