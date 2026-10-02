import React, { useState } from 'react';
import {
  FlaskConical,
  Activity,
  Plus,
  Search,
  CheckCircle,
  Clock,
  FileText,
  UploadCloud,
  Eye,
  User,
  Stethoscope
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const DiagnosticsModule = () => {
  const { labTests, updateLabTest, radiologyServices, updateRadiology, patients, doctors } = useHospitalData();

  const [activeTab, setActiveTab] = useState('lab'); // 'lab' | 'radiology'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReportToView, setSelectedReportToView] = useState(null);
  const [uploadModalTarget, setUploadModalTarget] = useState(null);
  const [reportResultText, setReportResultText] = useState('');

  const handleUploadReport = (e) => {
    e.preventDefault();
    if (!uploadModalTarget || !reportResultText) return;

    if (uploadModalTarget.type === 'lab') {
      updateLabTest(uploadModalTarget.id, {
        status: 'Completed',
        reportedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        resultsSummary: reportResultText
      });
    } else {
      updateRadiology(uploadModalTarget.id, {
        status: 'Report Uploaded',
        conductedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        findings: reportResultText
      });
    }

    setUploadModalTarget(null);
    setReportResultText('');
  };

  const filteredLabTests = (labTests || []).filter(t =>
    t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRad = (radiologyServices || []).filter(r =>
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.bodyPart.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FlaskConical size={22} style={{ color: 'var(--teal)' }} />
            <span>Hospital Laboratory & Radiology Operations</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Biochemical pathology series, imaging acquisition scans, and official clinical report publishing
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <button
          className={`btn ${activeTab === 'lab' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('lab')}
        >
          Clinical Laboratory ({labTests.length})
        </button>
        <button
          className={`btn ${activeTab === 'radiology' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('radiology')}
        >
          Radiology & Imaging Scans ({radiologyServices.length})
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px' }}
            placeholder={activeTab === 'lab' ? "Search lab test by name, patient, or test ID..." : "Search radiology order by modality (MRI, CT, X-Ray) or patient..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* LAB TESTS TAB */}
      {activeTab === 'lab' && (
        filteredLabTests.length === 0 ? (
          <EmptyState
            icon={FlaskConical}
            title="No Laboratory Tests Queued"
            description="When physicians order diagnostic panels during consultation, they will appear here for phlebotomy and biochemical analysis."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Patient Details</th>
                  <th>Diagnostic Test Requested</th>
                  <th>Ordering Physician</th>
                  <th>Requested Date</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabTests.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                        {t.id}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{t.patientName}</strong>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{t.patientId}</span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.testName}</span>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{t.department || 'Biochemistry'}</div>
                    </td>

                    <td>
                      <span style={{ color: 'var(--teal)', fontSize: '0.825rem' }}>{t.doctorName || 'Attending Physician'}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.requestedDate}</span>
                    </td>

                    <td>
                      <Badge variant={t.status === 'Completed' ? 'success' : t.status === 'Sample Collected' ? 'warning' : 'primary'}>
                        {t.status}
                      </Badge>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {t.status !== 'Completed' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => {
                              setUploadModalTarget({ type: 'lab', id: t.id, name: t.testName, patient: t.patientName });
                              setReportResultText('');
                            }}
                          >
                            <UploadCloud size={13} />
                            Upload Report
                          </button>
                        )}

                        {t.status === 'Completed' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => setSelectedReportToView({ title: t.testName, patient: t.patientName, date: t.reportedDate, result: t.resultsSummary, staff: t.labTechnician })}
                          >
                            <Eye size={13} />
                            View Findings
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* RADIOLOGY TAB */}
      {activeTab === 'radiology' && (
        filteredRad.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No Radiology Orders Queued"
            description="When physicians order MRI, CT, X-Ray, or Ultrasound scans, orders will appear here for technician acquisition."
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Patient Details</th>
                  <th>Imaging Modality & Body Region</th>
                  <th>Ordering Physician</th>
                  <th>Requested Date</th>
                  <th>Scan Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRad.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                        {r.id}
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: 'var(--text-main)', display: 'block' }}>{r.patientName}</strong>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{r.patientId}</span>
                    </td>

                    <td>
                      <Badge variant="primary">{r.modality}</Badge>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                        {r.bodyPart}
                      </div>
                    </td>

                    <td>
                      <span style={{ color: 'var(--teal)', fontSize: '0.825rem' }}>{r.doctorName || 'Attending Physician'}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.requestedDate}</span>
                    </td>

                    <td>
                      <Badge variant={r.status === 'Report Uploaded' ? 'success' : 'warning'}>
                        {r.status}
                      </Badge>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {r.status !== 'Report Uploaded' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => {
                              setUploadModalTarget({ type: 'radiology', id: r.id, name: `${r.modality} - ${r.bodyPart}`, patient: r.patientName });
                              setReportResultText('');
                            }}
                          >
                            <UploadCloud size={13} />
                            Upload Findings
                          </button>
                        )}

                        {r.status === 'Report Uploaded' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => setSelectedReportToView({ title: `${r.modality} Scan: ${r.bodyPart}`, patient: r.patientName, date: r.conductedDate, result: r.findings, staff: r.radiologist })}
                          >
                            <Eye size={13} />
                            View Scan Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Upload Report Findings Modal */}
      <Modal
        isOpen={!!uploadModalTarget}
        onClose={() => setUploadModalTarget(null)}
        title={`Upload Diagnostic Report: ${uploadModalTarget?.name}`}
        subtitle={`Patient: ${uploadModalTarget?.patient}`}
        maxWidth="600px"
      >
        <form onSubmit={handleUploadReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Diagnostic Findings & Values Summary *</label>
            <textarea
              className="form-textarea"
              rows={4}
              required
              placeholder="e.g. Hemoglobin: 14.2 g/dL, Platelets: 280k, WBC: 6.8k. All differential cell lines within physiological reference intervals."
              value={reportResultText}
              onChange={(e) => setReportResultText(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setUploadModalTarget(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish Clinical Report
            </button>
          </div>
        </form>
      </Modal>

      {/* View Report Findings Modal */}
      <Modal
        isOpen={!!selectedReportToView}
        onClose={() => setSelectedReportToView(null)}
        title={selectedReportToView?.title || 'Report Details'}
        subtitle={`Patient: ${selectedReportToView?.patient} • Date: ${selectedReportToView?.date}`}
        maxWidth="620px"
      >
        {selectedReportToView && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Clinical Interpretation / Diagnostic Findings:
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedReportToView.result}
              </p>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'right' }}>
              Certified by: {selectedReportToView.staff || 'Certified Clinical Diagnostician'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedReportToView(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
