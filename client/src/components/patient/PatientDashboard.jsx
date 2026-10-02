import React from 'react';
import {
  User,
  ClipboardList,
  CalendarCheck,
  Pill,
  CreditCard,
  Heart,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';

export const PatientDashboard = ({ onNavigate }) => {
  const { activePatientId } = useAuth();
  const { patients, patientRequests, appointments, prescriptions, bills } = useHospitalData();

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0] || {
    name: 'Patient User',
    id: 'PAT-1001',
    bloodGroup: 'O+',
    admissionStatus: 'Outpatient'
  };

  const myRequests = patientRequests.filter(r => r.patientId === currentPatient.id || r.patientName === currentPatient.name);
  const myAppointments = appointments.filter(a => a.patientId === currentPatient.id || a.patientName === currentPatient.name);
  const myPrescriptions = prescriptions.filter(p => p.patientId === currentPatient.id || p.patientName === currentPatient.name);
  const myBills = bills.filter(b => b.patientId === currentPatient.id || b.patientName === currentPatient.name);

  const pendingBillsTotal = myBills
    .filter(b => b.status !== 'Paid')
    .reduce((sum, b) => sum + Number(b.balanceDue || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Patient Welcome Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
            }}
          >
            <User size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentPatient.name}
              </h2>
              <Badge variant={currentPatient.admissionStatus === 'Inpatient' ? 'danger' : 'primary'}>
                {currentPatient.admissionStatus || 'Outpatient'}
              </Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Medical ID: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{currentPatient.id}</strong> • Blood Type: <strong style={{ color: 'var(--danger)' }}>{currentPatient.bloodGroup}</strong>
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Insurance: {currentPatient.insuranceProvider || 'Self-Pay'} ({currentPatient.policyNumber || 'N/A'})
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => onNavigate('patient-request-care')}
          style={{ padding: '12px 20px' }}
        >
          <ClipboardList size={16} />
          <span>Request Care / Consultation</span>
        </button>
      </div>

      {/* Patient Metrics Grid */}
      <div className="grid-4">
        <StatCard
          title="Active Care Requests"
          value={myRequests.length}
          subtitle="Triage & consultation submissions"
          icon={ClipboardList}
          color="amber"
          onClick={() => onNavigate('patient-request-care')}
        />
        <StatCard
          title="Scheduled Appointments"
          value={myAppointments.length}
          subtitle="Confirmed clinical visits"
          icon={CalendarCheck}
          color="primary"
          onClick={() => onNavigate('patient-appointments')}
        />
        <StatCard
          title="Active Prescriptions"
          value={myPrescriptions.length}
          subtitle="Authorized medications"
          icon={Pill}
          color="emerald"
          onClick={() => onNavigate('patient-prescriptions')}
        />
        <StatCard
          title="Outstanding Balance"
          value={`$${pendingBillsTotal.toFixed(2)}`}
          subtitle={pendingBillsTotal > 0 ? 'Medical invoices due' : 'All accounts settled'}
          icon={CreditCard}
          color={pendingBillsTotal > 0 ? 'rose' : 'emerald'}
          onClick={() => onNavigate('patient-billing')}
        />
      </div>

      {/* Two Column Layout: Upcoming Visits & Care Request Status Tracker */}
      <div className="grid-2">
        {/* Appointments */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <CalendarCheck size={18} style={{ color: 'var(--primary)' }} />
                <span>My Upcoming Hospital Visits</span>
              </div>
              <div className="card-subtitle">
                Scheduled consultations with hospital physicians
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('patient-appointments')}>
              View All ({myAppointments.length})
            </button>
          </div>

          {myAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-dim)' }}>
              <Clock size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming appointments</p>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '10px' }}
                onClick={() => onNavigate('patient-request-care')}
              >
                + Request Consultation
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{apt.doctorName}</strong>
                      <Badge variant="primary">{apt.department}</Badge>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '2px' }}>
                      {apt.date} at {apt.time} • Room: {apt.room || 'Outpatient Clinic'}
                    </span>
                  </div>

                  <Badge variant={apt.status === 'Confirmed' ? 'success' : 'warning'}>
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Care Request Tracker */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <ClipboardList size={18} style={{ color: 'var(--amber)' }} />
                <span>My Consultation Requests & Triage Status</span>
              </div>
              <div className="card-subtitle">
                Live status tracking from submission to doctor assignment
              </div>
            </div>
          </div>

          {myRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-dim)' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active requests</p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '10px' }}
                onClick={() => onNavigate('patient-request-care')}
              >
                Submit Health Issue Request
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myRequests.map((req) => (
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
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>
                        {req.id}
                      </span>
                      <Badge variant="primary">{req.issueCategory}</Badge>
                    </div>

                    <Badge variant={req.status === 'Accepted' || req.status === 'Assigned' ? 'success' : req.status === 'Under Review' ? 'warning' : 'neutral'}>
                      {req.status}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    "{req.description}"
                  </p>

                  {req.assignedDoctor && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 600, marginTop: '2px' }}>
                      ✓ Assigned Specialist: {req.assignedDoctor} ({req.assignedDepartment})
                    </div>
                  )}

                  {req.managerNotes && (
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      Hospital Notes: {req.managerNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
