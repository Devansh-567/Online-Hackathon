/**
 * Tracks persisted workflow snapshots per expense (optional adjunct to expense.workflow JSON).
 */

const steps = new Map(); // expenseId -> latest snapshot

export function saveWorkflowSnapshot(expenseId, workflow) {
  steps.set(expenseId, { ...workflow, savedAt: new Date().toISOString() });
  return steps.get(expenseId);
}

export function getWorkflowSnapshot(expenseId) {
  return steps.get(expenseId) || null;
}
