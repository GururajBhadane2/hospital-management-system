import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Calendar,
  AlertTriangle,
  Send,
  MessageSquare
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const PatientRequestsModule = () => {
  const {
    patientRequests,
    updatePatientRequest,
    departments,
    doctors
  } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Selected request for review modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: 'Accepted',
    assignedDepartment: '',
    assignedDoctor: '',
    managerNotes: '',
    scheduleAppointment: true,
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: '10:00 AM'
  });

  const openReviewModal = (req) => {
    setSelectedRequest(req);
    // Auto-detect matching department or doctor
    const matchedDept = req.assignedDepartment || req.preferredDepartment || (departments[0]?.name || '');
    const matchedDoc = req.assignedDoctor || req.preferredDoctor || '';

    setReviewForm({
      status: req.status === 'Pending' ? 'Accepted' : req.status,
      assignedDepartment: matchedDept,
      assignedDoctor: matchedDoc,
      managerNotes: req.managerNotes || '',
      scheduleAppointment: true,
      appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointmentTime: '10:00 AM'
    });
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    updatePatientRequest(selectedRequest.id, {
      status: reviewForm.status,
      assignedDepartment: reviewForm.assignedDepartment,
      assignedDoctor: reviewForm.assignedDoctor,
      managerNotes: reviewForm.managerNotes,
      scheduleAppointment: reviewForm.scheduleAppointment && reviewForm.status === 'Accepted',
      appointmentDate: reviewForm.appointmentDate,
      appointmentTime: reviewForm.appointmentTime
    });

    setSelectedRequest(null);
  };

  const filteredRequests = (patientRequests || []).filter(req => {
    const matchesSearch =
      req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.issueCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Accepted':
      case 'Completed':
      case 'Assigned':
        return 'success';
      case 'Pending':
      case 'Under Review':
        return 'warning';
      case 'Rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  // Doctors filtered by selected department in the review modal
  const departmentDoctors = reviewForm.assignedDepartment
    ? doctors.filter(d => d.department.toLowerCase().includes(reviewForm.assignedDepartment.toLowerCase()))
    : doctors;

  return (
    <div>
      {/* Module Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={22} style={{ color: 'var(--amber)' }} />
            <span>Patient Consultation Requests & Triage</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Review incoming patient symptoms, assign appropriate clinical departments, assign doctors, and schedule appointments
          </p>
        </div>
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
            placeholder="Search by patient name, request ID, category, or symptom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '160px', height: '40px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Accepted">Accepted</option>
          <option value="Assigned">Assigned</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          className="form-select"
          style={{ width: '150px', height: '40px' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="High">High Urgency</option>
          <option value="Medium">Medium</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No Patient Requests Found"
          description="There are currently no patient consultation requests matching your filters. When patients submit requests, they will appear here for triage."
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Patient Details</th>
                <th>Category</th>
                <th>Symptom Summary</th>
                <th>Priority</th>
                <th>Assigned Doctor / Dept</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {req.id}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {req.submittedDate}
                    </div>
                  </td>

                  <td>
                    <strong style={{ color: 'var(--text-main)', display: 'block' }}>{req.patientName}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {req.patientContact || req.patientId}
                    </span>
                  </td>

                  <td>
                    <Badge variant="primary">{req.issueCategory}</Badge>
                  </td>

                  <td style={{ maxWidth: '300px' }}>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.description}>
                      "{req.description}"
                    </p>
                    {req.managerNotes && (
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', display: 'block', marginTop: '2px' }}>
                        Note: {req.managerNotes}
                      </span>
                    )}
                  </td>

                  <td>
                    <Badge variant={req.priority === 'High' ? 'danger' : req.priority === 'Medium' ? 'warning' : 'neutral'}>
                      {req.priority || 'Normal'}
                    </Badge>
                  </td>

                  <td>
                    {req.assignedDoctor ? (
                      <div>
                        <strong style={{ fontSize: '0.825rem', color: 'var(--teal)' }}>{req.assignedDoctor}</strong>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{req.assignedDepartment}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                        Unassigned (Pref: {req.preferredDoctor || req.preferredDepartment || 'None'})
                      </span>
                    )}
                  </td>

                  <td>
                    <Badge variant={getStatusBadgeVariant(req.status)}>
                      {req.status}
                    </Badge>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openReviewModal(req)}
                    >
                      <UserCheck size={14} />
                      Review & Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review & Triage Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Review Consultation Request: ${selectedRequest?.id}`}
        subtitle={`Patient: ${selectedRequest?.patientName} (${selectedRequest?.issueCategory})`}
        maxWidth="720px"
      >
        {selectedRequest && (
          <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Patient Reported Details Callout */}
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Reported Symptoms & Issue
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '10px' }}>
                "{selectedRequest.description}"
              </p>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <span><strong>Priority:</strong> {selectedRequest.priority}</span>
                <span><strong>Pref. Dept:</strong> {selectedRequest.preferredDepartment || 'None specified'}</span>
                <span><strong>Pref. Doctor:</strong> {selectedRequest.preferredDoctor || 'None specified'}</span>
              </div>
            </div>

            {/* Decision Controls */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Triage Decision / Status *</label>
                <select
                  className="form-select"
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                >
                  <option value="Accepted">Accept & Assign</option>
                  <option value="Under Review">Keep Under Clinical Review</option>
                  <option value="Completed">Mark as Completed</option>
                  <option value="Rejected">Reject Request</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign Clinical Department *</label>
                <select
                  className="form-select"
                  value={reviewForm.assignedDepartment}
                  onChange={(e) => setReviewForm({ ...reviewForm, assignedDepartment: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Assign Physician / Specialist *</label>
                <select
                  className="form-select"
                  value={reviewForm.assignedDoctor}
                  onChange={(e) => setReviewForm({ ...reviewForm, assignedDoctor: e.target.value })}
                >
                  <option value="">Select Doctor</option>
                  {(departmentDoctors.length > 0 ? departmentDoctors : doctors).map(doc => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} — {doc.specialization} ({doc.department}) [Fee: ${doc.consultationFee}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Auto Schedule Appointment Option */}
            {reviewForm.status === 'Accepted' && (
              <div style={{ background: 'rgba(14, 165, 233, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={reviewForm.scheduleAppointment}
                    onChange={(e) => setReviewForm({ ...reviewForm, scheduleAppointment: e.target.checked })}
                  />
                  <span>Automatically Schedule Appointment in Doctor's Calendar</span>
                </label>

                {reviewForm.scheduleAppointment && (
                  <div className="grid-2">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Appointment Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={reviewForm.appointmentDate}
                        onChange={(e) => setReviewForm({ ...reviewForm, appointmentDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Appointment Slot Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={reviewForm.appointmentTime}
                        placeholder="e.g. 10:30 AM"
                        onChange={(e) => setReviewForm({ ...reviewForm, appointmentTime: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manager Notes */}
            <div className="form-group">
              <label className="form-label">Manager Clinical Notes / Reason (Sent to Patient)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Assigned to Dr. Jenkins for urgent ECG evaluation. Please arrive 15 minutes before slot time."
                value={reviewForm.managerNotes}
                onChange={(e) => setReviewForm({ ...reviewForm, managerNotes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Send size={15} />
                Confirm & Dispatch Notification
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
