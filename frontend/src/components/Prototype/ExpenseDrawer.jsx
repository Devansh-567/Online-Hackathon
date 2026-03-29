/**
 * Right-hand expense detail drawer — actions call API approvals.
 */
import React, { useState } from 'react';
import { decideExpense } from '../../services/expenseService.js';
import { formatInr } from '../../utils/expenseAdapter.js';
import { StatusBadge, riskColor } from './StatusBadges.jsx';
import { ROLES } from '../../utils/constants.js';

export function ExpenseDrawer({ drawer, onClose, user, userMap }) {
  const row = drawer?.row;
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState('');

  if (!row) return null;

  const canDecide =
    user &&
    (user.role === ROLES.MANAGER || user.role === ROLES.ADMIN || user.role === ROLES.EXECUTIVE) &&
    (row.status === 'pending' || row.status === 'flagged');

  async function act(action) {
    if (!row.internalId) return;
    setBusy(true);
    try {
      await decideExpense(row.internalId, action, comment);
      drawer.onAfter?.();
      onClose();
    } catch (e) {
      drawer.onToast?.(e.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  }

  return (
      <div className="sxp-drawer-overlay open" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <aside className="sxp-drawer open" onMouseDown={(e) => e.stopPropagation()}>
          <div className="sxp-drawer-head">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{row.id}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{row.vendor}</div>
            </div>
            <button type="button" className="sxp-btn sxp-btn-ghost sxp-btn-sm" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="sxp-drawer-body">
            <div className="sxp-detail-item">
              <span className="sxp-detail-key">Employee</span>
              <span className="sxp-detail-val">{row.empName}</span>
            </div>
            <div className="sxp-detail-item">
              <span className="sxp-detail-key">Department</span>
              <span className="sxp-detail-val">{row.dept}</span>
            </div>
            <div className="sxp-detail-item">
              <span className="sxp-detail-key">Amount</span>
              <span className="sxp-detail-val" style={{ fontSize: 18, fontWeight: 700 }}>
                {formatInr(row.amount)}
              </span>
            </div>
            <div className="sxp-detail-item">
              <span className="sxp-detail-key">Status</span>
              <span className="sxp-detail-val">
                <StatusBadge status={row.status} />
              </span>
            </div>
            <div className="sxp-detail-item">
              <span className="sxp-detail-key">Risk</span>
              <span className="sxp-detail-val" style={{ color: riskColor(row.risk), fontWeight: 700 }}>
                {row.risk}
              </span>
            </div>
            {row.note ? (
              <div style={{ marginTop: 14, padding: 12, background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Business purpose</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.note}</div>
              </div>
            ) : null}
            {canDecide ? (
              <div style={{ marginTop: 16 }}>
                <label className="sxp-form-label" htmlFor="sx-drawer-comment">
                  Comment
                </label>
                <textarea
                  id="sx-drawer-comment"
                  className="sxp-form-input"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button type="button" className="sxp-btn sxp-btn-success" disabled={busy} onClick={() => act('APPROVE')}>
                    Approve
                  </button>
                  <button type="button" className="sxp-btn sxp-btn-danger" disabled={busy} onClick={() => act('REJECT')}>
                    Reject
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
  );
}
