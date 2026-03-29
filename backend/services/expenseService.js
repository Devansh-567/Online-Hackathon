/**
 * Core expense domain logic: scoring, normalization, workflow kickoff.
 */
import { v4 as uuid } from 'uuid';
import { convertToBase } from '../../integrations/currency_api.js';
import { attachOcrToExpense } from '../../integrations/ocr_service.js';
import { buildInitialWorkflow } from '../../workflow-engine/approval_engine.js';
import * as ExpenseModel from '../models/Expense.js';
import * as ApprovalStep from '../models/ApprovalStep.js';
import { ROLES } from '../../auth/role_manager.js';

function basicFraudFlags(expense) {
  const flags = [];
  if (expense.amountBase > 8000 && expense.category === 'MEALS') flags.push('AMOUNT_CATEGORY_MISMATCH');
  if (expense.merchant && /test|fake|xxx/i.test(expense.merchant)) flags.push('SUSPICIOUS_MERCHANT');
  if ((expense.ocr?.structured?.confidence || 1) < 0.5) flags.push('LOW_OCR_CONFIDENCE');
  return flags;
}

export function computeRiskScore(expense) {
  let score = 10;
  score += Math.min(40, Math.floor(expense.amountBase / 250));
  score += expense.flags?.length * 8 || 0;
  if (expense.category === 'TRAVEL') score += 5;
  return Math.min(99, score);
}

export function computeTrustScore(userMeta) {
  let t = 70;
  if (userMeta.role === ROLES.MANAGER) t += 10;
  if (userMeta.role === ROLES.ADMIN) t += 5;
  t -= (userMeta.recentRejections || 0) * 5;
  return Math.max(20, Math.min(99, t));
}

export async function createExpenseFromPayload(body, submitter) {
  const amountBase = convertToBase(body.amount, body.currency || 'USD', 'USD');
  let expense = {
    id: uuid(),
    title: body.title,
    category: body.category,
    amount: body.amount,
    currency: body.currency || 'USD',
    amountBase,
    merchant: body.merchant,
    description: body.description || '',
    submitterId: submitter.id,
    departmentId: submitter.departmentId,
    status: 'DRAFT',
    flags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (body.receiptMeta) {
    expense = await attachOcrToExpense(expense, body.receiptMeta);
  }

  expense.flags = [...new Set([...basicFraudFlags(expense), ...(body.flags || [])])];
  expense.riskScore = computeRiskTrustAdjustedRisk(expense, submitter);
  expense.trustScore = computeTrustScore({
    role: submitter.role,
    recentRejections: submitter.recentRejections || 0,
  });
  expense.workflow = buildInitialWorkflow(expense, submitter.role);
  expense.status = expense.workflow.status === 'APPROVED' ? 'APPROVED' : 'PENDING';

  ExpenseModel.createExpense(expense);
  ApprovalStep.saveWorkflowSnapshot(expense.id, expense.workflow);
  return expense;
}

function computeRiskTrustAdjustedRisk(expense, submitter) {
  const base = computeRiskScore(expense);
  const trust = computeTrustScore({
    role: submitter.role,
    recentRejections: submitter.recentRejections || 0,
  });
  const adjusted = base - Math.floor((trust - 50) / 10);
  return Math.max(5, Math.min(99, adjusted));
}

export function getExpense(id) {
  return ExpenseModel.getExpense(id);
}

export function listForUser(user) {
  if (user.role === ROLES.ADMIN || user.role === ROLES.EXECUTIVE) return ExpenseModel.listExpenses();
  if (user.role === ROLES.MANAGER) {
    return ExpenseModel.listExpenses().filter((e) => e.departmentId === user.departmentId);
  }
  return ExpenseModel.listExpenses({ submitterId: user.id });
}

export function updateExpense(id, patch, user) {
  const cur = ExpenseModel.getExpense(id);
  if (!cur) return null;
  if (user.role === ROLES.EMPLOYEE && cur.submitterId !== user.id) {
    const e = new Error('Forbidden');
    e.statusCode = 403;
    throw e;
  }
  if (cur.status !== 'DRAFT' && user.role === ROLES.EMPLOYEE) {
    const e = new Error('Only draft expenses editable by employee');
    e.statusCode = 400;
    throw e;
  }
  return ExpenseModel.updateExpense(id, patch);
}

export function removeExpense(id, user) {
  const cur = ExpenseModel.getExpense(id);
  if (!cur) return false;
  if (user.role !== ROLES.ADMIN && cur.submitterId !== user.id) {
    const e = new Error('Forbidden');
    e.statusCode = 403;
    throw e;
  }
  return ExpenseModel.deleteExpense(id);
}
