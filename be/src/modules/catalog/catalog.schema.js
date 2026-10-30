import { z } from 'zod';
import { paginationSchema } from '../../shared/pagination.js';
import { guidSchema } from '../../shared/identifiers.js';

export const categoryNames = Object.freeze({
  NATURE: 'Thiên nhiên', CULTURE: 'Văn hóa', FOOD: 'Ẩm thực',
  STAY: 'Lưu trú', ADVENTURE: 'Trải nghiệm', OTHER: 'Khác',
});
const price = z.string().regex(/^(0|[1-9]\d{0,19})$/, 'Nhập số nguyên VND không âm.')
  .pipe(z.string().refine((value) => BigInt(value) <= 18446744073709551615n, 'Giá vượt giới hạn.'));

export const placeQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(120).default(''),
  category: z.enum(Object.keys(categoryNames)).optional(),
  regionId: guidSchema.optional(),
  minPrice: price.optional(), maxPrice: price.optional(),
  sort: z.enum(['name', 'price-asc']).default('name'),
}).strict().superRefine((query, ctx) => {
  if (price.safeParse(query.minPrice).success && price.safeParse(query.maxPrice).success && BigInt(query.minPrice) > BigInt(query.maxPrice)) {
    ctx.addIssue({ code: 'custom', path: ['maxPrice'], message: 'Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu.' });
  }
});

export const placeParamsSchema = z.object({ id: guidSchema });
