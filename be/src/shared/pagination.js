import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1_000_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export function paginationMeta({ page, pageSize }, total) {
  if (!Number.isSafeInteger(total) || total < 0) throw new TypeError('Total must be a non-negative safe integer');
  return { page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
}
