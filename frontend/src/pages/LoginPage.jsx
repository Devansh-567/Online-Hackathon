/**
 * Prototype login — role tabs + API authentication (password123 demo roster).
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_ACCOUNTS } from '../utils/constants.js';

const TABS = [
  { key: 'admin', icon: '🔐', label: 'Admin' },
  { key: 'executive', icon: '📊', label: 'Exec' },
  { key: 'manager', icon: '✅', label: 'Manager' },
  { key: 'employee', icon: '👤', label: 'Employee' },
];

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2L4 5v6c0 5.25 3.58 10.16 8 11.38C16.42 21.16 20 16.25 20 11V5l-8-3z" />
    </svg>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('admin');
  const [email, setEmail] = useState(DEMO_ACCOUNTS.admin.email);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  function selectRole(key) {
    setTab(key);
    const a = DEMO_ACCOUNTS[key];
    if (a) setEmail(a.email);
    setErr(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await login(email.trim(), password || DEMO_ACCOUNTS[tab]?.password || '');
      nav('/');
    } catch (ex) {
      setErr(ex.message || 'Invalid credentials');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sxp-login-screen">
      <div className="sxp-login-pattern" />
      <div className="sxp-login-container">
        <div className="sxp-login-logo-row">
          <div className="sxp-login-logo-icon">
            <ShieldIcon />
          </div>
          <div className="sxp-login-wordmark">SentinelX</div>
        </div>
        <div className="sxp-login-card">
          <div className="sxp-login-card-title">Sign in to your workspace</div>
          <div className="sxp-login-card-sub">Select your role and enter your credentials</div>
          <div className="sxp-role-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`sxp-role-tab${tab === t.key ? ' active' : ''}`}
                onClick={() => selectRole(t.key)}
              >
                <span className="sxp-role-tab-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          {err ? (
            <div className="sxp-login-error">
              <span>⚠</span> {err}
            </div>
          ) : null}
          <form onSubmit={onSubmit}>
            <div className="sxp-form-group">
              <label className="sxp-form-label" htmlFor="sx-email">
                Email address
              </label>
              <input
                id="sx-email"
                className="sxp-form-input"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="sxp-form-group">
              <label className="sxp-form-label" htmlFor="sx-pwd">
                Password
              </label>
              <input
                id="sx-pwd"
                type="password"
                className="sxp-form-input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
            <button type="submit" className="sxp-btn-login" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className="sxp-login-hint">
            <b>Demo:</b> passwords are <b>password123</b> for seeded accounts (admin@sentinelx.in, sunita@sentinelx.in,
            vikram@sentinelx.in, priya@sentinelx.in, …).
          </div>
        </div>
      </div>
    </div>
  );
}
