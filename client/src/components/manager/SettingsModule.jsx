import React, { useState } from 'react';
import {
  Settings,
  Save,
  Hospital,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  Lock,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';

export const SettingsModule = ({ onOpenSetupWizard }) => {
  const { hospital, updateHospitalConfig, loadCleanSlate, loadDemoData, isDemoMode } = useHospitalData();

  const [form, setForm] = useState({
    name: hospital.name || '',
    tagline: hospital.tagline || '',
    registrationNumber: hospital.registrationNumber || '',
    phone: hospital.phone || '',
    emergencyPhone: hospital.emergencyPhone || '',
    email: hospital.email || '',
    address: hospital.address || '',
    city: hospital.city || '',
    state: hospital.state || '',
    workingHours: hospital.workingHours || '24/7 Operations',
    billingCurrency: hospital.billingCurrency || 'USD ($)',
    taxRate: hospital.taxRate || 0
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateHospitalConfig(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={22} style={{ color: 'var(--primary)' }} />
          <span>Hospital Configuration & System Operations</span>
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Operational profile, emergency numbers, currency formatting, and automation webhook readiness
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
          <CheckCircle2 size={18} />
          <span>Hospital operational parameters saved successfully to system storage!</span>
        </div>
      )}

      {/* Hospital Identity Card */}
      <form onSubmit={handleSave} className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Hospital size={18} style={{ color: 'var(--primary)' }} />
              <span>Hospital Master Information</span>
            </div>
            <div className="card-subtitle">
              Configured by the authorized Hospital Manager
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            <Save size={14} />
            Save Parameters
          </button>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Hospital Name *</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tagline / Mission</label>
            <input
              type="text"
              className="form-input"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hospital Registration / License #</label>
            <input
              type="text"
              className="form-input"
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Telephone</label>
            <input
              type="text"
              className="form-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trauma / Emergency Hotline</label>
            <input
              type="text"
              className="form-input"
              value={form.emergencyPhone}
              onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Administrative Email</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Street Address & City</label>
            <input
              type="text"
              className="form-input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Billing Currency Format</label>
            <select
              className="form-select"
              value={form.billingCurrency}
              onChange={(e) => setForm({ ...form, billingCurrency: e.target.value })}
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
              <option value="INR (₹)">INR (₹)</option>
              <option value="CAD ($)">CAD ($)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Applicable Tax / VAT (%)</label>
            <input
              type="number"
              className="form-input"
              value={form.taxRate}
              onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={15} />
            Commit Configuration
          </button>
        </div>
      </form>

      {/* Architecture & Future Supabase / n8n Readiness Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Database size={18} style={{ color: 'var(--info)' }} />
              <span>Future Backend & Automation Architecture Readiness</span>
            </div>
            <div className="card-subtitle">
              Engineered according to specification for Supabase and n8n webhook pipelines
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--teal)', fontWeight: 700, marginBottom: '6px' }}>
              <Lock size={16} />
              <span>Supabase Row Level Security (RLS) Ready</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Service interfaces (DoctorService, PatientService, BillingService, etc.) are strictly partitioned by user role IDs for drop-in migration to PostgreSQL RLS policies.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, marginBottom: '6px' }}>
              <Zap size={16} />
              <span>n8n Workflow Automation Hooks Active</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Standard event emitters wired for <code>patient.request.created</code>, <code>appointment.scheduled</code>, and <code>billing.payment.received</code> for external SMS, email, and reminder workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Environment Control Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <RotateCcw size={18} style={{ color: 'var(--warning)' }} />
              <span>Operational Environment Management</span>
            </div>
            <div className="card-subtitle">
              Reset to clean slate or load evaluation demo dataset
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
              Current Status: {isDemoMode ? 'Evaluation Demo Dataset Active' : 'Clean Slate (0 Data) Active'}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Clean slate empties all doctors, patients, beds, and appointments so a real hospital manager can enter real data.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={loadCleanSlate}>
              Reset to Clean Slate (0)
            </button>
            <button className="btn btn-primary btn-sm" onClick={loadDemoData}>
              <Sparkles size={13} />
              Load Sample Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
