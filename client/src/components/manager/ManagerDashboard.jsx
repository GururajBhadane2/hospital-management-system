import React from 'react';
import {
  Users,
  Stethoscope,
  Building2,
  BedDouble,
  ClipboardList,
  CalendarCheck,
  Receipt,
  Pill,
  ArrowRight,
  Plus,
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';

export const ManagerDashboard = ({ onNavigate, onOpenSetupWizard }) => {
  const {
    hospital,
    isDemoMode,
    loadDemoData,
    doctors,
    patients,
    departments,
    beds,
    patientRequests,
    appointments,
    bills,
    pharmacyOrders,
    auditLogs
  } = useHospitalData();

  // Dynamic calculations from live data layer
  const totalDoctors = doctors.length;
  const totalPatients = patients.length;
  const totalDepartments = departments.length;
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'Available').length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const pendingRequests = patientRequests.filter(r => r.status === 'Pending' || r.status === 'Under Review');
  const todayAppointments = appointments.length;
  const pendingBills = bills.filter(b => b.status !== 'Paid').length;
  const activePharmacyOrders = pharmacyOrders.filter(o => o.status !== 'Completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hospital Banner & Setup Prompt if not configured */}
      {!hospital.isConfigured && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              Welcome to Your Hospital Management Platform
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Complete the 9-step Hospital Setup Wizard to configure your departments, doctors, rooms, and billing policies.
            </p>
          </div>
          <button className="btn btn-primary" onClick={onOpenSetupWizard}>
            Launch Setup Wizard
          </button>
        </div>
      )}

      {/* Primary Dynamic Operational Counters (Initially 0 in clean slate, dynamic from data store) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Hospital Operational Command Center</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Real-time telemetry and resource allocation for {hospital.name || 'Hospital'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('requests')}>
              <ClipboardList size={14} />
              Review Triage Queue ({pendingRequests.length})
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('doctors')}>
              <Plus size={14} />
              + Add Doctor
            </button>
          </div>
        </div>

        <div className="grid-4">
          <StatCard
            title="Total Doctors"
            value={totalDoctors}
            subtitle={totalDoctors > 0 ? `${doctors.filter(d => d.status === 'Active').length} Active on Duty` : 'No doctors added yet'}
            icon={Stethoscope}
            color="primary"
            onClick={() => onNavigate('doctors')}
          />
          <StatCard
            title="Total Patients"
            value={totalPatients}
            subtitle={totalPatients > 0 ? `${patients.filter(p => p.admissionStatus === 'Inpatient').length} Inpatients admitted` : 'No patients registered'}
            icon={Users}
            color="indigo"
            onClick={() => onNavigate('patients')}
          />
          <StatCard
            title="Clinical Departments"
            value={totalDepartments}
            subtitle={totalDepartments > 0 ? 'Divisions active' : 'No departments configured'}
            icon={Building2}
            color="emerald"
            onClick={() => onNavigate('departments')}
          />
          <StatCard
            title="Available Beds"
            value={availableBeds}
            badge={`${occupancyPercent}% Occupied`}
            subtitle={totalBeds > 0 ? `${occupiedBeds} of ${totalBeds} beds in use` : 'No beds cataloged yet'}
            icon={BedDouble}
            color={occupancyPercent > 85 ? 'rose' : 'emerald'}
            onClick={() => onNavigate('beds')}
          />
        </div>

        <div className="grid-4" style={{ marginTop: '16px' }}>
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            badge={pendingRequests.length > 0 ? 'Requires Action' : 'All Clear'}
            subtitle={pendingRequests.length > 0 ? 'Triage patients awaiting doctor' : 'No incoming requests'}
            icon={ClipboardList}
            color={pendingRequests.length > 0 ? 'amber' : 'emerald'}
            onClick={() => onNavigate('requests')}
          />
          <StatCard
            title="Appointments"
            value={todayAppointments}
            subtitle="Consultations & procedures scheduled"
            icon={CalendarCheck}
            color="primary"
            onClick={() => onNavigate('appointments')}
          />
          <StatCard
            title="Pending Bills"
            value={pendingBills}
            subtitle={pendingBills > 0 ? 'Unsettled patient balances' : 'All invoices cleared'}
            icon={Receipt}
            color={pendingBills > 0 ? 'amber' : 'emerald'}
            onClick={() => onNavigate('billing')}
          />
          <StatCard
            title="Pharmacy Orders"
            value={activePharmacyOrders}
            subtitle="Prescription fulfillments pending"
            icon={Pill}
            color="indigo"
            onClick={() => onNavigate('pharmacy')}
          />
        </div>
      </div>

      {/* Two Column Layout: Urgent Triage Queue & Resource Allocation */}
      <div className="grid-2">
        {/* Triage / Patient Care Requests */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <ClipboardList size={18} style={{ color: 'var(--amber)' }} />
                <span>Patient Triage & Consultation Queue</span>
              </div>
              <div className="card-subtitle">
                Incoming care requests awaiting department & doctor assignment
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('requests')}>
              View All ({patientRequests.length})
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-dim)' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 12px', color: 'var(--success)', opacity: 0.6 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending triage requests</p>
              <span style={{ fontSize: '0.75rem' }}>All incoming patient consultation requests have been processed.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingRequests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{req.patientName}</strong>
                      <Badge variant="primary">{req.issueCategory}</Badge>
                      {req.priority === 'High' && <Badge variant="danger">High Urgency</Badge>}
                    </div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{req.submittedDate}</span>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    "{req.description}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Preferred: {req.preferredDoctor || req.preferredDepartment || 'Any specialist'}
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate('requests')}
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      Assign Doctor & Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Hospital Capacity & Bed Management Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <BedDouble size={18} style={{ color: 'var(--teal)' }} />
                <span>Bed Allocation & Facility Capacity</span>
              </div>
              <div className="card-subtitle">
                Live census across hospital inpatient wards
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('beds')}>
              Manage Beds ({totalBeds})
            </button>
          </div>

          {totalBeds === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-dim)' }}>
              <BedDouble size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No hospital beds added</p>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: '10px' }} onClick={() => onNavigate('beds')}>
                + Add First Hospital Bed
              </button>
            </div>
          ) : (
            <div>
              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span>Overall Capacity Usage</span>
                  <strong>{occupiedBeds} / {totalBeds} Beds ({occupancyPercent}%)</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${occupancyPercent}%`,
                      height: '100%',
                      background: occupancyPercent > 85 ? 'var(--danger)' : 'var(--teal)',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>

              {/* Status pills breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                    {beds.filter(b => b.status === 'Available').length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Available</div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger)' }}>
                    {beds.filter(b => b.status === 'Occupied').length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Occupied</div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--info)' }}>
                    {beds.filter(b => b.status === 'Reserved').length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reserved</div>
                </div>

                <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>
                    {beds.filter(b => b.status === 'Maintenance').length}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Maintenance</div>
                </div>
              </div>

              {/* Sample bed list preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {beds.slice(0, 3).map(bed => (
                  <div
                    key={bed.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div>
                      <strong>{bed.id}</strong> • <span style={{ color: 'var(--text-muted)' }}>{bed.room}</span>
                    </div>
                    <Badge variant={bed.status === 'Available' ? 'success' : bed.status === 'Occupied' ? 'danger' : 'warning'}>
                      {bed.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Compliance & System Activity Trail */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Activity size={18} style={{ color: 'var(--info)' }} />
              <span>Real-Time Hospital Operational Trail</span>
            </div>
            <div className="card-subtitle">
              Live administrative, clinical, and patient actions logged to compliance ledger
            </div>
          </div>
        </div>

        {auditLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No operational events logged yet. Activity appears as hospital operations proceed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {auditLogs.slice(0, 5).map(log => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.015)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.825rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: log.role === 'MANAGER' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(20, 184, 166, 0.15)',
                      color: log.role === 'MANAGER' ? '#0ea5e9' : '#14b8a6'
                    }}
                  >
                    {log.role}
                  </span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{log.user}:</span>
                  <span style={{ color: 'var(--text-muted)' }}>{log.action}</span>
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
