import React from 'react';
import {
  FlaskConical,
  Activity,
  Calendar,
  Stethoscope,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const PatientDiagnosticsView = ({ onNavigate }) => {
  const { activePatientId } = useAuth();
  const { patients, labTests, radiologyServices } = useHospitalData();

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0] || {
    id: activePatientId || 'PAT-1001',
    name: 'Patient'
  };

  const myLabTests = (labTests || []).filter(
    t => t.patientId === currentPatient.id || t.patientName?.toLowerCase() === currentPatient.name?.toLowerCase()
  );

  const myRadiology = (radiologyServices || []).filter(
    r => r.patientId === currentPatient.id || r.patientName?.toLowerCase() === currentPatient.name?.toLowerCase()
  );

  const totalDiagnostics = myLabTests.length + myRadiology.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FlaskConical size={22} style={{ color: 'var(--amber)' }} />
            <span>My Diagnostic Tests & Laboratory Results</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Biochemical laboratory orders, pathology panels, and radiology imaging scans ordered by your attending doctors
          </p>
        </div>

        <Badge variant={totalDiagnostics > 0 ? 'primary' : 'neutral'}>
          {totalDiagnostics} Diagnostic Order{totalDiagnostics === 1 ? '' : 's'}
        </Badge>
      </div>

      {totalDiagnostics === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No Diagnostic Orders on File"
          description="When your doctor orders laboratory panels (e.g. CBC, CMP) or imaging scans during consultation, tracking and results will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Lab Tests Section */}
          {myLabTests.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                <FlaskConical size={18} style={{ color: 'var(--teal)' }} />
                <span>Laboratory & Pathology Tests ({myLabTests.length})</span>
              </h3>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Test ID</th>
                      <th>Test Name</th>
                      <th>Ordering Doctor</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Status & Findings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLabTests.map(test => (
                      <tr key={test.id}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                            {test.id}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>{test.testName || test.name}</strong>
                        </td>
                        <td>
                          <span style={{ color: 'var(--teal)', fontSize: '0.85rem' }}>{test.doctorName}</span>
                        </td>
                        <td>{test.department || 'Clinical Biochemistry'}</td>
                        <td>{test.date || 'Recent'}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Badge variant={test.status === 'Completed' ? 'success' : 'warning'}>
                              {test.status || 'Pending Specimen'}
                            </Badge>
                            {test.result && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Result: {test.result}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Radiology Section */}
          {myRadiology.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                <Activity size={18} style={{ color: 'var(--indigo)' }} />
                <span>Radiology & Imaging Scans ({myRadiology.length})</span>
              </h3>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Scan ID</th>
                      <th>Modality</th>
                      <th>Target Anatomy</th>
                      <th>Ordering Doctor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRadiology.map(rad => (
                      <tr key={rad.id}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--indigo)' }}>
                            {rad.id}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>{rad.modality}</strong>
                        </td>
                        <td>{rad.bodyPart}</td>
                        <td>{rad.doctorName}</td>
                        <td>
                          <Badge variant={rad.status === 'Completed' ? 'success' : 'warning'}>
                            {rad.status || 'Scheduled'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
