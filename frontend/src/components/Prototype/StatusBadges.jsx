import React from 'react';

export function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase();
  const map = {
    approved: ['sxp-badge-green', 'Approved'],
    pending: ['sxp-badge-amber', 'Pending'],
    rejected: ['sxp-badge-red', 'Rejected'],
    flagged: ['sxp-badge-red', 'Flagged'],
  };
  const [cls, label] = map[s] || ['sxp-badge-gray', status];
  return (
    <span className={`sxp-badge ${cls}`}>
      <span className="sxp-badge-dot" />
      {label}
    </span>
  );
}

export function RoleBadge({ role }) {
  const r = String(role || '').toLowerCase();
  const cls =
    r === 'admin'
      ? 'sxp-rb-admin'
      : r === 'executive'
        ? 'sxp-rb-executive'
        : r === 'manager'
          ? 'sxp-rb-manager'
          : 'sxp-rb-employee';
  return <span className={`sxp-role-badge ${cls}`}>{r}</span>;
}

export function riskColor(r) {
  if (r > 70) return 'var(--red-600)';
  if (r > 40) return 'var(--amber-600)';
  return 'var(--green-600)';
}
