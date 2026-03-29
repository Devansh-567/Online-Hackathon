/** Executive overview — KPIs + activity feed sourced from expenses API. */

import React, { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import { StatCard } from '../components/Dashboard/StatCard.jsx';
import { ActivityFeed } from '../components/Dashboard/ActivityFeed.jsx';
import { ExpenseTable } from '../components/Expense/ExpenseTable.jsx';

export function DashboardPage() {
  const { result, loading, error, reload } = useExpenses();
  const rows = result?.data || [];

  const kpis = useMemo(() => {
    const pending = rows.filter((r) => r.status === 'PENDING').length;
    const exposure = rows.filter((r) => r.status === 'PENDING').reduce((s, r) => s + (r.amountBase || 0), 0);
    const highRisk = rows.filter((r) => (r.riskScore || 0) >= 70).length;
    return { pending, exposure, highRisk };
  }, [rows]);

  return (
    <div>
      <header className="sx-header">
        <div>
          <h1 className="sx-title">Governance Overview</h1>
          <p className="sx-sub">Real-time visibility into spend risk, trust signals, and approval flow.</p>
        </div>
        <button
          type="button"
          onClick={reload}
          style={{
            borderRadius: 10,
            border: '1px solid var(--sx-border)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--sx-text)',
            padding: '10px 12px',
            cursor: 'pointer',
            fontWeight: 800,
          }}
        >
          Refresh
        </button>
      </header>

      {loading ? <div style={{ color: 'var(--sx-muted)' }}>Loading intelligence layer…</div> : null}
      {error ? <div style={{ color: 'var(--sx-danger)' }}>{String(error.message)}</div> : null}

      <section className="sx-grid-3" style={{ marginBottom: 16 }}>
        <StatCard title="Pending reviews" value={String(kpis.pending)} hint="Across your visibility scope" />
        <StatCard
          title="Exposure in flight"
          value={`$${kpis.exposure.toLocaleString()}`}
          hint="USD-normalized pipeline"
          tone="warn"
        />
        <StatCard title="High risk items" value={String(kpis.highRisk)} hint="riskScore ≥ 70" tone="danger" />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }} className="sx-overview-split">
        <div>
          <h2 style={{ marginTop: 0 }}>Latest expenses</h2>
          <ExpenseTable rows={rows.slice(0, 8)} />
        </div>
        <div>
          <h2 style={{ marginTop: 0 }}>Activity</h2>
          <ActivityFeed expenses={rows} />
        </div>
      </section>
    </div>
  );
}
