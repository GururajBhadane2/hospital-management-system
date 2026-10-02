import React from 'react';
import {
  ShieldCheck,
  Stethoscope,
  User,
  Activity,
  Building2,
  Lock,
  ArrowRight,
  Database,
  Workflow,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';

export const LandingPage = () => {
  const { loginAsManager, loginAsDoctor, loginAsPatient } = useAuth();
  const { isDemoMode, loadCleanSlate, loadDemoData, hospital } = useHospitalData();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% -20%, #172554 0%, #090d16 65%, #050811 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
            }}
          >
            <Activity size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              ApexCare OS
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Hospital Operating & Clinical Management Platform
            </p>
          </div>
        </div>

        {/* Evaluation State Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDemoMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                Demo Test Data Active
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={loadCleanSlate}
                style={{ fontSize: '0.75rem' }}
              >
                Reset to Clean Slate (0)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                Clean Production Slate Active
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={loadDemoData}
                style={{ fontSize: '0.75rem' }}
              >
                <Sparkles size={13} style={{ color: '#0ea5e9' }} />
                Load Sample Test Data
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: '64px 32px 48px', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(14, 165, 233, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '20px'
            }}
          >
            <Lock size={14} />
            <span>SECURE ROLE-BASED OPERATIONAL SYSTEM</span>
          </div>

          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Centralized Operating Platform for Modern Hospital Infrastructure
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6 }}>
            A role-governed digital command ecosystem enabling hospital administrators, physicians, and patients to seamlessly manage triage requests, clinical records, doctor scheduling, pharmacy inventory, and hospital resources.
          </p>
        </div>

        {/* Three Dedicated Login Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '64px' }}>
          {/* Manager / Admin Portal */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0ea5e9';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(14, 165, 233, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0ea5e9',
                marginBottom: '20px'
              }}
            >
              <ShieldCheck size={26} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Role 1 • Operational Authority
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
              Hospital Manager / Admin
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '24px' }}>
              Configure hospital information, review incoming patient triage requests, assign doctors, manage departments, monitor bed allocation, pharmacy stock, and full audit compliance.
            </p>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
              onClick={loginAsManager}
            >
              <span>Enter Manager Portal</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Doctor Portal */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#14b8a6';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(20, 184, 166, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#14b8a6',
                marginBottom: '20px'
              }}
            >
              <Stethoscope size={26} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#14b8a6', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Role 2 • Clinical Workspace
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
              Doctor & Physician Suite
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '24px' }}>
              Access authorized patient queues, write consultation clinical notes, generate digital prescriptions, order laboratory tests, schedule radiology, and manage clinic availability.
            </p>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', borderColor: 'rgba(20, 184, 166, 0.4)', color: '#2dd4bf' }}
              onClick={() => loginAsDoctor('DOC-101')}
            >
              <span>Enter Doctor Portal</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Patient Portal */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1',
                marginBottom: '20px'
              }}
            >
              <User size={26} />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Role 3 • Patient Services
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
              Patient Care Access Portal
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, flex: 1, marginBottom: '24px' }}>
              Submit structured consultation requests with symptom details, discover hospital specialists, view issued prescriptions, access lab & radiology reports, and simulate invoice settlements.
            </p>

            <button
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', borderColor: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' }}
              onClick={() => loginAsPatient('PAT-1001')}
            >
              <span>Enter Patient Portal</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Operational Pillars */}
        <div
          style={{
            padding: '32px',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontWeight: 700, marginBottom: '8px' }}>
              <Workflow size={18} />
              <span>Intelligent Patient Triage</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Patients request care with category and symptoms; administrators review, assign departments, and route to appropriate medical specialists.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14b8a6', fontWeight: 700, marginBottom: '8px' }}>
              <Database size={18} />
              <span>Real-Time Resource Management</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Live bed allocation, hospital equipment maintenance tracking, formulary stock monitoring, and dynamic capacity counters.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: 700, marginBottom: '8px' }}>
              <Lock size={18} />
              <span>Enterprise RBAC & Audit</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Strict role-based data boundary segregation prepared for Supabase Row Level Security and immutable compliance logging.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '24px 48px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#64748b'
        }}
      >
        <span>ApexCare Hospital Operating System • Secure Healthcare Infrastructure</span>
      </footer>
    </div>
  );
};
