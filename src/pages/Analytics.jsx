// pages/Analytics.jsx
import React, { useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import PageWrapper from '../components/PageWrapper';
import { mockCongestion, mockAccidentZones, mockViolationTypes, mockMonthlyViolations, mockDailyViolations } from '../utils/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler);

const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#9ca3af', font: { size: 11 }, boxWidth: 12 } },
    tooltip: { backgroundColor: '#1f2937', titleColor: '#f9fafb', bodyColor: '#d1d5db', borderColor: 'rgba(251,191,36,0.2)', borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

const Analytics = () => {
  const [period, setPeriod] = useState('monthly');

  // Congestion line chart
  const congestionData = {
    labels: mockCongestion.map(c => c.time),
    datasets: [{
      label: 'Congestion Level (%)',
      data: mockCongestion.map(c => c.level),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(251,191,36,0.1)',
      borderWidth: 2.5, tension: 0.4, fill: true,
      pointBackgroundColor: '#f59e0b', pointRadius: 4,
    }],
  };

  // Violation frequency bar
  const freqData = {
    labels: mockViolationTypes.map(v => v.type),
    datasets: [{
      label: 'Frequency',
      data: mockViolationTypes.map(v => v.count),
      backgroundColor: ['rgba(251,191,36,0.7)','rgba(239,68,68,0.7)','rgba(59,130,246,0.7)','rgba(16,185,129,0.7)','rgba(139,92,246,0.7)','rgba(236,72,153,0.7)'],
      borderRadius: 6, borderWidth: 0,
    }],
  };

  // Radar for zone risk
  const radarData = {
    labels: ['MG Road', 'Highway 48', 'Central Mkt', 'Airport Rd', 'Ring Road', 'SG Hwy'],
    datasets: [
      {
        label: 'Incident Count',
        data: [42, 38, 31, 28, 22, 18],
        backgroundColor: 'rgba(239,68,68,0.2)',
        borderColor: '#ef4444',
        borderWidth: 2, pointBackgroundColor: '#ef4444',
      },
      {
        label: 'Severity Score',
        data: [35, 45, 28, 30, 20, 25],
        backgroundColor: 'rgba(251,191,36,0.15)',
        borderColor: '#f59e0b',
        borderWidth: 2, pointBackgroundColor: '#f59e0b',
      },
    ],
  };

  const radarOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#9ca3af', font: { size: 11 } } }, tooltip: chartOpts.plugins.tooltip },
    scales: { r: { ticks: { color: '#6b7280', backdropColor: 'transparent', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.08)' }, pointLabels: { color: '#9ca3af', font: { size: 11 } } } },
  };

  const trendData = {
    labels: (period === 'monthly' ? mockMonthlyViolations : mockDailyViolations).map(d => d.month || d.day),
    datasets: [
      {
        label: 'Violations',
        data: (period === 'monthly' ? mockMonthlyViolations : mockDailyViolations).map(d => d.violations),
        borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)',
        borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: '#3b82f6', pointRadius: 3,
      },
    ],
  };

  const severityColor = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

  return (
    <PageWrapper>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ color: '#f9fafb', fontWeight: 800, fontSize: '1.6rem', fontFamily: 'Georgia, serif', marginBottom: 4 }}>
            Traffic Analytics
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            Deep insights into congestion patterns, violation trends, and high-risk zones
          </p>
        </div>
        <div className="d-flex gap-2">
          {['daily', 'monthly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '0.4rem 1rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
              background: period === p ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
              border: period === p ? '1px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,255,255,0.1)',
              color: period === p ? '#f59e0b' : '#6b7280', cursor: 'pointer',
              textTransform: 'capitalize',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Peak Hour', value: '6 PM – 8 PM', icon: 'bi-clock-fill', color: '#f59e0b' },
          { label: 'Highest Risk Zone', value: 'MG Road', icon: 'bi-geo-alt-fill', color: '#ef4444' },
          { label: 'Most Common Violation', value: 'Speeding', icon: 'bi-speedometer', color: '#3b82f6' },
          { label: 'Avg Response Time', value: '4.2 min', icon: 'bi-stopwatch-fill', color: '#10b981' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="col-6 col-md-3">
            <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 18, flexShrink: 0 }}>
                <i className={`bi ${icon}`} />
              </div>
              <div>
                <div style={{ color: '#6b7280', fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                <div style={{ color: '#f9fafb', fontWeight: 700, fontSize: '0.9rem' }}>{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="row g-3 mb-3">
        {/* Congestion */}
        <div className="col-12 col-lg-8">
          <div style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={titleStyle}><i className="bi bi-activity me-2 text-warning" />Traffic Congestion Trend (Today)</h6>
              <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '0.2rem 0.65rem', fontSize: '0.72rem', fontWeight: 600 }}>
                <i className="bi bi-dot" />Peak: 6PM (92%)
              </span>
            </div>
            <div style={{ height: 230 }}><Line data={congestionData} options={chartOpts} /></div>
          </div>
        </div>

        {/* Trend */}
        <div className="col-12 col-lg-4">
          <div style={cardStyle}>
            <h6 style={{ ...titleStyle, marginBottom: '1rem' }}><i className="bi bi-graph-up-arrow me-2 text-primary" />{period === 'monthly' ? 'Monthly' : 'Weekly'} Trend</h6>
            <div style={{ height: 230 }}><Line data={trendData} options={chartOpts} /></div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        {/* Frequency */}
        <div className="col-12 col-lg-6">
          <div style={cardStyle}>
            <h6 style={{ ...titleStyle, marginBottom: '1rem' }}><i className="bi bi-bar-chart-fill me-2 text-success" />Violation Frequency by Type</h6>
            <div style={{ height: 240 }}><Bar data={freqData} options={chartOpts} /></div>
          </div>
        </div>

        {/* Radar */}
        <div className="col-12 col-lg-6">
          <div style={cardStyle}>
            <h6 style={{ ...titleStyle, marginBottom: '1rem' }}><i className="bi bi-crosshair me-2 text-danger" />Accident-Prone Zone Analysis</h6>
            <div style={{ height: 240 }}><Radar data={radarData} options={radarOpts} /></div>
          </div>
        </div>
      </div>

      {/* Accident zones table */}
      <div style={cardStyle}>
        <h6 style={{ ...titleStyle, marginBottom: '1rem' }}><i className="bi bi-geo-alt-fill me-2 text-danger" />High-Risk Locations</h6>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Rank', 'Location', 'Total Incidents', 'Severity', 'Risk Score'].map(h => (
                  <th key={h} style={{ color: '#6b7280', fontWeight: 600, padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockAccidentZones.map((z, i) => {
                const score = Math.round((z.incidents / 42) * 100);
                return (
                  <tr key={z.area} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={tdStyle}>
                      <span style={{ width: 26, height: 26, borderRadius: 8, background: i === 0 ? 'rgba(239,68,68,0.2)' : i === 1 ? 'rgba(251,191,36,0.2)' : 'rgba(59,130,246,0.15)', color: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#60a5fa', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                        {i + 1}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#e5e7eb' }}>{z.area}</td>
                    <td style={tdStyle}><span style={{ color: '#f9fafb', fontWeight: 700 }}>{z.incidents}</span> incidents</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '0.22rem 0.6rem', borderRadius: 20, background: `${severityColor[z.severity]}18`, color: severityColor[z.severity], fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${severityColor[z.severity]}33` }}>{z.severity}</span>
                    </td>
                    <td style={tdStyle}>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ height: 6, width: 100, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${score}%`, background: score > 70 ? '#ef4444' : score > 50 ? '#f59e0b' : '#10b981', borderRadius: 10 }} />
                        </div>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{score}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
};

const cardStyle = { background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' };
const titleStyle = { color: '#e5e7eb', fontWeight: 700, fontSize: '0.9rem', margin: 0 };
const tdStyle = { color: '#d1d5db', padding: '0.7rem 0.75rem', verticalAlign: 'middle' };
const severityColor = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

export default Analytics;
