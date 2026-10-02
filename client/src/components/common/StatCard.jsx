import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  onClick,
  badge
}) => {
  const colorMap = {
    primary: {
      bg: 'rgba(14, 165, 233, 0.1)',
      border: 'rgba(14, 165, 233, 0.3)',
      text: '#0ea5e9'
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#10b981'
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#f59e0b'
    },
    rose: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#ef4444'
    },
    indigo: {
      bg: 'rgba(99, 102, 241, 0.1)',
      border: 'rgba(99, 102, 241, 0.3)',
      text: '#6366f1'
    }
  }[color] || {
    bg: 'rgba(14, 165, 233, 0.1)',
    border: 'rgba(14, 165, 233, 0.3)',
    text: '#0ea5e9'
  };

  const isZero = value === 0 || value === '0' || value === '$0';

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = colorMap.border;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: colorMap.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colorMap.text
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: isZero ? 'var(--text-dim)' : 'var(--text-main)', letterSpacing: '-0.03em' }}>
          {value}
        </span>
        {badge && (
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: colorMap.bg, color: colorMap.text, fontWeight: 600 }}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.785rem', color: isZero ? 'var(--text-dim)' : 'var(--text-muted)', marginTop: '8px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
