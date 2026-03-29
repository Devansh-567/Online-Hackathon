/** Email/password login wired to AuthContext. */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../UI/Button.jsx';
import { Input } from '../UI/Input.jsx';

export function LoginForm() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('employee@sentinelx.demo');
  const [password, setPassword] = useState('Employee!123');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="sx-form" onSubmit={onSubmit}>
      <Input label="Work email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error ? <div style={{ color: 'var(--sx-danger)', fontSize: 13 }}>{error}</div> : null}
      <Button disabled={busy} variant="primary" type="submit">
        {busy ? 'Signing in…' : 'Sign in to SentinelX'}
      </Button>
      <div style={{ color: 'var(--sx-muted)', fontSize: 12, lineHeight: 1.5 }}>
        Demo accounts: <strong>admin@sentinelx.demo</strong> / <strong>Admin!123</strong> · manager@… / Manager!123 · employee@… /
        Employee!123
      </div>
    </form>
  );
}
