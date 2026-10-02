import React, { useState } from 'react';
import { Stethoscope, Save, UserCheck, Calendar, DollarSign, Award, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHospitalData } from '../../context/DataContext';

export const DoctorProfileView = () => {
  const { activeDoctorId } = useAuth();
  const { doctors, updateDoctor } = useHospitalData();
  const currentDoctor = doctors.find(d => d.id === activeDoctorId) || doctors[0];

  const [form, setForm] = useState({
    name: currentDoctor?.name || '',
    specialization: currentDoctor?.specialization || '',
    qualifications: currentDoctor?.qualifications || '',
    registrationNumber: currentDoctor?.registrationNumber || '',
    availableDays: currentDoctor?.availableDays || 'Mon, Wed, Fri',
    availableTime: currentDoctor?.availableTime || '09:00 - 16:00',
    consultationFee: currentDoctor?.consultationFee || 200,
    professionalBio: currentDoctor?.professionalBio || '',
    status: currentDoctor?.status || 'Active'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentDoctor) return;
    updateDoctor(currentDoctor.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '880px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={22} style={{ color: 'var(--teal)' }} />
          <span>Physician Clinical Profile & Working Availability</span>
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Configure clinic hours, patient consultation fee, credentials, and duty status
        </p>
      </div>

      {saved && (
        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.85rem' }}>
          ✓ Profile and clinic availability updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="card">
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Doctor Name</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              className="form-input"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Qualifications</label>
            <input
              type="text"
              className="form-input"
              value={form.qualifications}
              onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
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
              value={form.availableDays}
              onChange={(e) => setForm({ ...form, availableDays: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Hours</label>
            <input
              type="text"
              className="form-input"
              value={form.availableTime}
              onChange={(e) => setForm({ ...form, availableTime: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duty Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">On Duty / Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Off Duty</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '10px' }}>
          <label className="form-label">Professional Clinical Summary</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={form.professionalBio}
            onChange={(e) => setForm({ ...form, professionalBio: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={15} />
            Save Profile Parameters
          </button>
        </div>
      </form>
    </div>
  );
};
