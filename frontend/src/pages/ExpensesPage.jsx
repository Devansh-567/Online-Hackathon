/** Full expense list + submission form. */

import React from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import { ExpenseTable } from '../components/Expense/ExpenseTable.jsx';
import { ExpenseForm } from '../components/Expense/ExpenseForm.jsx';
import { Card } from '../components/UI/Card.jsx';
import { ROLES } from '../utils/constants.js';
import { useAuth } from '../context/AuthContext.jsx';

export function ExpensesPage() {
  const { user } = useAuth();
  const { result, loading, error, reload } = useExpenses();
  const rows = result?.data || [];

  return (
    <div>
      <header className="sx-header">
        <div>
          <h1 className="sx-title">Expenses</h1>
          <p className="sx-sub">Submit, track, and audit spend with OCR-assisted metadata.</p>
        </div>
      </header>

      {user?.role === ROLES.EMPLOYEE || user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN ? (
        <Card title="New submission" subtitle="Simulated OCR enriches merchant and confidence scores.">
          <ExpenseForm onCreated={() => reload()} />
        </Card>
      ) : null}

      <h2 style={{ marginTop: 22 }}>All items</h2>
      {loading ? <div style={{ color: 'var(--sx-muted)' }}>Loading…</div> : null}
      {error ? <div style={{ color: 'var(--sx-danger)' }}>{String(error.message)}</div> : null}
      <ExpenseTable rows={rows} />
    </div>
  );
}
