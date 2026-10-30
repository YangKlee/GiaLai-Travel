import { z } from 'zod';
import { paginationSchema } from '../../shared/pagination.js';
import { guidSchema } from '../../shared/identifiers.js';

export const categoryNames = Object.freeze({
  NATURE: 'Thiên nhiên',
  CULTURE: 'Văn hóa',
  FOOD: 'Ẩm thực',
  STAY: 'Lưu trú',
  ADVENTURE: 'Trải nghiệm',
  OTHER: 'Khác',
});

export const serviceTypeNames = Object.freeze({
  HOMESTAY: 'Lưu trú Homestay',
  EXPERIENCE: 'Trải nghiệm bản địa',
  GUIDE: 'Hướng dẫn viên',
  RENTAL: 'Thuê phương tiện',
  OTHER: 'Dịch vụ khác',
});

const price = z
  .string()
  .regex(/^(0|[1-9]\d{0,19})$/, 'Nhập số nguyên VND không âm.')
  .pipe(
    z.string().refine((value) => BigInt(value) <= 18446744073709551615n, 'Giá vượt giới hạn.'),
  );

export const placeQuerySchema = paginationSchema
  .extend({
    q: z.string().trim().max(120).default(''),
    category: z.enum(Object.keys(categoryNames)).optional(),
    regionId: guidSchema.optional(),
    minPrice: price.optional(),
    maxPrice: price.optional(),
    sort: z.enum(['name', 'price-asc']).default('name'),
  })
  .strict()
  .superRefine((query, ctx) => {
    if (
      price.safeParse(query.minPrice).success &&
      price.safeParse(query.maxPrice).success &&
      BigInt(query.minPrice) > BigInt(query.maxPrice)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['maxPrice'],
        message: 'Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu.',
      });
    }
  });

export const placeParamsSchema = z.object({ id: guidSchema });

export const eventQuerySchema = paginationSchema
  .extend({
    q: z.string().trim().max(120).default(''),
    placeId: guidSchema.optional(),
    regionId: guidSchema.optional(),
    status: z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED']).optional(),
  })
  .strict();

export const eventParamsSchema = z.object({ id: guidSchema });

export const serviceQuerySchema = paginationSchema
  .extend({
    q: z.string().trim().max(120).default(''),
    placeId: guidSchema.optional(),
    serviceType: z.enum(Object.keys(serviceTypeNames)).optional(),
  })
  .strict();

export const serviceParamsSchema = z.object({ id: guidSchema });
