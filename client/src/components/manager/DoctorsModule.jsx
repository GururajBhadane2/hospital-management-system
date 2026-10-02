import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Search,
  Filter,
  UserCheck,
  Award,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Edit,
  Trash2,
  Building2
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const DoctorsModule = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor, departments } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Add/Edit Form State
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    department: '',
    qualifications: '',
    registrationNumber: '',
    yearsOfExperience: 5,
    professionalBio: '',
    areasOfExpertise: '',
    languages: 'English',
    consultationFee: 200,
    availableDays: 'Mon, Wed, Fri',
    availableTime: '09:00 - 16:00',
    hospitalRole: 'Attending Physician',
    employmentStatus: 'Full-Time',
    phone: '',
    email: '',
    status: 'Active'
  });

  const openAddModal = () => {
    setForm({
      name: '',
      specialization: '',
      department: departments[0]?.name || 'Cardiology',
      qualifications: 'MD Board Certified',
      registrationNumber: `MED-REG-${Date.now().toString().slice(-5)}`,
      yearsOfExperience: 5,
      professionalBio: '',
      areasOfExpertise: '',
      languages: 'English',
      consultationFee: 200,
      availableDays: 'Mon, Wed, Fri',
      availableTime: '09:00 - 16:00',
      hospitalRole: 'Attending Physician',
      employmentStatus: 'Full-Time',
      phone: '+1 (555) 000-0000',
      email: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!form.name || !form.specialization) return;

    if (selectedDoctor) {
      updateDoctor(selectedDoctor.id, form);
      setSelectedDoctor(null);
    } else {
      addDoctor(form);
      setIsAddModalOpen(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateDoctor(id, { status: newStatus });
  };

  const filteredDoctors = (doctors || []).filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || d.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={22} style={{ color: 'var(--teal)' }} />
            <span>Hospital Medical Staff & Doctor Directory</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Authorized physician credentials, clinical specialization, department assignments, and portal access
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>+ Add Doctor</span>
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
            placeholder="Search by physician name, specialty, or clinical expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '180px', height: '40px' }}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <select
          className="form-select"
          style={{ width: '170px', height: '40px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="On Leave">On Leave</option>
          <option value="Suspended">Suspended</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Doctors Grid / Table */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No Doctors Added Yet"
          description="There are currently no doctors registered on the platform. Click below to add your hospital's real clinical staff."
          actionLabel="+ Add First Doctor"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid-2">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(20, 184, 166, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--teal)',
                        fontWeight: 800,
                        fontSize: '1.1rem'
                      }}
                    >
                      {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {doc.name}
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--teal)', fontWeight: 600 }}>
                        {doc.specialization}
                      </p>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                        Reg: {doc.registrationNumber || 'N/A'} • {doc.yearsOfExperience} yrs exp
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    className="form-select"
                    style={{
                      width: 'auto',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      height: '28px',
                      borderRadius: '9999px',
                      background: doc.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: doc.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                      border: 'none',
                      fontWeight: 700
                    }}
                    value={doc.status}
                    onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Details Grid */}
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.775rem', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Department</span>
                    <strong style={{ color: 'var(--text-main)' }}>{doc.department}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Consultation Fee</span>
                    <strong style={{ color: 'var(--primary)' }}>${doc.consultationFee}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Schedule</span>
                    <span style={{ color: 'var(--text-muted)' }}>{doc.availableDays}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Hours</span>
                    <span style={{ color: 'var(--text-muted)' }}>{doc.availableTime}</span>
                  </div>
                </div>

                {doc.qualifications && (
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    <strong>Credentials:</strong> {doc.qualifications}
                  </p>
                )}

                {doc.areasOfExpertise && (
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    <strong>Focus:</strong> {doc.areasOfExpertise}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                  Role: {doc.hospitalRole || 'Staff Physician'} ({doc.employmentStatus || 'Full-Time'})
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setForm({ ...doc });
                    }}
                  >
                    <Edit size={13} />
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDoctor(doc.id)}
                    title="Remove doctor from active directory"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen || !!selectedDoctor}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedDoctor(null);
        }}
        title={selectedDoctor ? `Edit Doctor: ${selectedDoctor.name}` : '+ Register Real Physician'}
        subtitle="Enter complete clinical credentials and schedule availability"
        maxWidth="760px"
      >
        <form onSubmit={handleSaveDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Doctor Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Dr. Sarah Jenkins"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Interventional Cardiology"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Department</label>
              <select
                className="form-select"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Medical Registration / License #</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MED-MA-99214"
                value={form.registrationNumber}
                onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Qualifications & Degrees</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MD, FACC (Harvard Medical School)"
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Clinical Experience</label>
              <input
                type="number"
                className="form-input"
                value={form.yearsOfExperience}
                onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee ($)</label>
              <input
                type="number"
                className="form-input"
                value={form.consultationFee}
                onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Days</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mon, Wed, Fri"
                value={form.availableDays}
                onChange={(e) => setForm({ ...form, availableDays: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Working Hours</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 08:30 - 16:30"
                value={form.availableTime}
                onChange={(e) => setForm({ ...form, availableTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Spoken Languages</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. English, Spanish"
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Role</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Head of Cardiology"
                value={form.hospitalRole}
                onChange={(e) => setForm({ ...form, hospitalRole: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Direct Contact Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 (555) 301-4411"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Areas of Expertise</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Coronary Angioplasty, Echocardiography, Valvular Heart Disease"
              value={form.areasOfExpertise}
              onChange={(e) => setForm({ ...form, areasOfExpertise: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Bio / Summary</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Summary of clinical background, research, or surgical focus..."
              value={form.professionalBio}
              onChange={(e) => setForm({ ...form, professionalBio: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedDoctor(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedDoctor ? 'Update Doctor Profile' : 'Save & Authorize Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
