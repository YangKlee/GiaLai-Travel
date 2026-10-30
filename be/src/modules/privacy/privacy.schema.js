import { z } from 'zod';
import { guidSchema } from '../../shared/identifiers.js';

export const PRIVACY_SLA_DAYS = 7;
export const PRIVACY_SLA_MILLISECONDS = PRIVACY_SLA_DAYS * 86400_000;

export const privacyRequestCreateSchema = z
  .object({
    requestType: z.enum(['EXPORT', 'DELETE']),
    password: z
      .string()
      .min(1, 'Nhập mật khẩu hiện tại để xác minh chủ tài khoản.')
      .max(128, 'Mật khẩu tối đa 128 ký tự.'),
  })
  .strict();

export const privacyRequestIdParamSchema = z
  .object({
    id: guidSchema,
  })
  .strict();
