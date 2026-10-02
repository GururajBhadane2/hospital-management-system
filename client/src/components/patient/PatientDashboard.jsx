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
  AlertCircle,
  FileText,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';

export const PatientDashboard = ({ onNavigate }) => {
  const { activePatientId, setActivePatientId } = useAuth();
  const { patients, patientRequests, appointments, prescriptions, bills, medicalRecords } = useHospitalData();

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0] || {
    name: 'Eleanor Vance',
    id: 'PAT-1001',
    bloodGroup: 'O+',
    admissionStatus: 'Inpatient'
  };

  const myRequests = (patientRequests || []).filter(r => r.patientId === currentPatient.id || r.patientName?.toLowerCase() === currentPatient.name?.toLowerCase());
  const myAppointments = (appointments || []).filter(a => a.patientId === currentPatient.id || a.patientName?.toLowerCase() === currentPatient.name?.toLowerCase());
  const myPrescriptions = (prescriptions || []).filter(p => p.patientId === currentPatient.id || p.patientName?.toLowerCase() === currentPatient.name?.toLowerCase());
  const myRecords = (medicalRecords || []).filter(r => r.patientId === currentPatient.id || r.patientName?.toLowerCase() === currentPatient.name?.toLowerCase());
  const myBills = (bills || []).filter(b => b.patientId === currentPatient.id || b.patientName?.toLowerCase() === currentPatient.name?.toLowerCase());

  const pendingBillsTotal = myBills
    .filter(b => b.status !== 'Paid')
    .reduce((sum, b) => sum + Number(b.balanceDue || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Patient Welcome Hero Banner & Patient Switcher */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentPatient.name}
              </h2>
              <Badge variant={currentPatient.admissionStatus === 'Inpatient' ? 'danger' : 'primary'}>
                {currentPatient.admissionStatus || 'Outpatient'}
              </Badge>
              {currentPatient.assignedDoctor && (
                <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 600 }}>
                  • Attending: {currentPatient.assignedDoctor}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Medical Record ID: <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{currentPatient.id}</strong> • Blood Type: <strong style={{ color: 'var(--danger)' }}>{currentPatient.bloodGroup}</strong> • Age: <strong>{currentPatient.age || 38} yrs</strong>
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Insurance: {currentPatient.insuranceProvider || 'Self-Pay'} ({currentPatient.policyNumber || 'N/A'})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Patient Switcher for testing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Viewing:</span>
            <select
              className="form-select"
              style={{ fontSize: '0.8rem', height: '36px', padding: '4px 10px', minWidth: '160px', background: 'var(--bg-surface)' }}
              value={currentPatient.id}
              onChange={(e) => setActivePatientId(e.target.value)}
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate('request-care')}
            style={{ padding: '10px 18px' }}
          >
            <ClipboardList size={16} />
            <span>Request Consultation</span>
          </button>
        </div>
      </div>

      {/* Patient Metrics Grid */}
      <div className="grid-4">
        <StatCard
          title="Doctor EMR Records"
          value={myRecords.length}
          subtitle="Consultation notes & vitals"
          icon={FileText}
          color="teal"
          onClick={() => onNavigate('records')}
        />
        <StatCard
          title="Active Prescriptions"
          value={myPrescriptions.length}
          subtitle="Doctor issued medications"
          icon={Pill}
          color="emerald"
          onClick={() => onNavigate('prescriptions')}
        />
        <StatCard
          title="Scheduled Visits"
          value={myAppointments.length}
          subtitle="Confirmed clinical visits"
          icon={CalendarCheck}
          color="primary"
          onClick={() => onNavigate('appointments')}
        />
        <StatCard
          title="Outstanding Balance"
          value={`$${pendingBillsTotal.toFixed(2)}`}
          subtitle={pendingBillsTotal > 0 ? 'Medical invoices due' : 'All accounts settled'}
          icon={CreditCard}
          color={pendingBillsTotal > 0 ? 'rose' : 'emerald'}
          onClick={() => onNavigate('billing')}
        />
      </div>

      {/* Live Doctor Consultation Records Section */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">
              <FileText size={18} style={{ color: 'var(--teal)' }} />
              <span>Latest Physician Consultations & Medical Records</span>
            </div>
            <div className="card-subtitle">
              Official diagnoses, examination vitals, and care recommendations entered by your doctor
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('records')}>
            View All ({myRecords.length}) <ChevronRight size={14} />
          </button>
        </div>

        {myRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-dim)' }}>
            <FileText size={36} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No clinical consultation records on file yet.</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              When a doctor submits a consultation note in the Doctor Portal, it will appear here immediately.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myRecords.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(20, 184, 166, 0.04)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>
                      {rec.id}
                    </span>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{rec.diagnosis}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 600 }}>Attending: {rec.doctorName}</span>
                    <span style={{ color: 'var(--text-dim)' }}>• {rec.date}</span>
                  </div>
                </div>

                {rec.consultationNotes && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {rec.consultationNotes}
                  </p>
                )}

                {rec.followUpPlan && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>
                    Care Plan: {rec.followUpPlan}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout: Upcoming Visits & Prescriptions Tracker */}
      <div className="grid-2">
        {/* Appointments */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <CalendarCheck size={18} style={{ color: 'var(--primary)' }} />
                <span>My Hospital Visits</span>
              </div>
              <div className="card-subtitle">
                Scheduled consultations with hospital physicians
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('appointments')}>
              View All ({myAppointments.length})
            </button>
          </div>

          {myAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-dim)' }}>
              <Clock size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming appointments</p>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '8px' }}
                onClick={() => onNavigate('request-care')}
              >
                + Request Consultation
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myAppointments.slice(0, 3).map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    padding: '12px 14px',
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
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{apt.doctorName}</strong>
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

        {/* Digital Prescriptions Snapshot */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Pill size={18} style={{ color: 'var(--emerald)' }} />
                <span>My Active Prescriptions</span>
              </div>
              <div className="card-subtitle">
                Medications authorized by hospital physicians
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('prescriptions')}>
              View All ({myPrescriptions.length})
            </button>
          </div>

          {myPrescriptions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-dim)' }}>
              <Pill size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active prescriptions</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myPrescriptions.slice(0, 3).map((rx) => (
                <div
                  key={rx.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.04)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>
                      {rx.id}
                    </span>
                    <Badge variant="success">{rx.status || 'Active'}</Badge>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    {(rx.items || []).map(i => `${i.medicine || i.name} (${i.dosage})`).join(', ')}
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Prescribed by: {rx.doctorName} • {rx.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
