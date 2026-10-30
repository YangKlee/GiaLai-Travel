import { generateKeyPairSync } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function generateAuthKeyFiles(directory) {
  const privatePath = join(directory, 'private.pem'); const publicPath = join(directory, 'public.pem');
  if (existsSync(privatePath) || existsSync(publicPath)) throw new Error('AUTH_KEY_FILES_ALREADY_EXIST');
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
  writeFileSync(privatePath, privateKey, { flag: 'wx', mode: 0o600 });
  writeFileSync(publicPath, publicKey, { flag: 'wx', mode: 0o644 });
  return { privatePath, publicPath };
}
