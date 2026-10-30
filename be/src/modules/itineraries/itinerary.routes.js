import { Router } from 'express';
import { validate } from '../../shared/validation.js';
import {
  createItinerarySchema,
  itineraryParamsSchema,
  proposalInputSchema,
  renameItinerarySchema,
  revalidateSchema,
  updateRevisionSchema,
} from './itinerary.schema.js';
import { createItineraryService } from './itinerary.service.js';

export function createItineraryProposalsRouter({
  database,
  authService,
  aiAdapter,
  routingAdapter,
  clock,
}) {
  const router = Router();
  const service = createItineraryService(database, {
    aiAdapter,
    routingAdapter,
    clock,
  });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.post(
    '/itinerary-proposals',
    validate(proposalInputSchema),
    async (req, res) => {
      let auth = null;
      if (authService && req.get('authorization')) {
        try {
          auth = await authService.authenticate(req.get('authorization'));
        } catch {
          auth = null;
        }
      }
      res.json(await service.proposeItinerary(auth, req.validated.body, req.id));
    },
  );

  router.post(
    '/itinerary-proposals/revalidate',
    validate(revalidateSchema),
    async (req, res) => {
      res.json(await service.revalidateProposal(req.validated.body));
    },
  );

  return router;
}

export function createMyItinerariesRouter({
  database,
  authService,
  aiAdapter,
  routingAdapter,
  clock,
}) {
  const router = Router();
  const service = createItineraryService(database, {
    aiAdapter,
    routingAdapter,
    clock,
  });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    if (!authService) {
      return next();
    }
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.get('/', async (req, res) => {
    res.json(await service.listMyItineraries(req.auth));
  });

  router.post('/', validate(createItinerarySchema), async (req, res) => {
    res.status(201).json(await service.createMyItinerary(req.auth, req.validated.body, req.id));
  });

  router.get('/:id', validate(itineraryParamsSchema, 'params'), async (req, res) => {
    res.json(await service.getMyItinerary(req.auth, req.validated.params.id));
  });

  router.put(
    '/:id/revisions',
    validate(itineraryParamsSchema, 'params'),
    validate(updateRevisionSchema),
    async (req, res) => {
      res.json(
        await service.updateMyItineraryRevision(
          req.auth,
          req.validated.params.id,
          req.validated.body,
          req.id,
        ),
      );
    },
  );

  router.patch(
    '/:id',
    validate(itineraryParamsSchema, 'params'),
    validate(renameItinerarySchema),
    async (req, res) => {
      res.json(
        await service.renameMyItinerary(
          req.auth,
          req.validated.params.id,
          req.validated.body,
          req.id,
        ),
      );
    },
  );

  router.post('/:id/copy', validate(itineraryParamsSchema, 'params'), async (req, res) => {
    res.status(201).json(await service.copyMyItinerary(req.auth, req.validated.params.id, req.id));
  });

  router.delete('/:id', validate(itineraryParamsSchema, 'params'), async (req, res) => {
    res.json(await service.deleteMyItinerary(req.auth, req.validated.params.id, req.id));
  });

  return router;
}
