import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Users,
  Stethoscope,
  ClipboardList,
  CalendarCheck,
  Edit,
  MapPin,
  Phone
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const DepartmentsModule = () => {
  const { departments, addDepartment, updateDepartment, doctors, patientRequests, appointments } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    headOfDepartment: '',
    location: '',
    phone: '',
    description: '',
    status: 'Active'
  });

  const openAddModal = () => {
    setForm({
      name: '',
      code: '',
      headOfDepartment: '',
      location: 'Building A, Floor 2',
      phone: 'Ext. 2000',
      description: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveDepartment = (e) => {
    e.preventDefault();
    if (!form.name) return;

    if (selectedDept) {
      updateDepartment(selectedDept.id, form);
      setSelectedDept(null);
    } else {
      addDepartment(form);
      setIsAddModalOpen(false);
    }
  };

  const filteredDepts = (departments || []).filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={22} style={{ color: 'var(--emerald)' }} />
            <span>Hospital Department Management</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Configure clinical specialties, assign department heads, monitor specialist staffing and triage loads
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>+ Add Department</span>
        </button>
      </div>

      {/* Search Bar */}
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
            placeholder="Search departments by name, specialty, or code (e.g. CARD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      {filteredDepts.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Departments Configured"
          description="Create your hospital's departments (e.g. Cardiology, Dermatology, Orthopedics) to begin routing patient requests."
          actionLabel="+ Add Department"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid-3">
          {filteredDepts.map((dept) => {
            const deptDoctors = doctors.filter(d => d.department.toLowerCase().includes(dept.name.toLowerCase()));
            const deptRequests = patientRequests.filter(r => (r.assignedDepartment || r.preferredDepartment || '').toLowerCase().includes(dept.name.toLowerCase()));
            const deptAppointments = appointments.filter(a => (a.department || '').toLowerCase().includes(dept.name.toLowerCase()));

            return (
              <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                        {dept.code || 'DEPT'}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                        {dept.name}
                      </h3>
                    </div>
                    <Badge variant={dept.status === 'Active' ? 'success' : 'neutral'}>
                      {dept.status || 'Active'}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '16px', minHeight: '38px', lineHeight: '1.4' }}>
                    {dept.description || 'Clinical specialty division.'}
                  </p>

                  <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.785rem', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Stethoscope size={14} style={{ color: 'var(--teal)' }} />
                      <span><strong>Head:</strong> {dept.headOfDepartment || 'To be appointed'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)' }} />
                      <span>{dept.location || 'Hospital Main Pavilion'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} style={{ color: 'var(--text-dim)' }} />
                      <span>{dept.phone || 'Internal Ext.'}</span>
                    </div>
                  </div>

                  {/* Dynamic Department Statistics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teal)', display: 'block' }}>
                        {deptDoctors.length}
                      </span>
                      <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Doctors</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--amber)', display: 'block' }}>
                        {deptRequests.length}
                      </span>
                      <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Requests</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>
                        {deptAppointments.length}
                      </span>
                      <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Appts</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSelectedDept(dept);
                      setForm({ ...dept });
                    }}
                  >
                    <Edit size={13} />
                    Edit Department
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={isAddModalOpen || !!selectedDept}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedDept(null);
        }}
        title={selectedDept ? `Edit Department: ${selectedDept.name}` : '+ Create Clinical Department'}
        subtitle="Configure department name, code, clinical head, and location"
        maxWidth="620px"
      >
        <form onSubmit={handleSaveDepartment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Neurology"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department Code (3-4 letters)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. NEUR"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Head of Department (Physician)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Emily Taylor"
                value={form.headOfDepartment}
                onChange={(e) => setForm({ ...form, headOfDepartment: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Physical Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Building A, Floor 3"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Extension / Contact Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ext. 3010"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operational Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive / Suspended</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department Scope / Clinical Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Diagnostic evaluation and surgical interventions for spinal, cranial, and neuromuscular conditions..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedDept(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedDept ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
