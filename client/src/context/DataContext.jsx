import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataStore } from '../services/dataStore';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [storeState, setStoreState] = useState(() => dataStore.getState());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(newState => {
      setStoreState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  return (
    <DataContext.Provider
      value={{
        ...storeState,
        // Methods forwarded from dataStore
        updateHospitalConfig: (updates) => dataStore.updateHospitalConfig(updates),
        addDepartment: (dep) => dataStore.addDepartment(dep),
        updateDepartment: (id, updates) => dataStore.updateDepartment(id, updates),
        addDoctor: (doc) => dataStore.addDoctor(doc),
        updateDoctor: (id, updates) => dataStore.updateDoctor(id, updates),
        deleteDoctor: (id) => dataStore.deleteDoctor(id),
        addPatient: (patient) => dataStore.addPatient(patient),
        updatePatient: (id, updates) => dataStore.updatePatient(id, updates),
        submitPatientRequest: (req) => dataStore.submitPatientRequest(req),
        updatePatientRequest: (id, updates) => dataStore.updatePatientRequest(id, updates),
        createAppointment: (apt) => dataStore.createAppointment(apt),
        updateAppointment: (id, updates) => dataStore.updateAppointment(id, updates),
        addMedicalRecord: (rec) => dataStore.addMedicalRecord(rec),
        issuePrescription: (rx) => dataStore.issuePrescription(rx),
        addMedicine: (med) => dataStore.addMedicine(med),
        updateMedicineStock: (id, stock) => dataStore.updateMedicineStock(id, stock),
        createPharmacyOrder: (order) => dataStore.createPharmacyOrder(order),
        updatePharmacyOrderStatus: (id, status, notes) => dataStore.updatePharmacyOrderStatus(id, status, notes),
        addRoom: (r) => dataStore.addRoom(r),
        addBed: (b) => dataStore.addBed(b),
        updateBedStatus: (id, status, patient) => dataStore.updateBedStatus(id, status, patient),
        addEquipment: (eq) => dataStore.addEquipment(eq),
        updateEquipmentStatus: (id, status, notes) => dataStore.updateEquipmentStatus(id, status, notes),
        addLabTestOrder: (test) => dataStore.addLabTestOrder(test),
        updateLabTest: (id, updates) => dataStore.updateLabTest(id, updates),
        addRadiologyOrder: (rad) => dataStore.addRadiologyOrder(rad),
        updateRadiology: (id, updates) => dataStore.updateRadiology(id, updates),
        createInvoice: (bill) => dataStore.createInvoice(bill),
        processSimulatedPayment: (id, amount, method) => dataStore.processSimulatedPayment(id, amount, method),
        markNotificationRead: (id) => dataStore.markNotificationRead(id),
        markAllNotificationsRead: (role) => dataStore.markAllNotificationsRead(role),
        loadCleanSlate: () => dataStore.loadCleanSlate(),
        loadDemoData: () => dataStore.loadDemoData(),
        isCloudConnected: () => dataStore.isCloudConnected(),
        syncAllToCloud: () => dataStore.syncAllToCloud(),
        pullAllFromCloud: () => dataStore.pullAllFromCloud()
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useHospitalData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useHospitalData must be used within a DataProvider');
  return ctx;
};
