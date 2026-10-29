import { performance } from 'node:perf_hooks';
import { randomUUID } from 'node:crypto';

export function requestContext(logger) {
  return (req, res, next) => {
    req.requestId = randomUUID();
    res.setHeader('X-Request-Id', req.requestId);
    const start = performance.now();
    res.on('finish', () => logger.info({
      requestId: req.requestId, method: req.method, statusCode: res.statusCode,
      durationMs: Math.round(performance.now() - start),
    }, 'request completed'));
    next();
  };
}
