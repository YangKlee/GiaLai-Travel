import { Router } from 'express';
import { parse } from 'cookie';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { createHmac, randomBytes } from 'node:crypto';
import { z } from 'zod';
import {
  registrationSchema,
  emailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../shared/credentials.js';
import { validate } from '../../shared/validation.js';
import { AppError } from '../../shared/app-error.js';
import { createAuthService } from './auth.service.js';

export function createAuthRouter({ database, auth, mail, clock, logger, authService }) {
  const router = Router();
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  router.get('/status', (_req, res) => res.json({ data: { enabled: Boolean(auth) } }));
  if (!auth) {
    router.use((_req, _res, next) => next(new AppError(503, 'AUTH_UNAVAILABLE', 'Tính năng tài khoản chưa được bật trên máy chủ này.')));
    return router;
  }
  const service = authService || createAuthService(database, auth, { mail, clock, logger });
  const cookieName = auth.secure ? '__Secure-gialai_refresh' : 'gialai_refresh';
  const cookieOptions = { httpOnly: true, secure: auth.secure, sameSite: 'lax', path: '/api/v1/auth' };
  const cookieToken = (req) => parse(req.headers.cookie || '')[cookieName];
  const secret = randomBytes(32);
  const limit = (max, windowMs = 15 * 60_000, extra = {}) => rateLimit({ windowMs, limit: max,
    standardHeaders: 'draft-8', legacyHeaders: false, ...extra,
    handler: (_req, _res, next) => next(new AppError(429, 'AUTH_RATE_LIMITED', 'Bạn đã thử nhiều lần. Vui lòng đợi rồi thử lại.')),
  });
  const csrf = (req, _res, next) => {
    if (!auth.origins.includes(req.headers.origin) || req.get('X-CSRF-Protection') !== '1') return next(new AppError(403, 'CSRF_REJECTED', 'Yêu cầu tài khoản không hợp lệ. Hãy tải lại trang.'));
    next();
  };
  async function sendSession(res, result) {
    res.cookie(cookieName, result.refreshToken, { ...cookieOptions, expires: result.expiresAt });
    res.json({ data: result.data });
  }
  router.post('/register', csrf, limit(10, 3600_000), validate(registrationSchema), async (req, res) => res.status(201).json(await service.register(req.validated.body, req.requestId)));
  router.post('/login', csrf, limit(30), validate(z.object({ email: emailSchema, password: z.string().min(1).max(128) }).strict()),
    limit(5, 15 * 60_000, { skipSuccessfulRequests: true, keyGenerator: (req) => createHmac('sha256', secret).update(ipKeyGenerator(req.ip) + ':' + req.validated.body.email).digest('hex') }),
    async (req, res) => sendSession(res, await service.login(req.validated.body, req.requestId)));
  router.post('/refresh', csrf, limit(100), async (req, res) => {
    try { await sendSession(res, await service.refresh(cookieToken(req), req.requestId)); }
    catch (error) { if (error.status === 401) res.clearCookie(cookieName, cookieOptions); throw error; }
  });
  router.post('/logout', csrf, limit(100), async (req, res) => {
    await service.logout(cookieToken(req), req.requestId);
    res.clearCookie(cookieName, cookieOptions); res.status(204).end();
  });
  router.post('/forgot-password', csrf, limit(10), validate(forgotPasswordSchema),
    limit(5, 15 * 60_000, { keyGenerator: (req) => createHmac('sha256', secret).update('forgot:' + ipKeyGenerator(req.ip) + ':' + req.validated.body.email).digest('hex') }),
    async (req, res) => res.status(202).json(await service.forgotPassword(req.validated.body, req.requestId)));
  router.post('/reset-password', csrf, limit(15), validate(resetPasswordSchema), async (req, res) => {
    const result = await service.resetPassword(req.validated.body, req.requestId);
    res.clearCookie(cookieName, cookieOptions);
    res.status(200).json(result);
  });
  router.get('/me', async (req, res) => res.json(await service.me(req.get('authorization'))));
  return router;
}
