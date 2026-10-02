import React, { useState } from 'react';
import {
  Hospital,
  Shield,
  Stethoscope,
  User,
  Bell,
  Activity,
  LogOut,
  ChevronDown,
  Sparkles,
  Check,
  Database,
  Cloud
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import NotificationDrawer from '../common/NotificationDrawer';
import AuditDrawer from '../common/AuditDrawer';
import DatabaseModal from '../common/DatabaseModal';
import { isSupabaseConfigured } from '../../services/supabaseClient';

const Navbar = ({ activeModule, setActiveModule }) => {
  const {
    currentRole,
    loginAsManager,
    loginAsDoctor,
    loginAsPatient,
    logout,
    activeDoctorId,
    setActiveDoctorId,
    activePatientId,
    setActivePatientId
  } = useAuth();

  const {
    hospital,
    isDemoMode,
    loadCleanSlate,
    loadDemoData,
    notifications,
    doctors,
    patients
  } = useHospitalData();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [auditDrawerOpen, setAuditDrawerOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const isCloudDb = isSupabaseConfigured();

  const unreadCount = (notifications || []).filter(
    n => !n.read && (!n.targetRole || n.targetRole === currentRole || n.targetRole === 'ALL')
  ).length;

  const currentDoctor = (doctors || []).find(d => d.id === activeDoctorId) || (doctors || [])[0];
  const currentPatient = (patients || []).find(p => p.id === activePatientId) || (patients || [])[0];

  const getRoleBadge = () => {
    switch (currentRole) {
      case ROLES.MANAGER:
        return { label: 'HOSPITAL MANAGER / ADMIN', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.15)', icon: Shield };
      case ROLES.DOCTOR:
        return { label: `DR. ${currentDoctor?.name?.split(' ').slice(-1)[0] || 'Physician'}`, color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)', icon: Stethoscope };
      case ROLES.PATIENT:
        return { label: `PATIENT: ${currentPatient?.name?.split(' ')[0] || 'Portal'}`, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', icon: User };
      default:
        return { label: 'PUBLIC ACCESS', color: '#94a3b8', bg: 'rgba(255, 255, 255, 0.08)', icon: Hospital };
    }
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  const handleNavigate = (module) => {
    if (setActiveModule) setActiveModule(module);
  };

  return (
    <>
      <header
        style={{
          height: '64px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0
        }}
      >
        {/* Left: Hospital Name & Environment Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(14, 165, 233, 0.3)',
                flexShrink: 0
              }}
            >
              <Hospital size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {(hospital && hospital.name) ? hospital.name : 'MediCore HMS'}
              </h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>
                Hospital Operations Platform
              </p>
            </div>
          </div>

          {/* Environment Mode Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isDemoMode ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  color: '#f59e0b'
                }}
              >
                <Sparkles size={12} />
                <span>DEMO DATA ACTIVE</span>
                <button
                  onClick={loadCleanSlate}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#cbd5e1',
                    fontSize: '0.7rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginLeft: '4px',
                    fontFamily: 'var(--font-sans)'
                  }}
                  title="Switch to empty hospital state"
                >
                  [Reset]
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '9999px',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  color: '#10b981'
                }}
              >
                <span>CLEAN SLATE</span>
                <button
                  onClick={loadDemoData}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#93c5fd',
                    fontSize: '0.7rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginLeft: '4px',
                    fontFamily: 'var(--font-sans)'
                  }}
                  title="Load sample data for evaluation"
                >
                  [Load Demo]
                </button>
              </div>
            )}

            {/* Supabase Cloud DB Status Indicator */}
            <button
              onClick={() => setDbModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                background: isCloudDb ? 'rgba(16, 185, 129, 0.12)' : 'rgba(14, 165, 233, 0.12)',
                border: `1px solid ${isCloudDb ? 'rgba(16, 185, 129, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
                borderRadius: '9999px',
                fontSize: '0.725rem',
                fontWeight: 700,
                color: isCloudDb ? '#10b981' : '#0ea5e9',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.15s ease'
              }}
              title="Click to view Supabase database setup & status"
            >
              {isCloudDb ? <Cloud size={12} /> : <Database size={12} />}
              <span>{isCloudDb ? 'SUPABASE CLOUD' : 'DATABASE: SETUP'}</span>
            </button>
          </div>
        </div>

        {/* Right: Audit Log, Notifications, Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Audit Log */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAuditDrawerOpen(true)}
            title="System Audit Log"
            style={{ padding: '7px 11px' }}
          >
            <Activity size={15} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.8rem' }}>Audit Trail</span>
          </button>

          {/* Notifications */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setNotifDrawerOpen(true)}
            style={{ position: 'relative', padding: '7px 11px' }}
            title="Operational Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--danger)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-surface)'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: roleInfo.bg,
                border: `1px solid ${roleInfo.color}40`,
                borderRadius: 'var(--radius-md)',
                color: roleInfo.color,
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)'
              }}
            >
              <RoleIcon size={16} />
              <span>{roleInfo.label}</span>
              <ChevronDown size={14} />
            </button>

            {roleDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '280px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '8px 10px', fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Switch Operational Role
                </div>

                {/* Manager */}
                <button
                  onClick={() => {
                    loginAsManager();
                    setRoleDropdownOpen(false);
                    handleNavigate('dashboard');
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                    background: currentRole === ROLES.MANAGER ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                    border: 'none', color: currentRole === ROLES.MANAGER ? '#0ea5e9' : 'var(--text-main)',
                    fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} />
                    <span>Hospital Manager / Admin</span>
                  </div>
                  {currentRole === ROLES.MANAGER && <Check size={14} />}
                </button>

                {/* Doctor */}
                <div style={{ marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      loginAsDoctor(activeDoctorId || ((doctors || [])[0]?.id));
                      setRoleDropdownOpen(false);
                      handleNavigate('dashboard');
                    }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                      background: currentRole === ROLES.DOCTOR ? 'rgba(20, 184, 166, 0.15)' : 'transparent',
                      border: 'none', color: currentRole === ROLES.DOCTOR ? '#14b8a6' : 'var(--text-main)',
                      fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Stethoscope size={16} />
                      <span>Doctor Portal</span>
                    </div>
                    {currentRole === ROLES.DOCTOR && <Check size={14} />}
                  </button>

                  {(doctors || []).length > 0 && currentRole === ROLES.DOCTOR && (
                    <select
                      className="form-select"
                      style={{ margin: '4px 0 8px', fontSize: '0.75rem', height: '30px', padding: '4px 8px' }}
                      value={activeDoctorId}
                      onChange={(e) => setActiveDoctorId(e.target.value)}
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Patient */}
                <div style={{ marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      loginAsPatient(activePatientId || ((patients || [])[0]?.id));
                      setRoleDropdownOpen(false);
                      handleNavigate('dashboard');
                    }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                      background: currentRole === ROLES.PATIENT ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: 'none', color: currentRole === ROLES.PATIENT ? '#6366f1' : 'var(--text-main)',
                      fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} />
                      <span>Patient Portal</span>
                    </div>
                    {currentRole === ROLES.PATIENT && <Check size={14} />}
                  </button>

                  {(patients || []).length > 0 && currentRole === ROLES.PATIENT && (
                    <select
                      className="form-select"
                      style={{ margin: '4px 0 8px', fontSize: '0.75rem', height: '30px', padding: '4px 8px' }}
                      value={activePatientId}
                      onChange={(e) => setActivePatientId(e.target.value)}
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.admissionStatus || 'Patient'})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ margin: '6px 0', borderTop: '1px solid var(--border-subtle)' }} />

                {/* Exit to Landing Page */}
                <button
                  onClick={() => {
                    logout();
                    setRoleDropdownOpen(false);
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'transparent', border: 'none', color: 'var(--danger)',
                    fontSize: '0.825rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)'
                  }}
                >
                  <LogOut size={14} />
                  <span>Exit / Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Drawers */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        role={currentRole}
        onNavigate={handleNavigate}
      />

      <AuditDrawer
        isOpen={auditDrawerOpen}
        onClose={() => setAuditDrawerOpen(false)}
      />

      <DatabaseModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
