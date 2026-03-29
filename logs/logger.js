/**
 * Lightweight structured logger for SentinelX services.
 * Swap implementation with Winston/Pino without changing call sites.
 */

const LEVELS = ['debug', 'info', 'warn', 'error'];

function format(level, message, meta = {}) {
  return JSON.stringify({
    ts: new Date().toISOString(),
    service: process.env.SERVICE_NAME || 'sentinelx',
    level,
    message,
    ...meta,
  });
}

export function createLogger(scope = 'app') {
  const withScope = (meta) => ({ scope, ...meta });

  return {
    debug: (message, meta = {}) => {
      if (LEVELS.indexOf(process.env.LOG_LEVEL || 'info') <= 0) {
        // eslint-disable-next-line no-console
        console.debug(format('debug', message, withScope(meta)));
      }
    },
    info: (message, meta = {}) => {
      // eslint-disable-next-line no-console
      console.log(format('info', message, withScope(meta)));
    },
    warn: (message, meta = {}) => {
      // eslint-disable-next-line no-console
      console.warn(format('warn', message, withScope(meta)));
    },
    error: (message, meta = {}) => {
      // eslint-disable-next-line no-console
      console.error(format('error', message, withScope(meta)));
    },
  };
}

export const logger = createLogger('core');
