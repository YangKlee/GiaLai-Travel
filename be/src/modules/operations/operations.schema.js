import { z } from 'zod';
import { guidSchema } from '../../shared/identifiers.js';
import { paginationSchema } from '../../shared/pagination.js';

export const notificationQuerySchema = paginationSchema
  .extend({
    unreadOnly: z.coerce.boolean().optional(),
  })
  .strict();

export const notificationParamsSchema = z.object({
  id: guidSchema,
});

export const ISSUE_CATEGORIES = [
  'INACCURATE_INFO',
  'CLOSED_DOWN',
  'INAPPROPRIATE',
  'OUTDATED_PRICE',
  'OTHER',
];

export const ISSUE_STATUSES = [
  'NEW',
  'PROCESSING',
  'ACCEPTED',
  'REJECTED',
  'CLOSED',
];

export const issueCreateSchema = z
  .object({
    contentId: guidSchema,
    category: z.enum(ISSUE_CATEGORIES),
    description: z
      .string()
      .trim()
      .min(5, 'Mô tả vấn đề tối thiểu 5 ký tự')
      .max(2000, 'Mô tả vấn đề tối đa 2000 ký tự'),
  })
  .strict();

export const issueQuerySchema = paginationSchema
  .extend({
    status: z.enum(ISSUE_STATUSES).optional(),
    category: z.enum(ISSUE_CATEGORIES).optional(),
    contentId: guidSchema.optional(),
  })
  .strict();

export const issueParamsSchema = z.object({
  id: guidSchema,
});

export const issueReviewSchema = z
  .object({
    status: z.enum(ISSUE_STATUSES),
    response: z.string().trim().max(2000).optional(),
    duplicateOf: guidSchema.optional(),
  })
  .strict();

export const auditLogQuerySchema = paginationSchema
  .extend({
    targetType: z.string().trim().max(50).optional(),
    targetId: guidSchema.optional(),
    action: z.string().trim().max(60).optional(),
    result: z.enum(['SUCCESS', 'FAILURE']).optional(),
  })
  .strict();
