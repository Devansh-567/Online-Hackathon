/**
 * JWT issue/verify helpers used by backend and auth_service.
 * Keeps signing options in one place for consistency.
 */
import jwt from 'jsonwebtoken';

export function signToken(payload, secret, options = {}) {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: options.expiresIn || '8h',
    issuer: 'sentinelx',
    audience: 'sentinelx-clients',
  });
}

export function verifyToken(token, secret) {
  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer: 'sentinelx',
    audience: 'sentinelx-clients',
  });
}

export function decodeTokenUnsafe(token) {
  return jwt.decode(token, { complete: true });
}
