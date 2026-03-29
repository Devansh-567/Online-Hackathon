/**
 * Routes: prototype shell mirrors HTML reference; data from SentinelX API.
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/Auth/ProtectedRoute.jsx';
import { PrototypeLayout } from './components/Prototype/PrototypeLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { PrototypePage } from './pages/PrototypePage.jsx';
import { RoleHomeRedirect } from './pages/RoleHomeRedirect.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { user, loading, token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PrototypeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleHomeRedirect />} />
        <Route path=":pageKey" element={<PrototypePage />} />
      </Route>
      <Route path="*" element={<Navigate to={loading && token ? '/' : '/login'} replace />} />
    </Routes>
  );
}
