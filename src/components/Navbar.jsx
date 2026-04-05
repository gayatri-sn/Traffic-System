// components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user?.role === 'citizen'
    ? [{ to: '/citizen', label: 'My Portal', icon: 'bi-person-circle' }]
    : [
        { to: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        { to: '/violations', label: 'Violations', icon: 'bi-exclamation-triangle' },
        { to: '/analytics', label: 'Analytics', icon: 'bi-bar-chart-line' },
        { to: '/citizen', label: 'Citizen Portal', icon: 'bi-people' },
        ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: 'bi-shield-lock' }] : []),
      ];

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{
      background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 100%)',
      borderBottom: '1px solid rgba(251,191,36,0.2)',
      backdropFilter: 'blur(20px)',
      zIndex: 1050,
      padding: '0 1.5rem',
    }}>
      {/* Brand */}
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/" style={{ textDecoration: 'none' }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          <i className="bi bi-traffic-cone-fill text-white" style={{ fontSize: 16 }} />
        </div>
        <div>
          <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'Georgia, serif', letterSpacing: '0.5px' }}>
            STAMS
          </span>
          <span style={{ color: '#6b7280', fontSize: '0.65rem', display: 'block', letterSpacing: '1px', marginTop: -2 }}>
            TRAFFIC AUTHORITY
          </span>
        </div>
      </Link>

      <button
        className="navbar-toggler border-0"
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        style={{ color: '#f59e0b' }}
      >
        <i className={`bi ${collapsed ? 'bi-list' : 'bi-x-lg'}`} style={{ fontSize: 22 }} />
      </button>

      <div className={`collapse navbar-collapse ${!collapsed ? 'show' : ''}`}>
        <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <li className="nav-item" key={to}>
              <Link
                to={to}
                className="nav-link d-flex align-items-center gap-2"
                onClick={() => setCollapsed(true)}
                style={{
                  color: isActive(to) ? '#f59e0b' : '#9ca3af',
                  fontWeight: isActive(to) ? 600 : 400,
                  fontSize: '0.85rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 8,
                  background: isActive(to) ? 'rgba(251,191,36,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  letterSpacing: '0.3px',
                }}
              >
                <i className={`bi ${icon}`} style={{ fontSize: 15 }} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User info + logout */}
        {user && (
          <div className="d-flex align-items-center gap-3 ms-lg-3 mt-2 mt-lg-0">
            <div className="d-flex align-items-center gap-2">
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff',
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: '#e5e7eb', fontSize: '0.8rem', fontWeight: 600 }}>{user.name}</div>
                <div style={{
                  fontSize: '0.65rem', letterSpacing: '0.8px',
                  color: user.role === 'admin' ? '#f59e0b' : user.role === 'officer' ? '#3b82f6' : '#10b981',
                  textTransform: 'uppercase', fontWeight: 700,
                }}>
                  {user.role}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                borderRadius: 8,
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <i className="bi bi-box-arrow-right me-1" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
