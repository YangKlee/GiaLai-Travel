import { z } from 'zod';
import { displayNameSchema, emailSchema, passwordSchema } from '../../shared/credentials.js';
import { guidSchema } from '../../shared/identifiers.js';
import { paginationSchema } from '../../shared/pagination.js';
import { profileUpdateSchema } from './users.schema.js';

export const adminUserRoles = ['TOURIST', 'ADMIN', 'PARTNER', 'B2G', 'CONTRIBUTOR'];
export const adminUserQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(150).optional(),
  status: z.enum(['ACTIVE', 'LOCKED']).optional(),
  role: z.enum(adminUserRoles).optional(),
}).strict();
export const adminUserParamsSchema = z.object({ id: guidSchema }).strict();
const fields = {
  email: emailSchema,
  displayName: displayNameSchema,
  phone: profileUpdateSchema.shape.phone,
  roles: z.array(z.enum(adminUserRoles)).min(1).max(5).transform(values => [...new Set(values)]),
  status: z.enum(['ACTIVE', 'LOCKED']),
};
export const adminUserCreateSchema = z.object({ ...fields, password: passwordSchema }).strict();
export const adminUserUpdateSchema = z.object({ ...fields, password: passwordSchema.optional() }).strict();
