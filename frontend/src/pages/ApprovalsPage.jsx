/** Manager/admin approval queue with decision modal. */

import React, { useMemo, useState } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import { ExpenseTable } from '../components/Expense/ExpenseTable.jsx';
import { Modal } from '../components/UI/Modal.jsx';
import { Button } from '../components/UI/Button.jsx';
import { decideExpense } from '../services/expenseService.js';
import { formatMoney } from '../utils/formatters.js';

export function ApprovalsPage() {
  const { result, reload, loading } = useExpenses();
  const rows = useMemo(() => (result?.data || []).filter((r) => r.status === 'PENDING'), [result]);
  const [active, setActive] = useState(null);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  async function act(action) {
    if (!active) return;
    setBusy(true);
    try {
      await decideExpense(active.id, action, comment);
      setActive(null);
      setComment('');
      await reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <header className="sx-header">
        <div>
          <h1 className="sx-title">Approvals</h1>
          <p className="sx-sub">Dynamic routing: manager → finance → executive based on tiering rules.</p>
        </div>
      </header>

      {loading ? <div style={{ color: 'var(--sx-muted)' }}>Loading queue…</div> : null}

      <ExpenseTable rows={rows} onSelect={setActive} />

      <Modal
        open={!!active}
        title={active ? active.title : ''}
        onClose={() => setActive(null)}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button variant="ghost" onClick={() => setActive(null)} disabled={busy}>
              Dismiss
            </Button>
            <Button variant="danger" onClick={() => act('REJECT')} disabled={busy}>
              Reject
            </Button>
            <Button variant="primary" onClick={() => act('APPROVE')} disabled={busy}>
              Approve step
            </Button>
          </div>
        }
      >
        {active ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <strong>Amount:</strong> {formatMoney(active.amount, active.currency)} ({active.status})
            </div>
            <div>
              <strong>Workflow:</strong> {active.workflow?.currentStep || '—'} · Tier{' '}
              {active.workflow?.escalation?.tier ?? '—'}
            </div>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: 'var(--sx-muted)', fontWeight: 700 }}>Comment</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                style={{
                  borderRadius: 12,
                  border: '1px solid var(--sx-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--sx-text)',
                  padding: 12,
                  fontFamily: 'inherit',
                }}
              />
            </label>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
