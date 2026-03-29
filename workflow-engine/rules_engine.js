/**
 * Declarative rule evaluation for expense auto-actions.
 * Rules return { action: 'AUTO_APPROVE'|'FLAG'|'ESCALATE', reasons: string[] }.
 */

export const DEFAULT_RULES = [
  {
    id: 'small_amount',
    when: (expense) => expense.amountBase <= 50 && expense.category !== 'TRAVEL',
    then: () => ({ action: 'AUTO_APPROVE', reasons: ['Under policy micro-threshold'] }),
  },
  {
    id: 'weekend_travel',
    when: (expense) => expense.category === 'TRAVEL' && expense.flags?.includes('WEEKEND_SUBMIT'),
    then: () => ({ action: 'FLAG', reasons: ['Travel submitted on weekend — manual review'] }),
  },
  {
    id: 'high_risk_score',
    when: (expense) => (expense.riskScore || 0) >= 75,
    then: () => ({ action: 'ESCALATE', reasons: ['Risk score exceeds escalation threshold'] }),
  },
];

export function evaluateRules(expense, rules = DEFAULT_RULES) {
  const applied = [];
  let final = { action: 'NONE', reasons: [] };

  for (const rule of rules) {
    try {
      if (rule.when(expense)) {
        const outcome = rule.then(expense);
        applied.push({ ruleId: rule.id, ...outcome });
        // Escalation wins; then FLAG; AUTO_APPROVE only if nothing stronger
        if (outcome.action === 'ESCALATE') final = outcome;
        else if (outcome.action === 'FLAG' && final.action !== 'ESCALATE') final = outcome;
        else if (outcome.action === 'AUTO_APPROVE' && final.action === 'NONE') final = outcome;
      }
    } catch (e) {
      applied.push({ ruleId: rule.id, error: String(e.message || e) });
    }
  }

  return { final, applied };
}
