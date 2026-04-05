// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import PageWrapper from '../components/PageWrapper';
import StatCard from '../components/StatCard';
import { useAuth } from '../utils/AuthContext';
import { violationsAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, title: { display: !!title, text: title, color: '#9ca3af', font: { size: 13 } } },
  scales: {
    x: { ticks: { color: '#6b7280', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#6b7280', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
});

const Dashboard = () => {
  const { user } = useAuth();
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    violationsAPI.getAll()
      .then(res => {
        const safe = res.data.map(v => ({ ...v, time: v.time ? new Date(v.time) : new Date(), status: v.status || 'Pending' }));
        setViolations(safe);
      })
      .catch(() => setBackendError(true))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: violations.length,
    pending: violations.filter(v => v.status === 'Pending').length,
    resolved: violations.filter(v => v.status === 'Paid').length,
    revenue: violations.reduce((s, v) => s + (v.fine || 0), 0),
  };

  // Daily bar chart
  const getDailyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    violations.forEach(v => { counts[new Date(v.time).getDay()]++; });
    return {
      labels: days,
      datasets: [{ label: 'Violations', data: counts, backgroundColor: 'rgba(251,191,36,0.7)', borderRadius: 6 }],
    };
  };

  // Monthly line chart
  const getMonthlyData = () => {
    const months = Array(12).fill(0);
    violations.forEach(v => { months[new Date(v.time).getMonth()]++; });
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Violations', data: months,
        borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)',
        tension: 0.4, fill: true,
      }],
    };
  };

  // Violation type donut
  const typeCounts = {};
  violations.forEach(v => { if (v.type) typeCounts[v.type] = (typeCounts[v.type] || 0) + 1; });
  const donutData = {
    labels: Object.keys(typeCounts),
    datasets: [{ data: Object.values(typeCounts), backgroundColor: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'] }],
  };

  const statusColor = { Pending: '#f59e0b', Paid: '#10b981', Contested: '#ef4444' };

  return (
    <PageWrapper>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ color: '#f9fafb', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
            Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Welcome back, <strong style={{ color: '#f59e0b' }}>{user?.name}</strong></p>
        </div>
        {loading && <span className="spinner-border text-warning spinner-border-sm" />}
      </div>

      {backendError && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#f87171', fontSize: '0.85rem' }}>
          <i className="bi bi-wifi-off me-2" />Backend not reachable. Start the server with <code>node server.js</code> in the <code>backend/</code> folder.
        </div>
      )}

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><StatCard title="Total Violations" value={stats.total} icon="bi-exclamation-triangle-fill" color="red" /></div>
        <div className="col-6 col-md-3"><StatCard title="Pending" value={stats.pending} icon="bi-clock-fill" color="amber" /></div>
        <div className="col-6 col-md-3"><StatCard title="Resolved" value={stats.resolved} icon="bi-check-circle-fill" color="green" /></div>
        <div className="col-6 col-md-3"><StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon="bi-currency-rupee" color="purple" /></div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div style={cardStyle}>
            <h6 style={cardTitleStyle}><i className="bi bi-bar-chart-fill me-2 text-warning" />Daily Violations (This Week)</h6>
            <div style={{ height: 200 }}>
              <Bar data={getDailyData()} options={chartOptions()} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div style={cardStyle}>
            <h6 style={cardTitleStyle}><i className="bi bi-graph-up me-2 text-info" />Monthly Trend</h6>
            <div style={{ height: 200 }}>
              <Line data={getMonthlyData()} options={chartOptions()} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {Object.keys(typeCounts).length > 0 && (
          <div className="col-12 col-md-5">
            <div style={cardStyle}>
              <h6 style={cardTitleStyle}><i className="bi bi-pie-chart-fill me-2 text-success" />Violation Types</h6>
              <div style={{ height: 220 }}>
                <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 11 }, boxWidth: 12 } } } }} />
              </div>
            </div>
          </div>
        )}

        {/* Recent table */}
        <div className={`col-12 ${Object.keys(typeCounts).length > 0 ? 'col-md-7' : ''}`}>
          <div style={cardStyle}>
            <h6 style={cardTitleStyle}><i className="bi bi-clock-history me-2 text-warning" />Recent Violations</h6>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Vehicle', 'Type', 'Location', 'Status'].map(h => (
                      <th key={h} style={{ color: '#6b7280', fontWeight: 600, padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {violations.slice(0, 8).map(v => (
                    <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700, padding: '0.55rem 0.75rem' }}>{v.vehicleNo}</td>
                      <td style={{ color: '#d1d5db', padding: '0.55rem 0.75rem' }}>{v.type}</td>
                      <td style={{ color: '#9ca3af', padding: '0.55rem 0.75rem', fontSize: '0.78rem' }}>{v.location}</td>
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <span style={{ padding: '0.18rem 0.55rem', borderRadius: 20, background: `${statusColor[v.status] || '#6b7280'}18`, color: statusColor[v.status] || '#6b7280', fontSize: '0.68rem', fontWeight: 700 }}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {violations.length === 0 && !loading && (
                    <tr><td colSpan={4} style={{ color: '#4b5563', textAlign: 'center', padding: '1.5rem' }}>No violations yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const cardStyle = { background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' };
const cardTitleStyle = { color: '#e5e7eb', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' };

export default Dashboard;
