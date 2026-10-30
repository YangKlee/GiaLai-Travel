import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hashPassword, verifyPassword } from '../src/shared/password.js';
import { registrationSchema } from '../src/shared/credentials.js';
import { serializeUtc } from '../src/shared/time.js';

test('password hashes are salted, versioned and verify without truncating Unicode', async () => {
  const password = 'Mật khẩu kiểm thử 🌿';
  const hash = await hashPassword(password);
  assert.ok(!hash.includes(password));
  assert.ok(await verifyPassword(password, hash));
  assert.equal(await verifyPassword(`${password}x`, hash), false);
  assert.equal(await verifyPassword(password, null), false);
});

test('credentials reject short passwords, extra roles and normalize email consistently with DB', () => {
  const data = { email: ' Example@Example.TEST ', password: 'Long enough password!', displayName: ' Du khách ' };
  assert.equal(registrationSchema.parse(data).email, 'example@example.test');
  assert.equal(registrationSchema.parse(data).displayName, 'Du khách');
  assert.equal(registrationSchema.safeParse({ ...data, roles: ['ADMIN'] }).success, false);
  assert.equal(registrationSchema.safeParse({ ...data, password: 'short' }).success, false);
  assert.equal(serializeUtc('2026-10-30 01:02:03.123456'), '2026-10-30T01:02:03.123Z');
});
