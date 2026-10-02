import React, { useState } from 'react';
import {
  Search,
  Filter,
  Stethoscope,
  Calendar,
  DollarSign,
  Award,
  Globe,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { useHospitalData } from '../../context/DataContext';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';

export const DoctorDiscoveryView = ({ onNavigate }) => {
  const { doctors, departments } = useHospitalData();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  const filteredDoctors = (doctors || []).filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.areasOfExpertise && d.areasOfExpertise.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = departmentFilter === 'ALL' || d.department.toLowerCase().includes(departmentFilter.toLowerCase());
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={22} style={{ color: 'var(--primary)' }} />
            <span>Discover Hospital Physicians & Clinical Specialists</span>
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Search verified hospital medical staff by medical specialty, credentials, consultation fee, and clinic days
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
          marginBottom: '24px'
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
            placeholder="Search by physician name, clinical subspecialty, or treatment focus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: '200px', height: '40px' }}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No Matching Physicians Found"
          description="There are currently no doctors matching your search parameters in this department."
        />
      ) : (
        <div className="grid-2">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'rgba(14, 165, 233, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontWeight: 800,
                        fontSize: '1rem'
                      }}
                    >
                      {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {doc.name}
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {doc.specialization}
                      </p>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                        Dept of {doc.department} • {doc.yearsOfExperience} yrs experience
                      </span>
                    </div>
                  </div>

                  <Badge variant="success">Active</Badge>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
                  {doc.professionalBio || 'Attending physician providing specialized diagnosis and patient care.'}
                </p>

                <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.775rem', marginBottom: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Consultation Fee</span>
                    <strong style={{ color: 'var(--teal)', fontSize: '0.9rem' }}>${doc.consultationFee}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Clinic Schedule</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{doc.availableDays}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Available Hours</span>
                    <span style={{ color: 'var(--text-muted)' }}>{doc.availableTime}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block' }}>Languages</span>
                    <span style={{ color: 'var(--text-muted)' }}>{doc.languages || 'English'}</span>
                  </div>
                </div>

                {doc.areasOfExpertise && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <strong>Clinical Focus:</strong> {doc.areasOfExpertise}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigate && onNavigate('patient-request-care')}
                >
                  <ClipboardList size={14} />
                  Request Consultation with {doc.name.split(' ')[1] || 'Doctor'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
