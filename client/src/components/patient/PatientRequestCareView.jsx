import React, { useState } from 'react';
import {
  ClipboardList,
  Send,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  AlertTriangle,
  UserCheck,
  Stethoscope,
  Bone,
  Eye,
  Smile,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';

export const PatientRequestCareView = ({ onNavigate }) => {
  const { activePatientId } = useAuth();
  const { patients, departments, doctors, submitPatientRequest, patientRequests } = useHospitalData();

  const currentPatient = patients.find(p => p.id === activePatientId) || patients[0] || {
    id: 'PAT-1001',
    name: 'Patient User'
  };

  const categories = [
    { id: 'Bone / Joint', label: 'Bone / Joint', dept: 'Orthopedics & Sports Medicine', desc: 'Fractures, knee pain, joints, spine' },
    { id: 'Skin', label: 'Dermatology & Skin', dept: 'Dermatology', desc: 'Rashes, lesions, eczema, allergies' },
    { id: 'Heart', label: 'Cardiovascular / Heart', dept: 'Cardiology', desc: 'Chest pressure, palpitations, hypertension' },
    { id: 'Neurological', label: 'Neurological & Brain', dept: 'Neurology', desc: 'Headaches, migraines, numbness, tremors' },
    { id: 'Respiratory', label: 'Lungs & Respiratory', dept: 'Pulmonology', desc: 'Shortness of breath, persistent cough, asthma' },
    { id: 'ENT', label: 'Ear, Nose & Throat (ENT)', dept: 'ENT', desc: 'Sinusitis, hearing loss, throat infections' },
    { id: 'Stomach / Digestive', label: 'Stomach & Digestive', dept: 'Gastroenterology', desc: 'Abdominal pain, reflux, digestion' },
    { id: 'Eyes', label: 'Ophthalmology & Vision', dept: 'Ophthalmology', desc: 'Blurry vision, eye strain, redness' },
    { id: 'General Health', label: 'General Medicine', dept: 'Internal Medicine', desc: 'Fever, fatigue, annual evaluation' },
    { id: 'Other', label: 'Other Special Care', dept: '', desc: 'Other specialized healthcare concerns' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('Bone / Joint');
  const [description, setDescription] = useState('');
  const [preferredDept, setPreferredDept] = useState('Orthopedics & Sports Medicine');
  const [preferredDoctor, setPreferredDoctor] = useState('');
  const [priority, setPriority] = useState('Normal');

  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;

    const newReq = submitPatientRequest({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientContact: currentPatient.phone || '+1 (555) 000-0000',
      issueCategory: selectedCategory,
      description,
      preferredDepartment: preferredDept,
      preferredDoctor,
      priority
    });

    setSubmittedId(newReq.id);
    setDescription('');
    setTimeout(() => setSubmittedId(null), 4000);
  };

  const myRequests = (patientRequests || []).filter(
    r => r.patientId === currentPatient.id || r.patientName === currentPatient.name
  );

  return (
    <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClipboardList size={22} style={{ color: 'var(--primary)' }} />
          <span>Request Hospital Care & Specialist Triage</span>
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Submit your health concern for review by the hospital management triage team to be assigned to the most qualified physician
        </p>
      </div>

      {submittedId && (
        <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={22} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Care Request Submitted! Reference: {submittedId}</strong>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              The Hospital Manager and clinical triage team have been notified to review your symptoms and assign an appropriate specialist.
            </span>
          </div>
        </div>
      )}

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
          Step 1: Select Health Issue Category
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Choose the anatomical or clinical category that best matches your symptoms:
        </p>

        {/* Category Selector Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '24px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.dept) setPreferredDept(cat.dept);
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '4px', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                  {cat.label}
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.3', display: 'block' }}>
                  {cat.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step 2: Describe Symptoms */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
          Step 2: Describe Your Symptoms & Medical Concern *
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Please explain your symptoms in detail (duration, severity, triggers) to help our triage team:
        </p>

        <div className="form-group">
          <textarea
            className="form-textarea"
            rows={4}
            required
            placeholder="e.g. Pain in my right knee for the last two weeks, worse after walking upstairs. Noticeable joint swelling."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Step 3: Preferences & Urgency */}
        <div className="grid-3" style={{ marginTop: '14px' }}>
          <div className="form-group">
            <label className="form-label">Preferred Clinical Department</label>
            <select
              className="form-select"
              value={preferredDept}
              onChange={(e) => setPreferredDept(e.target.value)}
            >
              <option value="">No preference (Let manager decide)</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Physician (Optional)</label>
            <select
              className="form-select"
              value={preferredDoctor}
              onChange={(e) => setPreferredDoctor(e.target.value)}
            >
              <option value="">Any qualified specialist</option>
              {doctors.map(d => (
                <option key={d.id} value={d.name}>{d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Urgency Level</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Normal">Normal (Routine Consultation)</option>
              <option value="Medium">Medium (Moderate Discomfort)</option>
              <option value="High">High Urgency (Severe Acute Symptoms)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Send size={16} />
            <span>Submit Care Request for Review</span>
          </button>
        </div>
      </form>

      {/* My Past Requests Stream */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Clock size={18} style={{ color: 'var(--amber)' }} />
              <span>My Consultation Request History</span>
            </div>
            <div className="card-subtitle">
              Live status tracking for requests submitted under your profile
            </div>
          </div>
        </div>

        {myRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            You haven't submitted any care requests yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                      {req.id}
                    </span>
                    <Badge variant="primary">{req.issueCategory}</Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{req.submittedDate}</span>
                  </div>

                  <Badge variant={req.status === 'Accepted' || req.status === 'Assigned' ? 'success' : req.status === 'Under Review' ? 'warning' : 'neutral'}>
                    Status: {req.status}
                  </Badge>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                  "{req.description}"
                </p>

                {req.assignedDoctor ? (
                  <div style={{ padding: '8px 12px', background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--teal)' }}>
                    ✓ <strong>Assigned Physician:</strong> {req.assignedDoctor} ({req.assignedDepartment})
                    {req.managerNotes && <span> • <em>Note: {req.managerNotes}</em></span>}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Awaiting Hospital Manager triage & specialist assignment
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
