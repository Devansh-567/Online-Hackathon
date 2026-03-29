/**
 * Routed prototype pages — JSX ports of the HTML reference screens (data from API).
 */
import React from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { StatusBadge, RoleBadge, riskColor } from '../components/Prototype/StatusBadges.jsx';
import { formatInr } from '../utils/expenseAdapter.js';
import { ROLES } from '../utils/constants.js';
import { createExpense } from '../services/expenseService.js';

function Placeholder({ title, sub }) {
  return (
    <div>
      <header className="sxp-page-header">
        <h1>{title}</h1>
        <p>{sub}</p>
      </header>
      <div className="sxp-card">
        <div className="sxp-card-body sxp-empty">This section is wired to the API shell — extend with full policy/audit UX as needed.</div>
      </div>
    </div>
  );
}

export function PrototypePage() {
  const { pageKey } = useParams();
  const ctx = useOutletContext();
  const { user, users, expenseRows, myTeam, openExpenseDrawer, reload, pushToast, navigate } = ctx;

  const pending = expenseRows.filter((e) => e.status === 'pending' || e.status === 'flagged');
  const approved = expenseRows.filter((e) => e.status === 'approved');
  const totalSpend = approved.reduce((a, b) => a + b.amount, 0);

  if (pageKey === 'admin-dashboard') {
    return (
      <div>
        <header className="sxp-page-header">
          <h1>Dashboard</h1>
          <p>Platform overview · live API data</p>
        </header>
        <div className="sxp-stat-row sxp-stat-row-4">
          <div className="sxp-stat-card sxp-stat-accent">
            <div className="sxp-stat-label">Total Users</div>
            <div className="sxp-stat-value">{users.length}</div>
            <div className="sxp-stat-sub">Active directory</div>
          </div>
          <div className="sxp-stat-card sxp-stat-amber">
            <div className="sxp-stat-label">Pending Review</div>
            <div className="sxp-stat-value" style={{ color: 'var(--amber-600)' }}>
              {pending.length}
            </div>
            <div className="sxp-stat-sub">Queue + AI-flagged</div>
          </div>
          <div className="sxp-stat-card sxp-stat-green">
            <div className="sxp-stat-label">Approved spend (INR)</div>
            <div className="sxp-stat-value" style={{ color: 'var(--green-600)' }}>
              {formatInr(totalSpend)}
            </div>
            <div className="sxp-stat-sub">{approved.length} expenses</div>
          </div>
          <div className="sxp-stat-card sxp-stat-red">
            <div className="sxp-stat-label">High risk</div>
            <div className="sxp-stat-value" style={{ color: 'var(--red-600)' }}>
              {expenseRows.filter((e) => e.risk > 70).length}
            </div>
            <div className="sxp-stat-sub">Risk score &gt; 70</div>
          </div>
        </div>
        <div className="sxp-two-col" style={{ marginBottom: 16 }}>
          <section className="sxp-card">
            <div className="sxp-card-header">
              <span className="sxp-card-title">Recent expenses</span>
              <button type="button" className="sxp-btn sxp-btn-ghost sxp-btn-sm" onClick={() => navigate('/admin-expenses')}>
                View all →
              </button>
            </div>
            <div className="sxp-table-wrap">
              <table className="sxp-data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.slice(0, 8).map((e) => (
                    <tr key={e.internalId} onClick={() => openExpenseDrawer(e)}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{e.empName}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                          {e.vendor} · {e.id}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatInr(e.amount)}</td>
                      <td>
                        <StatusBadge status={e.status} />
                      </td>
                      <td style={{ fontWeight: 700, color: riskColor(e.risk), fontFamily: 'var(--font-mono)' }}>{e.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="sxp-card">
            <div className="sxp-card-header">
              <span className="sxp-card-title">Users</span>
              <button type="button" className="sxp-btn sxp-btn-ghost sxp-btn-sm" onClick={() => navigate('/admin-users')}>
                Manage →
              </button>
            </div>
            <div className="sxp-table-wrap">
              <table className="sxp-data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 8).map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.name || u.email}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{u.departmentLabel}</div>
                      </td>
                      <td>
                        <RoleBadge role={String(u.role).toLowerCase()} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (pageKey === 'admin-users') {
    return (
      <div>
        <header className="sxp-page-header">
          <h1>User Management</h1>
          <p>{users.length} accounts</p>
        </header>
        <div className="sxp-card">
          <div className="sxp-table-wrap">
            <table className="sxp-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Trust</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {u.email}
                      </div>
                    </td>
                    <td>
                      <RoleBadge role={String(u.role).toLowerCase()} />
                    </td>
                    <td>{u.departmentLabel}</td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: riskColor(100 - (u.trustScore || 80)) }}>
                      {u.trustScore ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (pageKey === 'admin-expenses') {
    return (
      <div>
        <header className="sxp-page-header">
          <h1>All Expenses</h1>
          <p>{expenseRows.length} records</p>
        </header>
        <div className="sxp-card">
          <div className="sxp-table-wrap">
            <table className="sxp-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {expenseRows.map((e) => (
                  <tr key={e.internalId} onClick={() => openExpenseDrawer(e)}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text-secondary)' }}>{e.id}</td>
                    <td style={{ fontWeight: 600 }}>{e.empName}</td>
                    <td>{e.vendor}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatInr(e.amount)}</td>
                    <td>
                      <StatusBadge status={e.status} />
                    </td>
                    <td style={{ fontWeight: 700, color: riskColor(e.risk), fontFamily: 'var(--font-mono)' }}>{e.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (pageKey === 'mgr-dashboard' || pageKey === 'mgr-queue') {
    const queue =
      user.role === ROLES.ADMIN
        ? pending
        : pending.filter((e) => myTeam.some((t) => t.id === e.empId));
    return (
      <div>
        <header className="sxp-page-header">
          <h1>{pageKey === 'mgr-queue' ? 'Approval Queue' : 'Manager Dashboard'}</h1>
          <p>{queue.length} pending in your scope</p>
        </header>
        <div className="sxp-card">
          <div className="sxp-table-wrap">
            <table className="sxp-data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Risk</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {queue.map((e) => (
                  <tr key={e.internalId}>
                    <td style={{ fontWeight: 600 }}>{e.empName}</td>
                    <td>{e.vendor}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatInr(e.amount)}</td>
                    <td style={{ color: riskColor(e.risk), fontWeight: 700 }}>{e.risk}</td>
                    <td>
                      <button type="button" className="sxp-btn sxp-btn-secondary sxp-btn-sm" onClick={() => openExpenseDrawer(e)}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (pageKey === 'exec-overview' || pageKey === 'exec-fraud' || pageKey === 'exec-escalations') {
    const flagged = expenseRows.filter((e) => e.status === 'flagged' || e.risk > 70);
    return (
      <div>
        <header className="sxp-page-header">
          <h1>Executive Overview</h1>
          <p>Company-wide signals · INR normalization</p>
        </header>
        <div className="sxp-stat-row sxp-stat-row-4">
          <div className="sxp-stat-card sxp-stat-accent">
            <div className="sxp-stat-label">Total spend</div>
            <div className="sxp-stat-value">{formatInr(expenseRows.reduce((a, b) => a + b.amount, 0))}</div>
          </div>
          <div className="sxp-stat-card sxp-stat-amber">
            <div className="sxp-stat-label">Pending</div>
            <div className="sxp-stat-value">{pending.length}</div>
          </div>
          <div className="sxp-stat-card sxp-stat-red">
            <div className="sxp-stat-label">High risk</div>
            <div className="sxp-stat-value">{flagged.length}</div>
          </div>
          <div className="sxp-stat-card sxp-stat-green">
            <div className="sxp-stat-label">Approved</div>
            <div className="sxp-stat-value">{approved.length}</div>
          </div>
        </div>
        <div className="sxp-card">
          <div className="sxp-card-header">
            <span className="sxp-card-title">Focus list</span>
          </div>
          <div className="sxp-table-wrap">
            <table className="sxp-data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((e) => (
                  <tr key={e.internalId} onClick={() => openExpenseDrawer(e)}>
                    <td>{e.empName}</td>
                    <td>{e.vendor}</td>
                    <td>{formatInr(e.amount)}</td>
                    <td style={{ color: riskColor(e.risk), fontWeight: 700 }}>{e.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (pageKey === 'emp-home' || pageKey === 'emp-expenses') {
    const mine = expenseRows.filter((e) => e.empId === user.id);
    return (
      <div>
        <header className="sxp-page-header">
          <h1>{pageKey === 'emp-home' ? 'Home' : 'My Expenses'}</h1>
          <p>{mine.length} submissions</p>
        </header>
        <div className="sxp-card">
          <div className="sxp-table-wrap">
            <table className="sxp-data-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((e) => (
                  <tr key={e.internalId} onClick={() => openExpenseDrawer(e)}>
                    <td style={{ fontWeight: 600 }}>{e.vendor}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatInr(e.amount)}</td>
                    <td>
                      <StatusBadge status={e.status} />
                    </td>
                    <td style={{ color: riskColor(e.risk), fontWeight: 700 }}>{e.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (pageKey === 'emp-submit') {
    return <EmpSubmit user={user} reload={reload} pushToast={pushToast} navigate={navigate} />;
  }

  if (pageKey === 'emp-trust') {
    const t = user.trustScore ?? 80;
    return (
      <div>
        <header className="sxp-page-header">
          <h1>Trust Score</h1>
          <p>Derived from backend user profile</p>
        </header>
        <div className="sxp-card">
          <div className="sxp-card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, fontWeight: 800, fontFamily: 'var(--font-mono)', color: riskColor(100 - t) }}>{t}</div>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Higher trust reduces automated friction in policy engine.</p>
          </div>
        </div>
      </div>
    );
  }

  const placeholders = {
    'admin-approvers': ['Approval Flows', 'Configure sequences — mirror of HTML “Approval Flows” screen.'],
    'admin-audit': ['Audit Trail', 'Immutable events — connect to audit microservice.'],
    'admin-policy': ['Policy Engine', 'Spending limits & AI thresholds.'],
    'admin-analytics': ['Analytics', 'Department/category breakdown charts.'],
    'exec-trends': ['Spend Trends', 'Historical trends.'],
    'exec-departments': ['Departments', 'Compare teams.'],
    'mgr-history': ['Decision History', 'Approver history export.'],
    'mgr-team': ['My Team', 'Roster view.'],
    'mgr-settings': ['Workflow Rules', 'Manager toggles.'],
    'emp-notifs': ['Notifications', 'In-app inbox (connect websocket).'],
  };
  const ph = placeholders[pageKey];
  if (ph) return <Placeholder title={ph[0]} sub={ph[1]} />;

  return <Placeholder title={pageKey} sub="Unknown page key." />;
}

function EmpSubmit({ user, reload, pushToast, navigate }) {
  const [title, setTitle] = useState('IndiGo Airlines');
  const [category, setCategory] = useState('TRAVEL');
  const [amount, setAmount] = useState('12000');
  const [merchant, setMerchant] = useState('IndiGo');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await createExpense({
        title,
        category,
        amount: Number(amount),
        currency: 'INR',
        merchant,
        description: 'Submitted via prototype console',
        receiptMeta: { name: 'receipt.png', type: 'image/png' },
      });
      pushToast('success', '✓', 'Expense submitted');
      await reload();
      navigate('/emp-expenses');
    } catch (err) {
      pushToast('danger', '!', err.message || 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <header className="sxp-page-header">
        <h1>New Expense</h1>
        <p>Creates a real API record with OCR simulation + risk scoring.</p>
      </header>
      <form className="sxp-card" onSubmit={submit} style={{ padding: 0 }}>
        <div className="sxp-card-body">
          <div className="sxp-form-group">
            <label className="sxp-form-label">Title</label>
            <input className="sxp-form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="sxp-two-col">
            <div className="sxp-form-group">
              <label className="sxp-form-label">Category</label>
              <select className="sxp-form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {['MEALS', 'TRAVEL', 'SOFTWARE', 'OTHER', 'CONFERENCE', 'HOTEL'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sxp-form-group">
              <label className="sxp-form-label">Amount (INR)</label>
              <input className="sxp-form-input" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <div className="sxp-form-group">
            <label className="sxp-form-label">Merchant</label>
            <input className="sxp-form-input" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
          </div>
          <button type="submit" className="sxp-btn sxp-btn-primary" disabled={busy}>
            {busy ? 'Submitting…' : 'Submit expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
