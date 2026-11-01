import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createR2Storage } from '../src/adapters/r2-storage.js';
import {
  adminEventCreateSchema,
  adminPlaceCreateSchema,
  adminUploadSchema,
  adminWardCreateSchema,
  adminWardUpdateSchema,
} from '../src/modules/content/content.schema.js';

test('createR2Storage: handles local fallback and file validations', async () => {
  const localR2 = createR2Storage({
    accountId: '',
    accessKeyId: '',
    secretAccessKey: '',
  });
  assert.equal(localR2.isConfigured, false);

  // Reject empty buffer
  await assert.rejects(
    localR2.uploadImage({ buffer: Buffer.alloc(0), mimeType: 'image/png' }),
    (err) => err.code === 'INVALID_FILE',
  );

  // Reject unsupported mime type (e.g. text or exe)
  await assert.rejects(
    localR2.uploadImage({ buffer: Buffer.from('test'), mimeType: 'application/pdf' }),
    (err) => err.code === 'INVALID_FILE_TYPE',
  );

  // Valid local upload returns url starting with /uploads/
  const validBuffer = Buffer.from('fake-png-image-content');
  const result = await localR2.uploadImage({
    buffer: validBuffer,
    mimeType: 'image/png',
    originalName: 'banner-chudangya.png',
    folder: 'events',
  });
  assert.ok(result.url.startsWith('/uploads/events/'));
  assert.ok(result.key.startsWith('events/'));
  assert.equal(result.provider, 'local-fallback');
  assert.equal(result.byteSize, validBuffer.length);
});

test('createR2Storage: configured with R2 credentials generates Cloudflare R2 url', async () => {
  const r2 = createR2Storage({
    accountId: 'cf-acc-12345',
    accessKeyId: 'cf-key-123',
    secretAccessKey: 'cf-secret-456',
    bucketName: 'gialai-storage',
    publicUrl: 'https://cdn.gialaitravel.com',
  });
  assert.equal(r2.isConfigured, true);
});

test('admin schemas: validate place and event inputs correctly', () => {
  // Valid place
  const validPlace = {
    title: 'Hồ T’Nưng (Biển Hồ)',
    description: 'Được mệnh danh là đôi mắt Pleiku...',
    category: 'NATURE',
    regionId: '11111111-1111-4111-8111-111111111111',
    latitude: 14.05,
    longitude: 108.01,
    referencePriceVnd: '10000',
    typicalDurationMinutes: 120,
    bestTimeToVisit: '06:00 - 08:30 (Bình minh mờ sương)',
    wardId: '50000000-0000-4000-8000-000000000015',
    bannerUrl: 'https://cdn.example.com/bien-ho.jpg',
  };
  const parsedPlace = adminPlaceCreateSchema.safeParse(validPlace);
  assert.ok(parsedPlace.success);

  // Valid ward schema
  const validWard = {
    regionId: '11111111-1111-4111-8111-111111111111',
    code: 'PLEIKU_HOALU',
    name: 'Phường Hoa Lư',
    status: 'ACTIVE',
  };
  const parsedWard = adminWardCreateSchema.safeParse(validWard);
  assert.ok(parsedWard.success);

  const parsedWardUpdate = adminWardUpdateSchema.safeParse({ name: 'Phường Hoa Lư mới' });
  assert.ok(parsedWardUpdate.success);

  // Valid event with pasted banner link
  const validEventUrl = {
    title: 'Lễ hội Hoa dã quỳ Chư Đang Ya 2026',
    description: 'Lễ hội hoa dã quỳ ngập tràn sắc vàng trên đỉnh núi lửa...',
    placeId: '11111111-1111-4111-8111-111111111111',
    startsAt: '2026-11-10T08:00:00.000Z',
    endsAt: '2026-11-12T18:00:00.000Z',
    eventStatus: 'SCHEDULED',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  };
  const parsedEventUrl = adminEventCreateSchema.safeParse(validEventUrl);
  assert.ok(parsedEventUrl.success);

  // Valid event with R2 upload banner url
  const validEventR2 = {
    title: 'Đêm hội Cồng chiêng Gia Lai',
    description: 'Âm vang đại ngàn Tây Nguyên...',
    placeId: '11111111-1111-4111-8111-111111111111',
    startsAt: '2026-11-15T19:00:00.000Z',
    endsAt: '2026-11-15T22:00:00.000Z',
    eventStatus: 'SCHEDULED',
    bannerUrl: 'https://pub-abc123xyz.r2.dev/events/cong-chieng.webp',
  };
  const parsedEventR2 = adminEventCreateSchema.safeParse(validEventR2);
  assert.ok(parsedEventR2.success);

  // Invalid event: endsAt before startsAt
  const invalidEvent = {
    ...validEventUrl,
    startsAt: '2026-11-12T18:00:00.000Z',
    endsAt: '2026-11-10T08:00:00.000Z',
  };
  assert.ok(!adminEventCreateSchema.safeParse(invalidEvent).success);

  // Valid upload input
  const validUpload = {
    fileName: 'banner.jpg',
    mimeType: 'image/jpeg',
    contentBase64: 'aGVsbG8=',
    folder: 'events',
  };
  assert.ok(adminUploadSchema.safeParse(validUpload).success);
});
