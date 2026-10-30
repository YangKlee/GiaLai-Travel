import { z } from 'zod';
import { guidSchema } from '../../shared/identifiers.js';
import { paginationSchema } from '../../shared/pagination.js';

export const BOOKING_STATUSES = [
  'CHO_DUYET',
  'CHO_THANH_TOAN',
  'DA_XAC_NHAN',
  'TU_CHOI',
  'HET_HAN',
  'DA_HUY',
  'HOAN_THANH',
];

export const bookingQuoteSchema = z
  .object({
    serviceId: guidSchema,
    slotId: guidSchema,
    quantity: z.coerce.number().int().min(1, 'Số lượng tối thiểu là 1').max(100),
  })
  .strict();

export const bookingCreateSchema = z
  .object({
    serviceId: guidSchema,
    slotId: guidSchema,
    quantity: z.coerce.number().int().min(1, 'Số lượng tối thiểu là 1').max(100),
    contactName: z.string().trim().min(2, 'Họ tên liên hệ tối thiểu 2 ký tự').max(150),
    contactEmail: z.union([z.string().trim().email('Email không đúng định dạng').max(254), z.null()]).optional(),
    contactPhone: z.union([z.string().trim().min(8, 'Số điện thoại tối thiểu 8 số').max(32), z.null()]).optional(),
    idempotencyKey: z
      .string()
      .trim()
      .min(8, 'Khóa chống lặp tối thiểu 8 ký tự')
      .max(64)
      .regex(/^[A-Za-z0-9_-]+$/, 'Khóa chống lặp chỉ chứa ký tự chữ cái, số, gạch ngang và gạch dưới'),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.contactEmail && !data.contactPhone) {
      ctx.addIssue({
        code: 'custom',
        path: ['contactEmail'],
        message: 'Cần cung cấp ít nhất một phương thức liên hệ (email hoặc số điện thoại).',
      });
    }
  });

export const bookingReviewSchema = z
  .object({
    decision: z.enum(['APPROVE', 'REJECT']),
    rejectionReason: z.string().trim().max(1000).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.decision === 'REJECT' && (!data.rejectionReason || data.rejectionReason.length < 3)) {
      ctx.addIssue({
        code: 'custom',
        path: ['rejectionReason'],
        message: 'Vui lòng cung cấp lý do từ chối (tối thiểu 3 ký tự).',
      });
    }
  });

export const paymentAttemptSchema = z
  .object({
    outcome: z.enum(['SUCCEEDED', 'FAILED', 'CANCELLED']),
    idempotencyKey: z
      .string()
      .trim()
      .min(8)
      .max(64)
      .regex(/^[A-Za-z0-9_-]+$/),
  })
  .strict();

export const bookingCancelSchema = z
  .object({
    reason: z.string().trim().max(1000).optional(),
  })
  .strict();

export const bookingParamsSchema = z.object({
  id: guidSchema,
});

export const bookingQuerySchema = paginationSchema
  .extend({
    status: z.enum(BOOKING_STATUSES).optional(),
  })
  .strict();
