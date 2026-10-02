import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Building2
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const EquipmentModule = () => {
  const { equipment, addEquipment, updateEquipmentStatus, departments } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    category: 'Radiology & Imaging',
    department: '',
    serialNumber: `SN-${Date.now().toString().slice(-6)}`,
    location: 'Radiology Suite 101',
    purchaseDate: '2024-01-15',
    status: 'Operational',
    lastMaintenance: '2026-08-01',
    nextMaintenance: '2026-11-01'
  });

  const handleSaveEquipment = (e) => {
    e.preventDefault();
    if (!form.name) return;
    addEquipment({
      ...form,
      department: form.department || (departments[0]?.name || 'Radiology')
    });
    setIsAddModalOpen(false);
  };

  const filteredEquipment = (equipment || []).filter(eq => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || eq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={22} style={{ color: 'var(--amber)' }} />
            <span>Hospital Medical Equipment & Asset Management</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Biomedical device tracking, calibration schedules, preventative maintenance, and operational readiness
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>+ Add Medical Device</span>
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
            placeholder="Search equipment by name, category, or serial number..."
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
          <option value="ALL">All Device States</option>
          <option value="Operational">Operational</option>
          <option value="Maintenance">Under Maintenance</option>
          <option value="Out of Service">Out of Service</option>
        </select>
      </div>

      {/* Equipment Table */}
      {filteredEquipment.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Medical Devices Registered"
          description="Catalog your hospital's real biomedical equipment (e.g. CT Scanners, Ventilators, Infusion Pumps, Ultrasound)."
          actionLabel="+ Add Equipment"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Device Code / Name</th>
                <th>Category</th>
                <th>Department & Location</th>
                <th>Serial Number</th>
                <th>Maintenance Schedule</th>
                <th>Operational Status</th>
                <th style={{ textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => (
                <tr key={eq.id}>
                  <td>
                    <strong style={{ color: 'var(--text-main)', display: 'block' }}>{eq.name}</strong>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {eq.id}
                    </span>
                  </td>

                  <td>
                    <Badge variant="primary">{eq.category}</Badge>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>{eq.department}</div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{eq.location}</span>
                  </td>

                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {eq.serialNumber}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Last: {eq.lastMaintenance || 'N/A'}</div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Next Due: {eq.nextMaintenance || 'N/A'}</span>
                  </td>

                  <td>
                    <Badge variant={eq.status === 'Operational' ? 'success' : eq.status === 'Maintenance' ? 'warning' : 'danger'}>
                      {eq.status}
                    </Badge>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem', height: '30px' }}
                      value={eq.status}
                      onChange={(e) => updateEquipmentStatus(eq.id, e.target.value)}
                    >
                      <option value="Operational">Operational</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="+ Catalog Medical Device Asset"
        subtitle="Specify biomedical device specs, department assignment, and service intervals"
        maxWidth="640px"
      >
        <form onSubmit={handleSaveEquipment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Equipment Brand / Model *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Siemens SOMATOM CT Scanner"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Device Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Radiology & Imaging">Radiology & Imaging</option>
                <option value="Critical Care Respiration">Critical Care Respiration</option>
                <option value="Surgical Operating Suite">Surgical Operating Suite</option>
                <option value="Cardiology Diagnostics">Cardiology Diagnostics</option>
                <option value="Laboratory Automation">Laboratory Automation</option>
              </select>
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
              <label className="form-label">Serial Number</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.serialNumber}
                onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Physical Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Radiology Suite 102"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Next Maintenance Inspection</label>
              <input
                type="date"
                className="form-input"
                value={form.nextMaintenance}
                onChange={(e) => setForm({ ...form, nextMaintenance: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Device Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
