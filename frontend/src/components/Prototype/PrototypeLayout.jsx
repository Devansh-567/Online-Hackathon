/**
 * App shell — sidebar, topbar, drawer/modal/toasts — matches HTML prototype structure.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { NAV_CONFIG, CRUMB_MAP, ENV_LABEL } from '../../config/navConfig.js';
import {
  apiRoleToNavKey,
  DEFAULT_PAGE_BY_NAV,
  ROLES,
} from '../../utils/constants.js';
import { api } from '../../services/api.js';
import { fetchExpenses } from '../../services/expenseService.js';
import { buildUserMap, toUiExpense } from '../../utils/expenseAdapter.js';
import { ExpenseDrawer } from './ExpenseDrawer.jsx';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2L4 5v6c0 5.25 3.58 10.16 8 11.38C16.42 21.16 20 16.25 20 11V5l-8-3z" />
    </svg>
  );
}

export function PrototypeLayout() {
  const { user, logout } = useAuth();
  const { drawer, setDrawer, toasts, pushToast } = useUi();
  const navKey = apiRoleToNavKey(user?.role);
  const sections = NAV_CONFIG[navKey] || NAV_CONFIG.employee;
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [expenseRows, setExpenseRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: usersRes }, expRes] = await Promise.all([
        api.get('/users'),
        fetchExpenses({ limit: 100, page: 1 }),
      ]);
      const u = usersRes.data || [];
      setUsers(u);
      const umap = buildUserMap(u);
      const ui = (expRes.data || []).map((e) => toUiExpense(e, umap));
      setExpenseRows(ui);
    } catch (e) {
      pushToast('danger', '!', e.message || 'Failed to load workspace');
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    reload();
  }, [reload]);

  const userMap = useMemo(() => buildUserMap(users), [users]);

  const myTeam = useMemo(() => {
    if (!user?.id) return [];
    return users.filter((u) => u.managerId === user.id);
  }, [users, user?.id]);

  const badgeData = useMemo(() => {
    const pendingLike = expenseRows.filter((e) => e.status === 'pending' || e.status === 'flagged');
    const highRisk = expenseRows.filter(
      (e) => e.risk > 80 && (e.status === 'pending' || e.status === 'flagged'),
    );
    const mgrQueue =
      user?.role === ROLES.ADMIN
        ? pendingLike.length
        : pendingLike.filter((e) => myTeam.some((t) => t.id === e.empId)).length;
    const myEx =
      user?.role === ROLES.EMPLOYEE ? expenseRows.filter((e) => e.empId === user.id) : expenseRows;
    return {
      userCount: users.length,
      expenseCount: expenseRows.length,
      highRiskQueue: highRisk.length,
      mgrQueue,
      teamCount: myTeam.length,
      myExpenseCount: myEx.length,
      notifCount: 0,
    };
  }, [expenseRows, users, user, myTeam]);

  const seg = location.pathname.replace(/^\//, '').split('/')[0] || '';

  useEffect(() => {
    if (!user || !seg) return;
    const allowed = new Set(sections.flatMap((s) => s.items.map((i) => i.pageKey)));
    if (!allowed.has(seg)) {
      navigate(`/${DEFAULT_PAGE_BY_NAV[navKey]}`, { replace: true });
    }
  }, [user, sections, seg, navigate, navKey]);

  const [clock, setClock] = useState(() => new Date().toLocaleTimeString('en-IN'));
  useEffect(() => {
    const t = setInterval(
      () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  const topCta =
    user?.role === ROLES.EMPLOYEE ? (
      <button type="button" className="sxp-btn sxp-btn-primary sxp-btn-sm" onClick={() => navigate('/emp-submit')}>
        + New Expense
      </button>
    ) : user?.role === ROLES.ADMIN ? (
      <button type="button" className="sxp-btn sxp-btn-primary sxp-btn-sm" onClick={() => navigate('/admin-users')}>
        + Add User
      </button>
    ) : null;

  return (
    <div className="sxp-app-root">
      <aside className="sxp-sidebar">
        <div className="sxp-sidebar-top">
          <div className="sxp-sidebar-brand">
            <div className="sxp-sidebar-brand-icon">
              <ShieldIcon />
            </div>
            <div>
              <div className="sxp-sidebar-brand-name">SentinelX</div>
              <div className="sxp-sidebar-brand-env">{ENV_LABEL[navKey]}</div>
            </div>
          </div>
        </div>
        <nav className="sxp-sidebar-nav">
          {sections.map((sec) => (
            <div key={sec.section}>
              <div className="sxp-nav-section">{sec.section}</div>
              {sec.items.map((item) => {
                const raw =
                  item.badgeKey && badgeData[item.badgeKey] ? badgeData[item.badgeKey] : 0;
                const cnt = typeof raw === 'number' ? raw : 0;
                return (
                  <NavLink
                    key={item.pageKey}
                    to={`/${item.pageKey}`}
                    className={({ isActive }) => `sxp-nav-item${isActive ? ' active' : ''}`}
                  >
                    <span className="sxp-nav-item-icon" aria-hidden>
                      {item.icon}
                    </span>
                    {item.label}
                    {cnt > 0 ? (
                      <span className={`sxp-nav-badge${item.badgeCls === 'muted' ? ' muted' : ''}`}>{cnt}</span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sxp-sidebar-footer">
          <div className="sxp-sidebar-user">
            <div
              className="sxp-user-av"
              style={{
                background: 'rgba(21,112,239,0.12)',
                color: 'var(--brand)',
                border: '1.5px solid rgba(21,112,239,0.25)',
              }}
            >
              {user?.initials || user?.email?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--sidebar-text-active)', fontSize: '12.5px' }}>
                {user?.name || user?.email}
              </div>
              <div className="sxp-sidebar-brand-env">{String(user?.role || '').toLowerCase()}</div>
            </div>
            <button type="button" className="sxp-btn-logout" title="Sign out" onClick={() => logout()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="sxp-main-content">
        <div className="sxp-topbar">
          <div className="sxp-topbar-breadcrumb">
            <span className="parent">SentinelX</span>
            <span className="sep">/</span>
            <span className="current">{CRUMB_MAP[seg] || 'Dashboard'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="sxp-topbar-clock">{clock}</div>
            {topCta}
          </div>
        </div>

        <div className="sxp-page-content">
          {loading ? <div style={{ color: 'var(--text-secondary)' }}>Loading workspace…</div> : null}
          <Outlet
            context={{
              user,
              users,
              userMap,
              expenseRows,
              reload,
              myTeam,
              pushToast,
              openExpenseDrawer: (row) =>
                setDrawer({
                  row,
                  onAfter: reload,
                  onToast: (m) => pushToast('danger', '!', m),
                }),
              navigate,
            }}
          />
        </div>
      </div>

      {drawer ? (
        <ExpenseDrawer drawer={drawer} onClose={() => setDrawer(null)} user={user} userMap={userMap} />
      ) : null}

      <div className="sxp-toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`sxp-toast sxp-toast-${t.type}`}>
            <span style={{ fontSize: 15 }}>{t.icon}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
