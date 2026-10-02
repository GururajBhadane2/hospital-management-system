import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  Stethoscope,
  Building2,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const AppointmentsModule = () => {
  const { appointments, createAppointment, updateAppointment, doctors, patients, departments } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);

  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    doctorName: '',
    department: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Consultation',
    room: 'Clinic Suite 201',
    status: 'Confirmed',
    notes: ''
  });

  const openAddModal = () => {
    setForm({
      patientName: patients[0]?.name || '',
      patientId: patients[0]?.id || '',
      doctorName: doctors[0]?.name || '',
      department: departments[0]?.name || 'Cardiology',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00 AM',
      type: 'Specialist Consultation',
      room: 'Clinic Suite 201',
      status: 'Confirmed',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    if (!form.patientName || !form.doctorName || !form.date) return;

    if (selectedApt) {
      updateAppointment(selectedApt.id, form);
      setSelectedApt(null);
    } else {
      createAppointment(form);
      setIsAddModalOpen(false);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    updateAppointment(id, { status: newStatus });
  };

  const filteredAppointments = (appointments || []).filter(a => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.department && a.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending Approval':
      case 'Requested':
      case 'Rescheduled':
        return 'warning';
      case 'Completed':
        return 'primary';
      case 'Cancelled':
      case 'No Show':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarCheck size={22} style={{ color: 'var(--primary)' }} />
            <span>Hospital Appointments & Clinical Schedule</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Schedule patient visits, approve requests, monitor daily consultations, and manage cancellations
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>+ Schedule Appointment</span>
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
            placeholder="Search by patient, physician, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '180px', height: '40px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Completed">Completed</option>
          <option value="Rescheduled">Rescheduled</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No Appointments Scheduled"
          description="There are currently no appointments registered. Click below to schedule a patient consultation."
          actionLabel="+ Schedule Appointment"
          onAction={openAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Appt ID</th>
                <th>Patient</th>
                <th>Assigned Physician</th>
                <th>Department & Room</th>
                <th>Date & Time</th>
                <th>Type & Clinical Notes</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {apt.id}
                    </span>
                  </td>

                  <td>
                    <strong style={{ color: 'var(--text-main)', display: 'block' }}>{apt.patientName}</strong>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{apt.patientId}</span>
                  </td>

                  <td>
                    <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{apt.doctorName}</span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>{apt.department}</div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{apt.room || 'Clinic Suite'}</span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{apt.date}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> {apt.time}
                    </span>
                  </td>

                  <td style={{ maxWidth: '240px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500, display: 'block' }}>
                      {apt.type}
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={apt.notes}>
                      {apt.notes || 'Routine examination'}
                    </p>
                  </td>

                  <td>
                    <Badge variant={getStatusBadge(apt.status)}>
                      {apt.status}
                    </Badge>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      {apt.status === 'Pending Approval' && (
                        <button
                          className="btn btn-success btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.725rem' }}
                          onClick={() => handleStatusUpdate(apt.id, 'Confirmed')}
                          title="Confirm appointment"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.725rem' }}
                          onClick={() => handleStatusUpdate(apt.id, 'Completed')}
                          title="Mark completed"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.725rem' }}
                          onClick={() => handleStatusUpdate(apt.id, 'Cancelled')}
                          title="Cancel appointment"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen || !!selectedApt}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedApt(null);
        }}
        title={selectedApt ? `Edit Appointment: ${selectedApt.id}` : '+ Schedule Patient Appointment'}
        subtitle="Book physician clinic consultation or diagnostic procedure"
        maxWidth="680px"
      >
        <form onSubmit={handleSaveAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Patient *</label>
              {patients.length > 0 ? (
                <select
                  className="form-select"
                  value={form.patientName}
                  onChange={(e) => {
                    const pat = patients.find(p => p.name === e.target.value);
                    setForm({ ...form, patientName: e.target.value, patientId: pat ? pat.id : '' });
                  }}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Patient Name"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Physician *</label>
              {doctors.length > 0 ? (
                <select
                  className="form-select"
                  value={form.doctorName}
                  onChange={(e) => {
                    const doc = doctors.find(d => d.name === e.target.value);
                    setForm({ ...form, doctorName: e.target.value, department: doc ? doc.department : form.department });
                  }}
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.specialization})</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Doctor Name"
                  value={form.doctorName}
                  onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
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
              <label className="form-label">Room / Clinic Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Clinic Suite 304"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. 10:30 AM"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Clinical Reason / Notes</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Follow-up consultation on anti-hypertensive titration..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedApt(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedApt ? 'Update Appointment' : 'Schedule & Confirm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
