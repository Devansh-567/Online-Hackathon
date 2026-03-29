/**
 * JWT bearer authentication — attaches req.user on success.
 */
import { verifyToken } from '../../auth/jwt_handler.js';
import { config } from '../config/env.js';
import { findUserById } from '../models/User.js';

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      const e = new Error('Unauthorized');
      e.statusCode = 401;
      throw e;
    }
    const payload = verifyToken(token, config.jwtSecret);
    const user = findUserById(payload.sub);
    if (!user) {
      const e = new Error('Unauthorized');
      e.statusCode = 401;
      throw e;
    }
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
      recentRejections: user.recentRejections ?? 0,
      name: user.name,
      initials: user.initials,
      departmentLabel: user.departmentLabel || user.departmentId,
      managerId: user.managerId ?? null,
      trustScore: user.trustScore ?? 80,
    };
    req.jwt = payload;
    next();
  } catch (e) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    next(err);
  }
}
