// pages/ViolationEntry.jsx
import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { violationsAPI } from '../services/api';

const VIOLATION_TYPES = ['Speeding', 'Red Light Jump', 'No Seatbelt', 'Wrong Lane', 'Mobile Phone Use', 'Drunk Driving', 'No Helmet', 'Illegal Parking', 'Overloading', 'Document Violation'];
const FINE_MAP = { 'Speeding': 800, 'Red Light Jump': 1000, 'No Seatbelt': 500, 'Wrong Lane': 500, 'Mobile Phone Use': 1500, 'Drunk Driving': 10000, 'No Helmet': 500, 'Illegal Parking': 200, 'Overloading': 2000, 'Document Violation': 500 };
const LOCATIONS = ['MG Road Junction', 'Brigade Road', 'NH-48 Highway', 'Anna Salai', 'Ring Road Overpass', 'Airport Road', 'Marine Drive', 'Central Market', 'SG Highway', 'Outer Ring Road'];

const initialForm = { vehicleNo: '', type: '', location: '', time: '', fine: '', severity: 'Medium' };

const ViolationEntry = () => {
  const [form, setForm] = useState(initialForm);
  const [violations, setViolations] = useState([]);
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchViolations = async () => {
    try {
      const res = await violationsAPI.getAll();
      setViolations(res.data);
      setFetchError('');
    } catch (err) {
      setFetchError('Could not load violations. Make sure the backend is running.');
    }
  };

  useEffect(() => { fetchViolations(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };
    if (name === 'type' && FINE_MAP[value]) updates.fine = FINE_MAP[value];
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await violationsAPI.create({
        vehicleNo: form.vehicleNo,
        type: form.type,
        location: form.location,
        time: form.time || new Date().toISOString(),
        fine: Number(form.fine),
        severity: form.severity,
        status: 'Pending',
      });
      setSubmitted(true);
      setForm(initialForm);
      fetchViolations();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  const filtered = violations.filter(v =>
    (v.vehicleNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.type || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.location || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = { Pending: '#f59e0b', Paid: '#10b981', Contested: '#ef4444' };

  return (
    <PageWrapper>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ color: '#f9fafb', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
            Violation Entry
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Record new traffic violations and manage existing records</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Form */}
        <div className="col-12 col-lg-5">
          <div style={cardStyle}>
            <h6 style={{ color: '#e5e7eb', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              <i className="bi bi-pencil-square me-2 text-warning" />New Violation Record
            </h6>

            {submitted && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#34d399', fontSize: '0.85rem' }}>
                <i className="bi bi-check-circle-fill me-2" />Violation recorded successfully!
              </div>
            )}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.85rem' }}>
                <i className="bi bi-exclamation-circle me-2" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label style={labelStyle}>Vehicle Number *</label>
                  <input name="vehicleNo" required value={form.vehicleNo} onChange={handleChange}
                    placeholder="e.g. MH12AB1234" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f59e0b'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label style={labelStyle}>Violation Type *</label>
                  <select name="type" required value={form.type} onChange={handleChange} style={inputStyle}>
                    <option value="">Select type...</option>
                    {VIOLATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="col-12 col-sm-6">
                  <label style={labelStyle}>Severity</label>
                  <select name="severity" value={form.severity} onChange={handleChange} style={inputStyle}>
                    {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-12">
                  <label style={labelStyle}>Location *</label>
                  <select name="location" required value={form.location} onChange={handleChange} style={inputStyle}>
                    <option value="">Select location...</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="col-12 col-sm-6">
                  <label style={labelStyle}>Date & Time</label>
                  <input type="datetime-local" name="time" value={form.time} onChange={handleChange} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f59e0b'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label style={labelStyle}>Fine Amount (₹) *</label>
                  <input type="number" name="fine" required value={form.fine} onChange={handleChange}
                    placeholder="Amount in ₹" style={inputStyle} min="0"
                    onFocus={e => e.target.style.borderColor = '#f59e0b'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button type="submit" disabled={submitting} style={{
                  flex: 1, padding: '0.75rem',
                  background: submitting ? 'rgba(251,191,36,0.3)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none', borderRadius: 10, color: '#0a0e1a',
                  fontWeight: 700, fontSize: '0.88rem', cursor: submitting ? 'not-allowed' : 'pointer',
                }}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</> : <><i className="bi bi-send-fill me-2" />Submit Violation</>}
                </button>
                <button type="button" onClick={() => setForm(initialForm)} style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#9ca3af', cursor: 'pointer', fontSize: '0.88rem',
                }}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Records Table */}
        <div className="col-12 col-lg-7">
          <div style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 style={{ color: '#e5e7eb', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
                <i className="bi bi-list-ul me-2 text-info" />Violation Records
              </h6>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 13 }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search vehicle, type, location..."
                  style={{ ...inputStyle, paddingLeft: 32, width: 230, fontSize: '0.8rem', padding: '0.5rem 0.75rem 0.5rem 32px' }}
                />
              </div>
            </div>

            {fetchError && (
              <div style={{ color: '#f87171', fontSize: '0.82rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
                <i className="bi bi-wifi-off me-2" />{fetchError}
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Vehicle', 'Type', 'Location', 'Fine', 'Status'].map(h => (
                      <th key={h} style={{ color: '#6b7280', fontWeight: 600, padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={tdStyle}><span style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>{v.vehicleNo}</span></td>
                      <td style={tdStyle}>{v.type}</td>
                      <td style={tdStyle}><span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{v.location}</span></td>
                      <td style={tdStyle}><span style={{ fontWeight: 700, color: '#e5e7eb' }}>₹{(v.fine || 0).toLocaleString()}</span></td>
                      <td style={tdStyle}>
                        <span style={{ padding: '0.22rem 0.6rem', borderRadius: 20, background: `${statusColor[v.status] || '#6b7280'}18`, color: statusColor[v.status] || '#6b7280', fontSize: '0.7rem', fontWeight: 700, border: `1px solid ${statusColor[v.status] || '#6b7280'}33` }}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} style={{ color: '#4b5563', textAlign: 'center', padding: '2rem' }}>
                      {violations.length === 0 ? 'No violations recorded yet.' : 'No matching records.'}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'right' }}>
              Showing {filtered.length} of {violations.length} records
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const cardStyle = { background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' };
const labelStyle = { display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.4rem' };
const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e5e7eb', fontSize: '0.88rem', outline: 'none', transition: 'border 0.2s' };
const tdStyle = { color: '#d1d5db', padding: '0.65rem 0.75rem', verticalAlign: 'middle' };

export default ViolationEntry;
