/**
 * Smoke tests for RBAC and workflow helpers (no running server required).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { hasPermission, ROLES } from '../auth/role_manager.js';
import { evaluateRules } from '../workflow-engine/rules_engine.js';

test('admin has wildcard permission', () => {
  assert.equal(hasPermission(ROLES.ADMIN, 'expense:approve'), true);
});

test('employee cannot approve', () => {
  assert.equal(hasPermission(ROLES.EMPLOYEE, 'expense:approve'), false);
});

test('rules engine escalates high risk', () => {
  const { final } = evaluateRules({ amountBase: 100, category: 'MEALS', riskScore: 80, flags: [] });
  assert.equal(final.action, 'ESCALATE');
});
