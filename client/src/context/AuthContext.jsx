import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  PUBLIC: 'PUBLIC',
  MANAGER: 'MANAGER',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT'
};

export const AuthProvider = ({ children }) => {
  // Check if role was persisted or default to 'PUBLIC' landing page
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('apexcare_active_role') || ROLES.PUBLIC;
  });

  // Active Doctor context (for doctor portal)
  const [activeDoctorId, setActiveDoctorId] = useState('DOC-101');

  // Active Patient context (for patient portal)
  const [activePatientId, setActivePatientId] = useState('PAT-1001');

  useEffect(() => {
    localStorage.setItem('apexcare_active_role', currentRole);
  }, [currentRole]);

  const loginAsManager = () => {
    setCurrentRole(ROLES.MANAGER);
  };

  const loginAsDoctor = (doctorId = 'DOC-101') => {
    setActiveDoctorId(doctorId);
    setCurrentRole(ROLES.DOCTOR);
  };

  const loginAsPatient = (patientId = 'PAT-1001') => {
    setActivePatientId(patientId);
    setCurrentRole(ROLES.PATIENT);
  };

  const logout = () => {
    setCurrentRole(ROLES.PUBLIC);
  };

  // Role permissions checking (prepared for Supabase Row Level Security)
  const checkPermission = (action, module) => {
    if (currentRole === ROLES.MANAGER) return true; // Full administrative operations

    if (currentRole === ROLES.DOCTOR) {
      const allowedModules = ['clinical', 'appointments', 'records', 'prescriptions', 'laboratory', 'radiology', 'profile'];
      return allowedModules.includes(module);
    }

    if (currentRole === ROLES.PATIENT) {
      const allowedModules = ['patient-portal', 'my-requests', 'my-appointments', 'my-records', 'my-prescriptions', 'my-billing', 'my-pharmacy', 'discovery'];
      return allowedModules.includes(module);
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeDoctorId,
        setActiveDoctorId,
        activePatientId,
        setActivePatientId,
        loginAsManager,
        loginAsDoctor,
        loginAsPatient,
        logout,
        checkPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
