import { z } from 'zod';
import { displayNameSchema } from '../../shared/credentials.js';

export const PREFERENCE_CATALOG = Object.freeze({
  categories: Object.freeze([
    { code: 'NATURE', name: 'Thiên nhiên & cảnh quan' },
    { code: 'CULTURE', name: 'Văn hóa & lịch sử' },
    { code: 'FOOD', name: 'Ẩm thực bản địa' },
    { code: 'STAY', name: 'Nghỉ dưỡng & lưu trú' },
    { code: 'ADVENTURE', name: 'Khám phá & trải nghiệm' },
    { code: 'OTHER', name: 'Khác' },
  ]),
  paces: Object.freeze([
    { code: 'RELAXED', name: 'Thong thả' },
    { code: 'BALANCED', name: 'Cân bằng' },
    { code: 'INTENSIVE', name: 'Nhiều điểm trong ngày' },
  ]),
  travelGroups: Object.freeze([
    { code: 'SOLO', name: 'Đi một mình' },
    { code: 'COUPLE', name: 'Cặp đôi' },
    { code: 'FAMILY', name: 'Gia đình' },
    { code: 'FRIENDS', name: 'Nhóm bạn' },
  ]),
});

export const CONSENT_POLICY_VERSION = '2026-10-v1';

export const CONSENT_PURPOSES = Object.freeze([
  {
    purpose: 'PERSONALIZATION',
    title: 'Cá nhân hóa đề xuất theo hành vi',
    description:
      'Cho phép sử dụng lịch sử tương tác cho gợi ý cá nhân hóa ở Giai đoạn 2. Giai đoạn 1 chưa thu thập sự kiện hành vi.',
    policyVersion: CONSENT_POLICY_VERSION,
  },
  {
    purpose: 'ADVERTISING',
    title: 'Quảng cáo phù hợp sở thích',
    description:
      'Cho phép cá nhân hóa nội dung tài trợ ở Giai đoạn 2. Khi chưa đồng ý, hệ thống chỉ hiển thị theo ngữ cảnh.',
    policyVersion: CONSENT_POLICY_VERSION,
  },
]);

const phoneSchema = z
  .union([z.string().trim().max(32, 'Số điện thoại tối đa 32 ký tự.'), z.null()])
  .optional()
  .transform((value) => (!value ? null : value))
  .refine(
    (value) => value === null || /^[0-9+\s()-]{8,20}$/.test(value),
    'Số điện thoại cần 8–20 ký tự số hợp lệ.',
  );

export const profileUpdateSchema = z
  .object({
    displayName: displayNameSchema,
    phone: phoneSchema,
  })
  .strict();

export const preferencesUpdateSchema = z
  .object({
    categories: z
      .array(z.enum(['NATURE', 'CULTURE', 'FOOD', 'STAY', 'ADVENTURE', 'OTHER']))
      .max(6, 'Chọn tối đa 6 nhóm sở thích.')
      .transform((items) => [...new Set(items)]),
    pace: z.enum(['RELAXED', 'BALANCED', 'INTENSIVE']),
    travelGroup: z.enum(['SOLO', 'COUPLE', 'FAMILY', 'FRIENDS']),
    dietaryNotes: z
      .union([z.string().trim().max(240, 'Ghi chú tối đa 240 ký tự.'), z.null()])
      .optional()
      .transform((value) => (!value ? null : value)),
  })
  .strict();

export const consentDecisionSchema = z
  .object({
    purpose: z.enum(['PERSONALIZATION', 'ADVERTISING']),
    granted: z.boolean(),
  })
  .strict();

export function normalizePreferences(raw) {
  const parsed = typeof raw === 'string' ? safeParseJson(raw) : raw;
  const candidate = parsed && typeof parsed === 'object' ? parsed : {};
  const validCategories = new Set(['NATURE', 'CULTURE', 'FOOD', 'STAY', 'ADVENTURE', 'OTHER']);
  const categories = Array.isArray(candidate.categories)
    ? [...new Set(candidate.categories.filter((code) => validCategories.has(code)))]
    : [];
  const pace = ['RELAXED', 'BALANCED', 'INTENSIVE'].includes(candidate.pace)
    ? candidate.pace
    : 'BALANCED';
  const travelGroup = ['SOLO', 'COUPLE', 'FAMILY', 'FRIENDS'].includes(candidate.travelGroup)
    ? candidate.travelGroup
    : 'SOLO';
  const dietaryNotes =
    typeof candidate.dietaryNotes === 'string' && candidate.dietaryNotes.trim().length > 0
      ? candidate.dietaryNotes.trim().slice(0, 240)
      : null;
  return { categories, pace, travelGroup, dietaryNotes };
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
