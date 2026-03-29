/**
 * Authentication context — stores JWT + user profile from /auth/me.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'sx_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const persist = useCallback((t) => {
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
      setAuthToken(t);
      setToken(t);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) persist(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, persist]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data.token);
      setUser(data.user);
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      isRole: (r) => user?.role === r,
    }),
    [token, user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
