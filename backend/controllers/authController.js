/**
 * Authentication HTTP handlers — login and /me.
 */
import { issueAuthToken, normalizeRole, verifyPassword } from '../../auth/auth_service.js';
import { findUserByEmail } from '../models/User.js';
import { config } from '../config/env.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      const e = new Error('email and password required');
      e.statusCode = 400;
      throw e;
    }
    const user = findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      const e = new Error('Invalid credentials');
      e.statusCode = 401;
      throw e;
    }
    const token = issueAuthToken(user, config.jwtSecret, config.jwtExpiresIn);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: normalizeRole(user.role),
        departmentId: user.departmentId,
        name: user.name,
        initials: user.initials,
        departmentLabel: user.departmentLabel || user.departmentId,
        managerId: user.managerId ?? null,
        trustScore: user.trustScore ?? 80,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    res.json({ user: req.user });
  } catch (e) {
    next(e);
  }
}
