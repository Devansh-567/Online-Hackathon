/**
 * HTTP request logging middleware.
 */
import { createLogger } from '../../logs/logger.js';

const log = createLogger('http');

export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    log.info('request', { method: req.method, path: req.originalUrl, status: res.statusCode, ms: Date.now() - start });
  });
  next();
}
