import { createPrivateKey, createPublicKey } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { z } from 'zod';

export function loadAuthConfig(config, environment = process.env) {
  const enabled = z.enum(['true', 'false']).default('false').safeParse(environment.AUTH_ENABLED);
  if (!enabled.success) throw new Error('Invalid auth configuration: AUTH_ENABLED');
  if (enabled.data !== 'true') return undefined;
  const result = z.object({
    AUTH_KEY_ID: z.string().regex(/^[A-Za-z0-9_-]{1,80}$/),
    AUTH_PRIVATE_KEY_FILE: z.string().min(1),
    AUTH_ISSUER: z.string().min(1).max(200).default('gialai-travel-api'),
    AUTH_AUDIENCE: z.string().min(1).max(200).default('gialai-travel-web'),
    AUTH_COOKIE_SECURE: z.enum(['true', 'false']).optional(),
  }).safeParse(environment);
  if (!result.success) throw new Error('Invalid auth configuration: ' + result.error.issues.map((issue) => issue.path.join('.')).join(', '));
  const env = result.data;
  const secure = env.AUTH_COOKIE_SECURE === undefined ? config.nodeEnv === 'production' : env.AUTH_COOKIE_SECURE === 'true';
  if (config.nodeEnv === 'production' && !secure) throw new Error('AUTH_COOKIE_SECURE is required in production');
  try {
    const privateKey = createPrivateKey(readFileSync(env.AUTH_PRIVATE_KEY_FILE));
    if (privateKey.asymmetricKeyType !== 'rsa' || privateKey.asymmetricKeyDetails.modulusLength < 2048) throw new Error('Invalid key');
    const publicKeys = new Map([[env.AUTH_KEY_ID, createPublicKey(privateKey)]]);
    if (environment.AUTH_PREVIOUS_PUBLIC_KEYS_FILE) {
      const previous = z.record(z.string().regex(/^[A-Za-z0-9_-]{1,80}$/), z.string()).parse(JSON.parse(readFileSync(environment.AUTH_PREVIOUS_PUBLIC_KEYS_FILE, 'utf8')));
      for (const [kid, pem] of Object.entries(previous)) {
        if (publicKeys.has(kid)) throw new Error('Duplicate key');
        const key = createPublicKey(pem);
        if (key.asymmetricKeyType !== 'rsa' || key.asymmetricKeyDetails.modulusLength < 2048) throw new Error('Invalid key');
        publicKeys.set(kid, key);
      }
    }
    return { privateKey, publicKeys, kid: env.AUTH_KEY_ID, issuer: env.AUTH_ISSUER, audience: env.AUTH_AUDIENCE,
      secure, origins: config.clientOrigins, accessSeconds: 900, sessionMilliseconds: 7 * 86400_000 };
  } catch { throw new Error('Invalid auth key files'); }
}
