import { EMPTY_HOSPITAL_STATE, DEMO_HOSPITAL_STATE } from './initialData';
import {
  isSupabaseConfigured,
  fetchAllHospitalData,
  syncEntityToSupabase,
  deleteEntityFromSupabase,
  syncAllStateToSupabase
} from './supabaseClient';

const STORAGE_KEY = 'apexcare_hospital_operating_system_v1';

class HospitalDataStore {
  constructor() {
    this.listeners = new Set();
    this.cloudConnected = isSupabaseConfigured();
    this.state = this.loadState();
    this.initCloud();
  }

  isCloudConnected() {
    return isSupabaseConfigured();
  }

  async initCloud() {
    if (!this.isCloudConnected()) return;
    try {
      console.info('[Supabase] Initializing cloud sync...');
      const cloudData = await fetchAllHospitalData();
      if (cloudData && Object.keys(cloudData).length > 0) {
        console.info('[Supabase] State hydrated from cloud database');
        this.state = {
          ...this.state,
          ...cloudData
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {}
        this.notify();
      } else {
        console.info('[Supabase] Cloud database is empty. Uploading current state...');
        await syncAllStateToSupabase(this.state);
      }
    } catch (e) {
      console.warn('[Supabase] Cloud hydration notice:', e);
    }
  }

  async syncAllToCloud() {
    if (!this.isCloudConnected()) return false;
    return await syncAllStateToSupabase(this.state);
  }

  async pullAllFromCloud() {
    if (!this.isCloudConnected()) return false;
    const cloudData = await fetchAllHospitalData();
    if (cloudData) {
      this.state = {
        ...this.state,
        ...cloudData
      };
      this.saveState();
      return true;
    }
    return false;
  }

  syncEntity(collectionKey, entity) {
    if (this.isCloudConnected()) {
      syncEntityToSupabase(collectionKey, entity);
    }
  }

  deleteEntity(collectionKey, id) {
    if (this.isCloudConnected()) {
      deleteEntityFromSupabase(collectionKey, id);
    }
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default state', e);
    }
    // Default to DEMO_HOSPITAL_STATE so the user has immediate access to rich clinical demo records,
    // but can switch to CLEAN SLATE in 1 click!
    return JSON.parse(JSON.stringify(DEMO_HOSPITAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState() {
    return this.state;
  }

  // Switch between clean slate and demo mode
  loadCleanSlate() {
    this.state = JSON.parse(JSON.stringify(EMPTY_HOSPITAL_STATE));
    this.logAudit({
      user: 'Hospital Administrator',
      role: 'MANAGER',
      module: 'System Operations',
      action: 'Initialized Clean Slate Operating Environment'
    });
    this.saveState();
    if (this.isCloudConnected()) {
      syncAllStateToSupabase(this.state);
    }
  }

  loadDemoData() {
    this.state = JSON.parse(JSON.stringify(DEMO_HOSPITAL_STATE));
    this.logAudit({
      user: 'Hospital Administrator',
      role: 'MANAGER',
      module: 'System Operations',
      action: 'Loaded Clinical Evaluation Dataset (DEMO)'
    });
    this.saveState();
    if (this.isCloudConnected()) {
      syncAllStateToSupabase(this.state);
    }
  }

  // Automation / n8n Webhook Hook
  triggerAutomation(eventType, payload) {
    console.info(`[n8n Automation Event] Triggered: ${eventType}`, payload);
  }

  // Audit Logging
  logAudit({ user = 'System', role = 'MANAGER', module, action, status = 'Success' }) {
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      user,
      role,
      module,
      action,
      status,
      ipAddress: '127.0.0.1 (Local)'
    };
    this.state.auditLogs = [newLog, ...(this.state.auditLogs || [])];
    if (this.state.auditLogs.length > 50) this.state.auditLogs.pop();
    this.syncEntity('auditLogs', newLog);
  }

  // Notification Dispatcher
  sendNotification({ targetRole, title, message, link = 'dashboard' }) {
    const newNotif = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      targetRole,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      link
    };
    this.state.notifications = [newNotif, ...(this.state.notifications || [])];
    this.syncEntity('notifications', newNotif);
  }

  // ==========================================
  // HOSPITAL PROFILE & CONFIGURATION
  // ==========================================
  updateHospitalConfig(updates) {
    this.state.hospital = {
      ...this.state.hospital,
      ...updates,
      isConfigured: true
    };
    this.logAudit({
      user: 'Hospital Administrator',
      role: 'MANAGER',
      module: 'Hospital Setup',
      action: `Updated Hospital Settings for ${this.state.hospital.name || 'Hospital'}`
    });
    this.saveState();
    this.syncEntity('hospital', this.state.hospital);
    return this.state.hospital;
  }

  // ==========================================
  // DEPARTMENTS
  // ==========================================
  addDepartment(depData) {
    const newDep = {
      id: `DEP-${(this.state.departments.length + 1).toString().padStart(2, '0')}`,
      status: 'Active',
      activeDoctorsCount: 0,
      ...depData
    };
    this.state.departments.push(newDep);
    this.logAudit({
      user: 'Hospital Administrator',
      role: 'MANAGER',
      module: 'Department Management',
      action: `Created new department: ${newDep.name}`
    });
    this.saveState();
    this.syncEntity('departments', newDep);
    return newDep;
  }

  updateDepartment(id, updates) {
    const idx = this.state.departments.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.state.departments[idx] = { ...this.state.departments[idx], ...updates };
      this.logAudit({
        user: 'Hospital Administrator',
        role: 'MANAGER',
        module: 'Department Management',
        action: `Updated department: ${this.state.departments[idx].name}`
      });
      this.saveState();
      this.syncEntity('departments', this.state.departments[idx]);
      return this.state.departments[idx];
    }
    return null;
  }

  // ==========================================
  // DOCTORS
  // ==========================================
  addDoctor(doctorData) {
    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      status: doctorData.status || 'Active',
      assignedPatientsCount: 0,
      ...doctorData
    };
    this.state.doctors.push(newDoc);
    
    // Update department count
    const dept = this.state.departments.find(d => d.name === newDoc.department);
    if (dept) {
      dept.activeDoctorsCount = (dept.activeDoctorsCount || 0) + 1;
      this.syncEntity('departments', dept);
    }

    this.logAudit({
      user: 'Hospital Administrator',
      role: 'MANAGER',
      module: 'Doctor Management',
      action: `Added doctor: ${newDoc.name} (${newDoc.specialization})`
    });
    this.saveState();
    this.syncEntity('doctors', newDoc);
    return newDoc;
  }

  updateDoctor(id, updates) {
    const idx = this.state.doctors.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.state.doctors[idx] = { ...this.state.doctors[idx], ...updates };
      this.logAudit({
        user: 'Hospital Administrator',
        role: 'MANAGER',
        module: 'Doctor Management',
        action: `Updated doctor profile: ${this.state.doctors[idx].name}`
      });
      this.saveState();
      this.syncEntity('doctors', this.state.doctors[idx]);
      return this.state.doctors[idx];
    }
    return null;
  }

  deleteDoctor(id) {
    const doc = this.state.doctors.find(d => d.id === id);
    this.state.doctors = this.state.doctors.filter(d => d.id !== id);
    if (doc) {
      this.logAudit({
        user: 'Hospital Administrator',
        role: 'MANAGER',
        module: 'Doctor Management',
        action: `Deactivated doctor: ${doc.name}`
      });
    }
    this.saveState();
    this.deleteEntity('doctors', id);
    return true;
  }

  // ==========================================
  // PATIENTS
  // ==========================================
  addPatient(patientData) {
    const newPatient = {
      id: `PAT-${Date.now().toString().slice(-4)}`,
      admissionDate: new Date().toISOString().split('T')[0],
      approvalStatus: patientData.approvalStatus || 'Approved',
      admissionStatus: patientData.admissionStatus || 'Outpatient',
      ...patientData
    };
    this.state.patients.unshift(newPatient);
    this.logAudit({
      user: 'Hospital Administrator',
      role: 'MANAGER',
      module: 'Patient Management',
      action: `Registered patient: ${newPatient.name}`
    });
    this.saveState();
    this.syncEntity('patients', newPatient);
    return newPatient;
  }

  updatePatient(id, updates) {
    const idx = this.state.patients.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.state.patients[idx] = { ...this.state.patients[idx], ...updates };
      this.saveState();
      this.syncEntity('patients', this.state.patients[idx]);
      return this.state.patients[idx];
    }
    return null;
  }

  // ==========================================
  // PATIENT REQUESTS & TRIAGE WORKFLOW
  // ==========================================
  submitPatientRequest(requestData) {
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      submittedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }),
      status: 'Pending',
      priority: requestData.priority || 'Medium',
      assignedDepartment: '',
      assignedDoctor: '',
      managerNotes: '',
      ...requestData
    };
    this.state.patientRequests.unshift(newReq);

    // Notify Manager
    this.sendNotification({
      targetRole: 'MANAGER',
      title: 'New Patient Consultation Request',
      message: `${newReq.patientName} submitted request for ${newReq.issueCategory} issue`,
      link: 'requests'
    });

    this.logAudit({
      user: newReq.patientName,
      role: 'PATIENT',
      module: 'Patient Requests',
      action: `Submitted consultation request ${newReq.id} for [${newReq.issueCategory}]`
    });

    this.triggerAutomation('patient.request.created', newReq);
    this.saveState();
    this.syncEntity('patientRequests', newReq);
    return newReq;
  }

  updatePatientRequest(id, { status, assignedDepartment, assignedDoctor, managerNotes, scheduleAppointment = false, appointmentDate, appointmentTime }) {
    const idx = this.state.patientRequests.findIndex(r => r.id === id);
    if (idx === -1) return null;

    const currentReq = this.state.patientRequests[idx];
    const updated = {
      ...currentReq,
      status: status || currentReq.status,
      assignedDepartment: assignedDepartment !== undefined ? assignedDepartment : currentReq.assignedDepartment,
      assignedDoctor: assignedDoctor !== undefined ? assignedDoctor : currentReq.assignedDoctor,
      managerNotes: managerNotes !== undefined ? managerNotes : currentReq.managerNotes
    };
    this.state.patientRequests[idx] = updated;

    // Send notification to patient
    this.sendNotification({
      targetRole: 'PATIENT',
      title: `Request ${updated.id} ${updated.status}`,
      message: `Your hospital care request status is now: ${updated.status}. ${managerNotes ? `Note: ${managerNotes}` : ''}`,
      link: 'requests'
    });

    // If doctor assigned, notify doctor
    if (updated.assignedDoctor) {
      this.sendNotification({
        targetRole: 'DOCTOR',
        title: 'New Patient Request Assigned',
        message: `Manager assigned request from ${updated.patientName} (${updated.issueCategory}) to you.`,
        link: 'appointments'
      });
    }

    // Auto-create appointment if requested
    if (scheduleAppointment && appointmentDate && appointmentTime && updated.assignedDoctor) {
      this.createAppointment({
        patientId: updated.patientId,
        patientName: updated.patientName,
        doctorName: updated.assignedDoctor,
        department: updated.assignedDepartment || 'General',
        date: appointmentDate,
        time: appointmentTime,
        type: 'Assigned Consultation',
        status: 'Confirmed',
        notes: `Scheduled from triage request ${updated.id}: ${updated.description}`
      });
    }

    this.logAudit({
      user: 'Hospital Administrator',
      role: 'MANAGER',
      module: 'Patient Requests',
      action: `Updated request ${updated.id} status to ${updated.status}; Assigned: ${updated.assignedDoctor || 'None'}`
    });

    this.triggerAutomation('patient.request.updated', updated);
    this.saveState();
    this.syncEntity('patientRequests', updated);
    return updated;
  }

  // ==========================================
  // APPOINTMENTS
  // ==========================================
  createAppointment(aptData) {
    const newApt = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      status: aptData.status || 'Pending Approval',
      room: aptData.room || 'Outpatient Clinic',
      ...aptData
    };
    this.state.appointments.unshift(newApt);

    // Notify Patient & Doctor
    this.sendNotification({
      targetRole: 'PATIENT',
      title: 'Appointment Scheduled',
      message: `Appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.time}.`,
      link: 'appointments'
    });

    this.sendNotification({
      targetRole: 'DOCTOR',
      title: 'New Appointment Booked',
      message: `Patient ${newApt.patientName} scheduled for ${newApt.date} at ${newApt.time}.`,
      link: 'appointments'
    });

    this.logAudit({
      user: 'Hospital System',
      role: 'MANAGER',
      module: 'Appointments',
      action: `Scheduled appointment ${newApt.id} with ${newApt.doctorName} for ${newApt.patientName}`
    });

    this.triggerAutomation('appointment.scheduled', newApt);
    this.saveState();
    this.syncEntity('appointments', newApt);
    return newApt;
  }

  updateAppointment(id, updates) {
    const idx = this.state.appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.state.appointments[idx] = { ...this.state.appointments[idx], ...updates };
      this.saveState();
      this.syncEntity('appointments', this.state.appointments[idx]);
      return this.state.appointments[idx];
    }
    return null;
  }

  // ==========================================
  // MEDICAL RECORDS & CONSULTATION
  // ==========================================
  addMedicalRecord(recordData) {
    const newRec = {
      id: `EHR-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      ...recordData
    };
    this.state.medicalRecords.unshift(newRec);

    this.sendNotification({
      targetRole: 'PATIENT',
      title: 'Clinical Consultation Record Available',
      message: `Consultation notes from ${newRec.doctorName} have been added to your EMR record.`,
      link: 'records'
    });

    this.logAudit({
      user: newRec.doctorName,
      role: 'DOCTOR',
      module: 'Clinical EMR',
      action: `Created medical consultation record ${newRec.id} for ${newRec.patientName}`
    });

    this.saveState();
    this.syncEntity('medicalRecords', newRec);
    return newRec;
  }

  // ==========================================
  // DIGITAL PRESCRIPTIONS
  // ==========================================
  issuePrescription(prescriptionData) {
    const newRx = {
      id: `RX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Issued',
      ...prescriptionData
    };
    this.state.prescriptions.unshift(newRx);

    this.sendNotification({
      targetRole: 'PATIENT',
      title: 'New Digital Prescription Issued',
      message: `${newRx.doctorName} issued prescription ${newRx.id} with ${newRx.items.length} medication(s).`,
      link: 'prescriptions'
    });

    this.logAudit({
      user: newRx.doctorName,
      role: 'DOCTOR',
      module: 'Prescriptions',
      action: `Issued digital prescription ${newRx.id} for ${newRx.patientName}`
    });

    this.saveState();
    this.syncEntity('prescriptions', newRx);
    return newRx;
  }

  // ==========================================
  // PHARMACY & MEDICINES
  // ==========================================
  addMedicine(medData) {
    const newMed = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      status: Number(medData.stockQuantity) <= Number(medData.minStockLevel) ? 'Low Stock' : 'In Stock',
      ...medData
    };
    this.state.medicines.push(newMed);
    this.logAudit({
      user: 'Hospital Pharmacist',
      role: 'MANAGER',
      module: 'Pharmacy',
      action: `Added medicine to formulary: ${newMed.name}`
    });
    this.saveState();
    this.syncEntity('medicines', newMed);
    return newMed;
  }

  updateMedicineStock(id, newStock) {
    const med = this.state.medicines.find(m => m.id === id);
    if (med) {
      med.stockQuantity = Number(newStock);
      med.status = med.stockQuantity <= med.minStockLevel ? (med.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock';
      this.saveState();
      this.syncEntity('medicines', med);
    }
  }

  createPharmacyOrder(orderData) {
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      orderDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }),
      status: 'Placed',
      ...orderData
    };
    this.state.pharmacyOrders.unshift(newOrder);

    this.sendNotification({
      targetRole: 'MANAGER',
      title: 'Pharmacy Order Placed',
      message: `Order ${newOrder.id} placed for ${newOrder.patientName}`,
      link: 'pharmacy'
    });

    this.saveState();
    this.syncEntity('pharmacyOrders', newOrder);
    return newOrder;
  }

  updatePharmacyOrderStatus(id, status, notes) {
    const order = this.state.pharmacyOrders.find(o => o.id === id);
    if (order) {
      order.status = status;
      if (notes) order.pharmacistNotes = notes;
      
      this.sendNotification({
        targetRole: 'PATIENT',
        title: `Pharmacy Order ${status}`,
        message: `Your order ${order.id} status is now: ${status}`,
        link: 'pharmacy'
      });

      this.saveState();
      this.syncEntity('pharmacyOrders', order);
      return order;
    }
    return null;
  }

  // ==========================================
  // ROOMS, BEDS & EQUIPMENT
  // ==========================================
  addRoom(roomData) {
    const newRoom = {
      id: `RM-${Date.now().toString().slice(-3)}`,
      ...roomData
    };
    this.state.rooms.push(newRoom);
    this.saveState();
    this.syncEntity('rooms', newRoom);
    return newRoom;
  }

  addBed(bedData) {
    const newBed = {
      id: `BED-${Date.now().toString().slice(-4)}`,
      status: bedData.status || 'Available',
      assignedPatient: null,
      ...bedData
    };
    this.state.beds.push(newBed);
    this.logAudit({
      user: 'Hospital Operations',
      role: 'MANAGER',
      module: 'Bed Management',
      action: `Added bed ${newBed.id} in ${newBed.room}`
    });
    this.saveState();
    this.syncEntity('beds', newBed);
    return newBed;
  }

  updateBedStatus(id, status, assignedPatient = null) {
    const bed = this.state.beds.find(b => b.id === id);
    if (bed) {
      bed.status = status;
      bed.assignedPatient = status === 'Occupied' ? assignedPatient : null;
      this.logAudit({
        user: 'Hospital Operations',
        role: 'MANAGER',
        module: 'Bed Management',
        action: `Bed ${bed.id} status changed to ${status}`
      });
      this.saveState();
      this.syncEntity('beds', bed);
      return bed;
    }
    return null;
  }

  addEquipment(eqData) {
    const newEq = {
      id: `EQ-${Date.now().toString().slice(-3)}`,
      status: eqData.status || 'Operational',
      ...eqData
    };
    this.state.equipment.push(newEq);
    this.logAudit({
      user: 'Clinical Engineering',
      role: 'MANAGER',
      module: 'Medical Equipment',
      action: `Cataloged equipment: ${newEq.name} (${newEq.serialNumber})`
    });
    this.saveState();
    this.syncEntity('equipment', newEq);
    return newEq;
  }

  updateEquipmentStatus(id, status, notes) {
    const eq = this.state.equipment.find(e => e.id === id);
    if (eq) {
      eq.status = status;
      this.saveState();
      this.syncEntity('equipment', eq);
      return eq;
    }
    return null;
  }

  // ==========================================
  // LABORATORY & RADIOLOGY
  // ==========================================
  addLabTestOrder(testData) {
    const newTest = {
      id: `LAB-${Date.now().toString().slice(-4)}`,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Requested',
      resultsSummary: 'Awaiting specimen collection',
      ...testData
    };
    this.state.labTests.unshift(newTest);
    this.saveState();
    this.syncEntity('labTests', newTest);
    return newTest;
  }

  updateLabTest(id, updates) {
    const test = this.state.labTests.find(t => t.id === id);
    if (test) {
      Object.assign(test, updates);
      if (updates.status === 'Completed') {
        this.sendNotification({
          targetRole: 'PATIENT',
          title: 'Laboratory Results Published',
          message: `Diagnostic results for ${test.testName} are now ready to view.`,
          link: 'lab-reports'
        });
      }
      this.saveState();
      this.syncEntity('labTests', test);
      return test;
    }
    return null;
  }

  addRadiologyOrder(radData) {
    const newRad = {
      id: `RAD-${Date.now().toString().slice(-4)}`,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      findings: 'Pending imaging acquisition',
      ...radData
    };
    this.state.radiologyServices.unshift(newRad);
    this.saveState();
    this.syncEntity('radiologyServices', newRad);
    return newRad;
  }

  updateRadiology(id, updates) {
    const rad = this.state.radiologyServices.find(r => r.id === id);
    if (rad) {
      Object.assign(rad, updates);
      if (updates.status === 'Report Uploaded') {
        this.sendNotification({
          targetRole: 'PATIENT',
          title: 'Radiology Scan Report Uploaded',
          message: `${rad.modality} report for ${rad.bodyPart} is ready for clinical review.`,
          link: 'radiology'
        });
      }
      this.saveState();
      this.syncEntity('radiologyServices', rad);
      return rad;
    }
    return null;
  }

  // ==========================================
  // BILLING & SIMULATED PAYMENTS
  // ==========================================
  createInvoice(billData) {
    const items = billData.items || [];
    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const insurancePaid = Number(billData.insurancePaid || 0);
    const patientPaid = Number(billData.patientPaid || 0);
    const balanceDue = Math.max(0, totalAmount - insurancePaid - patientPaid);

    const newBill = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: billData.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      items,
      totalAmount,
      insurancePaid,
      patientPaid,
      balanceDue,
      status: balanceDue === 0 ? 'Paid' : (patientPaid > 0 ? 'Partial' : 'Pending'),
      paymentMethod: billData.paymentMethod || 'Awaiting Payment',
      receiptReference: balanceDue === 0 ? `REC-${Date.now().toString().slice(-5)}` : 'UNPAID',
      patientId: billData.patientId,
      patientName: billData.patientName
    };
    this.state.bills.unshift(newBill);

    this.sendNotification({
      targetRole: 'PATIENT',
      title: 'New Medical Bill Generated',
      message: `Invoice ${newBill.id} for $${totalAmount.toFixed(2)} has been issued.`,
      link: 'billing'
    });

    this.logAudit({
      user: 'Hospital Accounts',
      role: 'MANAGER',
      module: 'Billing',
      action: `Generated medical invoice ${newBill.id} for ${newBill.patientName}`
    });

    this.saveState();
    this.syncEntity('bills', newBill);
    return newBill;
  }

  processSimulatedPayment(invoiceId, amount, paymentMethodName = 'Credit / Debit Card') {
    const bill = this.state.bills.find(b => b.id === invoiceId);
    if (!bill) return null;

    const amt = Number(amount);
    bill.patientPaid = (bill.patientPaid || 0) + amt;
    bill.balanceDue = Math.max(0, bill.totalAmount - (bill.insurancePaid || 0) - bill.patientPaid);
    bill.status = bill.balanceDue === 0 ? 'Paid' : 'Partial';
    bill.paymentMethod = paymentMethodName;
    bill.receiptReference = `REC-SIM-${Date.now().toString().slice(-6)}`;

    this.sendNotification({
      targetRole: 'PATIENT',
      title: 'Payment Receipt Confirmed',
      message: `Simulated payment of $${amt.toFixed(2)} accepted for ${bill.id}. Receipt: ${bill.receiptReference}`,
      link: 'billing'
    });

    this.logAudit({
      user: bill.patientName,
      role: 'PATIENT',
      module: 'Billing',
      action: `Simulated payment of $${amt.toFixed(2)} processed for ${bill.id}`
    });

    this.triggerAutomation('billing.payment.received', { bill, paymentAmount: amt });
    this.saveState();
    this.syncEntity('bills', bill);
    return bill;
  }

  markNotificationRead(id) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState();
      this.syncEntity('notifications', notif);
    }
  }

  markAllNotificationsRead(role) {
    this.state.notifications.forEach(n => {
      if (n.targetRole === role) {
        n.read = true;
        this.syncEntity('notifications', n);
      }
    });
    this.saveState();
  }
}

export const dataStore = new HospitalDataStore();

// Export service interfaces prepared for future Supabase or API clients
export const HospitalService = {
  getConfig: () => dataStore.getState().hospital,
  updateConfig: (updates) => dataStore.updateHospitalConfig(updates)
};

export const DepartmentService = {
  getAll: () => dataStore.getState().departments,
  add: (dep) => dataStore.addDepartment(dep),
  update: (id, updates) => dataStore.updateDepartment(id, updates)
};

export const DoctorService = {
  getAll: () => dataStore.getState().doctors,
  getById: (id) => dataStore.getState().doctors.find(d => d.id === id),
  add: (doc) => dataStore.addDoctor(doc),
  update: (id, updates) => dataStore.updateDoctor(id, updates),
  delete: (id) => dataStore.deleteDoctor(id)
};

export const PatientService = {
  getAll: () => dataStore.getState().patients,
  getById: (id) => dataStore.getState().patients.find(p => p.id === id),
  add: (patient) => dataStore.addPatient(patient),
  update: (id, updates) => dataStore.updatePatient(id, updates)
};

export const PatientRequestService = {
  getAll: () => dataStore.getState().patientRequests,
  submit: (req) => dataStore.submitPatientRequest(req),
  update: (id, updates) => dataStore.updatePatientRequest(id, updates)
};

export const AppointmentService = {
  getAll: () => dataStore.getState().appointments,
  create: (apt) => dataStore.createAppointment(apt),
  update: (id, updates) => dataStore.updateAppointment(id, updates)
};

export const MedicalRecordService = {
  getAll: (patientId = null) => {
    const records = dataStore.getState().medicalRecords;
    return patientId ? records.filter(r => r.patientId === patientId) : records;
  },
  create: (record) => dataStore.addMedicalRecord(record)
};

export const PrescriptionService = {
  getAll: (patientId = null) => {
    const rx = dataStore.getState().prescriptions;
    return patientId ? rx.filter(r => r.patientId === patientId) : rx;
  },
  issue: (rx) => dataStore.issuePrescription(rx)
};

export const PharmacyService = {
  getMedicines: () => dataStore.getState().medicines,
  addMedicine: (med) => dataStore.addMedicine(med),
  updateStock: (id, count) => dataStore.updateMedicineStock(id, count),
  getOrders: () => dataStore.getState().pharmacyOrders,
  createOrder: (order) => dataStore.createPharmacyOrder(order),
  updateOrderStatus: (id, status, notes) => dataStore.updatePharmacyOrderStatus(id, status, notes)
};

export const ResourceService = {
  getRooms: () => dataStore.getState().rooms,
  addRoom: (r) => dataStore.addRoom(r),
  getBeds: () => dataStore.getState().beds,
  addBed: (b) => dataStore.addBed(b),
  updateBedStatus: (id, status, patient) => dataStore.updateBedStatus(id, status, patient),
  getEquipment: () => dataStore.getState().equipment,
  addEquipment: (eq) => dataStore.addEquipment(eq),
  updateEquipmentStatus: (id, status) => dataStore.updateEquipmentStatus(id, status)
};

export const LabAndRadiologyService = {
  getLabTests: (patientId = null) => {
    const tests = dataStore.getState().labTests;
    return patientId ? tests.filter(t => t.patientId === patientId) : tests;
  },
  addLabTest: (test) => dataStore.addLabTestOrder(test),
  updateLabTest: (id, updates) => dataStore.updateLabTest(id, updates),
  getRadiology: (patientId = null) => {
    const rad = dataStore.getState().radiologyServices;
    return patientId ? rad.filter(r => r.patientId === patientId) : rad;
  },
  addRadiology: (rad) => dataStore.addRadiologyOrder(rad),
  updateRadiology: (id, updates) => dataStore.updateRadiology(id, updates)
};

export const BillingService = {
  getBills: (patientId = null) => {
    const bills = dataStore.getState().bills;
    return patientId ? bills.filter(b => b.patientId === patientId) : bills;
  },
  createInvoice: (bill) => dataStore.createInvoice(bill),
  paySimulated: (id, amount, method) => dataStore.processSimulatedPayment(id, amount, method)
};

export const AuditService = {
  getLogs: () => dataStore.getState().auditLogs
};

export const NotificationService = {
  getForRole: (role) => dataStore.getState().notifications.filter(n => n.targetRole === role),
  markRead: (id) => dataStore.markNotificationRead(id),
  markAllRead: (role) => dataStore.markAllNotificationsRead(role)
};
