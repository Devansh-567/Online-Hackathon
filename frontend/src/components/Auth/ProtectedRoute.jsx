/** Route guard — redirects unauthenticated users and enforces optional roles. */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function ProtectedRoute({ children, roles }) {
  const { user, loading, token } = useAuth();

  if (loading && token) {
    return (
      <div style={{ padding: 24, color: 'var(--sx-muted)' }}>Loading workspace…</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
