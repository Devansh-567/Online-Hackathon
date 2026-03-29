/**
 * Request validation helpers for expense and auth payloads.
 */

export function assertNonEmptyString(v, field) {
  if (typeof v !== 'string' || !v.trim()) {
    const e = new Error(`${field} is required`);
    e.statusCode = 400;
    throw e;
  }
}

export function parseMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) {
    const e = new Error('amount must be a non-negative number');
    e.statusCode = 400;
    throw e;
  }
  return Math.round(n * 100) / 100;
}

export function allowedCategories() {
  return ['MEALS', 'TRAVEL', 'SOFTWARE', 'OTHER', 'CONFERENCE', 'HOTEL'];
}
