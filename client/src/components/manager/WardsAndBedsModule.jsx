import React, { useState } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  User,
  Shield,
  Home,
  Check,
  RotateCcw
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const WardsAndBedsModule = () => {
  const { rooms, beds, addRoom, addBed, updateBedStatus, patients, departments } = useHospitalData();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roomFilter, setRoomFilter] = useState('ALL');

  const [isAddBedModalOpen, setIsAddBedModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [selectedBedToAssign, setSelectedBedToAssign] = useState(null);

  // Add Room Form
  const [roomForm, setRoomForm] = useState({
    name: '',
    department: '',
    floor: 'Floor 3',
    bedCapacity: 2
  });

  // Add Bed Form
  const [bedForm, setBedForm] = useState({
    id: '',
    room: '',
    department: '',
    type: 'Standard Electric Ward Bed',
    status: 'Available'
  });

  // Patient Assign Form
  const [assignPatientName, setAssignPatientName] = useState('');

  const handleSaveRoom = (e) => {
    e.preventDefault();
    if (!roomForm.name) return;
    addRoom(roomForm);
    setIsAddRoomModalOpen(false);
    setRoomForm({ name: '', department: departments[0]?.name || 'Cardiology', floor: 'Floor 3', bedCapacity: 2 });
  };

  const handleSaveBed = (e) => {
    e.preventDefault();
    if (!bedForm.id || !bedForm.room) return;
    addBed(bedForm);
    setIsAddBedModalOpen(false);
    setBedForm({ id: '', room: '', department: departments[0]?.name || 'Cardiology', type: 'Standard Electric Ward Bed', status: 'Available' });
  };

  const handleAssignPatient = (e) => {
    e.preventDefault();
    if (!selectedBedToAssign || !assignPatientName) return;
    updateBedStatus(selectedBedToAssign.id, 'Occupied', assignPatientName);
    setSelectedBedToAssign(null);
    setAssignPatientName('');
  };

  const handleReleaseBed = (bedId) => {
    updateBedStatus(bedId, 'Available', null);
  };

  const handleToggleMaintenance = (bed) => {
    const nextStatus = bed.status === 'Maintenance' ? 'Available' : 'Maintenance';
    updateBedStatus(bed.id, nextStatus, null);
  };

  const filteredBeds = (beds || []).filter(b => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesRoom = roomFilter === 'ALL' || b.room === roomFilter;
    return matchesStatus && matchesRoom;
  });

  const getBedColor = (status) => {
    switch (status) {
      case 'Available':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.35)', color: '#10b981' };
      case 'Occupied':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.35)', color: '#ef4444' };
      case 'Reserved':
        return { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.35)', color: '#6366f1' };
      case 'Maintenance':
        return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.35)', color: '#f59e0b' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', color: '#94a3b8' };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BedDouble size={22} style={{ color: 'var(--teal)' }} />
            <span>Hospital Rooms & Visual Bed Allocation</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Real-time visual map of inpatient beds, occupancy states, patient bed assignments, and sanitation maintenance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setIsAddRoomModalOpen(true)}>
            <Home size={15} />
            + Add Room
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddBedModalOpen(true)}>
            <Plus size={16} />
            + Add Bed
          </button>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="form-select"
            style={{ width: '170px', height: '38px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Bed Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Occupied">Occupied Only</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            className="form-select"
            style={{ width: '190px', height: '38px' }}
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
          >
            <option value="ALL">All Hospital Rooms</option>
            {rooms.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.775rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span>Available ({beds.filter(b => b.status === 'Available').length})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span>Occupied ({beds.filter(b => b.status === 'Occupied').length})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
            <span>Reserved ({beds.filter(b => b.status === 'Reserved').length})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>Maintenance ({beds.filter(b => b.status === 'Maintenance').length})</span>
          </div>
        </div>
      </div>

      {/* Visual Bed Grid */}
      {filteredBeds.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="No Hospital Beds Found"
          description="There are currently no beds configured. Add your hospital's actual physical beds using the buttons above."
          actionLabel="+ Add Hospital Bed"
          onAction={() => setIsAddBedModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredBeds.map((bed) => {
            const colors = getBedColor(bed.status);

            return (
              <div
                key={bed.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1.5px solid ${colors.border}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: colors.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.color
                        }}
                      >
                        <BedDouble size={18} />
                      </div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{bed.id}</strong>
                    </div>

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        background: colors.bg,
                        color: colors.color,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}
                    >
                      {bed.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.785rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                    <span>{bed.room}</span> • <span>{bed.department}</span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    <strong>Type:</strong> {bed.type}
                  </div>

                  {/* Occupant Info */}
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.775rem',
                      minHeight: '36px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {bed.status === 'Occupied' && bed.assignedPatient ? (
                      <div>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.675rem', display: 'block' }}>Patient:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{bed.assignedPatient}</strong>
                      </div>
                    ) : bed.status === 'Reserved' ? (
                      <span style={{ color: 'var(--info)' }}>Held for intake triage</span>
                    ) : bed.status === 'Maintenance' ? (
                      <span style={{ color: 'var(--warning)' }}>Sanitization / Inspection underway</span>
                    ) : (
                      <span style={{ color: 'var(--success)' }}>Ready for patient intake</span>
                    )}
                  </div>
                </div>

                {/* Bed Quick Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  {bed.status === 'Available' ? (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, padding: '5px' }}
                      onClick={() => setSelectedBedToAssign(bed)}
                    >
                      <User size={13} />
                      Assign Patient
                    </button>
                  ) : bed.status === 'Occupied' ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, padding: '5px' }}
                      onClick={() => handleReleaseBed(bed.id)}
                    >
                      <Check size={13} />
                      Release Bed
                    </button>
                  ) : null}

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '5px 8px' }}
                    onClick={() => handleToggleMaintenance(bed)}
                    title="Toggle Maintenance State"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      <Modal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        title="+ Create Hospital Room / Bay"
        subtitle="Catalog physical rooms across hospital floors and wings"
        maxWidth="540px"
      >
        <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Room Identifier / Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Room 405 (Post-Op ICU)"
              value={roomForm.name}
              onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={roomForm.department}
                onChange={(e) => setRoomForm({ ...roomForm, department: e.target.value })}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Floor / Wing</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Floor 4, West Wing"
                value={roomForm.floor}
                onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bed Capacity in Room</label>
            <input
              type="number"
              className="form-input"
              value={roomForm.bedCapacity}
              onChange={(e) => setRoomForm({ ...roomForm, bedCapacity: Number(e.target.value) })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddRoomModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Room
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Bed Modal */}
      <Modal
        isOpen={isAddBedModalOpen}
        onClose={() => setIsAddBedModalOpen(false)}
        title="+ Register Hospital Bed"
        subtitle="Specify bed identification number, ward location, and bed specifications"
        maxWidth="540px"
      >
        <form onSubmit={handleSaveBed} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Bed Serial / ID *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. BED-405-A"
              value={bedForm.id}
              onChange={(e) => setBedForm({ ...bedForm, id: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Room *</label>
            <select
              className="form-select"
              required
              value={bedForm.room}
              onChange={(e) => {
                const room = rooms.find(r => r.name === e.target.value);
                setBedForm({ ...bedForm, room: e.target.value, department: room ? room.department : bedForm.department });
              }}
            >
              <option value="">Select Room</option>
              {rooms.map(r => (
                <option key={r.id} value={r.name}>{r.name} ({r.floor})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bed Model / Type</label>
            <select
              className="form-select"
              value={bedForm.type}
              onChange={(e) => setBedForm({ ...bedForm, type: e.target.value })}
            >
              <option value="Standard Electric Ward Bed">Standard Electric Ward Bed</option>
              <option value="Critical Care ICU Cardiac Bed">Critical Care ICU Cardiac Bed</option>
              <option value="Orthopedic Traction Bed">Orthopedic Traction Bed</option>
              <option value="Pediatric Crib / Cot">Pediatric Crib / Cot</option>
              <option value="Trauma Emergency Stretcher">Trauma Emergency Stretcher</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddBedModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Bed
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Patient Modal */}
      <Modal
        isOpen={!!selectedBedToAssign}
        onClose={() => setSelectedBedToAssign(null)}
        title={`Assign Patient to Bed: ${selectedBedToAssign?.id}`}
        subtitle={`Room: ${selectedBedToAssign?.room}`}
        maxWidth="500px"
      >
        <form onSubmit={handleAssignPatient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Select Patient</label>
            <select
              className="form-select"
              required
              value={assignPatientName}
              onChange={(e) => setAssignPatientName(e.target.value)}
            >
              <option value="">Choose Patient</option>
              {patients.map(p => (
                <option key={p.id} value={`${p.name} (${p.id})`}>{p.name} ({p.id}) — {p.admissionStatus}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setSelectedBedToAssign(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Bed Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
