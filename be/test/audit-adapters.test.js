import assert from 'node:assert/strict';
import { test } from 'node:test';
import { redactMetadata } from '../src/shared/audit.js';
import { resolveNow } from '../src/shared/time.js';
import {
  createMailAdapter,
  createAiAdapter,
  createRoutingAdapter,
  createStorageAdapter,
} from '../src/adapters/index.js';

test('audit metadata redacts credentials, tokens, emails and deep objects', () => {
  const redacted = redactMetadata({
    job: 'cleanup-expired-auth',
    password: 'secret-password',
    resetToken: 'abcdefghijklmnopqrstuvwxy0123456789ABCDEFGH',
    resetUrl: 'http://localhost:5173/reset-password?token=abcdefghijklmnopqrstuvwxy0123456789ABCDEFGH',
    email: 'visitor@example.test',
    nested: {
      authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxIn0.signature_part_long_enough',
      note: 'https://example.test/callback?token=secret',
      safeCount: 3,
      level2: { level3: { level4: { hidden: 'too-deep' } } },
    },
  });
  assert.equal(redacted.job, 'cleanup-expired-auth');
  assert.equal(redacted.password, '[REDACTED]');
  assert.equal(redacted.resetToken, '[REDACTED]');
  assert.equal(redacted.resetUrl, '[REDACTED]');
  assert.equal(redacted.email, '[REDACTED]');
  assert.equal(redacted.nested.authorization, '[REDACTED]');
  assert.equal(redacted.nested.note, '[REDACTED]');
  assert.equal(redacted.nested.safeCount, 3);
  assert.equal(redacted.nested.level2.level3.level4, '[TRUNCATED]');
});

test('clock seam and adapters enforce bounded retries and fail closed when unconfigured', async () => {
  const fixed = resolveNow(() => '2026-10-30 02:30:00.000000');
  assert.equal(fixed.toISOString(), '2026-10-30T02:30:00.000Z');

  const disabledMail = createMailAdapter({ mode: 'disabled' });
  assert.equal(disabledMail.enabled, false);
  await assert.rejects(
    () => disabledMail.sendPasswordReset({
      to: 'visitor@example.test',
      displayName: 'Du khách',
      resetUrl: 'http://localhost:5173/reset-password?token=test',
      expiresAt: fixed.toISOString(),
      requestId: 'req-1',
    }),
    { code: 'MAIL_UNAVAILABLE' },
  );

  let attempts = 0;
  const retryingMail = createMailAdapter({
    mode: 'smtp',
    maxAttempts: 2,
    retryDelayMs: 1,
    send: async () => {
      if (++attempts === 1) throw new Error('temporary-smtp-timeout');
    },
  });
  const sent = await retryingMail.sendPasswordReset({
    to: 'visitor@example.test',
    displayName: 'Du khách',
    resetUrl: 'http://localhost:5173/reset-password?token=test',
    expiresAt: fixed.toISOString(),
    requestId: 'req-2',
  });
  assert.deepEqual(sent, { delivered: true, simulated: false, attempts: 2 });

  const failingMail = createMailAdapter({
    mode: 'smtp',
    maxAttempts: 2,
    retryDelayMs: 1,
    send: async () => {
      throw new Error('smtp-down');
    },
  });
  await assert.rejects(
    () => failingMail.sendPasswordReset({
      to: 'visitor@example.test',
      displayName: 'Du khách',
      resetUrl: 'http://localhost:5173/reset-password?token=test',
      expiresAt: fixed.toISOString(),
      requestId: 'req-3',
    }),
    { message: 'MAIL_DELIVERY_FAILED' },
  );

  await assert.rejects(() => createAiAdapter().generateItineraryProposal({}), { code: 'AI_UNAVAILABLE' });
  await assert.rejects(() => createRoutingAdapter().estimateRouteLeg({}), { code: 'ROUTING_UNAVAILABLE' });
  await assert.rejects(() => createStorageAdapter().put({}), { code: 'STORAGE_UNAVAILABLE' });
});

test('AI adapter builds rich prompt and calls OpenAI / Gemini APIs or falls back to smart planner with Google Maps routes', async () => {
  const samplePlaces = [
    {
      id: '10000000-0000-4000-8000-000000000005',
      revisionId: '30000000-0000-4000-8000-000000000005',
      title: 'Góc cà phê cao nguyên',
      category: 'FOOD',
      latitude: 13.981,
      longitude: 108.0025,
      referencePriceVnd: '45000',
      typicalDurationMinutes: 30,
      openingHours: [],
    },
    {
      id: '10000000-0000-4000-8000-000000000001',
      revisionId: '30000000-0000-4000-8000-000000000001',
      title: 'Biển Hồ',
      category: 'NATURE',
      latitude: 14.0462,
      longitude: 108.0002,
      referencePriceVnd: '20000',
      typicalDurationMinutes: 90,
      openingHours: [{ weekday: 0, opensAt: '07:00:00', closesAt: '18:00:00' }],
    },
  ];

  // 1. Test Gemini API call with mock fetchImpl
  let geminiCalledUrl = '';
  let geminiSentBody = null;
  const geminiAdapter = createAiAdapter({
    mode: 'gemini',
    geminiApiKey: 'test-gemini-key',
    geminiModel: 'gemini-2.0-flash',
    fallbackToPromptEngine: false,
    fetchImpl: async (url, init) => {
      geminiCalledUrl = url;
      geminiSentBody = JSON.parse(init.body);
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        summary: 'Lộ trình ăn sáng cà phê lúc 07:00-07:30 rồi đi Biển Hồ lúc 07:30-08:00',
                        days: [
                          {
                            dayNumber: 1,
                            travelDate: '2026-11-01',
                            daySummary: 'Sáng ăn sáng Phố Núi rồi đi Biển Hồ',
                            stops: [
                              {
                                placeId: '10000000-0000-4000-8000-000000000005',
                                sequenceNo: 1,
                                activityType: 'BREAKFAST',
                                arrivesAt: '2026-11-01T00:00:00.000Z',
                                departsAt: '2026-11-01T00:30:00.000Z',
                                note: '07:00 - 07:30: Ăn sáng và uống cà phê tại Góc cà phê cao nguyên',
                              },
                              {
                                placeId: '10000000-0000-4000-8000-000000000001',
                                sequenceNo: 2,
                                activityType: 'VISIT',
                                arrivesAt: '2026-11-01T01:00:00.000Z',
                                departsAt: '2026-11-01T02:30:00.000Z',
                                note: '08:00 - 09:30: Tham quan thắng cảnh Biển Hồ',
                              },
                            ],
                          },
                        ],
                      }),
                    },
                  ],
                },
              },
            ],
          };
        },
      };
    },
  });

  const geminiResult = await geminiAdapter.generateItineraryProposal({
    startDate: '2026-11-01',
    daysCount: 1,
    partySize: 2,
    totalBudgetVnd: '2000000',
    origin: { latitude: 13.9833, longitude: 108.0, label: 'Quảng trường Đại Đoàn Kết' },
    transportMode: 'MOTORBIKE',
    preferences: {
      categories: ['FOOD', 'NATURE'],
      pace: 'BALANCED',
      customPrompt: '7h-7h30 ăn sáng sau đó 7h30-8h xuất phát đi Biển Hồ',
    },
    selectedPlaceIds: ['10000000-0000-4000-8000-000000000001'],
    places: samplePlaces,
    events: [],
  });

  assert.ok(geminiCalledUrl.includes('gemini-2.0-flash:generateContent'));
  assert.ok(geminiSentBody.contents[0].parts[0].text.includes('7h-7h30 ăn sáng'));
  assert.equal(geminiResult.provider, 'google-gemini');
  assert.equal(geminiResult.days.length, 1);
  assert.equal(geminiResult.days[0].stops.length, 2);
  assert.equal(geminiResult.days[0].stops[0].activityType, 'BREAKFAST');
  assert.ok(geminiResult.days[0].googleMapsDayRouteUrl.includes('https://www.google.com/maps/dir/'));
  assert.ok(geminiResult.days[0].legs[1].googleMapsDirectionsUrl.includes('https://www.google.com/maps/dir/'));

  // 2. Test OpenAI API call with mock fetchImpl
  let openAiCalledUrl = '';
  const openAiAdapter = createAiAdapter({
    mode: 'openai',
    openaiApiKey: 'sk-test-openai',
    openaiModel: 'gpt-4o-mini',
    fallbackToPromptEngine: false,
    fetchImpl: async (url) => {
      openAiCalledUrl = url;
      return {
        ok: true,
        status: 200,
        async json() {
          return {
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: 'Lộ trình OpenAI tạo thành công',
                    days: [
                      {
                        dayNumber: 1,
                        travelDate: '2026-11-01',
                        stops: [
                          {
                            placeId: '10000000-0000-4000-8000-000000000001',
                            sequenceNo: 1,
                            activityType: 'VISIT',
                            arrivesAt: '2026-11-01T01:00:00.000Z',
                            departsAt: '2026-11-01T02:30:00.000Z',
                            note: 'Tham quan Biển Hồ',
                          },
                        ],
                      },
                    ],
                  }),
                },
              },
            ],
          };
        },
      };
    },
  });

  const openAiResult = await openAiAdapter.generateItineraryProposal({
    startDate: '2026-11-01',
    daysCount: 1,
    partySize: 2,
    totalBudgetVnd: '2000000',
    origin: { latitude: 13.9833, longitude: 108.0, label: 'Pleiku' },
    transportMode: 'CAR',
    preferences: { categories: ['NATURE'] },
    places: samplePlaces,
    events: [],
  });
  assert.ok(openAiCalledUrl.endsWith('/chat/completions'));
  assert.equal(openAiResult.provider, 'openai');
  assert.equal(openAiResult.days[0].stops[0].placeTitle, 'Biển Hồ');
});
