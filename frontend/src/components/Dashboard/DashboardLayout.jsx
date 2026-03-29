/** App shell with sidebar navigation and top header. */

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../utils/constants.js';
import { Button } from '../UI/Button.jsx';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? 'active' : undefined)}
      style={{ textDecoration: 'none' }}
    >
      <span>{children}</span>
    </NavLink>
  );
}

export function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="sx-shell">
      <aside className="sx-sidebar">
        <div className="sx-brand">
          <div className="sx-logo">SX</div>
          <div>
            <div style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>SentinelX</div>
            <div style={{ color: 'var(--sx-muted)', fontSize: 12 }}>Expense Governance</div>
          </div>
        </div>
        <nav className="sx-nav">
          <NavItem to="/">Overview</NavItem>
          <NavItem to="/expenses">Expenses</NavItem>
          {(user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN) && (
            <NavItem to="/approvals">Approvals</NavItem>
          )}
        </nav>
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--sx-border)' }}>
          <div style={{ color: 'var(--sx-muted)', fontSize: 12 }}>Signed in as</div>
          <div style={{ fontWeight: 800, marginTop: 6 }}>{user?.email}</div>
          <div style={{ color: 'var(--sx-muted)', fontSize: 12, marginTop: 4 }}>Role: {user?.role}</div>
          <div style={{ marginTop: 12 }}>
            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </aside>
      <main className="sx-main">
        <Outlet />
      </main>
    </div>
  );
}
