import React, { useState } from 'react';
import { useAuth, ROLES } from './context/AuthContext';
import { useHospitalData } from './context/DataContext';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Public
import { LandingPage } from './components/public/LandingPage';

// Manager modules
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { HospitalSetupWizard } from './components/manager/HospitalSetupWizard';
import { DoctorsModule } from './components/manager/DoctorsModule';
import { PatientsModule } from './components/manager/PatientsModule';
import { PatientRequestsModule } from './components/manager/PatientRequestsModule';
import { DepartmentsModule } from './components/manager/DepartmentsModule';
import { AppointmentsModule } from './components/manager/AppointmentsModule';
import { WardsAndBedsModule } from './components/manager/WardsAndBedsModule';
import { EquipmentModule } from './components/manager/EquipmentModule';
import { PharmacyModule } from './components/manager/PharmacyModule';
import { DiagnosticsModule } from './components/manager/DiagnosticsModule';
import { BillingModule } from './components/manager/BillingModule';
import { RecordsModule } from './components/manager/RecordsModule';
import { SettingsModule } from './components/manager/SettingsModule';

// Doctor modules
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorPatientsView } from './components/doctor/DoctorPatientsView';
import { DoctorConsultationWorkspace } from './components/doctor/DoctorConsultationWorkspace';
import { DoctorPrescriptionsView } from './components/doctor/DoctorPrescriptionsView';
import { DoctorProfileView } from './components/doctor/DoctorProfileView';

// Patient modules
import { PatientDashboard } from './components/patient/PatientDashboard';
import { PatientRequestCareView } from './components/patient/PatientRequestCareView';
import { PatientAppointmentsView } from './components/patient/PatientAppointmentsView';
import { DoctorDiscoveryView } from './components/patient/DoctorDiscoveryView';
import { PatientRecordsView } from './components/patient/PatientRecordsView';
import { PatientPrescriptionsView } from './components/patient/PatientPrescriptionsView';
import { PatientDiagnosticsView } from './components/patient/PatientDiagnosticsView';
import { PatientBillingView } from './components/patient/PatientBillingView';

import './App.css';

// ─── Manager Portal ──────────────────────────────────────────────────────────
function ManagerPortal({ activeModule, setActiveModule }) {
  const { hospital } = useHospitalData();
  const isConfigured = hospital?.isConfigured;

  if (!isConfigured) {
    return <HospitalSetupWizard />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':     return <ManagerDashboard onNavigate={setActiveModule} />;
      case 'departments':   return <DepartmentsModule />;
      case 'doctors':       return <DoctorsModule />;
      case 'patients':      return <PatientsModule />;
      case 'requests':      return <PatientRequestsModule />;
      case 'appointments':  return <AppointmentsModule />;
      case 'wards':         return <WardsAndBedsModule />;
      case 'equipment':     return <EquipmentModule />;
      case 'pharmacy':      return <PharmacyModule />;
      case 'diagnostics':   return <DiagnosticsModule />;
      case 'billing':       return <BillingModule />;
      case 'records':       return <RecordsModule />;
      case 'settings':      return <SettingsModule />;
      default:              return <ManagerDashboard onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} role={ROLES.MANAGER} />
      <div className="main-content">
        <Navbar activeModule={activeModule} setActiveModule={setActiveModule} />
        <div className="content-body">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}

// ─── Doctor Portal ────────────────────────────────────────────────────────────
function DoctorPortal({ activeModule, setActiveModule }) {
  const { activeDoctorId } = useAuth();
  const [consultingPatientId, setConsultingPatientId] = useState(null);

  const openConsultation = (patientId) => {
    setConsultingPatientId(patientId);
    setActiveModule('consultation');
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DoctorDashboard doctorId={activeDoctorId} onNavigate={setActiveModule} openConsultation={openConsultation} />;
      case 'my-patients':
      case 'patients':
      case 'doctor-patients':
        return <DoctorPatientsView doctorId={activeDoctorId} onNavigate={setActiveModule} openConsultation={openConsultation} />;
      case 'consultation':
      case 'doctor-consultation':
        return (
          <DoctorConsultationWorkspace
            doctorId={activeDoctorId}
            patientId={consultingPatientId}
            onNavigate={setActiveModule}
            goBack={() => setActiveModule('my-patients')}
          />
        );
      case 'prescriptions':
      case 'doctor-prescriptions':
        return <DoctorPrescriptionsView doctorId={activeDoctorId} onNavigate={setActiveModule} />;
      case 'profile':
      case 'doctor-profile':
        return <DoctorProfileView doctorId={activeDoctorId} onNavigate={setActiveModule} />;
      default:
        return <DoctorDashboard doctorId={activeDoctorId} onNavigate={setActiveModule} openConsultation={openConsultation} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} role={ROLES.DOCTOR} />
      <div className="main-content">
        <Navbar activeModule={activeModule} setActiveModule={setActiveModule} />
        <div className="content-body">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}

// ─── Patient Portal ───────────────────────────────────────────────────────────
function PatientPortal({ activeModule, setActiveModule }) {
  const { activePatientId } = useAuth();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <PatientDashboard patientId={activePatientId} onNavigate={setActiveModule} />;
      case 'records':
      case 'patient-records':
      case 'medical-records':
        return <PatientRecordsView patientId={activePatientId} onNavigate={setActiveModule} />;
      case 'prescriptions':
      case 'patient-prescriptions':
        return <PatientPrescriptionsView patientId={activePatientId} onNavigate={setActiveModule} />;
      case 'diagnostics':
      case 'patient-diagnostics':
      case 'lab-results':
        return <PatientDiagnosticsView patientId={activePatientId} onNavigate={setActiveModule} />;
      case 'appointments':
      case 'patient-appointments':
        return <PatientAppointmentsView patientId={activePatientId} onNavigate={setActiveModule} />;
      case 'request-care':
      case 'patient-request-care':
        return <PatientRequestCareView patientId={activePatientId} onNavigate={setActiveModule} />;
      case 'billing':
      case 'patient-billing':
        return <PatientBillingView patientId={activePatientId} onNavigate={setActiveModule} />;
      case 'doctors':
      case 'discovery':
        return <DoctorDiscoveryView onNavigate={setActiveModule} />;
      default:
        return <PatientDashboard patientId={activePatientId} onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} role={ROLES.PATIENT} />
      <div className="main-content">
        <Navbar activeModule={activeModule} setActiveModule={setActiveModule} />
        <div className="content-body">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
function App() {
  const { currentRole } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');

  // Reset to dashboard when role changes
  React.useEffect(() => {
    setActiveModule('dashboard');
  }, [currentRole]);

  switch (currentRole) {
    case ROLES.MANAGER:
      return <ManagerPortal activeModule={activeModule} setActiveModule={setActiveModule} />;
    case ROLES.DOCTOR:
      return <DoctorPortal activeModule={activeModule} setActiveModule={setActiveModule} />;
    case ROLES.PATIENT:
      return <PatientPortal activeModule={activeModule} setActiveModule={setActiveModule} />;
    default:
      return <LandingPage />;
  }
}

export default App;
