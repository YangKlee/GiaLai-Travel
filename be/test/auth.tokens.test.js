import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateKeyPairSync, randomUUID } from 'node:crypto';
import { SignJWT } from 'jose';
import { createTokens } from '../src/modules/auth/auth.tokens.js';

export function tokenFixture() {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  return { privateKey, publicKeys: new Map([['test-key', publicKey]]), kid: 'test-key', issuer: 'integration-api', audience: 'integration-web',
    secure: false, origins: ['http://localhost:5173', 'http://127.0.0.1:5173'], accessSeconds: 900, sessionMilliseconds: 7 * 86400_000 };
}

test('JWT accepts only correct keys, header and complete bounded claims', async () => {
  const config = tokenFixture(); const service = createTokens(config);
  const userId = randomUUID(); const sessionId = randomUUID(); const now = new Date();
  const valid = await service.issue(userId, sessionId, now, new Date(now.getTime() + 7 * 86400_000));
  assert.deepEqual(await service.verify(valid.accessToken), { userId, sessionId });
  const claims = { sub: userId, sid: sessionId, jti: randomUUID(), iss: config.issuer, aud: config.audience,
    iat: Math.floor(now / 1000), exp: Math.floor(now / 1000) + 900 };
  for (const change of [
    { payload: { ...claims, iss: 'wrong' } }, { payload: { ...claims, aud: 'wrong' } },
    { payload: { ...claims, sid: 'wrong' } }, { payload: { ...claims, iat: claims.iat + 1000, exp: claims.exp + 1000 } },
    { payload: { ...claims, exp: claims.exp + 1 } }, { header: { typ: 'JWT' } },
    { header: { kid: 'unknown' } }, { header: { jku: 'https://example.test/keys' } },
  ]) {
    const token = await new SignJWT(change.payload || claims).setProtectedHeader({ alg: 'RS256', typ: 'at+jwt', kid: config.kid, ...change.header }).sign(config.privateKey);
    await assert.rejects(service.verify(token), (error) => error.status === 401 && error.code === 'INVALID_ACCESS_TOKEN');
  }
  const expired = await new SignJWT({ ...claims, iat: claims.iat - 1000, exp: claims.iat - 1 }).setProtectedHeader({ alg: 'RS256', typ: 'at+jwt', kid: config.kid }).sign(config.privateKey);
  await assert.rejects(service.verify(expired), (error) => error.code === 'ACCESS_TOKEN_EXPIRED');
  await assert.rejects(service.verify('not.a.jwt'), (error) => error.status === 401);
});
