import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  Heart,
  Shield,
  Phone,
  Mail,
  Home,
  FileText,
  BedDouble
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const PatientsModule = () => {
  const { patients, addPatient, updatePatient, departments, doctors, beds, updateBedStatus } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '1990-01-01',
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    policyNumber: '',
    allergies: 'None',
    chronicConditions: '',
    admissionStatus: 'Inpatient',
    assignedDepartment: '',
    assignedDoctor: '',
    assignedBed: ''
  });

  const openAddModal = () => {
    setForm({
      name: '',
      dateOfBirth: '1990-01-01',
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '',
      email: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      insuranceProvider: 'Blue Cross / Medicare',
      policyNumber: '',
      allergies: 'None',
      chronicConditions: '',
      admissionStatus: 'Inpatient',
      assignedDepartment: departments[0]?.name || 'Cardiology',
      assignedDoctor: doctors[0]?.name || '',
      assignedBed: 'Room 302 - Bed A'
    });
    setIsAddModalOpen(true);
  };

  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    // Calculate age from DOB
    const birthYear = new Date(form.dateOfBirth).getFullYear();
    const age = new Date().getFullYear() - birthYear;

    addPatient({
      ...form,
      age,
      approvalStatus: 'Approved'
    });

    setIsAddModalOpen(false);
  };

  const filteredPatients = (patients || []).filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.chronicConditions && p.chronicConditions.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.admissionStatus === statusFilter;
    const matchesDept = deptFilter === 'ALL' || p.assignedDepartment === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} style={{ color: 'var(--primary)' }} />
            <span>Patients & Admissions Roster</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Hospital census, inpatient bed allocations, and electronic health registration records
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>+ Register Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search patient by name, ID (e.g. PAT-1001), or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '170px', height: '40px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Admissions</option>
          <option value="Inpatient">Inpatients</option>
          <option value="Outpatient">Outpatients</option>
          <option value="Discharged">Discharged</option>
        </select>

        <select
          className="form-select"
          style={{ width: '180px', height: '40px' }}
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Patients Table */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Patients Registered"
          description="There are currently no patient records entered in the system. Click below to register an intake patient."
          actionLabel="+ Register Patient"
          onAction={openAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name & Demographics</th>
                <th>Admission Status</th>
                <th>Assigned Care Team</th>
                <th>Bed / Ward Location</th>
                <th>Insurance / Policy</th>
                <th>Allergies & Alerts</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {p.id}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Admitted: {p.admissionDate || 'N/A'}
                    </div>
                  </td>

                  <td>
                    <strong style={{ color: 'var(--text-main)', display: 'block' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {p.age} yrs • {p.gender} • Blood: <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{p.bloodGroup}</span>
                    </span>
                  </td>

                  <td>
                    <Badge variant={p.admissionStatus === 'Inpatient' ? 'danger' : p.admissionStatus === 'Outpatient' ? 'primary' : 'neutral'}>
                      {p.admissionStatus || 'Outpatient'}
                    </Badge>
                  </td>

                  <td>
                    {p.assignedDoctor ? (
                      <div>
                        <strong style={{ fontSize: '0.825rem', color: 'var(--teal)' }}>{p.assignedDoctor}</strong>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{p.assignedDepartment}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Unassigned</span>
                    )}
                  </td>

                  <td>
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {p.assignedBed || 'N/A'}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{p.insuranceProvider || 'Self-Pay'}</div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{p.policyNumber}</span>
                  </td>

                  <td>
                    {p.allergies && p.allergies !== 'None' ? (
                      <Badge variant="warning">{p.allergies}</Badge>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>NKDA</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedPatient(p)}
                    >
                      <FileText size={13} />
                      EMR Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Patient Intake Registration Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="+ Patient Intake & Admission Registration"
        subtitle="Create complete medical profile, insurance coverage, and bed assignment"
        maxWidth="740px"
      >
        <form onSubmit={handleSavePatient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Patient Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Eleanor Vance"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                className="form-input"
                required
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary / Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              >
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Contact Phone *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="+1 (555) 234-5678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="patient@domain.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admission Category</label>
              <select
                className="form-select"
                value={form.admissionStatus}
                onChange={(e) => setForm({ ...form, admissionStatus: e.target.value })}
              >
                <option value="Inpatient">Inpatient (Admitted to Ward/Room)</option>
                <option value="Outpatient">Outpatient (Clinic Visits)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Department</label>
              <select
                className="form-select"
                value={form.assignedDepartment}
                onChange={(e) => setForm({ ...form, assignedDepartment: e.target.value })}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Attending Physician</label>
              <select
                className="form-select"
                value={form.assignedDoctor}
                onChange={(e) => setForm({ ...form, assignedDoctor: e.target.value })}
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.specialization})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Bed Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cardiology Wing - Bed 302-A"
                value={form.assignedBed}
                onChange={(e) => setForm({ ...form, assignedBed: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Insurance Provider</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Blue Cross Blue Shield"
                value={form.insuranceProvider}
                onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Insurance Policy Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BCBS-9912-A"
                value={form.policyNumber}
                onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Known Allergies & Drug Contraindications</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Penicillin, Sulfa drugs, Latex"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emergency Contact Name & Phone</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Thomas Vance (Spouse) - +1 (555) 888-2921"
              value={form.emergencyContactName}
              onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register & Admit Patient
            </button>
          </div>
        </form>
      </Modal>

      {/* Patient EMR Details Drawer / Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={`Patient EMR Profile: ${selectedPatient?.name}`}
        subtitle={`ID: ${selectedPatient?.id} • Blood: ${selectedPatient?.bloodGroup}`}
        maxWidth="680px"
      >
        {selectedPatient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>DOB & Age</span>
                <strong>{selectedPatient.dateOfBirth} ({selectedPatient.age} yrs)</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Contact Phone</span>
                <strong>{selectedPatient.phone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Emergency Contact</span>
                <span>{selectedPatient.emergencyContactName || 'N/A'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Address</span>
                <span>{selectedPatient.address || 'N/A'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Attending Physician</span>
                <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{selectedPatient.assignedDoctor || 'None'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Assigned Ward / Bed</span>
                <span>{selectedPatient.assignedBed || 'Outpatient'}</span>
              </div>
            </div>

            <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ color: 'var(--danger)', fontSize: '0.825rem', display: 'block', marginBottom: '4px' }}>
                Allergies & Medical Alerts:
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {selectedPatient.allergies || 'No known allergies'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>
                Close Record
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
