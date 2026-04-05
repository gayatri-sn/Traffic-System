// pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { violationsAPI } from '../services/api';

const statusColor = { Pending: '#f59e0b', Paid: '#10b981', Contested: '#ef4444' };

const AdminPanel = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const res = await violationsAPI.getAll();
      setViolations(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load violations. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchViolations(); }, []);

  const deleteViolation = async (id) => {
    if (!window.confirm('Delete this violation permanently?')) return;
    setDeletingId(id);
    try {
      await violationsAPI.delete(id);
      setViolations(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
    setDeletingId(null);
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await violationsAPI.updateStatus(id, status);
      setViolations(prev => prev.map(v => v._id === id ? res.data : v));
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    }
    setUpdatingId(null);
  };

  const filtered = violations.filter(v =>
    (v.vehicleNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.type || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: violations.length,
    pending: violations.filter(v => v.status === 'Pending').length,
    paid: violations.filter(v => v.status === 'Paid').length,
    revenue: violations.filter(v => v.status === 'Paid').reduce((s, v) => s + (v.fine || 0), 0),
  };

  return (
    <PageWrapper>
      <h1 style={{ color: '#f9fafb', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
        Admin Control Panel
      </h1>
      <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Manage all violations, update statuses, and remove records.</p>

      {/* Quick stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Violations', value: stats.total, color: '#3b82f6' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'Paid', value: stats.paid, color: '#10b981' },
          { label: 'Revenue Collected', value: `₹${stats.revenue.toLocaleString()}`, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div style={{ background: `${s.color}12`, border: `1px solid ${s.color}33`, borderRadius: 12, padding: '1rem' }}>
              <div style={{ color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Georgia, serif' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171' }}>
          <i className="bi bi-exclamation-circle me-2" />{error}
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h6 style={{ color: '#e5e7eb', fontWeight: 700, margin: 0 }}>
            <i className="bi bi-table me-2 text-warning" />All Violations
          </h6>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 13 }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                style={{ padding: '0.45rem 0.75rem 0.45rem 30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e5e7eb', fontSize: '0.82rem', outline: 'none', width: 200 }}
              />
            </div>
            <button onClick={fetchViolations} style={{ padding: '0.45rem 0.85rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#60a5fa', fontSize: '0.82rem', cursor: 'pointer' }}>
              <i className="bi bi-arrow-clockwise" />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <span className="spinner-border spinner-border-sm me-2 text-warning" />Loading violations...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Vehicle No', 'Type', 'Location', 'Severity', 'Fine', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ color: '#6b7280', fontWeight: 600, padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: deletingId === v._id ? 0.4 : 1 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={tdStyle}><span style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>{v.vehicleNo}</span></td>
                    <td style={tdStyle}>{v.type}</td>
                    <td style={tdStyle}><span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{v.location}</span></td>
                    <td style={tdStyle}>
                      <span style={{ padding: '0.18rem 0.5rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
                        background: v.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : v.severity === 'High' ? 'rgba(249,115,22,0.15)' : 'rgba(251,191,36,0.1)',
                        color: v.severity === 'Critical' ? '#f87171' : v.severity === 'High' ? '#fb923c' : '#fbbf24',
                      }}>{v.severity}</span>
                    </td>
                    <td style={tdStyle}><strong style={{ color: '#e5e7eb' }}>₹{(v.fine || 0).toLocaleString()}</strong></td>
                    <td style={tdStyle}>
                      <select
                        value={v.status}
                        disabled={updatingId === v._id}
                        onChange={e => updateStatus(v._id, e.target.value)}
                        style={{
                          background: `${statusColor[v.status] || '#6b7280'}18`,
                          border: `1px solid ${statusColor[v.status] || '#6b7280'}44`,
                          borderRadius: 8, color: statusColor[v.status] || '#6b7280',
                          fontSize: '0.78rem', fontWeight: 700, padding: '0.25rem 0.5rem',
                          cursor: 'pointer', outline: 'none',
                        }}
                      >
                        {['Pending', 'Paid', 'Contested'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => deleteViolation(v._id)}
                        disabled={deletingId === v._id}
                        style={{
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                          color: '#f87171', borderRadius: 7, padding: '0.3rem 0.65rem',
                          fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
                        }}
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ color: '#4b5563', textAlign: 'center', padding: '2rem' }}>
                    {violations.length === 0 ? 'No violations in database.' : 'No matching records.'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'right' }}>
          Showing {filtered.length} of {violations.length} total violations
        </div>
      </div>
    </PageWrapper>
  );
};

const tdStyle = { color: '#d1d5db', padding: '0.65rem 0.75rem', verticalAlign: 'middle' };

export default AdminPanel;
