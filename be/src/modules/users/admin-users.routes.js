import { Router } from 'express';
import { AppError } from '../../shared/app-error.js';
import { validate } from '../../shared/validation.js';
import { adminUserCreateSchema, adminUserParamsSchema, adminUserQuerySchema, adminUserUpdateSchema } from './admin-users.schema.js';
import { createAdminUsersService } from './admin-users.service.js';

export function createAdminUsersRouter({ database, authService, clock }) {
  const router = Router();
  const service = createAdminUsersService(database, { clock });
  router.use(async (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    req.auth = await authService.authenticate(req.get('authorization'));
    if (!req.auth.roles.includes('ADMIN')) throw new AppError(403, 'FORBIDDEN', 'Bạn không có quyền quản trị người dùng.');
    next();
  });
  router.get('/', validate(adminUserQuerySchema, 'query'), async (req, res) => res.json(await service.list(req.auth, req.validated.query)));
  router.post('/', validate(adminUserCreateSchema), async (req, res) => res.status(201).json(await service.create(req.auth, req.validated.body, req.requestId)));
  router.get('/:id', validate(adminUserParamsSchema, 'params'), async (req, res) => res.json(await service.get(req.auth, req.validated.params.id)));
  router.put('/:id', validate(adminUserParamsSchema, 'params'), validate(adminUserUpdateSchema), async (req, res) => res.json(await service.update(req.auth, req.validated.params.id, req.validated.body, req.requestId)));
  router.delete('/:id', validate(adminUserParamsSchema, 'params'), async (req, res) => res.json(await service.delete(req.auth, req.validated.params.id, req.requestId)));
  return router;
}
