import pino from 'pino';

export function createLogger(level = 'info', destination) {
  return pino({
    level, base: { service: 'gialai-travel-api' },
    redact: {
      paths: ['password', 'token', 'accessToken', 'refreshToken', 'privateKey', 'secret', 'authorization', 'cookie', 'database.password',
        'config.database.password', 'req.headers.authorization', 'req.headers.cookie',
        'body.password', 'body.token', 'headers.set-cookie'],
      censor: '[REDACTED]',
    },
  }, destination);
}
