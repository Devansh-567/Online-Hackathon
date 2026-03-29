/** Application-wide constants for roles and API paths. */

export const ROLES = {
  ADMIN: 'ADMIN',
  EXECUTIVE: 'EXECUTIVE',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

export const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

export const EXPENSE_CATEGORIES = ['MEALS', 'TRAVEL', 'SOFTWARE', 'OTHER', 'CONFERENCE', 'HOTEL'];

/** Maps API role to prototype nav bucket key. */
export function apiRoleToNavKey(role) {
  const r = String(role || '').toUpperCase();
  if (r === ROLES.ADMIN) return 'admin';
  if (r === ROLES.EXECUTIVE) return 'executive';
  if (r === ROLES.MANAGER) return 'manager';
  return 'employee';
}

export const DEFAULT_PAGE_BY_NAV = {
  admin: 'admin-dashboard',
  executive: 'exec-overview',
  manager: 'mgr-dashboard',
  employee: 'emp-home',
};

/** Demo credentials per role tab (matches backend seed). */
export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@sentinelx.in', password: 'password123' },
  executive: { email: 'sunita@sentinelx.in', password: 'password123' },
  manager: { email: 'vikram@sentinelx.in', password: 'password123' },
  employee: { email: 'priya@sentinelx.in', password: 'password123' },
};
