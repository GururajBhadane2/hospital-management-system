import React, { useState } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  X,
  ShieldCheck,
  Server,
  Code
} from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { useHospitalData } from '../../context/DataContext';

export const DatabaseModal = ({ isOpen, onClose }) => {
  const { syncAllToCloud, pullAllFromCloud } = useHospitalData();
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const connected = isSupabaseConfigured();
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';

  const handleCopyEnv = () => {
    const text = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-public-key-here`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleCopySqlLocation = () => {
    navigator.clipboard.writeText('supabase_schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handlePushToCloud = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing hospital state to Supabase...');
    try {
      const ok = await syncAllToCloud();
      if (ok) {
        setSyncStatus('All 19 collections successfully synced to Supabase!');
      } else {
        setSyncStatus('Notice: Ensure your Supabase tables are created first using supabase_schema.sql');
      }
    } catch (e) {
      setSyncStatus('Error syncing: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatus('Pulling data from Supabase...');
    try {
      const ok = await pullAllFromCloud();
      if (ok) {
        setSyncStatus('Successfully refreshed state from Supabase!');
      } else {
        setSyncStatus('No remote rows found or connection error.');
      }
    } catch (e) {
      setSyncStatus('Error pulling: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: connected
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(14, 165, 233, 0.15)',
                color: connected ? '#10b981' : '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {connected ? <Cloud size={22} /> : <Database size={22} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Supabase Database Setup & Status
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Cloud PostgreSQL storage for hospital operations (Free Tier)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Status Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: connected
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              marginBottom: '24px'
            }}
          >
            {connected ? (
              <CheckCircle2 size={24} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={24} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: connected ? '#10b981' : '#f59e0b' }}>
                  {connected ? 'Supabase Live Connected' : 'Local Storage Mode Active (Supabase Ready)'}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: connected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    fontWeight: 600
                  }}
                >
                  {connected ? 'Cloud Database' : 'Awaiting .env Keys'}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: 1.5 }}>
                {connected
                  ? `Connected to ${envUrl}. Mutations are automatically mirrored to your Supabase PostgreSQL cloud database.`
                  : 'Currently storing hospital state in your browser local storage. Follow the 3 quick steps below to attach Supabase free tier database.'}
              </p>
            </div>
          </div>

          {/* Cloud Sync Actions if Connected */}
          {connected && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}
            >
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
                Cloud Database Controls
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handlePushToCloud}
                  disabled={isSyncing}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UploadCloud size={16} />
                  <span>Sync All State to Supabase</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handlePullFromCloud}
                  disabled={isSyncing}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={16} className={isSyncing ? 'spin' : ''} />
                  <span>Refresh from Supabase</span>
                </button>
              </div>
              {syncStatus && (
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '10px', marginBottom: 0 }}>
                  {syncStatus}
                </p>
              )}
            </div>
          )}

          {/* Quick Step-by-Step Guide */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
              How to Connect Free Supabase in 3 Minutes:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Step 1 */}
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  background: 'var(--bg-surface)',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}
                >
                  1
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      Create a Free Project on Supabase
                    </span>
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                    >
                      <span>Open supabase.com</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Sign up (free), click <strong>"New Project"</strong>, choose a name (e.g. <code>apexcare-hms</code>) and set a database password.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  background: 'var(--bg-surface)',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}
                >
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Run the SQL Schema in Supabase
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>
                    In your Supabase project dashboard, open the <strong>SQL Editor</strong> tab on the left.
                    Open the prepared file <code>supabase_schema.sql</code> located in this project's root folder, paste it into the SQL Editor, and click <strong>"Run"</strong>.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        color: 'var(--text-main)'
                      }}
                    >
                      hospital-management-system/supabase_schema.sql
                    </span>
                    <button
                      onClick={handleCopySqlLocation}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                    >
                      <Copy size={12} />
                      <span>{copiedSql ? 'Copied path!' : 'Copy Path'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  background: 'var(--bg-surface)',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}
                >
                  3
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Add API Keys to <code>client/.env</code>
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>
                    In Supabase, navigate to <strong>Project Settings -&gt; API</strong> and copy your <strong>Project URL</strong> and <strong>anon public API key</strong>.
                    Create or edit <code>client/.env</code> with:
                  </p>
                  <pre
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      color: '#38bdf8',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      position: 'relative',
                      margin: 0
                    }}
                  >
                    VITE_SUPABASE_URL=https://your-project.supabase.co{'\n'}
                    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
                  </pre>
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={handleCopyEnv}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                    >
                      <Copy size={12} />
                      <span>{copiedEnv ? 'Copied template!' : 'Copy .env Template'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Free Tier Features info */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'rgba(14, 165, 233, 0.08)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.775rem',
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
              <span>
                <strong>Supabase Free Tier:</strong> 500MB PostgreSQL, 50,000 monthly users, unlimited API requests.
              </span>
            </div>
            <button
              onClick={onClose}
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 14px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseModal;
