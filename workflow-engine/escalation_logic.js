/**
 * Determines escalation target and SLA based on amount, risk, and org depth.
 */

export function computeEscalationTier({ amountBase, riskScore, departmentLevel = 1 }) {
  let tier = 1;
  const reasons = [];

  if (amountBase > 5000) {
    tier = Math.max(tier, 3);
    reasons.push('Amount exceeds L3 threshold');
  } else if (amountBase > 1500) {
    tier = Math.max(tier, 2);
    reasons.push('Amount exceeds L2 threshold');
  }

  if (riskScore >= 85) {
    tier = Math.max(tier, 3);
    reasons.push('Critical fraud/risk signals');
  } else if (riskScore >= 70) {
    tier = Math.max(tier, 2);
    reasons.push('Elevated risk score');
  }

  if (departmentLevel >= 4 && tier < 2) {
    tier = 2;
    reasons.push('Deep org unit — financial controller review');
  }

  const slaHours = tier >= 3 ? 4 : tier === 2 ? 24 : 72;
  return { tier, slaHours, reasons };
}
