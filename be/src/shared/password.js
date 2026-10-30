import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const options = Object.freeze({ N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
const prefix = 'scrypt$131072$8$1';
let dummy;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, 64, options);
  return `${prefix}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function verifyPassword(password, encoded) {
  if (typeof encoded !== 'string' || !/^scrypt\$131072\$8\$1\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{86}$/.test(encoded)) {
    // Missing account/unsupported stored hash still performs the same expensive KDF.
    dummy ??= hashPassword(randomBytes(32).toString('base64url'));
    await verifyPassword(password, await dummy);
    return false;
  }
  const parts = encoded.split('$');
  const actual = await derive(password, Buffer.from(parts[4], 'base64url'), 64, options);
  return timingSafeEqual(actual, Buffer.from(parts[5], 'base64url'));
}
