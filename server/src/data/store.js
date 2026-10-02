const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'initialData.json');

class DataStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error loading initial data:', err);
      return {
        hospital: {},
        patients: [],
        doctors: [],
        appointments: [],
        records: [],
        billings: [],
        wards: [],
        recentActivities: []
      };
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving data:', err);
    }
  }

  // Patients
  getPatients() {
    return this.data.patients;
  }

  getPatientById(id) {
    return this.data.patients.find(p => p.id === id);
  }

  createPatient(patientData) {
    const newPatient = {
      id: `PAT-${Date.now().toString().slice(-4)}`,
      admissionDate: new Date().toISOString().split('T')[0],
      status: patientData.status || 'Inpatient',
      ...patientData
    };
    this.data.patients.unshift(newPatient);
    this.addActivity({
      type: 'admission',
      title: 'New Patient Registered',
      description: `${newPatient.name} added to ${newPatient.department || 'General Medicine'}`,
      priority: 'normal'
    });
    this.saveData();
    return newPatient;
  }

  updatePatient(id, updates) {
    const index = this.data.patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.patients[index] = { ...this.data.patients[index], ...updates };
    this.saveData();
    return this.data.patients[index];
  }

  deletePatient(id) {
    const index = this.data.patients.findIndex(p => p.id === id);
    if (index === -1) return false;
    const removed = this.data.patients.splice(index, 1)[0];
    this.saveData();
    return true;
  }

  // Doctors
  getDoctors() {
    return this.data.doctors;
  }

  getDoctorById(id) {
    return this.data.doctors.find(d => d.id === id);
  }

  createDoctor(doctorData) {
    const newDoctor = {
      id: `DOC-${Date.now().toString().slice(-3)}`,
      rating: 5.0,
      assignedPatientsCount: 0,
      ...doctorData
    };
    this.data.doctors.push(newDoctor);
    this.saveData();
    return newDoctor;
  }

  updateDoctor(id, updates) {
    const index = this.data.doctors.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.data.doctors[index] = { ...this.data.doctors[index], ...updates };
    this.saveData();
    return this.data.doctors[index];
  }

  deleteDoctor(id) {
    const index = this.data.doctors.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.data.doctors.splice(index, 1);
    this.saveData();
    return true;
  }

  // Appointments
  getAppointments() {
    return this.data.appointments;
  }

  createAppointment(aptData) {
    const newApt = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      status: aptData.status || 'Confirmed',
      ...aptData
    };
    this.data.appointments.unshift(newApt);
    this.addActivity({
      type: 'appointment',
      title: 'Appointment Scheduled',
      description: `Appointment for ${newApt.patientName} with ${newApt.doctorName}`,
      priority: 'normal'
    });
    this.saveData();
    return newApt;
  }

  updateAppointment(id, updates) {
    const index = this.data.appointments.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.data.appointments[index] = { ...this.data.appointments[index], ...updates };
    this.saveData();
    return this.data.appointments[index];
  }

  deleteAppointment(id) {
    const index = this.data.appointments.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.data.appointments.splice(index, 1);
    this.saveData();
    return true;
  }

  // Medical Records
  getRecords(patientId = null) {
    if (patientId) {
      return this.data.records.filter(r => r.patientId === patientId);
    }
    return this.data.records;
  }

  createRecord(recordData) {
    const newRecord = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      ...recordData
    };
    this.data.records.unshift(newRecord);
    this.addActivity({
      type: 'lab',
      title: 'Medical Record Updated',
      description: `New clinical record added for ${newRecord.patientName}`,
      priority: 'normal'
    });
    this.saveData();
    return newRecord;
  }

  // Billing
  getBillings() {
    return this.data.billings;
  }

  createBilling(billingData) {
    const items = billingData.items || [];
    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const paidAmount = Number(billingData.paidAmount || 0);
    const balance = Math.max(0, totalAmount - paidAmount);

    const newBilling = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: billingData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      totalAmount,
      paidAmount,
      balance,
      status: balance === 0 ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Pending'),
      ...billingData
    };
    this.data.billings.unshift(newBilling);
    this.addActivity({
      type: 'billing',
      title: 'Invoice Generated',
      description: `Invoice ${newBilling.id} ($${totalAmount}) for ${newBilling.patientName}`,
      priority: 'normal'
    });
    this.saveData();
    return newBilling;
  }

  updateBilling(id, updates) {
    const index = this.data.billings.findIndex(b => b.id === id);
    if (index === -1) return null;
    const current = this.data.billings[index];
    const updated = { ...current, ...updates };
    if (updates.items || updates.paidAmount !== undefined) {
      const items = updated.items || [];
      const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const paidAmount = Number(updated.paidAmount || 0);
      updated.totalAmount = totalAmount;
      updated.balance = Math.max(0, totalAmount - paidAmount);
      updated.status = updated.balance === 0 ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Pending');
    }
    this.data.billings[index] = updated;
    this.saveData();
    return updated;
  }

  // Wards
  getWards() {
    return this.data.wards;
  }

  updateWard(id, updates) {
    const index = this.data.wards.findIndex(w => w.id === id);
    if (index === -1) return null;
    this.data.wards[index] = { ...this.data.wards[index], ...updates };
    this.saveData();
    return this.data.wards[index];
  }

  // Hospital Info
  getHospitalInfo() {
    return this.data.hospital;
  }

  // Activities
  getActivities() {
    return this.data.recentActivities || [];
  }

  addActivity(activity) {
    const newAct = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      time: 'Just now',
      priority: 'normal',
      ...activity
    };
    this.data.recentActivities.unshift(newAct);
    if (this.data.recentActivities.length > 20) {
      this.data.recentActivities.pop();
    }
  }

  // Aggregated Stats
  getStats() {
    const totalPatients = this.data.patients.length;
    const inpatients = this.data.patients.filter(p => p.status === 'Inpatient').length;
    const activeDoctors = this.data.doctors.filter(d => d.status !== 'Off Duty').length;
    const totalDoctors = this.data.doctors.length;
    const todayAppointments = this.data.appointments.length;
    
    let totalBeds = 0;
    let occupiedBeds = 0;
    this.data.wards.forEach(w => {
      totalBeds += (w.totalBeds || 0);
      occupiedBeds += (w.occupiedBeds || 0);
    });

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const totalRevenue = this.data.billings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const pendingRevenue = this.data.billings.reduce((sum, b) => sum + (b.balance || 0), 0);

    return {
      totalPatients,
      inpatients,
      outpatients: totalPatients - inpatients,
      activeDoctors,
      totalDoctors,
      todayAppointments,
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate,
      totalRevenue,
      pendingRevenue,
      recentActivities: this.data.recentActivities.slice(0, 6)
    };
  }
}

module.exports = new DataStore();
