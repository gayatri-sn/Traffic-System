// pages/CitizenPortal.jsx
import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { citizenAPI } from '../services/api';

const statusColor = { Pending: '#f59e0b', Paid: '#10b981', Contested: '#ef4444' };

const CitizenPortal = () => {
  const [vehicleNo, setVehicleNo] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(null);
  const [paySuccess, setPaySuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!vehicleNo.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setPaySuccess('');

    try {
      const res = await citizenAPI.lookup(vehicleNo.trim());
      const data = res.data;
      if (!data.violations || data.violations.length === 0) {
        setError(`No violations found for vehicle "${vehicleNo.toUpperCase()}".`);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching data. Please try again.');
    }

    setLoading(false);
  };

  const handlePay = async (violationId) => {
    setPaying(violationId);
    setPaySuccess('');
    try {
      await citizenAPI.pay(violationId);
      // Update local state immediately
      setResult(prev => ({
        ...prev,
        violations: prev.violations.map(v =>
          v.id === violationId ? { ...v, status: 'Paid' } : v
        ),
      }));
      setPaySuccess('Payment recorded successfully!');
      setTimeout(() => setPaySuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed. Please try again.');
    }
    setPaying(null);
  };

  const totalPending = result?.violations
    ?.filter(v => v.status === 'Pending')
    ?.reduce((sum, v) => sum + v.fine, 0) || 0;

  return (
    <PageWrapper>
      <h1 style={{ color: '#f9fafb', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
        Citizen Portal
      </h1>
      <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Enter your vehicle number to view and pay outstanding fines.
      </p>

      {/* Search */}
      <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', maxWidth: 560 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Vehicle Number</label>
            <input
              value={vehicleNo}
              onChange={e => setVehicleNo(e.target.value.toUpperCase())}
              placeholder="e.g. MH12AB1234"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#f59e0b'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" disabled={loading} style={{
              padding: '0.65rem 1.5rem',
              background: loading ? 'rgba(251,191,36,0.3)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', borderRadius: 10, color: '#0a0e1a',
              fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Searching...</> : <><i className="bi bi-search me-2" />Search</>}
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', color: '#f87171' }}>
          <i className="bi bi-exclamation-circle me-2" />{error}
        </div>
      )}

      {/* Pay success */}
      {paySuccess && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', color: '#34d399' }}>
          <i className="bi bi-check-circle-fill me-2" />{paySuccess}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem' }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="bi bi-car-front" style={{ color: '#f59e0b', fontSize: 20 }} />
                </div>
                <h2 style={{ color: '#f9fafb', fontWeight: 800, margin: 0, fontFamily: 'monospace', fontSize: '1.4rem', letterSpacing: 2 }}>
                  {result.vehicle}
                </h2>
              </div>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.82rem' }}>{result.violations.length} violation(s) found</p>
            </div>

            {totalPending > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                <div style={{ color: '#9ca3af', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Total Outstanding</div>
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Georgia, serif' }}>₹{totalPending.toLocaleString()}</div>
              </div>
            )}
            {totalPending === 0 && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '0.75rem 1.25rem', color: '#34d399', fontSize: '0.9rem', fontWeight: 600 }}>
                <i className="bi bi-check-circle-fill me-2" />All fines cleared
              </div>
            )}
          </div>

          {/* Violations list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.violations.map(v => (
              <div key={v.id} style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${v.status === 'Pending' ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 12, padding: '1rem 1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#e5e7eb', fontWeight: 700, fontSize: '0.95rem' }}>{v.type}</span>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: 20, background: `${statusColor[v.status] || '#6b7280'}18`, color: statusColor[v.status] || '#6b7280', fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${statusColor[v.status] || '#6b7280'}33` }}>
                      {v.status}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span><i className="bi bi-geo-alt me-1" />{v.location}</span>
                    <span><i className="bi bi-calendar3 me-1" />
                      {v.date ? new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.7rem', textTransform: 'uppercase' }}>Fine</div>
                    <div style={{ color: v.status === 'Pending' ? '#f87171' : '#34d399', fontWeight: 800, fontSize: '1.1rem' }}>₹{v.fine.toLocaleString()}</div>
                  </div>
                  {v.status === 'Pending' && (
                    <button
                      onClick={() => handlePay(v.id)}
                      disabled={paying === v.id}
                      style={{
                        padding: '0.5rem 1.1rem',
                        background: paying === v.id ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none', borderRadius: 9, color: '#fff',
                        fontWeight: 700, fontSize: '0.85rem', cursor: paying === v.id ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {paying === v.id ? <><span className="spinner-border spinner-border-sm me-1" />Processing...</> : <><i className="bi bi-credit-card me-1" />Pay Now</>}
                    </button>
                  )}
                  {v.status === 'Paid' && (
                    <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
                      <i className="bi bi-check-circle-fill me-1" />Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

const labelStyle = { display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.4rem' };
const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e5e7eb', fontSize: '0.88rem', outline: 'none', transition: 'border 0.2s', textTransform: 'uppercase', letterSpacing: 1 };

export default CitizenPortal;
