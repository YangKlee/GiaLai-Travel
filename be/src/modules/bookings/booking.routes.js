import { Router } from 'express';
import { validate } from '../../shared/validation.js';
import {
  bookingCancelSchema,
  bookingCreateSchema,
  bookingParamsSchema,
  bookingQuerySchema,
  bookingQuoteSchema,
  bookingReviewSchema,
  paymentAttemptSchema,
} from './booking.schema.js';
import { createBookingService } from './booking.service.js';

export function createBookingsRouter({ database, authService, clock }) {
  const router = Router();
  const service = createBookingService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.post('/booking-quotes', validate(bookingQuoteSchema), async (req, res) => {
    res.json(await service.quoteBooking(req.validated.body));
  });

  router.post(
    '/bookings',
    validate(bookingCreateSchema),
    async (req, res, next) => {
      try {
        const auth = await authService.authenticate(req.get('authorization'));
        res.status(201).json(await service.createBooking(auth, req.validated.body, req.id));
      } catch (err) {
        next(err);
      }
    },
  );

  router.post(
    '/bookings/:id/payment-attempts',
    validate(bookingParamsSchema, 'params'),
    validate(paymentAttemptSchema),
    async (req, res, next) => {
      try {
        const auth = await authService.authenticate(req.get('authorization'));
        res.json(
          await service.recordPaymentAttempt(
            auth,
            req.validated.params.id,
            req.validated.body,
            req.id,
          ),
        );
      } catch (err) {
        next(err);
      }
    },
  );

  router.post(
    '/bookings/:id/cancel',
    validate(bookingParamsSchema, 'params'),
    validate(bookingCancelSchema),
    async (req, res, next) => {
      try {
        const auth = await authService.authenticate(req.get('authorization'));
        res.json(
          await service.cancelBooking(
            auth,
            req.validated.params.id,
            req.validated.body,
            req.id,
          ),
        );
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
}

export function createMyBookingsRouter({ database, authService, clock }) {
  const router = Router();
  const service = createBookingService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    if (!authService) return next();
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.get('/', validate(bookingQuerySchema, 'query'), async (req, res) => {
    res.json(await service.listMyBookings(req.auth, req.validated.query));
  });

  router.get('/:id', validate(bookingParamsSchema, 'params'), async (req, res) => {
    res.json(await service.getMyBooking(req.auth, req.validated.params.id));
  });

  return router;
}

export function createAdminBookingsRouter({ database, authService, clock }) {
  const router = Router();
  const service = createBookingService(database, { clock });

  router.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  router.use(async (req, _res, next) => {
    if (!authService) return next();
    req.auth = await authService.authenticate(req.get('authorization'));
    next();
  });

  router.get('/', validate(bookingQuerySchema, 'query'), async (req, res) => {
    res.json(await service.listAdminBookings(req.auth, req.validated.query));
  });

  router.post(
    '/:id/review',
    validate(bookingParamsSchema, 'params'),
    validate(bookingReviewSchema),
    async (req, res) => {
      res.json(
        await service.reviewBooking(
          req.auth,
          req.validated.params.id,
          req.validated.body,
          req.id,
        ),
      );
    },
  );

  router.post(
    '/:id/complete',
    validate(bookingParamsSchema, 'params'),
    async (req, res) => {
      res.json(
        await service.completeBooking(req.auth, req.validated.params.id, req.id),
      );
    },
  );

  return router;
}
