import React from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  CalendarCheck,
  FileText,
  Pill,
  BedDouble,
  Wrench,
  FlaskConical,
  Receipt,
  Settings,
  ClipboardList,
  UserCheck,
  Search,
  CreditCard,
  HeartPulse,
  Sliders
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';

const Sidebar = ({ activeModule, setActiveModule, role }) => {
  const { currentRole } = useAuth();
  const { patientRequests, appointments } = useHospitalData();

  // Pending counts for badge indicators
  const pendingRequestsCount = (patientRequests || []).filter(r => r.status === 'Pending' || r.status === 'Under Review').length;
  const pendingAppointmentsCount = (appointments || []).filter(a => a.status === 'Pending Approval' || a.status === 'Requested').length;

  // Manager Navigation
  const managerNav = [
    { id: 'dashboard',    label: 'Command Center',          icon: LayoutDashboard },
    { id: 'requests',     label: 'Patient Requests',         icon: ClipboardList, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null, badgeColor: 'var(--warning)' },
    { id: 'patients',     label: 'Patients & Admissions',    icon: Users },
    { id: 'doctors',      label: 'Doctor Directory',         icon: Stethoscope },
    { id: 'departments',  label: 'Departments',              icon: Building2 },
    { id: 'appointments', label: 'Appointments',             icon: CalendarCheck, badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : null },
    { id: 'records',      label: 'Clinical Records (EHR)',   icon: FileText },
    { id: 'pharmacy',     label: 'Pharmacy & Stock',         icon: Pill },
    { id: 'wards',        label: 'Rooms & Bed Allocation',   icon: BedDouble },
    { id: 'equipment',    label: 'Medical Equipment',        icon: Wrench },
    { id: 'diagnostics',  label: 'Laboratory & Radiology',   icon: FlaskConical },
    { id: 'billing',      label: 'Billing & Invoices',       icon: Receipt },
    { id: 'settings',     label: 'Hospital Configuration',   icon: Settings },
  ];

  // Doctor Navigation
  const doctorNav = [
    { id: 'dashboard',    label: 'Clinical Dashboard',       icon: LayoutDashboard },
    { id: 'my-patients',  label: 'My Assigned Patients',     icon: Users },
    { id: 'consultation', label: 'Consultation & EHR',       icon: HeartPulse },
    { id: 'prescriptions',label: 'Digital Prescriptions',    icon: Pill },
    { id: 'profile',      label: 'Professional Profile',     icon: UserCheck },
  ];

  // Patient Navigation
  const patientNav = [
    { id: 'dashboard',    label: 'Patient Overview',         icon: LayoutDashboard },
    { id: 'request-care', label: 'Request Consultation',     icon: ClipboardList, highlight: true },
    { id: 'doctors',      label: 'Find Doctors & Depts',     icon: Search },
    { id: 'appointments', label: 'My Appointments',          icon: CalendarCheck },
  ];

  const activeRole = role || currentRole;
  let items = managerNav;
  let roleTitle = 'HOSPITAL MANAGEMENT';
  if (activeRole === ROLES.DOCTOR) {
    items = doctorNav;
    roleTitle = 'PHYSICIAN CLINICAL SUITE';
  } else if (activeRole === ROLES.PATIENT) {
    items = patientNav;
    roleTitle = 'PATIENT CARE PORTAL';
  }

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        overflowY: 'auto'
      }}
    >
      <div style={{ padding: '20px 20px 10px', fontSize: '0.675rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
        {roleTitle}
      </div>

      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: isActive
                  ? 'var(--primary-light)'
                  : item.highlight
                  ? 'rgba(14, 165, 233, 0.08)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(14, 165, 233, 0.4)'
                  : item.highlight
                  ? '1px solid rgba(14, 165, 233, 0.2)'
                  : '1px solid transparent',
                color: isActive
                  ? '#ffffff'
                  : item.highlight
                  ? 'var(--primary)'
                  : 'var(--text-muted)',
                fontWeight: isActive || item.highlight ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left',
                fontFamily: 'var(--font-sans)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = item.highlight ? 'rgba(14, 165, 233, 0.08)' : 'transparent';
                  e.currentTarget.style.color = item.highlight ? 'var(--primary)' : 'var(--text-muted)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  style={{
                    background: item.badgeColor || 'var(--primary)',
                    color: '#ffffff',
                    fontSize: '0.675rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '9999px'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.725rem',
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>MediCore HMS v2.4</span>
        <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
