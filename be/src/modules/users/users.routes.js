import { Router } from 'express';
import { AppError } from '../../shared/app-error.js';
import { validate } from '../../shared/validation.js';
import { createAuthService } from '../auth/auth.service.js';
import {
  consentDecisionSchema,
  preferencesUpdateSchema,
  profileUpdateSchema,
} from './users.schema.js';
import { createUsersService } from './users.service.js';
import {
  privacyRequestCreateSchema,
  privacyRequestIdParamSchema,
} from '../privacy/privacy.schema.js';
import { createPrivacyService } from '../privacy/privacy.service.js';

export function createUsersRouter({ database, auth, mail, clock, logger, authService }) {
  const router = Router();
  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  if (!auth) {
    router.use((_req, _res, next) =>
      next(
        new AppError(
          503,
          'AUTH_UNAVAILABLE',
          'Tính năng tài khoản chưa được bật trên máy chủ này.',
        ),
      ),
    );
    return router;
  }

  const authenticator = authService || createAuthService(database, auth, { mail, clock, logger });
  const usersService = createUsersService(database, { clock });
  const privacyService = createPrivacyService(database, { clock });

  router.use(async (req, _res, next) => {
    req.auth = await authenticator.authenticate(req.get('authorization'));
    next();
  });

  router.get('/profile', async (req, res) =>
    res.json(await usersService.getProfile(req.auth.user.id)),
  );
  router.patch('/profile', validate(profileUpdateSchema), async (req, res) =>
    res.json(await usersService.updateProfile(req.auth.user.id, req.validated.body, req.requestId)),
  );
  router.get('/preferences', async (req, res) =>
    res.json(await usersService.getPreferences(req.auth.user.id)),
  );
  router.put('/preferences', validate(preferencesUpdateSchema), async (req, res) =>
    res.json(
      await usersService.updatePreferences(req.auth.user.id, req.validated.body, req.requestId),
    ),
  );
  router.get('/consents', async (req, res) =>
    res.json(await usersService.getConsents(req.auth.user.id)),
  );
  router.post('/consents', validate(consentDecisionSchema), async (req, res) =>
    res
      .status(201)
      .json(await usersService.recordConsent(req.auth.user.id, req.validated.body, req.requestId)),
  );
  router.get('/privacy-requests', async (req, res) =>
    res.json(await privacyService.listRequests(req.auth.user.id)),
  );
  router.post('/privacy-requests', validate(privacyRequestCreateSchema), async (req, res) =>
    res
      .status(201)
      .json(
        await privacyService.createRequest(req.auth.user.id, req.validated.body, req.requestId),
      ),
  );
  router.get(
    '/privacy-requests/:id/export',
    validate(privacyRequestIdParamSchema, 'params'),
    async (req, res) =>
      res.json(
        await privacyService.exportData(req.auth.user.id, req.validated.params.id, req.requestId),
      ),
  );

  return router;
}
