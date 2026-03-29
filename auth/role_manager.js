/**
 * Role-based access control (RBAC) primitives.
 * Roles: ADMIN, EXECUTIVE, MANAGER, EMPLOYEE — extend via ROLE_PERMISSIONS map.
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  EXECUTIVE: 'EXECUTIVE',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

/** Maps role -> list of permission strings checked by middleware. */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.EXECUTIVE]: [
    'expense:create',
    'expense:read:team',
    'expense:approve',
    'expense:reject',
    'report:team',
    'user:read:team',
  ],
  [ROLES.MANAGER]: [
    'expense:create',
    'expense:read:team',
    'expense:approve',
    'expense:reject',
    'report:team',
    'user:read:team',
  ],
  [ROLES.EMPLOYEE]: ['expense:create', 'expense:read:own', 'expense:update:own'],
};

export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function assertPermission(role, permission) {
  if (!hasPermission(role, permission)) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
}
