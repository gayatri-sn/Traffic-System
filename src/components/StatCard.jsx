// components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, color, sub, trend }) => {
  const colors = {
    amber:  { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)',  icon: '#f59e0b', text: '#fbbf24' },
    red:    { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   icon: '#ef4444', text: '#f87171' },
    blue:   { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  icon: '#3b82f6', text: '#60a5fa' },
    green:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)', icon: '#10b981', text: '#34d399' },
    purple: { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.25)', icon: '#8b5cf6', text: '#a78bfa' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 16,
      padding: '1.4rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${c.border}`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100,
        background: c.icon,
        borderRadius: '50%',
        opacity: 0.05,
        filter: 'blur(20px)',
      }} />
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div style={{ color: '#9ca3af', fontSize: '0.72rem', letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ color: '#f9fafb', fontSize: '2rem', fontWeight: 800, lineHeight: 1, fontFamily: 'Georgia, serif' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {sub && (
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: 6 }}>{sub}</div>
          )}
          {trend !== undefined && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className={`bi ${trend >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right'}`}
                style={{ color: trend >= 0 ? '#10b981' : '#ef4444', fontSize: 12 }} />
              <span style={{ color: trend >= 0 ? '#10b981' : '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>
                {Math.abs(trend)}% vs last week
              </span>
            </div>
          )}
        </div>
        <div style={{
          width: 48, height: 48,
          background: `linear-gradient(135deg, ${c.icon}33, ${c.icon}11)`,
          border: `1px solid ${c.icon}44`,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: c.icon,
          flexShrink: 0,
        }}>
          <i className={`bi ${icon}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
