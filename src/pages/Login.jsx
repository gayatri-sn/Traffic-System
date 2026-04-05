// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const res = await authAPI.signup({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        login(res.data.user, res.data.token);
        navigate(res.data.user.role === 'citizen' ? '/citizen' : '/dashboard');
      } else {
        const res = await authAPI.login({ email: form.email, password: form.password });
        login(res.data.user, res.data.token);
        navigate(res.data.user.role === 'citizen' ? '/citizen' : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'citizen' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(251,191,36,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(245,158,11,0.3)',
          }}>
            <i className="bi bi-traffic-cone-fill text-white" />
          </div>
          <h1 style={{ color: '#f9fafb', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
            STAMS
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Smart Traffic Analysis & Management System
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(17,24,39,0.95)',
          border: '1px solid rgba(251,191,36,0.15)',
          borderRadius: 20,
          padding: '2rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: '1.5rem' }}>
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: '0.55rem',
                  borderRadius: 9,
                  border: 'none',
                  background: mode === m ? 'rgba(251,191,36,0.15)' : 'transparent',
                  color: mode === m ? '#f59e0b' : '#6b7280',
                  fontWeight: 700, fontSize: '0.85rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  textTransform: 'capitalize',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem',
              color: '#f87171', fontSize: '0.85rem',
            }}>
              <i className="bi bi-exclamation-circle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="mb-3">
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" name="name" required
                  value={form.name} onChange={handleChange}
                  placeholder="Your full name"
                  style={inputStyle}
                />
              </div>
            )}

            <div className="mb-3">
              <label style={labelStyle}>Email Address</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="Enter your email"
                style={inputStyle}
              />
            </div>

            <div className="mb-3">
              <label style={labelStyle}>Password</label>
              <input
                type="password" name="password" required
                value={form.password} onChange={handleChange}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Enter your password'}
                style={inputStyle}
              />
            </div>

            {mode === 'signup' && (
              <>
                <div className="mb-3">
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    type="password" name="confirmPassword" required
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter password"
                    style={inputStyle}
                  />
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Role</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { val: 'citizen', label: 'Citizen', icon: 'bi-person-circle', color: '#10b981' },
                      { val: 'officer', label: 'Officer', icon: 'bi-person-badge', color: '#3b82f6' },
                      { val: 'admin',   label: 'Admin',   icon: 'bi-shield-lock',   color: '#f59e0b' },
                    ].map(({ val, label, icon, color }) => (
                      <button
                        key={val} type="button"
                        onClick={() => setForm({ ...form, role: val })}
                        style={{
                          flex: 1, padding: '0.6rem 0.4rem',
                          borderRadius: 10,
                          border: form.role === val ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.08)',
                          background: form.role === val ? `${color}18` : 'rgba(255,255,255,0.03)',
                          color: form.role === val ? color : '#6b7280',
                          fontSize: '0.78rem', fontWeight: 600,
                          cursor: 'pointer', transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        }}
                      >
                        <i className={`bi ${icon}`} />{label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && <div className="mb-4" />}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.85rem',
              background: loading ? 'rgba(251,191,36,0.3)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', borderRadius: 12, color: '#0a0e1a',
              fontWeight: 800, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(251,191,36,0.3)',
            }}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />{mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                <><i className={`bi ${mode === 'login' ? 'bi-lock-fill' : 'bi-person-plus-fill'} me-2`} />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.8rem', marginTop: '1.25rem', marginBottom: 0 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, padding: 0 }}
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#374151', fontSize: '0.72rem', marginTop: '1.5rem' }}>
          © 2024 Smart Traffic Authority Management System
        </p>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block', color: '#9ca3af', fontSize: '0.78rem',
  fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.5rem',
};

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#e5e7eb', fontSize: '0.9rem',
  outline: 'none',
};

export default Login;
