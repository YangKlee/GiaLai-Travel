import { z } from 'zod';
import { guidSchema } from '../../shared/identifiers.js';

export const TRANSPORT_MODES = [
  'MOTORBIKE',
  'CAR',
  'TAXI',
  'BUS',
  'WALK',
  'MIXED',
];

export const originSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    label: z.string().trim().max(255).optional(),
  })
  .strict();

export const preferencesSchema = z
  .object({
    categories: z
      .array(z.enum(['NATURE', 'CULTURE', 'FOOD', 'STAY', 'ADVENTURE', 'OTHER']))
      .optional(),
    pace: z.enum(['RELAXED', 'BALANCED', 'FAST']).default('BALANCED').optional(),
    dietaryNotes: z.union([z.string().trim().max(500), z.null()]).optional(),
  })
  .strict()
  .optional();

export const proposalInputSchema = z
  .object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD'),
    daysCount: z.coerce.number().int().min(1, 'Số ngày tối thiểu là 1').max(14, 'Số ngày tối đa là 14'),
    partySize: z.coerce.number().int().min(1, 'Số lượng khách tối thiểu là 1').max(50, 'Số lượng khách tối đa là 50'),
    totalBudgetVnd: z.union([
      z.string().regex(/^(0|[1-9]\d{0,19})$/, 'Ngân sách phải là số nguyên dương hợp lệ'),
      z.number().int().min(0),
    ]),
    origin: originSchema,
    transportMode: z.enum(TRANSPORT_MODES).default('MOTORBIKE'),
    preferences: preferencesSchema,
  })
  .strict();

const itineraryStopSchema = z
  .object({
    id: guidSchema.optional(),
    placeId: guidSchema,
    placeTitle: z.string().optional(),
    contentRevisionId: z.union([guidSchema, z.null()]).optional(),
    eventId: z.union([guidSchema, z.null()]).optional(),
    sequenceNo: z.number().int().min(1),
    arrivesAt: z.string().datetime(),
    departsAt: z.string().datetime(),
    estimatedCostVnd: z.union([z.string().regex(/^\d+$/), z.number().int().min(0)]).default(0),
    note: z.union([z.string().trim().max(1000), z.null()]).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (new Date(data.departsAt) <= new Date(data.arrivesAt)) {
      ctx.addIssue({
        code: 'custom',
        path: ['departsAt'],
        message: 'Thời gian rời đi phải sau thời gian đến.',
      });
    }
  });

const itineraryLegSchema = z
  .object({
    id: guidSchema.optional(),
    fromStopId: z.union([guidSchema, z.null()]).optional(),
    toStopId: guidSchema.optional(),
    fromStopSequence: z.union([z.number().int(), z.null()]).optional(),
    toStopSequence: z.number().int().min(1).optional(),
    distanceMeters: z.number().int().min(0),
    durationSeconds: z.number().int().min(0),
    transportMode: z.string().max(30),
    provider: z.string().max(80).default('haversine-engine'),
    sourceReference: z.string().max(1000).default('Ước tính khoảng cách trắc địa'),
    estimatedCostVnd: z.union([z.string().regex(/^\d+$/), z.number().int().min(0)]).default(0),
  })
  .strict();

const itineraryDaySchema = z
  .object({
    id: guidSchema.optional(),
    dayNumber: z.number().int().min(1),
    travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    stops: z.array(itineraryStopSchema),
    legs: z.array(itineraryLegSchema).default([]),
  })
  .strict();

export const revalidateSchema = proposalInputSchema
  .extend({
    days: z.array(itineraryDaySchema).min(1, 'Lịch trình phải có ít nhất 1 ngày'),
  })
  .strict();

export const createItinerarySchema = z
  .object({
    name: z.string().trim().min(2, 'Tên chuyến đi tối thiểu 2 ký tự').max(255),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    daysCount: z.coerce.number().int().min(1).max(14),
    partySize: z.coerce.number().int().min(1).max(50),
    totalBudgetVnd: z.union([z.string().regex(/^\d+$/), z.number().int().min(0)]),
    origin: originSchema,
    transportMode: z.enum(TRANSPORT_MODES),
    preferences: preferencesSchema,
    aiRequestId: z.union([guidSchema, z.null()]).optional(),
    days: z.array(itineraryDaySchema).min(1),
  })
  .strict();

export const updateRevisionSchema = z
  .object({
    baseLockVersion: z.number().int().min(0),
    name: z.string().trim().min(2).max(255).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    daysCount: z.coerce.number().int().min(1).max(14),
    partySize: z.coerce.number().int().min(1).max(50),
    totalBudgetVnd: z.union([z.string().regex(/^\d+$/), z.number().int().min(0)]),
    origin: originSchema,
    transportMode: z.enum(TRANSPORT_MODES),
    preferences: preferencesSchema,
    aiRequestId: z.union([guidSchema, z.null()]).optional(),
    days: z.array(itineraryDaySchema).min(1),
  })
  .strict();

export const renameItinerarySchema = z
  .object({
    name: z.string().trim().min(2, 'Tên chuyến đi tối thiểu 2 ký tự').max(255),
  })
  .strict();

export const addEventToItinerarySchema = z
  .object({
    dayNumber: z.number().int().min(1),
    eventId: guidSchema,
    arrivesAt: z.string().datetime(),
    departsAt: z.string().datetime(),
    note: z.string().trim().max(1000).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (new Date(data.departsAt) <= new Date(data.arrivesAt)) {
      ctx.addIssue({
        code: 'custom',
        path: ['departsAt'],
        message: 'Thời gian kết thúc tham gia sự kiện phải sau thời gian bắt đầu.',
      });
    }
  });

export const itineraryParamsSchema = z.object({
  id: guidSchema,
});
