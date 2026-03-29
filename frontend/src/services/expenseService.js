/** Typed-ish API wrappers for expenses and approvals. */

import { api } from './api.js';

export async function fetchExpenses(params = {}) {
  const { data } = await api.get('/expenses', { params });
  return data;
}

export async function fetchExpense(id) {
  const { data } = await api.get(`/expenses/${id}`);
  return data;
}

export async function createExpense(payload) {
  const { data } = await api.post('/expenses', payload);
  return data;
}

export async function updateExpense(id, patch) {
  const { data } = await api.patch(`/expenses/${id}`, patch);
  return data;
}

export async function deleteExpense(id) {
  await api.delete(`/expenses/${id}`);
}

export async function decideExpense(id, action, comment) {
  const { data } = await api.post(`/expenses/${id}/approve`, { action, comment });
  return data;
}
