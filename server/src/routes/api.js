const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), hospital: store.getHospitalInfo().name });
});

// Overview / Stats
router.get('/stats', (req, res) => {
  res.json(store.getStats());
});

// Hospital Info
router.get('/hospital', (req, res) => {
  res.json(store.getHospitalInfo());
});

// Recent Activities
router.get('/activities', (req, res) => {
  res.json(store.getActivities());
});

// Patients Endpoints
router.get('/patients', (req, res) => {
  const { search, status, department } = req.query;
  let patients = store.getPatients();

  if (search) {
    const s = search.toLowerCase();
    patients = patients.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.id.toLowerCase().includes(s) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(s))
    );
  }
  if (status && status !== 'All') {
    patients = patients.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }
  if (department && department !== 'All') {
    patients = patients.filter(p => p.department && p.department.toLowerCase() === department.toLowerCase());
  }

  res.json(patients);
});

router.get('/patients/:id', (req, res) => {
  const patient = store.getPatientById(req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  const records = store.getRecords(patient.id);
  res.json({ ...patient, medicalRecords: records });
});

router.post('/patients', (req, res) => {
  const { name, age, gender, contact } = req.body;
  if (!name || !age || !gender || !contact) {
    return res.status(400).json({ error: 'Name, age, gender, and contact are required' });
  }
  const created = store.createPatient(req.body);
  res.status(201).json(created);
});

router.put('/patients/:id', (req, res) => {
  const updated = store.updatePatient(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Patient not found' });
  res.json(updated);
});

router.delete('/patients/:id', (req, res) => {
  const success = store.deletePatient(req.params.id);
  if (!success) return res.status(404).json({ error: 'Patient not found' });
  res.json({ message: 'Patient removed successfully' });
});

// Doctors Endpoints
router.get('/doctors', (req, res) => {
  const { department, status } = req.query;
  let doctors = store.getDoctors();
  if (department && department !== 'All') {
    doctors = doctors.filter(d => d.department.toLowerCase() === department.toLowerCase());
  }
  if (status && status !== 'All') {
    doctors = doctors.filter(d => d.status.toLowerCase() === status.toLowerCase());
  }
  res.json(doctors);
});

router.get('/doctors/:id', (req, res) => {
  const doctor = store.getDoctorById(req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctor);
});

router.post('/doctors', (req, res) => {
  const { name, specialty, department } = req.body;
  if (!name || !specialty) {
    return res.status(400).json({ error: 'Doctor name and specialty are required' });
  }
  const created = store.createDoctor(req.body);
  res.status(201).json(created);
});

router.put('/doctors/:id', (req, res) => {
  const updated = store.updateDoctor(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Doctor not found' });
  res.json(updated);
});

router.delete('/doctors/:id', (req, res) => {
  const success = store.deleteDoctor(req.params.id);
  if (!success) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ message: 'Doctor record removed' });
});

// Appointments Endpoints
router.get('/appointments', (req, res) => {
  const { date, status } = req.query;
  let appointments = store.getAppointments();
  if (date) {
    appointments = appointments.filter(a => a.date === date);
  }
  if (status && status !== 'All') {
    appointments = appointments.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }
  res.json(appointments);
});

router.post('/appointments', (req, res) => {
  const { patientName, doctorName, date, time } = req.body;
  if (!patientName || !doctorName || !date || !time) {
    return res.status(400).json({ error: 'Patient name, doctor, date, and time are required' });
  }
  const created = store.createAppointment(req.body);
  res.status(201).json(created);
});

router.put('/appointments/:id', (req, res) => {
  const updated = store.updateAppointment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Appointment not found' });
  res.json(updated);
});

router.delete('/appointments/:id', (req, res) => {
  const success = store.deleteAppointment(req.params.id);
  if (!success) return res.status(404).json({ error: 'Appointment not found' });
  res.json({ message: 'Appointment cancelled/removed' });
});

// Records Endpoints
router.get('/records', (req, res) => {
  const { patientId } = req.query;
  res.json(store.getRecords(patientId));
});

router.post('/records', (req, res) => {
  const { patientId, patientName, diagnosis } = req.body;
  if (!patientName || !diagnosis) {
    return res.status(400).json({ error: 'Patient and diagnosis are required' });
  }
  const created = store.createRecord(req.body);
  res.status(201).json(created);
});

// Billing Endpoints
router.get('/billings', (req, res) => {
  const { status } = req.query;
  let bills = store.getBillings();
  if (status && status !== 'All') {
    bills = bills.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }
  res.json(bills);
});

router.post('/billings', (req, res) => {
  const { patientName, items } = req.body;
  if (!patientName || !items || !items.length) {
    return res.status(400).json({ error: 'Patient name and at least one item are required' });
  }
  const created = store.createBilling(req.body);
  res.status(201).json(created);
});

router.put('/billings/:id', (req, res) => {
  const updated = store.updateBilling(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Billing record not found' });
  res.json(updated);
});

// Wards Endpoints
router.get('/wards', (req, res) => {
  res.json(store.getWards());
});

router.put('/wards/:id', (req, res) => {
  const updated = store.updateWard(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Ward not found' });
  res.json(updated);
});

module.exports = router;
