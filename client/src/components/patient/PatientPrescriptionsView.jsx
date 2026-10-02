import React from 'react';
import {
  Pill,
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const PatientPrescriptionsView = ({ onNavigate }) => {
  const { activePatientId } = useAuth();
  const { patients, prescriptions, pharmacyOrders } = useHospitalData();

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0] || {
    id: activePatientId || 'PAT-1001',
    name: 'Patient'
  };

  // Find all digital prescriptions for this patient
  const myPrescriptions = (prescriptions || []).filter(
    p => p.patientId === currentPatient.id || p.patientName?.toLowerCase() === currentPatient.name?.toLowerCase()
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={22} style={{ color: 'var(--emerald)' }} />
            <span>My Digital Prescriptions & Medications</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Authorized prescriptions issued by hospital doctors with dosage schedules, intake instructions, and pharmacy fulfillment status
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant={myPrescriptions.length > 0 ? 'success' : 'neutral'}>
            {myPrescriptions.length} Active Prescription{myPrescriptions.length === 1 ? '' : 's'}
          </Badge>
        </div>
      </div>

      {myPrescriptions.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No Prescriptions Issued"
          description="When an attending physician issues a prescription during your consultation, it will appear here with complete dosage instructions."
          actionText="Request Consultation"
          onAction={() => onNavigate && onNavigate('request-care')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myPrescriptions.map((rx) => {
            // Find linked pharmacy order if any
            const linkedOrder = (pharmacyOrders || []).find(o => o.prescriptionId === rx.id);

            return (
              <div
                key={rx.id}
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
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--emerald)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Pill size={18} />
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                        {rx.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>
                        Issued on: {rx.date}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.825rem', color: 'var(--teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Stethoscope size={14} />
                      Prescribing Physician: {rx.doctorName}
                    </span>

                    <Badge variant={rx.status === 'Issued' || rx.status === 'Active' ? 'success' : 'neutral'}>
                      {rx.status || 'Active'}
                    </Badge>
                  </div>
                </div>

                {/* Prescribed Items Table */}
                <div className="table-container" style={{ margin: 0 }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Medication & Formulation</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th>Intake Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(rx.items || []).map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                              {item.medicine || item.name}
                            </strong>
                          </td>
                          <td>
                            <span style={{ color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                              {item.dosage}
                            </span>
                          </td>
                          <td>{item.frequency}</td>
                          <td>{item.duration}</td>
                          <td>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                              {item.instructions || 'Take as directed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pharmacy Dispense Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={15} style={{ color: 'var(--emerald)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>Hospital Pharmacy Status:</span>
                    <strong style={{ color: linkedOrder?.status === 'Dispensed' ? 'var(--emerald)' : 'var(--amber)' }}>
                      {linkedOrder?.status || 'Sent to Pharmacy Fulfillment'}
                    </strong>
                  </div>

                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                    Official Digital Prescription • Signed by {rx.doctorName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
