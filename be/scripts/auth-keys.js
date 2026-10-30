import { generateKeyPairSync } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const directory = process.argv[2] || fileURLToPath(new URL('../.local/auth/', import.meta.url));
mkdirSync(directory, { recursive: true, mode: 0o700 });
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
// Exclusive creation: existing keys are never overwritten.
writeFileSync(join(directory, 'private.pem'), privateKey, { flag: 'wx', mode: 0o600 });
writeFileSync(join(directory, 'public.pem'), publicKey, { flag: 'wx', mode: 0o644 });
console.log('Local RSA keys created. Configure AUTH_KEY_ID and AUTH_PRIVATE_KEY_FILE; keep private.pem outside Git.');
