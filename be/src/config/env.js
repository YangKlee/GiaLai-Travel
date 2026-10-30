import { z } from 'zod';

const integer = (fallback, min, max) => z.coerce.number().int().min(min).max(max).default(fallback);
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: integer(3000, 1, 65535),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173').transform((value) => value.split(',').map((origin) => origin.trim()))
    .pipe(z.array(z.url().refine((value) => /^https?:\/\/[^/]+$/.test(value), 'Use an HTTP(S) origin without a path')).min(1)),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  TRUST_PROXY_HOPS: integer(0, 0, 5),
  DB_HOST: z.string().trim().min(1),
  DB_PORT: integer(3306, 1, 65535),
  DB_NAME: z.string().trim().min(1),
  DB_USER: z.string().trim().min(1),
  DB_PASSWORD: z.string(),
  DB_CONNECTION_LIMIT: integer(5, 1, 50),
  DB_CONNECT_TIMEOUT_MS: integer(10000, 100, 60000),
  DB_QUERY_TIMEOUT_MS: integer(10000, 100, 60000),
  DB_SSL: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  DB_SSL_CA: z.string().min(1).optional(),
  SERVE_STATIC: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  STATIC_DIR: z.string().min(1).optional(),
}).superRefine((env, ctx) => {
  const localDevelopment = env.NODE_ENV !== 'production' &&
    ['localhost', '127.0.0.1', '::1'].includes(env.DB_HOST);
  if (!env.DB_PASSWORD && !localDevelopment) {
    ctx.addIssue({ code: 'custom', path: ['DB_PASSWORD'], message: 'A password is required outside local development/test' });
  }
});

export function loadConfig(environment = process.env) {
  const result = schema.safeParse(environment);
  if (!result.success) {
    const fields = [...new Set(result.error.issues.map((issue) => issue.path.join('.')))];
    throw new Error(`Invalid environment configuration: ${fields.join(', ')}`);
  }
  const env = result.data;
  if (env.DB_SSL_CA && !env.DB_SSL) throw new Error('DB_SSL_CA requires DB_SSL=true');
  return Object.freeze({
    nodeEnv: env.NODE_ENV, port: env.PORT, clientOrigins: env.CLIENT_ORIGIN,
    logLevel: env.LOG_LEVEL, trustProxyHops: env.TRUST_PROXY_HOPS,
    serveStatic: env.SERVE_STATIC, staticDir: env.STATIC_DIR,
    database: Object.freeze({
      host: env.DB_HOST, port: env.DB_PORT, database: env.DB_NAME,
      user: env.DB_USER, password: env.DB_PASSWORD,
      connectionLimit: env.DB_CONNECTION_LIMIT, connectTimeout: env.DB_CONNECT_TIMEOUT_MS,
      queryTimeout: env.DB_QUERY_TIMEOUT_MS, ssl: env.DB_SSL, sslCaPath: env.DB_SSL_CA,
    }),
  });
}
