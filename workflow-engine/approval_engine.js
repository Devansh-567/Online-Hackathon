/**
 * Builds and advances multi-step approval chains (manager → finance → exec).
 */
import { evaluateRules } from './rules_engine.js';
import { computeEscalationTier } from './escalation_logic.js';

const STEPS = {
  MANAGER: 'MANAGER_REVIEW',
  FINANCE: 'FINANCE_REVIEW',
  EXEC: 'EXEC_APPROVAL',
};

export function buildInitialWorkflow(expense, submitterRole) {
  const ruleResult = evaluateRules(expense);
  const escalation = computeEscalationTier({
    amountBase: expense.amountBase,
    riskScore: expense.riskScore || 0,
    departmentLevel: expense.departmentLevel || 1,
  });

  if (ruleResult.final.action === 'AUTO_APPROVE') {
    return {
      status: 'APPROVED',
      currentStep: null,
      history: [{ at: new Date().toISOString(), by: 'system', action: 'AUTO_APPROVED', detail: ruleResult.final.reasons }],
      ruleResult,
      escalation,
    };
  }

  const steps = [STEPS.MANAGER];
  if (escalation.tier >= 2) steps.push(STEPS.FINANCE);
  if (escalation.tier >= 3) steps.push(STEPS.EXEC);

  return {
    status: 'PENDING',
    currentStep: steps[0],
    pendingSteps: steps,
    history: [
      {
        at: new Date().toISOString(),
        by: submitterRole,
        action: 'SUBMITTED',
        detail: ruleResult.final.reasons.length ? ruleResult.final.reasons : ['Queued for review'],
      },
    ],
    ruleResult,
    escalation,
  };
}

export function advanceWorkflow(workflow, { actorId, action, comment }) {
  const history = [...workflow.history, { at: new Date().toISOString(), by: actorId, action, comment }];
  if (action === 'REJECT') {
    return { ...workflow, status: 'REJECTED', currentStep: null, history };
  }

  const pending = [...(workflow.pendingSteps || [])];
  const idx = pending.indexOf(workflow.currentStep);
  const next = pending[idx + 1];

  if (!next) {
    return { ...workflow, status: 'APPROVED', currentStep: null, history };
  }

  return { ...workflow, currentStep: next, history };
}
