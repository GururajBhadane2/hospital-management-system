import React from 'react';
import {
  Stethoscope,
  Users,
  CalendarCheck,
  ClipboardList,
  Pill,
  Clock,
  HeartPulse,
  ArrowRight,
  FlaskConical,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';

export const DoctorDashboard = ({ onNavigate }) => {
  const { activeDoctorId } = useAuth();
  const { doctors, patients, appointments, patientRequests, prescriptions } = useHospitalData();

  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0] || {
    name: 'Dr. Physician',
    specialization: 'Specialist',
    department: 'Clinical Care'
  };

  // Filter clinical data to this doctor
  const myPatients = patients.filter(p => p.assignedDoctor === currentDoctor.name);
  const myAppointments = appointments.filter(a => a.doctorName === currentDoctor.name);
  const myRequests = patientRequests.filter(r => r.assignedDoctor === currentDoctor.name);
  const myPrescriptions = prescriptions.filter(p => p.doctorName === currentDoctor.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Doctor Clinical Profile Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
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
              background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)'
            }}
          >
            <Stethoscope size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentDoctor.name}
              </h2>
              <Badge variant="success">On Duty</Badge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 600 }}>
              {currentDoctor.specialization} • Department of {currentDoctor.department}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              License: {currentDoctor.registrationNumber || 'MED-STAFF-01'} • Clinic: {currentDoctor.room || 'Outpatient Suite'}
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => onNavigate('consultation')}
          style={{ padding: '12px 20px' }}
        >
          <HeartPulse size={16} />
          <span>Launch Consultation Workspace</span>
        </button>
      </div>

      {/* Dynamic Telemetry Metrics */}
      <div className="grid-4">
        <StatCard
          title="Assigned Patients"
          value={myPatients.length}
          subtitle={`${myPatients.filter(p => p.admissionStatus === 'Inpatient').length} Inpatients under care`}
          icon={Users}
          color="emerald"
          onClick={() => onNavigate('my-patients')}
        />
        <StatCard
          title="My Appointments"
          value={myAppointments.length}
          subtitle="Consultations on schedule"
          icon={CalendarCheck}
          color="primary"
          onClick={() => onNavigate('appointments')}
        />
        <StatCard
          title="Triage Assignments"
          value={myRequests.length}
          subtitle="Care requests routed by manager"
          icon={ClipboardList}
          color="amber"
          onClick={() => onNavigate('my-patients')}
        />
        <StatCard
          title="Prescriptions Issued"
          value={myPrescriptions.length}
          subtitle="Digital medication orders"
          icon={Pill}
          color="indigo"
          onClick={() => onNavigate('prescriptions')}
        />
      </div>

      {/* Two Column Layout: Upcoming Consultations & Assigned Patient Requests */}
      <div className="grid-2">
        {/* Today's Appointments Queue */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <CalendarCheck size={18} style={{ color: 'var(--primary)' }} />
                <span>Today's Consultation Schedule</span>
              </div>
              <div className="card-subtitle">
                Scheduled patient clinic visits and follow-ups
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('doctor-appointments')}>
              View All ({myAppointments.length})
            </button>
          </div>

          {myAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-dim)' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No appointments scheduled</p>
              <span style={{ fontSize: '0.75rem' }}>Your clinical calendar is currently clear.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myAppointments.slice(0, 4).map((apt) => (
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
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{apt.patientName}</strong>
                      <Badge variant="primary">{apt.type}</Badge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} /> {apt.date} at {apt.time} • Room: {apt.room || 'Clinic'}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                    onClick={() => onNavigate('doctor-consultation')}
                  >
                    Conduct Consultation
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Triage Requests */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <ClipboardList size={18} style={{ color: 'var(--amber)' }} />
                <span>Assigned Patient Requests</span>
              </div>
              <div className="card-subtitle">
                Incoming clinical complaints assigned by the Hospital Manager
              </div>
            </div>
          </div>

          {myRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-dim)' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending assigned requests</p>
              <span style={{ fontSize: '0.75rem' }}>All patient care requests assigned to you have been reviewed.</span>
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
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{req.patientName}</strong>
                      <Badge variant="primary">{req.issueCategory}</Badge>
                    </div>
                    <Badge variant={req.priority === 'High' ? 'danger' : 'neutral'}>{req.priority}</Badge>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{req.description}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => onNavigate('doctor-consultation')}
                    >
                      Open in Clinical Workspace →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
