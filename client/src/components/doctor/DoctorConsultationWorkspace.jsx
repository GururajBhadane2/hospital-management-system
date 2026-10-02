import React, { useState } from 'react';
import {
  HeartPulse,
  Save,
  CheckCircle,
  Plus,
  Pill,
  FlaskConical,
  Activity,
  AlertTriangle,
  User,
  Stethoscope,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';

export const DoctorConsultationWorkspace = ({ onNavigate }) => {
  const { activeDoctorId } = useAuth();
  const {
    doctors,
    patients,
    addMedicalRecord,
    issuePrescription,
    addLabTestOrder,
    addRadiologyOrder,
    createPharmacyOrder
  } = useHospitalData();

  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  // Patients available for consultation
  const myPatients = patients.filter(p => p.assignedDoctor === currentDoctor?.name);
  const patientList = myPatients.length > 0 ? myPatients : patients;

  const [selectedPatientId, setSelectedPatientId] = useState(patientList[0]?.id || '');
  const activePatient = patientList.find(p => p.id === selectedPatientId) || patientList[0];

  // Consultation Details State
  const [chiefComplaint, setChiefComplaint] = useState('Episodic exertional shortness of breath');
  const [diagnosis, setDiagnosis] = useState('Systemic Hypertension with Secondary Angina');
  const [consultationNotes, setConsultationNotes] = useState('Patient presented with mild dyspnea on exertion. Cardiac auscultation demonstrates regular rhythm, S1/S2 audible, no audible friction rub. Lungs clear to bilateral bases. Advised to continue anti-hypertensive regimen and log morning BP.');
  const [followUpPlan, setFollowUpPlan] = useState('Recheck ECG in 2 weeks. Comprehensive metabolic panel to assess renal baseline.');

  // Vitals State
  const [vitals, setVitals] = useState({
    bloodPressure: '138/88 mmHg',
    heartRate: '74 bpm',
    temperature: '98.6 °F',
    oxygenSaturation: '99%',
    respiratoryRate: '15 bpm'
  });

  // Digital Prescription Items
  const [prescriptionItems, setPrescriptionItems] = useState([
    {
      medicine: 'Amlodipine Besylate',
      dosage: '5 mg',
      frequency: 'Once daily (Morning)',
      duration: '30 days',
      instructions: 'Take after breakfast with a full glass of water'
    }
  ]);

  // Optional Diagnostics Orders
  const [orderLab, setOrderLab] = useState(true);
  const [labTestName, setLabTestName] = useState('Comprehensive Metabolic Panel (CMP)');
  const [orderRad, setOrderRad] = useState(false);
  const [radModality, setRadModality] = useState('X-Ray');
  const [radBodyPart, setRadBodyPart] = useState('Chest PA & Lateral');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleAddRxItem = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      { medicine: '', dosage: '10 mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take as directed' }
    ]);
  };

  const handleRemoveRxItem = (idx) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== idx));
  };

  const handleRxItemChange = (idx, field, val) => {
    const next = [...prescriptionItems];
    next[idx][field] = val;
    setPrescriptionItems(next);
  };

  const handleSubmitConsultation = (e) => {
    e.preventDefault();
    if (!activePatient || !diagnosis) return;

    // 1. Create EMR Record
    addMedicalRecord({
      patientId: activePatient.id,
      patientName: activePatient.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      department: currentDoctor.department,
      chiefComplaint,
      diagnosis,
      vitals,
      consultationNotes,
      followUpPlan
    });

    // 2. Issue Digital Prescription if items exist
    if (prescriptionItems.length > 0 && prescriptionItems[0].medicine) {
      const rx = issuePrescription({
        patientId: activePatient.id,
        patientName: activePatient.name,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        items: prescriptionItems
      });

      // Auto-create pharmacy order queue item
      createPharmacyOrder({
        patientId: activePatient.id,
        patientName: activePatient.name,
        prescriptionId: rx.id,
        totalAmount: 45.00,
        itemsSummary: prescriptionItems.map(i => `${i.medicine} ${i.dosage}`).join(', '),
        pharmacistNotes: 'Authorized digital prescription from consultation'
      });
    }

    // 3. Order Lab test if checked
    if (orderLab && labTestName) {
      addLabTestOrder({
        patientId: activePatient.id,
        patientName: activePatient.name,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        testName: labTestName,
        department: 'Clinical Biochemistry'
      });
    }

    // 4. Order Radiology scan if checked
    if (orderRad && radBodyPart) {
      addRadiologyOrder({
        patientId: activePatient.id,
        patientName: activePatient.name,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        modality: radModality,
        bodyPart: radBodyPart
      });
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      if (onNavigate) onNavigate('doctor-dashboard');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartPulse size={22} style={{ color: 'var(--teal)' }} />
          <span>Physician Clinical Consultation & EMR Workspace</span>
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Record clinical examination, document diagnosis, issue authorized digital prescriptions, and order diagnostics
        </p>
      </div>

      {submittedSuccess && (
        <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={22} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Clinical Consultation Completed Successfully!</strong>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>EMR record generated, digital prescription issued to pharmacy, and patient notification dispatched.</span>
          </div>
        </div>
      )}

      {/* Patient Selection Bar */}
      <div className="card" style={{ padding: '16px 20px', background: 'var(--bg-surface-elevated)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Select Active Patient:
            </span>
            <select
              className="form-select"
              style={{ width: '280px', height: '38px', fontWeight: 600 }}
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patientList.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) — {p.admissionStatus}</option>
              ))}
            </select>
          </div>

          {activePatient && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem' }}>
              <span>Age: <strong>{activePatient.age} yrs</strong></span>
              <span>Gender: <strong>{activePatient.gender}</strong></span>
              <span>Blood Group: <strong style={{ color: 'var(--danger)' }}>{activePatient.bloodGroup}</strong></span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontWeight: 700 }}>
                Allergies: {activePatient.allergies || 'None'}
              </span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmitConsultation} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Vitals Recording Strip */}
        <div className="card">
          <div className="card-title" style={{ fontSize: '1rem', marginBottom: '14px' }}>
            <Activity size={18} style={{ color: 'var(--teal)' }} />
            <span>Clinical Vitals & Physiological Measurements</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Blood Pressure</label>
              <input
                type="text"
                className="form-input"
                placeholder="120/80 mmHg"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Heart Rate</label>
              <input
                type="text"
                className="form-input"
                placeholder="72 bpm"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Temperature</label>
              <input
                type="text"
                className="form-input"
                placeholder="98.6 °F"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Oxygen Saturation (SpO2)</label>
              <input
                type="text"
                className="form-input"
                placeholder="98%"
                value={vitals.oxygenSaturation}
                onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Respiratory Rate</label>
              <input
                type="text"
                className="form-input"
                placeholder="16 bpm"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Diagnosis & Notes */}
        <div className="card">
          <div className="card-title" style={{ fontSize: '1rem', marginBottom: '14px' }}>
            <Stethoscope size={18} style={{ color: 'var(--primary)' }} />
            <span>Clinical Findings & Diagnosis</span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Chief Complaint *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Throbbing right temporal headache"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Diagnosis *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Chronic Migraine with Visual Aura"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Physician Examination & Consultation Notes *</label>
            <textarea
              className="form-textarea"
              rows={4}
              required
              placeholder="Physical findings, systemic examination observations, clinical rationale..."
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Follow-up Plan & Patient Guidance</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Recommended lifestyle adjustments, dietary guidance, follow-up timeline..."
              value={followUpPlan}
              onChange={(e) => setFollowUpPlan(e.target.value)}
            />
          </div>
        </div>

        {/* Digital Prescription Builder */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Pill size={18} style={{ color: 'var(--info)' }} />
                <span>Issue Digital Prescription (e-Rx)</span>
              </div>
              <div className="card-subtitle">
                Medications automatically route to Hospital Pharmacy for dispensing
              </div>
            </div>

            <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddRxItem}>
              <Plus size={14} />
              + Add Medication
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {prescriptionItems.map((item, idx) => (
              <div key={idx} style={{ padding: '14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Medicine Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Amlodipine"
                    value={item.medicine}
                    onChange={(e) => handleRxItemChange(idx, 'medicine', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Dosage</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 5 mg"
                    value={item.dosage}
                    onChange={(e) => handleRxItemChange(idx, 'dosage', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Frequency</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Daily with meal"
                    value={item.frequency}
                    onChange={(e) => handleRxItemChange(idx, 'frequency', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 30 days"
                    value={item.duration}
                    onChange={(e) => handleRxItemChange(idx, 'duration', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Instructions</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Take with water"
                    value={item.instructions}
                    onChange={(e) => handleRxItemChange(idx, 'instructions', e.target.value)}
                  />
                </div>

                {prescriptionItems.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ height: '40px' }}
                    onClick={() => handleRemoveRxItem(idx)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Diagnostics (Lab & Radiology) */}
        <div className="card">
          <div className="card-title" style={{ fontSize: '1rem', marginBottom: '14px' }}>
            <FlaskConical size={18} style={{ color: 'var(--teal)' }} />
            <span>Order Diagnostic Investigations (Optional)</span>
          </div>

          <div className="grid-2">
            {/* Lab Order */}
            <div style={{ padding: '14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px', fontWeight: 600, fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={orderLab}
                  onChange={(e) => setOrderLab(e.target.checked)}
                />
                <span>Order Clinical Laboratory Test</span>
              </label>

              {orderLab && (
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lipid Profile + HbA1c"
                  value={labTestName}
                  onChange={(e) => setLabTestName(e.target.value)}
                />
              )}
            </div>

            {/* Radiology Order */}
            <div style={{ padding: '14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px', fontWeight: 600, fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={orderRad}
                  onChange={(e) => setOrderRad(e.target.checked)}
                />
                <span>Order Radiology Imaging Scan</span>
              </label>

              {orderRad && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="form-select"
                    style={{ width: '120px' }}
                    value={radModality}
                    onChange={(e) => setRadModality(e.target.value)}
                  >
                    <option value="MRI">MRI</option>
                    <option value="CT">CT Scan</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="Ultrasound">Ultrasound</option>
                  </select>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Body region (e.g. Brain Contrast)"
                    value={radBodyPart}
                    onChange={(e) => setRadBodyPart(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate && onNavigate('doctor-dashboard')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg">
            <Send size={18} />
            Complete Consultation & Issue EMR Record
          </button>
        </div>
      </form>
    </div>
  );
};
