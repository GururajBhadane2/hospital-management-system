import React from 'react';
import { CalendarCheck, Clock, Stethoscope, Building2, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const PatientAppointmentsView = ({ onNavigate }) => {
  const { activePatientId } = useAuth();
  const { patients, appointments } = useHospitalData();
  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0];

  const myAppointments = (appointments || []).filter(
    a => !currentPatient || a.patientId === currentPatient.id || a.patientName === currentPatient.name
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarCheck size={22} style={{ color: 'var(--primary)' }} />
            <span>My Hospital Consultations & Visits</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Schedule of clinic consultations, diagnostic checkups, and post-operative follow-ups
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('patient-request-care')}>
          <Plus size={16} />
          Request New Consultation
        </button>
      </div>

      {myAppointments.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Scheduled Appointments"
          description="You do not have any clinical consultations scheduled. Submit a care request to be scheduled with a hospital specialist."
          actionLabel="Request Consultation"
          onAction={() => onNavigate && onNavigate('patient-request-care')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myAppointments.map(apt => (
            <div key={apt.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{apt.id}</span>
                  <Badge variant="primary">{apt.type}</Badge>
                  <Badge variant={apt.status === 'Confirmed' ? 'success' : 'warning'}>{apt.status}</Badge>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {apt.doctorName}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Department of {apt.department} • Room: {apt.room || 'Outpatient Clinic'}
                </p>

                {apt.notes && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{apt.notes}"
                  </p>
                )}
              </div>

              <div style={{ padding: '14px 20px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'right', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{apt.date}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--teal)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '2px' }}>
                  <Clock size={13} />
                  <span>{apt.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
