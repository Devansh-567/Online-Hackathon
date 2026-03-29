/**
 * In-memory expenses store with CRUD helpers.
 */

const expenses = new Map();

export function createExpense(expense) {
  expenses.set(expense.id, expense);
  return expense;
}

export function updateExpense(id, patch) {
  const cur = expenses.get(id);
  if (!cur) return null;
  const next = { ...cur, ...patch, updatedAt: new Date().toISOString() };
  expenses.set(id, next);
  return next;
}

export function getExpense(id) {
  return expenses.get(id) || null;
}

export function deleteExpense(id) {
  return expenses.delete(id);
}

export function listExpenses(filter = {}) {
  let rows = [...expenses.values()];
  if (filter.submitterId) rows = rows.filter((e) => e.submitterId === filter.submitterId);
  if (filter.status) rows = rows.filter((e) => e.status === filter.status);
  return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function seedExpenses(list) {
  list.forEach((e) => expenses.set(e.id, e));
}
