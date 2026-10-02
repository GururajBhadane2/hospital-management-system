import React, { useState, useEffect } from 'react';
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
  Code,
  Key,
  Link,
  Trash2
} from 'lucide-react';
import {
  isSupabaseConfigured,
  getActiveSupabaseUrl,
  getActiveSupabaseAnonKey,
  saveSupabaseCredentials,
  clearSupabaseCredentials
} from '../../services/supabaseClient';
import { useHospitalData } from '../../context/DataContext';

export const DatabaseModal = ({ isOpen, onClose }) => {
  const { syncAllToCloud, pullAllFromCloud } = useHospitalData();
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form input state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSupabaseUrl(getActiveSupabaseUrl());
      setSupabaseAnonKey(getActiveSupabaseAnonKey());
      setSyncStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const connected = isSupabaseConfigured();

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setSyncStatus('Please enter both Supabase Project URL and Anon Public Key.');
      return;
    }

    if (!supabaseUrl.startsWith('https://')) {
      setSyncStatus('Project URL must start with https://');
      return;
    }

    saveSupabaseCredentials(supabaseUrl.trim(), supabaseAnonKey.trim());
    setSaveSuccess(true);
    setSyncStatus('Supabase credentials saved successfully! Cloud connection active.');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearCredentials = () => {
    clearSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    setSyncStatus('Supabase credentials cleared. System returned to local storage mode.');
  };

  const handleCopyEnv = () => {
    const text = `VITE_SUPABASE_URL=${supabaseUrl || 'https://your-project-id.supabase.co'}\nVITE_SUPABASE_ANON_KEY=${supabaseAnonKey || 'your-anon-public-key-here'}`;
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
    setSyncStatus('Syncing hospital state to Supabase PostgreSQL database...');
    try {
      const ok = await syncAllToCloud();
      if (ok) {
        setSyncStatus('All 19 collections successfully synced to Supabase!');
      } else {
        setSyncStatus('Notice: Ensure your Supabase tables are created first using supabase_schema.sql in SQL Editor');
      }
    } catch (e) {
      setSyncStatus('Error syncing: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    setSyncStatus('Pulling data from Supabase PostgreSQL...');
    try {
      const ok = await pullAllFromCloud();
      if (ok) {
        setSyncStatus('Successfully refreshed state from Supabase!');
      } else {
        setSyncStatus('No remote rows found or check table permissions.');
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
          maxWidth: '720px',
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
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: connected
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              {connected ? <Cloud size={22} /> : <Database size={22} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Link Supabase Cloud Database (Free Tier)
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                PostgreSQL persistence for doctors, patients, appointments, prescriptions, and EMR
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
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              gap: '14px'
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
                  {connected ? 'Supabase Live Connected' : 'Local Storage Mode Active (Connect Your Supabase)'}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: connected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    fontWeight: 600,
                    color: connected ? '#10b981' : '#f59e0b'
                  }}
                >
                  {connected ? 'Cloud Synced' : 'Ready to Connect'}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: 1.5 }}>
                {connected
                  ? `Connected to ${getActiveSupabaseUrl()}. All clinical and hospital operations will automatically sync to your cloud database.`
                  : 'Paste your Supabase credentials below to connect your free Supabase PostgreSQL database.'}
              </p>
            </div>
          </div>

          {/* Interactive Credential Input Form */}
          <form
            onSubmit={handleSaveCredentials}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} style={{ color: 'var(--primary)' }} />
                <span>Enter Your Supabase Credentials</span>
              </h3>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Project URL (Found in Project Settings ➔ API)
              </label>
              <input
                type="text"
                className="form-input"
                style={{ height: '40px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                placeholder="https://xyzabcdefghijklmnop.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Anon Public API Key (Found in Project Settings ➔ API ➔ Project API Keys)
              </label>
              <input
                type="password"
                className="form-input"
                style={{ height: '40px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontWeight: 700 }}
                >
                  <Link size={14} />
                  <span>Save & Connect Database</span>
                </button>

                {connected && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClearCredentials}
                    style={{ padding: '8px 14px', color: 'var(--danger)' }}
                  >
                    <Trash2 size={14} />
                    <span>Disconnect</span>
                  </button>
                )}
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Saved locally in browser & ready for cloud sync
              </span>
            </div>
          </form>

          {/* Cloud Sync Actions if Connected */}
          {connected && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
                Cloud Database Synchronization
              </h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handlePushToCloud}
                  disabled={isSyncing}
                >
                  <UploadCloud size={14} />
                  <span>{isSyncing ? 'Syncing...' : 'Upload Local Data to Supabase'}</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handlePullFromCloud}
                  disabled={isSyncing}
                >
                  <RefreshCw size={14} />
                  <span>Refresh / Pull From Supabase</span>
                </button>
              </div>
            </div>
          )}

          {/* Sync Status Banner */}
          {syncStatus && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: syncStatus.includes('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                border: `1px solid ${syncStatus.includes('Error') ? 'rgba(239, 68, 68, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
                color: syncStatus.includes('Error') ? 'var(--danger)' : 'var(--primary)',
                fontSize: '0.85rem'
              }}
            >
              {syncStatus}
            </div>
          )}

          {/* 3 Step Setup Guide */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--teal)' }} />
              <span>How to Get Free Supabase Account & Database in 3 Minutes:</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  1
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block' }}>
                    Create a Free Project on Supabase
                  </strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>supabase.com</a>, log in to your account, and click <strong>"New Project"</strong>. Choose a name and database password.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  2
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block' }}>
                    Run the SQL Schema Script (Creates all 19 Tables)
                  </strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 8px 0' }}>
                    In your Supabase project left sidebar, click <strong>SQL Editor</strong> ➔ <strong>New Query</strong>, and paste the script from <code style={{ color: 'var(--teal)' }}>supabase_schema.sql</code>.
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCopySqlLocation}
                  >
                    <Code size={13} />
                    <span>{copiedSql ? '✓ Filename Copied!' : 'Copy Script Name: supabase_schema.sql'}</span>
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  3
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block' }}>
                    Copy Your API Keys & Paste Above
                  </strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    In Supabase, click <strong>Project Settings (Gear icon)</strong> ➔ <strong>API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public</strong> key, then paste them into the form above and click <strong>"Save & Connect"</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseModal;
