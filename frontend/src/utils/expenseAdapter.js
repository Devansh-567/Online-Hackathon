/**
 * Maps API expenses + user directory into prototype UI rows (Indian locale display).
 */

export function formatInr(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

export function uiStatus(apiStatus, riskScore) {
  const s = String(apiStatus || '').toUpperCase();
  if (s === 'REJECTED') return 'rejected';
  if (s === 'APPROVED') return 'approved';
  if (riskScore >= 65 && s === 'PENDING') return 'flagged';
  if (s === 'PENDING') return 'pending';
  return 'pending';
}

/** @param {object} exp - API expense */
/** @param {Map<string,object>|Record<string,object>} userById */
export function toUiExpense(exp, userById) {
  const submitter = userById[exp.submitterId];
  return {
    raw: exp,
    id: exp.referenceId || exp.id,
    internalId: exp.id,
    empId: exp.submitterId,
    empName: submitter?.name || submitter?.email || '—',
    dept: exp.departmentLabel || exp.departmentId || '—',
    cat: exp.category,
    vendor: exp.merchant || exp.title,
    amount: exp.amount,
    currency: exp.currency || 'INR',
    date: exp.dateDisplay || exp.createdAt?.slice?.(0, 10) || '—',
    submitted: exp.submittedTime || '',
    status: uiStatus(exp.status, exp.riskScore),
    risk: Math.round(exp.riskScore || 0),
    flags: exp.flags || [],
    note: exp.description || '',
  };
}

export function buildUserMap(users) {
  const m = {};
  for (const u of users || []) m[u.id] = u;
  return m;
}
