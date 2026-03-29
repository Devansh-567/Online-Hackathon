/**
 * Express centralized error handler — maps statusCode on Error instances.
 */
import { createLogger } from '../../logs/logger.js';

const log = createLogger('http');

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  if (status >= 500) log.error('unhandled_error', { message: err.message, path: req.path });
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
