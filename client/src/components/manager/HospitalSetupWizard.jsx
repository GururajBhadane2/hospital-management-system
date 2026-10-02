import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Hospital,
  Building2,
  Stethoscope,
  Users,
  Activity,
  BedDouble,
  Wrench,
  Pill,
  Receipt,
  Save,
  SkipForward
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';

export const HospitalSetupWizard = ({ isOpen, onClose }) => {
  const {
    hospital,
    updateHospitalConfig,
    departments,
    addDepartment,
    doctors,
    addDoctor,
    addRoom,
    addBed,
    addMedicine
  } = useHospitalData();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Hospital Info Form State
  const [infoForm, setInfoForm] = useState({
    name: hospital.name || '',
    tagline: hospital.tagline || '',
    registrationNumber: hospital.registrationNumber || '',
    address: hospital.address || '',
    city: hospital.city || '',
    state: hospital.state || '',
    postalCode: hospital.postalCode || '',
    phone: hospital.phone || '',
    emergencyPhone: hospital.emergencyPhone || '',
    email: hospital.email || '',
    website: hospital.website || '',
    workingHours: hospital.workingHours || '24/7 Operations',
    emergencyAvailability: hospital.emergencyAvailability !== undefined ? hospital.emergencyAvailability : true
  });

  // Step 2: New Dept Form State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptLocation, setNewDeptLocation] = useState('');

  // Step 3: New Doctor State
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocDept, setNewDocDept] = useState('');
  const [newDocFee, setNewDocFee] = useState(200);

  // Step 6: Rooms & Beds
  const [newRoomName, setNewRoomName] = useState('');
  const [newBedId, setNewBedId] = useState('');

  // Step 8: Pharmacy
  const [newMedName, setNewMedName] = useState('');
  const [newMedQty, setNewMedQty] = useState(100);

  // Step 9: Billing
  const [billingCurrency, setBillingCurrency] = useState(hospital.billingCurrency || 'USD ($)');
  const [taxRate, setTaxRate] = useState(hospital.taxRate || 0);

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Hospital Info', icon: Hospital },
    { number: 2, title: 'Departments', icon: Building2 },
    { number: 3, title: 'Doctors', icon: Stethoscope },
    { number: 4, title: 'Staff', icon: Users },
    { number: 5, title: 'Services', icon: Activity },
    { number: 6, title: 'Rooms & Beds', icon: BedDouble },
    { number: 7, title: 'Equipment', icon: Wrench },
    { number: 8, title: 'Pharmacy', icon: Pill },
    { number: 9, title: 'Billing Config', icon: Receipt }
  ];

  const handleSaveHospitalInfo = () => {
    updateHospitalConfig(infoForm);
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName) return;
    addDepartment({
      name: newDeptName,
      code: newDeptCode || newDeptName.slice(0, 4).toUpperCase(),
      location: newDeptLocation || 'Main Pavilion',
      description: 'Department configured during setup wizard'
    });
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptLocation('');
  };

  const handleAddDoc = (e) => {
    e.preventDefault();
    if (!newDocName || !newDocSpecialty) return;
    addDoctor({
      name: newDocName,
      specialization: newDocSpecialty,
      department: newDocDept || (departments[0]?.name || 'General Medicine'),
      consultationFee: Number(newDocFee),
      qualifications: 'MD Board Certified',
      registrationNumber: `REG-${Date.now().toString().slice(-5)}`,
      yearsOfExperience: 5,
      availableDays: 'Mon - Fri',
      availableTime: '09:00 - 17:00'
    });
    setNewDocName('');
    setNewDocSpecialty('');
  };

  const handleAddRoomAndBed = (e) => {
    e.preventDefault();
    if (!newRoomName) return;
    const room = addRoom({ name: newRoomName, department: 'General Care', floor: 'Floor 1', bedCapacity: 1 });
    if (newBedId) {
      addBed({ id: newBedId, room: room.name, department: 'General Care', type: 'Standard Care Bed' });
    }
    setNewRoomName('');
    setNewBedId('');
  };

  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMedName) return;
    addMedicine({
      name: newMedName,
      genericName: newMedName,
      category: 'General',
      dosageForm: 'Tablet',
      stockQuantity: Number(newMedQty),
      minStockLevel: 20,
      unitPrice: 1.00
    });
    setNewMedName('');
  };

  const handleSaveBilling = () => {
    updateHospitalConfig({ billingCurrency, taxRate });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Wizard Top Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Hospital Manager Onboarding
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Hospital Infrastructure Setup Wizard
            </h2>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Skip & Configure Later
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '8px'
          }}
        >
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = s.number < currentStep;
            const isCurrent = s.number === currentStep;

            return (
              <button
                key={s.number}
                onClick={() => setCurrentStep(s.number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: isCurrent ? 'var(--primary-light)' : isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  border: `1px solid ${isCurrent ? 'var(--primary)' : isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
                  color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--success)' : 'var(--text-dim)',
                  fontSize: '0.78rem',
                  fontWeight: isCurrent || isCompleted ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                <span>Step {s.number}: {s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step Form Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {/* STEP 1: Hospital Information */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 1 — Hospital Master Information</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Enter the official credentials, emergency routing lines, and working hours for this medical facility.
              </p>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Hospital Legal Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.name}
                    placeholder="e.g. St. Jude General Hospital"
                    onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Clinical Tagline / Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.tagline}
                    placeholder="e.g. Center for Healthcare & Research"
                    onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hospital Registration / License #</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.registrationNumber}
                    placeholder="e.g. HOSP-2026-9901"
                    onChange={(e) => setInfoForm({ ...infoForm, registrationNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Hospital Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.phone}
                    placeholder="+1 (555) 000-0000"
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Trauma Hotline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.emergencyPhone}
                    placeholder="+1 (800) 555-0911"
                    onChange={(e) => setInfoForm({ ...infoForm, emergencyPhone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Administrative Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={infoForm.email}
                    placeholder="admin@hospital.org"
                    onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Physical Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.address}
                    placeholder="100 Medical Plaza, Healthcare Way"
                    onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City & State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.city}
                    placeholder="Boston, MA"
                    onChange={(e) => setInfoForm({ ...infoForm, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Working Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    value={infoForm.workingHours}
                    placeholder="24/7 Clinical & Emergency Operations"
                    onChange={(e) => setInfoForm({ ...infoForm, workingHours: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Departments */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 2 — Hospital Clinical Departments</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Configure specialty divisions (Cardiology, Orthopedics, Pediatrics, Neurology, etc.). Currently configured: <strong>{departments.length}</strong>
              </p>

              <form onSubmit={handleAddDept} style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '10px' }}>Add Department to Hospital</div>
                <div className="grid-3">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Department Name (e.g. Oncology)"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Code (e.g. ONCO)"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Location (e.g. Pavilion B, Floor 2)"
                    value={newDeptLocation}
                    onChange={(e) => setNewDeptLocation(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  + Add Department
                </button>
              </form>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {departments.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <strong>{d.name}</strong> <span style={{ color: 'var(--text-dim)' }}>({d.code})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Doctors */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 3 — Doctor Staffing</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Add real physicians to your clinical roster. Currently registered: <strong>{doctors.length}</strong>
              </p>

              <form onSubmit={handleAddDoc} style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '10px' }}>Register Physician</div>
                <div className="grid-2">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Doctor Full Name (e.g. Dr. Alex Mercer)"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Specialization (e.g. Gastroenterology)"
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value)}
                  />
                  <select
                    className="form-select"
                    value={newDocDept}
                    onChange={(e) => setNewDocDept(e.target.value)}
                  >
                    <option value="">Assign Department</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Consultation Fee ($)"
                    value={newDocFee}
                    onChange={(e) => setNewDocFee(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  + Add Doctor
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {doctors.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong>{d.name}</strong> • <span style={{ color: 'var(--text-dim)' }}>{d.specialization} ({d.department})</span>
                    </div>
                    <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>${d.consultationFee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Staff */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 4 — Hospital Nursing & Administrative Staff</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Configure department head nurses, chief pharmacists, triage operators, and billing cycle administrators.
              </p>
              <div style={{ padding: '20px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  ✓ Standard operational roles (Head Charge Nurse, Chief Pharmacist, Revenue Cycle Manager) are pre-linked to your department workflows. You can invite additional staff anytime from User Management.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Services */}
          {currentStep === 5 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 5 — Clinical Services & Facilities</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Confirm available 24/7 healthcare facilities for your platform.
              </p>
              <div className="grid-2">
                {['24/7 Emergency Trauma Center', 'Inpatient Acute Care Wards', 'Diagnostic Laboratory (Biochemistry & Hematology)', 'Radiology & Imaging (MRI, CT, X-Ray)', 'Hospital In-House Formulary & Pharmacy', 'Outpatient Ambulatory Clinics'].map((srv, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
                    <Check size={18} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '0.875rem' }}>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Rooms & Beds */}
          {currentStep === 6 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 6 — Rooms & Bed Allocation</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Enter real physical rooms and beds. No hardcoded limits.
              </p>

              <form onSubmit={handleAddRoomAndBed} style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '10px' }}>Add Room & Initial Bed</div>
                <div className="grid-2">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Room Name (e.g. Room 401 ICU)"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Bed ID (e.g. BED-401-A)"
                    value={newBedId}
                    onChange={(e) => setNewBedId(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  + Add Room & Bed
                </button>
              </form>
            </div>
          )}

          {/* STEP 7: Equipment */}
          {currentStep === 7 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 7 — Medical Equipment Management</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Register critical clinical devices (CT Scanners, Ultrasound, Ventilators, Anesthesia machines) for maintenance and tracking.
              </p>
              <div style={{ padding: '20px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Equipment maintenance schedules can be cataloged directly from the Medical Equipment panel at any time.
                </p>
              </div>
            </div>
          )}

          {/* STEP 8: Pharmacy */}
          {currentStep === 8 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 8 — Hospital Pharmacy Formulary</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Add medicines to your hospital pharmacy stock.
              </p>

              <form onSubmit={handleAddMed} style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '10px' }}>Add Medicine to Formulary</div>
                <div className="grid-2">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Medicine Name (e.g. Paracetamol 500mg)"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Initial Stock Quantity"
                    value={newMedQty}
                    onChange={(e) => setNewMedQty(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  + Add Medicine
                </button>
              </form>
            </div>
          )}

          {/* STEP 9: Billing */}
          {currentStep === 9 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Step 9 — Billing & Currency Configuration</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Set your hospital's operational currency, default payment terms, and invoice tax settings.
              </p>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Operating Currency</label>
                  <select
                    className="form-select"
                    value={billingCurrency}
                    onChange={(e) => setBillingCurrency(e.target.value)}
                  >
                    <option value="USD ($)">USD - US Dollar ($)</option>
                    <option value="EUR (€)">EUR - Euro (€)</option>
                    <option value="GBP (£)">GBP - British Pound (£)</option>
                    <option value="INR (₹)">INR - Indian Rupee (₹)</option>
                    <option value="CAD ($)">CAD - Canadian Dollar ($)</option>
                    <option value="AUD ($)">AUD - Australian Dollar ($)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Applicable Tax Rate (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--success)', fontSize: '0.95rem', marginBottom: '4px' }}>Setup Complete!</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Clicking "Finalize & Launch Hospital OS" will save all hospital settings and open your live Manager Command Center.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            className="btn btn-secondary"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            style={{ opacity: currentStep === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentStep === 1 && (
              <button className="btn btn-secondary" onClick={handleSaveHospitalInfo}>
                <Save size={15} />
                Save Hospital Info
              </button>
            )}

            {currentStep < 9 ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (currentStep === 1) handleSaveHospitalInfo();
                  setCurrentStep(prev => Math.min(9, prev + 1));
                }}
              >
                <span>Next Step</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleSaveBilling}
              >
                <Check size={16} />
                Finalize & Launch Hospital OS
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
