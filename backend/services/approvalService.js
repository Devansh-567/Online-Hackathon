/**
 * Approval transitions — integrates workflow engine and notifications.
 */
import { advanceWorkflow } from '../../workflow-engine/approval_engine.js';
import { enqueueEmail } from '../../notifications/email_service.js';
import { ROLES } from '../../auth/role_manager.js';
import * as ExpenseModel from '../models/Expense.js';
import * as ApprovalStep from '../models/ApprovalStep.js';

function canActOnStep(user, workflow) {
  if (user.role === ROLES.ADMIN) return true;
  if (workflow.currentStep === 'MANAGER_REVIEW' && user.role === ROLES.MANAGER) return true;
  if (
    workflow.currentStep === 'FINANCE_REVIEW' &&
    (user.role === ROLES.MANAGER || user.role === ROLES.ADMIN || user.role === ROLES.EXECUTIVE)
  )
    return true;
  if (workflow.currentStep === 'EXEC_APPROVAL' && (user.role === ROLES.ADMIN || user.role === ROLES.EXECUTIVE))
    return true;
  return false;
}

export function applyDecision(expenseId, user, { action, comment }) {
  const expense = ExpenseModel.getExpense(expenseId);
  if (!expense) {
    const e = new Error('Not found');
    e.statusCode = 404;
    throw e;
  }
  if (expense.status !== 'PENDING') {
    const e = new Error('Expense not pending');
    e.statusCode = 400;
    throw e;
  }
  if (!canActOnStep(user, expense.workflow)) {
    const e = new Error('Forbidden');
    e.statusCode = 403;
    throw e;
  }

  const nextWorkflow = advanceWorkflow(expense.workflow, {
    actorId: user.id,
    action,
    comment,
  });

  const nextStatus = nextWorkflow.status === 'APPROVED' ? 'APPROVED' : nextWorkflow.status === 'REJECTED' ? 'REJECTED' : 'PENDING';

  const updated = ExpenseModel.updateExpense(expenseId, {
    workflow: nextWorkflow,
    status: nextStatus,
  });

  ApprovalStep.saveWorkflowSnapshot(expenseId, nextWorkflow);

  enqueueEmail({
    to: user.email,
    subject: `Expense ${expenseId} ${action}`,
    text: `Decision ${action} for ${expense.title}. Comment: ${comment || 'n/a'}`,
  });

  return updated;
}
