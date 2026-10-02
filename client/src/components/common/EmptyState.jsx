import React from 'react';
import { Plus, Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data available",
  description = "No records have been entered yet.",
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-subtle)',
        margin: '16px 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(14, 165, 233, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: '16px'
        }}
      >
        <Icon size={28} />
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: actionLabel ? '20px' : '0' }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          <ActionIcon size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
