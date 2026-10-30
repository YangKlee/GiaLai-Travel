import { Router } from 'express';
import { validate } from '../../shared/validation.js';
import {
  auditLogQuerySchema,
  issueCreateSchema,
  issueParamsSchema,
  issueQuerySchema,
  issueReviewSchema,
  notificationParamsSchema,
  notificationQuerySchema,
} from './operations.schema.js';
import { createOperationsService } from './operations.service.js';
import { itineraryParamsSchema } from '../itineraries/itinerary.schema.js';

export function createNotificationsRouter({ database, authService, clock }) {
  const router = Router();
  const service = createOperationsService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    if (!authService) return next();
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.get('/', validate(notificationQuerySchema, 'query'), async (req, res) => {
    res.json(await service.listNotifications(req.auth, req.validated.query));
  });

  router.get('/unread-count', async (req, res) => {
    res.json(await service.getUnreadCount(req.auth));
  });

  router.patch('/:id/read', validate(notificationParamsSchema, 'params'), async (req, res) => {
    res.json(await service.markNotificationRead(req.auth, req.validated.params.id));
  });

  router.post('/read-all', async (req, res) => {
    res.json(await service.markAllNotificationsRead(req.auth));
  });

  return router;
}

export function createIssuesRouter({ database, authService, clock }) {
  const router = Router();
  const service = createOperationsService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    if (!authService) return next();
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.post('/', validate(issueCreateSchema), async (req, res) => {
    res.status(201).json(await service.createIssueReport(req.auth, req.validated.body, req.id));
  });

  router.get('/me', validate(issueQuerySchema, 'query'), async (req, res) => {
    res.json(await service.listUserIssues(req.auth, req.validated.query));
  });

  return router;
}

export function createAdminOperationsRouter({ database, authService, clock }) {
  const router = Router();
  const service = createOperationsService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    if (!authService) return next();
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.get('/issues', validate(issueQuerySchema, 'query'), async (req, res) => {
    res.json(await service.listAdminIssues(req.auth, req.validated.query));
  });

  router.patch(
    '/issues/:id',
    validate(issueParamsSchema, 'params'),
    validate(issueReviewSchema),
    async (req, res) => {
      res.json(
        await service.reviewAdminIssue(
          req.auth,
          req.validated.params.id,
          req.validated.body,
          req.id,
        ),
      );
    },
  );

  router.get('/audit-logs', validate(auditLogQuerySchema, 'query'), async (req, res) => {
    res.json(await service.listAdminAuditLogs(req.auth, req.validated.query));
  });

  return router;
}

export function createOfflineManifestRouter({ database, authService, clock }) {
  const router = Router();
  const service = createOperationsService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    if (!authService) return next();
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.get(
    '/:id/manifest',
    validate(itineraryParamsSchema, 'params'),
    async (req, res) => {
      res.json(await service.getItineraryOfflineManifest(req.auth, req.validated.params.id));
    },
  );

  return router;
}
