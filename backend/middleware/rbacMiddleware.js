/**
 * Permission guard built on role_manager.
 */
import { assertPermission } from '../../auth/role_manager.js';

export function requirePermission(permission) {
  return (req, res, next) => {
    try {
      assertPermission(req.user.role, permission);
      next();
    } catch (e) {
      next(e);
    }
  };
}
