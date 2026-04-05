// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ViolationEntry from './pages/ViolationEntry';
import Analytics from './pages/Analytics';
import CitizenPortal from './pages/CitizenPortal';
import AdminPanel from './pages/AdminPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Global dark theme overrides
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; }
  body { background: #0d1117 !important; color: #e5e7eb !important; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
  select option { background: #1f2937; color: #e5e7eb; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #111827; }
  ::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.3); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(251,191,36,0.5); }
  input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
`;

// Private route component
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d1117' }}>
      <div className="spinner-border text-warning" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />

      <Route path="/dashboard" element={
        <PrivateRoute roles={['admin', 'officer']}>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/violations" element={
        <PrivateRoute roles={['admin', 'officer']}>
          <ViolationEntry />
        </PrivateRoute>
      } />

      <Route path="/analytics" element={
        <PrivateRoute roles={['admin', 'officer']}>
          <Analytics />
        </PrivateRoute>
      } />

      <Route path="/citizen" element={
        <PrivateRoute>
          <CitizenPortal />
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <PrivateRoute roles={['admin']}>
          <AdminPanel />
        </PrivateRoute>
      } />

      <Route path="/unauthorized" element={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d1117', flexDirection: 'column', gap: 16 }}>
          <i className="bi bi-shield-x" style={{ fontSize: 56, color: '#ef4444' }} />
          <h2 style={{ color: '#f9fafb' }}>Access Denied</h2>
          <p style={{ color: '#6b7280' }}>You don't have permission to view this page.</p>
          <a href="/dashboard" style={{ color: '#f59e0b', textDecoration: 'none' }}>← Go to Dashboard</a>
        </div>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <style>{globalStyles}</style>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
