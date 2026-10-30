import { z } from 'zod';
import { guidSchema } from '../../shared/identifiers.js';
import { paginationSchema } from '../../shared/pagination.js';

export const ALLOWED_MIME_BY_TYPE = Object.freeze({
  IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  AUDIO: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg'],
  DOCUMENT: ['application/pdf'],
});

const safeStorageKeySchema = z
  .string()
  .trim()
  .min(3, 'Đường dẫn lưu trữ tối thiểu 3 ký tự.')
  .max(500, 'Đường dẫn lưu trữ tối đa 500 ký tự.')
  .refine(
    (val) =>
      !val.includes('..') &&
      !val.includes('\\') &&
      !val.startsWith('/') &&
      !/\.(exe|js|mjs|cjs|sh|bat|cmd|ps1|php|html|htm|svg)$/i.test(val),
    'Đường dẫn tệp không hợp lệ hoặc chứa phần mở rộng bị cấm.',
  );

export const mediaCreateSchema = z
  .object({
    mediaType: z.enum(['IMAGE', 'AUDIO', 'DOCUMENT']),
    mimeType: z.string().trim().min(3).max(100),
    storageKey: safeStorageKeySchema,
    byteSize: z.coerce.number().int().min(1).max(25_000_000).optional(),
    sha256Hex: z
      .string()
      .trim()
      .regex(/^[0-9a-fA-F]{64}$/, 'SHA-256 phải gồm 64 ký tự hex.')
      .optional(),
    contentBase64: z.string().max(35_000_000).optional(),
    sourceReference: z.string().trim().min(3, 'Nguồn tài nguyên là bắt buộc.').max(1000),
    licenseNote: z.string().trim().min(3, 'Ghi chú bản quyền là bắt buộc.').max(2000),
    offlineAllowed: z.boolean().default(false),
  })
  .strict()
  .superRefine((data, ctx) => {
    const allowedMimes = ALLOWED_MIME_BY_TYPE[data.mediaType] ?? [];
    if (!allowedMimes.includes(data.mimeType)) {
      ctx.addIssue({
        code: 'custom',
        path: ['mimeType'],
        message: `Định dạng MIME không hợp lệ cho ${data.mediaType}.`,
      });
    }
    if (!data.contentBase64 && (!data.byteSize || !data.sha256Hex)) {
      ctx.addIssue({
        code: 'custom',
        path: ['contentBase64'],
        message: 'Cần cung cấp nội dung tệp (contentBase64) hoặc cặp byteSize + sha256Hex.',
      });
    }
  });

const openingHourSchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    opensAt: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
    closesAt: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
    crossesMidnight: z.boolean().default(false),
  })
  .strict();

const serviceSlotInputSchema = z
  .object({
    id: guidSchema.optional(),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    capacity: z.number().int().min(1).max(10000),
  })
  .strict();

export const contentQuerySchema = paginationSchema
  .extend({
    kind: z
      .enum(['PLACE', 'ARTICLE', 'AUDIO', 'EVENT', 'PARTNER', 'SERVICE', 'JRAI_PHRASE'])
      .optional(),
    visibility: z.enum(['DRAFT', 'PUBLIC', 'HIDDEN']).optional(),
  })
  .strict();

export const contentParamsSchema = z.object({ id: guidSchema });

export const revisionParamsSchema = z.object({
  id: guidSchema,
  revisionId: guidSchema,
});

export const contentCreateSchema = z
  .object({
    kind: z.enum(['PLACE', 'ARTICLE', 'AUDIO', 'EVENT', 'PARTNER', 'SERVICE']),
    title: z.string().trim().min(2, 'Tiêu đề tối thiểu 2 ký tự.').max(255),
    body: z.string().trim().min(2, 'Nội dung mô tả tối thiểu 2 ký tự.').max(50000),
    transcript: z.union([z.string().trim().max(50000), z.null()]).optional(),
    audioAssetId: z.union([guidSchema, z.null()]).optional(),
    sourceReference: z.union([z.string().trim().max(1000), z.null()]).optional(),
    submitImmediately: z.boolean().default(false),
    payload: z.record(z.string(), z.unknown()).default({}),
  })
  .strict()
  .superRefine((data, ctx) => {
    validateKindPayload(data.kind, data.payload, ctx);
  });

export const revisionCreateSchema = z
  .object({
    title: z.string().trim().min(2, 'Tiêu đề tối thiểu 2 ký tự.').max(255),
    body: z.string().trim().min(2, 'Nội dung mô tả tối thiểu 2 ký tự.').max(50000),
    transcript: z.union([z.string().trim().max(50000), z.null()]).optional(),
    audioAssetId: z.union([guidSchema, z.null()]).optional(),
    sourceReference: z.union([z.string().trim().max(1000), z.null()]).optional(),
    submitImmediately: z.boolean().default(false),
    payload: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export const revisionReviewSchema = z
  .object({
    decision: z.enum(['APPROVE', 'REJECT']),
    rejectionReason: z.string().trim().max(2000).optional(),
    sourceReference: z.string().trim().max(1000).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.decision === 'REJECT' && (!data.rejectionReason || data.rejectionReason.length < 3)) {
      ctx.addIssue({
        code: 'custom',
        path: ['rejectionReason'],
        message: 'Lý do từ chối tối thiểu 3 ký tự.',
      });
    }
  });

export const visibilityUpdateSchema = z
  .object({
    visibility: z.enum(['DRAFT', 'PUBLIC', 'HIDDEN']),
  })
  .strict();

export const placeClosureCreateSchema = z
  .object({
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    reason: z.string().trim().min(3).max(1000),
    sourceReference: z.string().trim().min(3).max(1000),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (new Date(data.endsAt) <= new Date(data.startsAt)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endsAt'],
        message: 'Thời điểm kết thúc đóng cửa phải sau thời điểm bắt đầu.',
      });
    }
  });

const placePayloadSchema = z.object({
  regionId: guidSchema,
  category: z.enum(['NATURE', 'CULTURE', 'FOOD', 'STAY', 'ADVENTURE', 'OTHER']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  referencePriceVnd: z
    .union([z.string().regex(/^(0|[1-9]\d{0,19})$/), z.number().int().min(0), z.null()])
    .optional(),
  typicalDurationMinutes: z.union([z.number().int().min(1).max(1440), z.null()]).optional(),
  openingHours: z.array(openingHourSchema).optional(),
});

const audioPayloadSchema = z.object({
  placeId: guidSchema,
  premiumOnly: z.boolean().optional(),
  audioUrl: z.string().max(2000).optional(),
});

const eventPayloadSchema = z
  .object({
    placeId: guidSchema,
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    eventStatus: z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED']).default('SCHEDULED'),
  })
  .superRefine((val, ctx) => {
    if (new Date(val.endsAt) <= new Date(val.startsAt)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endsAt'],
        message: 'Thời gian kết thúc sự kiện phải sau thời gian bắt đầu.',
      });
    }
  });

const partnerPayloadSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']).default('ACTIVE'),
  contactEmail: z.union([z.string().email().max(254), z.null()]).optional(),
  contactPhone: z.union([z.string().max(32), z.null()]).optional(),
});

const servicePayloadSchema = z.object({
  partnerId: guidSchema,
  placeId: z.union([guidSchema, z.null()]).optional(),
  serviceType: z.enum(['HOMESTAY', 'EXPERIENCE', 'GUIDE', 'RENTAL', 'OTHER']),
  priceUnit: z.string().trim().min(1).max(80),
  unitPriceVnd: z.union([z.string().regex(/^(0|[1-9]\d{0,19})$/), z.number().int().min(0)]),
  active: z.boolean().default(true),
  slots: z.array(serviceSlotInputSchema).optional(),
});

export function validateKindPayload(kind, payload, ctx) {
  const schemaMap = {
    PLACE: placePayloadSchema,
    AUDIO: audioPayloadSchema,
    EVENT: eventPayloadSchema,
    PARTNER: partnerPayloadSchema,
    SERVICE: servicePayloadSchema,
  };
  const targetSchema = schemaMap[kind];
  if (!targetSchema) return;
  const parsed = targetSchema.safeParse(payload);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      ctx.addIssue({
        code: 'custom',
        path: ['payload', ...issue.path],
        message: issue.message,
      });
    }
  }
}
