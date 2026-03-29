/**
 * High-level authentication service: password hashing, token minting.
 * Imported by backend controllers; isolates bcrypt/jwt details.
 */
import bcrypt from 'bcryptjs';
import { signToken } from './jwt_handler.js';
import { ROLES } from './role_manager.js';

export async function hashPassword(plain, rounds = 10) {
  return bcrypt.hash(plain, rounds);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * @param {object} user - { id, email, role, departmentId }
 * @param {string} jwtSecret
 * @param {string} expiresIn
 */
export function issueAuthToken(user, jwtSecret, expiresIn) {
  return signToken(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    },
    jwtSecret,
    { expiresIn },
  );
}

export function normalizeRole(role) {
  const r = String(role || '').toUpperCase();
  if (r === ROLES.ADMIN || r === ROLES.EXECUTIVE || r === ROLES.MANAGER || r === ROLES.EMPLOYEE) return r;
  return ROLES.EMPLOYEE;
}
