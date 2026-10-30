import { Router } from 'express';
import { validate } from '../../shared/validation.js';
import {
  contentCreateSchema,
  contentParamsSchema,
  contentQuerySchema,
  mediaCreateSchema,
  placeClosureCreateSchema,
  revisionCreateSchema,
  revisionParamsSchema,
  revisionReviewSchema,
  visibilityUpdateSchema,
} from './content.schema.js';
import { createContentService } from './content.service.js';

export function createContentRouter({ database, authService, clock }) {
  const router = Router();
  const contentService = createContentService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.get('/meta', async (req, res) => {
    res.json(await contentService.listMeta(req.auth));
  });

  router.post('/media-assets', validate(mediaCreateSchema), async (req, res) => {
    res.status(201).json(
      await contentService.createMediaAsset(req.auth, req.validated.body, req.id),
    );
  });

  router.get('/contents', validate(contentQuerySchema, 'query'), async (req, res) => {
    res.json(await contentService.listContents(req.auth, req.validated.query));
  });

  router.get('/contents/:id', validate(contentParamsSchema, 'params'), async (req, res) => {
    res.json(await contentService.getContent(req.auth, req.validated.params.id));
  });

  router.post('/contents', validate(contentCreateSchema), async (req, res) => {
    res.status(201).json(await contentService.createContent(req.auth, req.validated.body, req.id));
  });

  router.post(
    '/contents/:id/revisions',
    validate(contentParamsSchema, 'params'),
    validate(revisionCreateSchema),
    async (req, res) => {
      res
        .status(201)
        .json(
          await contentService.createRevision(
            req.auth,
            req.validated.params.id,
            req.validated.body,
            req.id,
          ),
        );
    },
  );

  router.post(
    '/contents/:id/revisions/:revisionId/submit',
    validate(revisionParamsSchema, 'params'),
    async (req, res) => {
      res.json(
        await contentService.submitRevision(
          req.auth,
          req.validated.params.id,
          req.validated.params.revisionId,
          req.id,
        ),
      );
    },
  );

  router.post(
    '/contents/:id/revisions/:revisionId/review',
    validate(revisionParamsSchema, 'params'),
    validate(revisionReviewSchema),
    async (req, res) => {
      res.json(
        await contentService.reviewRevision(
          req.auth,
          req.validated.params.id,
          req.validated.params.revisionId,
          req.validated.body,
          req.id,
        ),
      );
    },
  );

  router.post(
    '/contents/:id/visibility',
    validate(contentParamsSchema, 'params'),
    validate(visibilityUpdateSchema),
    async (req, res) => {
      res.json(
        await contentService.updateVisibility(
          req.auth,
          req.validated.params.id,
          req.validated.body,
          req.id,
        ),
      );
    },
  );

  router.post(
    '/places/:id/closures',
    validate(contentParamsSchema, 'params'),
    validate(placeClosureCreateSchema),
    async (req, res) => {
      res
        .status(201)
        .json(
          await contentService.addPlaceClosure(
            req.auth,
            req.validated.params.id,
            req.validated.body,
            req.id,
          ),
        );
    },
  );

  return router;
}
