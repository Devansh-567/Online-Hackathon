/**
 * In-memory user repository — mirrors database/users table shape from schema.sql.
 */

const users = new Map();

export function seedUsers(list) {
  list.forEach((u) => users.set(u.id, { ...u }));
}

export function findUserByEmail(email) {
  const e = String(email || '').toLowerCase();
  return [...users.values()].find((u) => u.email.toLowerCase() === e) || null;
}

export function findUserById(id) {
  return users.get(id) || null;
}

export function listUsers() {
  return [...users.values()].map(sanitize);
}

function sanitize(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

export function createUser(user) {
  users.set(user.id, user);
  return sanitize(user);
}
