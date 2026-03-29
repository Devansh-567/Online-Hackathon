/**
 * User admin endpoints (simplified for demo seed users).
 */
import { listUsers } from '../models/User.js';
import { ROLES } from '../../auth/role_manager.js';

export async function list(req, res, next) {
  try {
    if (
      req.user.role !== ROLES.ADMIN &&
      req.user.role !== ROLES.EXECUTIVE &&
      req.user.role !== ROLES.MANAGER
    ) {
      const e = new Error('Forbidden');
      e.statusCode = 403;
      throw e;
    }
    res.json({ data: listUsers() });
  } catch (e) {
    next(e);
  }
}
