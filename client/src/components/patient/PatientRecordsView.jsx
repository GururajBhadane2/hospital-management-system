import React, { useState } from 'react';
import {
  FileText,
  Activity,
  User,
  Stethoscope,
  Calendar,
  Clock,
  Heart,
  Pill,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const PatientRecordsView = ({ onNavigate }) => {
  const { activePatientId } = useAuth();
  const { patients, medicalRecords, prescriptions } = useHospitalData();
  const [selectedRecord, setSelectedRecord] = useState(null);

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0] || {
    id: activePatientId || 'PAT-1001',
    name: 'Patient'
  };

  // Find all clinical records for this patient
  const myRecords = (medicalRecords || []).filter(
    r => r.patientId === currentPatient.id || r.patientName?.toLowerCase() === currentPatient.name?.toLowerCase()
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} style={{ color: 'var(--primary)' }} />
            <span>My Electronic Medical Records (EMR)</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Official clinical consultation notes, diagnoses, physical exam vitals, and treatment plans uploaded by your attending physicians
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Records on file:</span>
          <Badge variant={myRecords.length > 0 ? 'success' : 'neutral'}>
            {myRecords.length} Consultation Record{myRecords.length === 1 ? '' : 's'}
          </Badge>
        </div>
      </div>

      {/* Patient Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.25)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <User size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{currentPatient.name}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
              Patient ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{currentPatient.id}</span> • Blood Group: <strong style={{ color: 'var(--danger)' }}>{currentPatient.bloodGroup || 'N/A'}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant={currentPatient.admissionStatus === 'Inpatient' ? 'danger' : 'primary'}>
            {currentPatient.admissionStatus || 'Outpatient'}
          </Badge>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Allergies: <strong style={{ color: 'var(--amber)' }}>{currentPatient.allergies || 'None documented'}</strong>
          </span>
        </div>
      </div>

      {myRecords.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Medical Consultation Records Found"
          description="When your attending doctor completes a clinical consultation, their examination notes, diagnosis, and care instructions will appear here automatically."
          actionText="Request a Consultation"
          onAction={() => onNavigate && onNavigate('request-care')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myRecords.map((record) => {
            const hasVitals = record.vitals && Object.keys(record.vitals).length > 0;
            return (
              <div
                key={record.id}
                className="card"
                style={{
                  border: '1px solid var(--border-subtle)',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'var(--bg-card)'
                }}
              >
                {/* Record Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileCheck size={20} style={{ color: 'var(--teal)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                      {record.id}
                    </span>
                    <Badge variant="primary">{record.department || 'Clinical Care'}</Badge>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {record.date}
                    </span>
                    <span style={{ color: 'var(--teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Stethoscope size={14} />
                      Attending: {record.doctorName}
                    </span>
                  </div>
                </div>

                {/* Primary Diagnosis */}
                <div style={{ background: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(20, 184, 166, 0.25)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                    Clinical Diagnosis
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {record.diagnosis}
                  </div>
                  {record.chiefComplaint && (
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <strong>Chief Complaint:</strong> {record.chiefComplaint}
                    </div>
                  )}
                </div>

                {/* Vitals Grid if available */}
                {hasVitals && (
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Recorded Clinical Vitals
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                      {record.vitals.bloodPressure && (
                        <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Blood Pressure</span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{record.vitals.bloodPressure}</strong>
                        </div>
                      )}
                      {record.vitals.heartRate && (
                        <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Heart Rate</span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{record.vitals.heartRate}</strong>
                        </div>
                      )}
                      {record.vitals.oxygenSaturation && (
                        <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Oxygen (SpO2)</span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{record.vitals.oxygenSaturation}</strong>
                        </div>
                      )}
                      {record.vitals.temperature && (
                        <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Temperature</span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{record.vitals.temperature}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Consultation Notes */}
                {record.consultationNotes && (
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Physician Consultation & Clinical Notes
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', background: 'rgba(255, 255, 255, 0.01)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      {record.consultationNotes}
                    </p>
                  </div>
                )}

                {/* Follow-up Plan */}
                {record.followUpPlan && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem' }}>
                    <strong style={{ color: 'var(--primary)' }}>Follow-up Care Plan:</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{record.followUpPlan}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
