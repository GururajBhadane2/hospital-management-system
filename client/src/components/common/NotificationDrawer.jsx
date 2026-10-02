import React from 'react';
import { X, Bell, CheckCircle2, Clock } from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';

export const NotificationDrawer = ({ isOpen, onClose, role, onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHospitalData();

  if (!isOpen) return null;

  const roleNotifs = (notifications || []).filter(
    n => !n.targetRole || n.targetRole === role || n.targetRole === 'ALL'
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(14, 165, 233, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Notifications
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {role} Operations Dispatch
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {roleNotifs.length > 0 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => markAllNotificationsRead(role)}
                title="Mark all as read"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {roleNotifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-dim)' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No unread notifications</p>
              <span style={{ fontSize: '0.75rem' }}>You're all caught up with your operational stream.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roleNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (onNavigate && n.link) {
                      onNavigate(n.link);
                      onClose();
                    }
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: n.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(14, 165, 233, 0.07)',
                    border: `1px solid ${n.read ? 'var(--border-subtle)' : 'rgba(14, 165, 233, 0.3)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: n.read ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} />
                      {n.timestamp}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
