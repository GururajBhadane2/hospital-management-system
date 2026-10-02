import React from 'react';
import { Users, FileText, HeartPulse, Stethoscope, Search, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const DoctorPatientsView = ({ onNavigate }) => {
  const { activeDoctorId } = useAuth();
  const { doctors, patients } = useHospitalData();
  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  const myPatients = patients.filter(p => !currentDoctor || p.assignedDoctor === currentDoctor.name);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} style={{ color: 'var(--teal)' }} />
            <span>Patients Under My Direct Care</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Inpatients and outpatients assigned to {currentDoctor?.name || 'Physician'}
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('doctor-consultation')}>
          <HeartPulse size={16} />
          Start Patient Consultation
        </button>
      </div>

      {myPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Patients Assigned"
          description="Patients assigned to you by the Hospital Manager or scheduled for consultation will appear here."
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Demographics</th>
                <th>Admission Status</th>
                <th>Ward / Bed Location</th>
                <th>Allergies</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myPatients.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {p.id}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-main)', display: 'block' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{p.phone}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>{p.age} yrs • {p.gender} • Blood: <strong style={{ color: 'var(--danger)' }}>{p.bloodGroup}</strong></span>
                  </td>
                  <td>
                    <Badge variant={p.admissionStatus === 'Inpatient' ? 'danger' : 'primary'}>
                      {p.admissionStatus || 'Outpatient'}
                    </Badge>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.assignedBed || 'Outpatient Clinic'}</span>
                  </td>
                  <td>
                    {p.allergies && p.allergies !== 'None' ? (
                      <Badge variant="warning">{p.allergies}</Badge>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>None</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onNavigate && onNavigate('doctor-consultation')}
                    >
                      <HeartPulse size={13} />
                      Consultation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
