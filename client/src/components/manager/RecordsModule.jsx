import React, { useState } from 'react';
import {
  FileText,
  Search,
  User,
  Stethoscope,
  Heart,
  Calendar,
  Activity,
  Plus
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const RecordsModule = () => {
  const { medicalRecords, patients } = useHospitalData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = (medicalRecords || []).filter(r =>
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={22} style={{ color: 'var(--primary)' }} />
            <span>Hospital Electronic Medical Records (EMR) Repository</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Administrative archive of clinical diagnoses, physical exam vitals, consultation summaries, and care plans
          </p>
        </div>
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
            placeholder="Search records by patient name, diagnosis, or attending doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Clinical EMR Records"
          description="Clinical consultation records will appear here as doctors conduct patient visits and submit consultation notes."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedRecord(r)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
                    {r.id}
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>•</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{r.patientName}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({r.patientId})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--teal)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {r.doctorName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {r.date}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Diagnosis: </strong>
                <span style={{ color: 'var(--text-muted)' }}>{r.diagnosis}</span>
              </div>

              {/* Vitals Summary Pill Bar */}
              {r.vitals && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', fontSize: '0.775rem', marginBottom: '10px' }}>
                  <span>BP: <strong>{r.vitals.bloodPressure || 'N/A'}</strong></span>
                  <span>HR: <strong>{r.vitals.heartRate || 'N/A'}</strong></span>
                  <span>SpO2: <strong>{r.vitals.oxygenSaturation || 'N/A'}</strong></span>
                  <span>Temp: <strong>{r.vitals.temperature || 'N/A'}</strong></span>
                </div>
              )}

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {r.consultationNotes}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`Clinical Record: ${selectedRecord?.id}`}
        subtitle={`Patient: ${selectedRecord?.patientName} • Attending: ${selectedRecord?.doctorName}`}
        maxWidth="700px"
      >
        {selectedRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Patient Name</span>
                <strong>{selectedRecord.patientName} ({selectedRecord.patientId})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Date of Consultation</span>
                <strong>{selectedRecord.date}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Primary Clinical Diagnosis</span>
                <strong style={{ color: 'var(--primary)' }}>{selectedRecord.diagnosis}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Attending Physician</span>
                <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{selectedRecord.doctorName}</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '6px' }}>Consultation & Physical Findings:</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                {selectedRecord.consultationNotes}
              </p>
            </div>

            {selectedRecord.followUpPlan && (
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '6px' }}>Follow-up Care Plan:</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  {selectedRecord.followUpPlan}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>
                Close Record
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
