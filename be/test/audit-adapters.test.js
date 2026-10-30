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
