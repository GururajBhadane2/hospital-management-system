import React, { useState } from 'react';
import { Pill, Search, Printer, FileText, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const DoctorPrescriptionsView = () => {
  const { activeDoctorId } = useAuth();
  const { prescriptions, doctors } = useHospitalData();
  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRxToView, setSelectedRxToView] = useState(null);

  const myPrescriptions = (prescriptions || []).filter(p =>
    !currentDoctor || p.doctorName === currentDoctor.name
  );

  const filtered = myPrescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Pill size={22} style={{ color: 'var(--info)' }} />
            <span>Physician Issued Digital Prescriptions</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Authoritative clinical prescriptions transmitted to the hospital formulary
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No Prescriptions Issued"
          description="Prescriptions created during patient consultations will be archived here."
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rx ID</th>
                <th>Patient Details</th>
                <th>Issued Date</th>
                <th>Prescribed Medications</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rx) => (
                <tr key={rx.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                      {rx.id}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-main)', display: 'block' }}>{rx.patientName}</strong>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{rx.patientId}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rx.date}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {rx.items?.map(i => `${i.medicine} (${i.dosage})`).join(', ')}
                    </span>
                  </td>
                  <td>
                    <Badge variant="success">{rx.status}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedRxToView(rx)}
                    >
                      <Printer size={13} />
                      View e-Rx
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Prescription View Modal */}
      <Modal
        isOpen={!!selectedRxToView}
        onClose={() => setSelectedRxToView(null)}
        title={`Official Electronic Prescription: ${selectedRxToView?.id}`}
        subtitle={`Issued by ${selectedRxToView?.doctorName}`}
        maxWidth="640px"
      >
        {selectedRxToView && (
          <div style={{ background: '#ffffff', color: '#0f172a', padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0284c7', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: '#0284c7', fontSize: '1.2rem', fontWeight: 800 }}>ApexCare Medical Center</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Department of Clinical Care • Digital Formulary Order</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedRxToView.id}</span>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {selectedRxToView.date}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
              <div>Patient: <strong>{selectedRxToView.patientName}</strong> ({selectedRxToView.patientId})</div>
              <div>Prescribing Physician: <strong>{selectedRxToView.doctorName}</strong></div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', marginBottom: '16px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Medication</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Dosage</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Frequency</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {(selectedRxToView.items || []).map((itm, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{itm.medicine}</td>
                    <td style={{ padding: '8px' }}>{itm.dosage}</td>
                    <td style={{ padding: '8px' }}>{itm.frequency}</td>
                    <td style={{ padding: '8px' }}>{itm.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <Printer size={14} />
                Print e-Prescription
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
