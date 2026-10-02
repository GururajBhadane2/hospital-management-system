/**
 * Operational Data Layer for ApexCare Hospital Management Platform.
 * Supports both clean empty slate (real deployment) and verified demo test data (evaluation).
 */

export const EMPTY_HOSPITAL_STATE = {
  isDemoMode: false,
  hospital: {
    isConfigured: false,
    name: "",
    tagline: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    emergencyPhone: "",
    email: "",
    website: "",
    workingHours: "24/7 Emergency Care",
    emergencyAvailability: true,
    billingCurrency: "USD ($)",
    taxRate: 0,
    pharmacyLicense: ""
  },
  departments: [],
  doctors: [],
  patients: [],
  patientRequests: [],
  appointments: [],
  medicalRecords: [],
  prescriptions: [],
  medicines: [],
  pharmacyOrders: [],
  bills: [],
  rooms: [],
  beds: [],
  equipment: [],
  labTests: [],
  radiologyServices: [],
  staff: [],
  auditLogs: [],
  notifications: []
};

export const DEMO_HOSPITAL_STATE = {
  isDemoMode: true,
  hospital: {
    isConfigured: true,
    name: "ApexCare Regional Hospital",
    tagline: "Academic Medical Center & Clinical Excellence",
    registrationNumber: "HOSP-MA-92841-B",
    address: "740 Health Sciences Parkway",
    city: "Boston",
    state: "MA",
    postalCode: "02115",
    phone: "+1 (555) 720-4000",
    emergencyPhone: "+1 (800) 555-0911",
    email: "operations@apexcare-hospital.org",
    website: "https://apexcare-hospital.org",
    workingHours: "24/7 Clinical & Emergency Operations",
    emergencyAvailability: true,
    billingCurrency: "USD ($)",
    taxRate: 5,
    pharmacyLicense: "PHARM-LIC-88390"
  },
  departments: [
    {
      id: "DEP-01",
      name: "Cardiology",
      headOfDepartment: "Dr. Sarah Jenkins",
      code: "CARD",
      location: "Building A, Floor 3",
      status: "Active",
      phone: "Ext. 3010",
      description: "Comprehensive cardiac diagnostics, interventional procedures, and coronary recovery.",
      activeDoctorsCount: 2
    },
    {
      id: "DEP-02",
      name: "Orthopedics & Sports Medicine",
      headOfDepartment: "Dr. David Brooks",
      code: "ORTH",
      location: "Building B, Floor 2",
      status: "Active",
      phone: "Ext. 2100",
      description: "Musculoskeletal trauma, arthroscopic surgery, joint replacement, and rehabilitation.",
      activeDoctorsCount: 1
    },
    {
      id: "DEP-03",
      name: "Neurology",
      headOfDepartment: "Dr. Emily Taylor",
      code: "NEUR",
      location: "Building A, Floor 2",
      status: "Active",
      phone: "Ext. 2400",
      description: "Advanced neurological diagnostics, stroke care, and neuromuscular disorders.",
      activeDoctorsCount: 1
    },
    {
      id: "DEP-04",
      name: "Emergency & Trauma",
      headOfDepartment: "Dr. Robert Sterling",
      code: "EMER",
      location: "Ground Floor, Ambulatory Bay",
      status: "Active",
      phone: "Ext. 9110",
      description: "Level-1 emergency trauma care, acute triage, and rapid stabilization.",
      activeDoctorsCount: 1
    },
    {
      id: "DEP-05",
      name: "Pediatrics",
      headOfDepartment: "Dr. Maya Patel",
      code: "PED",
      location: "Building C, Floor 1",
      status: "Active",
      phone: "Ext. 1150",
      description: "Comprehensive infant, child, and adolescent clinical healthcare.",
      activeDoctorsCount: 1
    }
  ],
  doctors: [
    {
      id: "DOC-101",
      name: "Dr. Sarah Jenkins",
      specialization: "Cardiology",
      department: "Cardiology",
      qualifications: "MD, FACC, Harvard Medical School",
      registrationNumber: "MED-MA-44910",
      yearsOfExperience: 16,
      professionalBio: "Specialist in interventional cardiology and ischemic heart disease management.",
      areasOfExpertise: "Angioplasty, Echocardiography, Coronary Stenting",
      languages: "English, French",
      consultationFee: 250,
      availableDays: "Mon, Wed, Fri",
      availableTime: "08:30 - 15:30",
      hospitalRole: "Head of Cardiology",
      employmentStatus: "Full-Time",
      phone: "+1 (555) 301-4411",
      email: "s.jenkins@apexcare-hospital.org",
      status: "Active",
      assignedPatientsCount: 3
    },
    {
      id: "DOC-102",
      name: "Dr. David Brooks",
      specialization: "Orthopedic Surgery",
      department: "Orthopedics & Sports Medicine",
      qualifications: "MD, FACS, Board Certified Orthopedic Surgeon",
      registrationNumber: "MED-MA-31920",
      yearsOfExperience: 12,
      professionalBio: "Expert in minimally invasive joint repair and complex knee reconstruction.",
      areasOfExpertise: "ACL Reconstruction, Total Knee Arthroplasty",
      languages: "English, Spanish",
      consultationFee: 280,
      availableDays: "Tue, Thu, Sat",
      availableTime: "09:00 - 16:00",
      hospitalRole: "Senior Orthopedic Surgeon",
      employmentStatus: "Full-Time",
      phone: "+1 (555) 301-4422",
      email: "d.brooks@apexcare-hospital.org",
      status: "Active",
      assignedPatientsCount: 2
    },
    {
      id: "DOC-103",
      name: "Dr. Emily Taylor",
      specialization: "Neurology",
      department: "Neurology",
      qualifications: "MD, PhD, Johns Hopkins University",
      registrationNumber: "MED-MA-66215",
      yearsOfExperience: 11,
      professionalBio: "Specializes in neuro-imaging analysis, intractable migraine, and motor neuron disorders.",
      areasOfExpertise: "EEG, EMG, Chronic Migraine Therapeutics",
      languages: "English",
      consultationFee: 260,
      availableDays: "Mon, Tue, Thu",
      availableTime: "09:00 - 15:00",
      hospitalRole: "Attending Neurologist",
      employmentStatus: "Full-Time",
      phone: "+1 (555) 301-4433",
      email: "e.taylor@apexcare-hospital.org",
      status: "Active",
      assignedPatientsCount: 2
    },
    {
      id: "DOC-104",
      name: "Dr. Robert Sterling",
      specialization: "Emergency & Trauma Medicine",
      department: "Emergency & Trauma",
      qualifications: "MD, FACEP, Columbia University",
      registrationNumber: "MED-MA-12903",
      yearsOfExperience: 18,
      professionalBio: "Director of Emergency Services overseeing trauma triage and rapid resuscitation.",
      areasOfExpertise: "Trauma Resuscitation, Critical Care Medicine",
      languages: "English, German",
      consultationFee: 200,
      availableDays: "Rotational Shifts (24/7)",
      availableTime: "07:00 - 19:00",
      hospitalRole: "Chief of Emergency Services",
      employmentStatus: "Full-Time",
      phone: "+1 (555) 301-4444",
      email: "r.sterling@apexcare-hospital.org",
      status: "Active",
      assignedPatientsCount: 1
    }
  ],
  patients: [
    {
      id: "PAT-1001",
      name: "Eleanor Vance",
      dateOfBirth: "1988-04-14",
      age: 38,
      gender: "Female",
      bloodGroup: "O+",
      phone: "+1 (555) 234-5678",
      email: "eleanor.vance@example.com",
      address: "742 Evergreen Terrace, Boston, MA",
      emergencyContactName: "Thomas Vance (Spouse)",
      emergencyContactPhone: "+1 (555) 888-2921",
      insuranceProvider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-9821-44",
      allergies: "Penicillin, Sulfa drugs",
      chronicConditions: "Hypertension",
      admissionStatus: "Inpatient",
      admissionDate: "2026-09-28",
      assignedDepartment: "Cardiology",
      assignedDoctor: "Dr. Sarah Jenkins",
      assignedBed: "Cardiology Wing - Bed 302-A",
      approvalStatus: "Approved"
    },
    {
      id: "PAT-1002",
      name: "Marcus Aurelius Chen",
      dateOfBirth: "1974-09-20",
      age: 52,
      gender: "Male",
      bloodGroup: "A+",
      phone: "+1 (555) 891-2345",
      email: "m.chen@example.com",
      address: "128 Beacon St, Cambridge, MA",
      emergencyContactName: "Clara Chen (Wife)",
      emergencyContactPhone: "+1 (555) 492-1082",
      insuranceProvider: "Aetna Health",
      policyNumber: "AET-5510-82",
      allergies: "Latex",
      chronicConditions: "Post-op ACL recovery",
      admissionStatus: "Inpatient",
      admissionDate: "2026-10-01",
      assignedDepartment: "Orthopedics & Sports Medicine",
      assignedDoctor: "Dr. David Brooks",
      assignedBed: "Surgical Recovery - Bed 14",
      approvalStatus: "Approved"
    },
    {
      id: "PAT-1003",
      name: "Sophia Rodriguez",
      dateOfBirth: "1997-11-05",
      age: 29,
      gender: "Female",
      bloodGroup: "B+",
      phone: "+1 (555) 432-8765",
      email: "sophia.rodriguez@example.com",
      address: "19 Newbury St, Boston, MA",
      emergencyContactName: "Carlos Rodriguez (Father)",
      emergencyContactPhone: "+1 (555) 120-9944",
      insuranceProvider: "UnitedHealthcare",
      policyNumber: "UHC-7731-09",
      allergies: "None known",
      chronicConditions: "Recurrent migraines with visual aura",
      admissionStatus: "Outpatient",
      admissionDate: "2026-10-02",
      assignedDepartment: "Neurology",
      assignedDoctor: "Dr. Emily Taylor",
      assignedBed: "N/A",
      approvalStatus: "Approved"
    }
  ],
  patientRequests: [
    {
      id: "REQ-2026-001",
      patientId: "PAT-1003",
      patientName: "Sophia Rodriguez",
      patientContact: "+1 (555) 432-8765",
      issueCategory: "Neurological",
      description: "Severe throbbing headaches behind right eye accompanied by visual flashing lights and nausea for 3 consecutive days.",
      preferredDepartment: "Neurology",
      preferredDoctor: "Dr. Emily Taylor",
      priority: "High",
      submittedDate: "2026-10-02 09:15 AM",
      status: "Accepted",
      assignedDepartment: "Neurology",
      assignedDoctor: "Dr. Emily Taylor",
      managerNotes: "Approved for urgent neuro-consultation. Scheduled for Oct 3."
    },
    {
      id: "REQ-2026-002",
      patientId: "PAT-1004",
      patientName: "Arthur Dent",
      patientContact: "+1 (555) 777-3321",
      issueCategory: "Bone / Joint",
      description: "Sharp shooting pain in right knee after twisting while hiking. Significant swelling and unable to bear full weight.",
      preferredDepartment: "Orthopedics & Sports Medicine",
      preferredDoctor: "Dr. David Brooks",
      priority: "Medium",
      submittedDate: "2026-10-02 11:30 AM",
      status: "Under Review",
      assignedDepartment: "Orthopedics & Sports Medicine",
      assignedDoctor: "",
      managerNotes: "Reviewing triage notes before doctor assignment."
    },
    {
      id: "REQ-2026-003",
      patientId: "PAT-1005",
      patientName: "Evelyn Reed",
      patientContact: "+1 (555) 902-1847",
      issueCategory: "Heart",
      description: "Intermittent palpitations and shortness of breath when climbing stairs. Family history of coronary artery disease.",
      preferredDepartment: "Cardiology",
      preferredDoctor: "Dr. Sarah Jenkins",
      priority: "High",
      submittedDate: "2026-10-02 02:45 PM",
      status: "Pending",
      assignedDepartment: "",
      assignedDoctor: "",
      managerNotes: ""
    }
  ],
  appointments: [
    {
      id: "APT-2026-001",
      patientId: "PAT-1001",
      patientName: "Eleanor Vance",
      doctorId: "DOC-101",
      doctorName: "Dr. Sarah Jenkins",
      department: "Cardiology",
      date: "2026-10-03",
      time: "09:30 AM",
      type: "Follow-up Examination",
      status: "Confirmed",
      room: "Clinic 304, Pavilion B",
      notes: "Evaluate response to updated ACE inhibitor dosage and review latest ECG"
    },
    {
      id: "APT-2026-002",
      patientId: "PAT-1003",
      patientName: "Sophia Rodriguez",
      doctorId: "DOC-103",
      doctorName: "Dr. Emily Taylor",
      department: "Neurology",
      date: "2026-10-03",
      time: "11:00 AM",
      type: "Diagnostic Consultation",
      status: "Confirmed",
      room: "Clinic 210, Neuro Suite",
      notes: "Review MRI brain scans for chronic vascular migraine"
    },
    {
      id: "APT-2026-003",
      patientId: "PAT-1002",
      patientName: "Marcus Aurelius Chen",
      doctorId: "DOC-102",
      doctorName: "Dr. David Brooks",
      department: "Orthopedics & Sports Medicine",
      date: "2026-10-03",
      time: "02:00 PM",
      type: "Post-Op Wound & Mobility Check",
      status: "Confirmed",
      room: "Surgical Recovery Wing, Bay 2",
      notes: "Inspect knee incision dressing, joint effusion, and passive range of motion"
    }
  ],
  medicalRecords: [
    {
      id: "EHR-2026-901",
      patientId: "PAT-1001",
      patientName: "Eleanor Vance",
      doctorId: "DOC-101",
      doctorName: "Dr. Sarah Jenkins",
      department: "Cardiology",
      date: "2026-09-29",
      chiefComplaint: "Morning occipital headaches and exertional shortness of breath",
      diagnosis: "Essential Stage II Systemic Hypertension with Mild Left Ventricular Hypertrophy",
      vitals: {
        bloodPressure: "144/92 mmHg",
        heartRate: "78 bpm",
        temperature: "98.4 °F",
        oxygenSaturation: "98%",
        respiratoryRate: "16 bpm"
      },
      consultationNotes: "Patient has history of untreated hypertension. Heart sounds S1, S2 present, no murmurs. Lungs clear to auscultation bilaterally. Initiated dual anti-hypertensive regimen. Patient educated on low-sodium dietary measures.",
      followUpPlan: "Repeat ECG in 2 weeks. Comprehensive metabolic panel to assess renal clearance."
    }
  ],
  prescriptions: [
    {
      id: "RX-2026-401",
      patientId: "PAT-1001",
      patientName: "Eleanor Vance",
      doctorId: "DOC-101",
      doctorName: "Dr. Sarah Jenkins",
      date: "2026-09-29",
      status: "Issued",
      items: [
        {
          medicine: "Amlodipine Besylate",
          dosage: "5 mg",
          frequency: "Once daily (Morning)",
          duration: "30 days",
          instructions: "Take with water after breakfast"
        },
        {
          medicine: "Lisinopril",
          dosage: "10 mg",
          frequency: "Once daily (Evening)",
          duration: "30 days",
          instructions: "Monitor blood pressure weekly"
        }
      ]
    },
    {
      id: "RX-2026-402",
      patientId: "PAT-1002",
      patientName: "Marcus Aurelius Chen",
      doctorId: "DOC-102",
      doctorName: "Dr. David Brooks",
      date: "2026-10-01",
      status: "Issued",
      items: [
        {
          medicine: "Enoxaparin Sodium",
          dosage: "40 mg / 0.4 mL",
          frequency: "Subcutaneous once daily",
          duration: "14 days",
          instructions: "Thromboprophylaxis post-orthopedic surgery"
        },
        {
          medicine: "Acetaminophen / Tramadol",
          dosage: "325 mg / 37.5 mg",
          frequency: "Every 6 hours as needed for severe pain",
          duration: "7 days",
          instructions: "Do not exceed 4 tablets in 24 hours"
        }
      ]
    }
  ],
  medicines: [
    {
      id: "MED-001",
      name: "Amlodipine Besylate",
      genericName: "Amlodipine",
      category: "Cardiovascular",
      dosageForm: "Tablet 5mg",
      stockQuantity: 450,
      minStockLevel: 100,
      unitPrice: 0.65,
      manufacturer: "Pfizer / Greenstone",
      batchNumber: "BN-2026-991",
      expiryDate: "2027-12-31",
      status: "In Stock"
    },
    {
      id: "MED-002",
      name: "Lisinopril",
      genericName: "Lisinopril",
      category: "Cardiovascular",
      dosageForm: "Tablet 10mg",
      stockQuantity: 380,
      minStockLevel: 80,
      unitPrice: 0.45,
      manufacturer: "AstraZeneca",
      batchNumber: "BN-2026-412",
      expiryDate: "2028-03-31",
      status: "In Stock"
    },
    {
      id: "MED-003",
      name: "Enoxaparin Sodium",
      genericName: "Enoxaparin",
      category: "Anticoagulant",
      dosageForm: "Prefilled Syringe 40mg/0.4mL",
      stockQuantity: 120,
      minStockLevel: 40,
      unitPrice: 18.50,
      manufacturer: "Sanofi",
      batchNumber: "BN-2026-781",
      expiryDate: "2027-06-30",
      status: "In Stock"
    },
    {
      id: "MED-004",
      name: "Amoxicillin / Clavulanate",
      genericName: "Augmentin",
      category: "Antibiotics",
      dosageForm: "Tablet 625mg",
      stockQuantity: 28,
      minStockLevel: 50,
      unitPrice: 1.20,
      manufacturer: "GSK",
      batchNumber: "BN-2026-118",
      expiryDate: "2026-11-30",
      status: "Low Stock"
    }
  ],
  pharmacyOrders: [
    {
      id: "ORD-2026-101",
      patientId: "PAT-1001",
      patientName: "Eleanor Vance",
      prescriptionId: "RX-2026-401",
      orderDate: "2026-09-29 03:00 PM",
      totalAmount: 33.00,
      status: "Ready",
      itemsSummary: "Amlodipine 5mg (x30), Lisinopril 10mg (x30)",
      pharmacistNotes: "Packaged with patient instructions. Ready at Dispensing Window 2."
    },
    {
      id: "ORD-2026-102",
      patientId: "PAT-1002",
      patientName: "Marcus Aurelius Chen",
      prescriptionId: "RX-2026-402",
      orderDate: "2026-10-01 05:20 PM",
      totalAmount: 284.50,
      status: "Dispatched",
      itemsSummary: "Enoxaparin 40mg (x14), Tramadol/APAP (x28)",
      pharmacistNotes: "Delivered to Surgical Recovery Unit Bed 14."
    }
  ],
  bills: [
    {
      id: "INV-2026-001",
      patientId: "PAT-1001",
      patientName: "Eleanor Vance",
      invoiceDate: "2026-09-30",
      dueDate: "2026-10-15",
      status: "Partial",
      items: [
        { description: "Cardiology Inpatient Ward Care (3 Days)", category: "Room Charges", amount: 1350 },
        { description: "Specialist Physician Consultation - Dr. S. Jenkins", category: "Consultation", amount: 350 },
        { description: "12-Lead Electrocardiogram & Diagnostics", category: "Laboratory / Diagnostic", amount: 480 },
        { description: "Hospital Pharmacy Prescriptions", category: "Pharmacy", amount: 75 }
      ],
      totalAmount: 2255.00,
      insurancePaid: 1600.00,
      patientPaid: 355.00,
      balanceDue: 300.00,
      paymentMethod: "Insurance Pre-Auth + Visa",
      receiptReference: "REC-BCBS-99120"
    },
    {
      id: "INV-2026-002",
      patientId: "PAT-1002",
      patientName: "Marcus Aurelius Chen",
      invoiceDate: "2026-10-01",
      dueDate: "2026-10-16",
      status: "Paid",
      items: [
        { description: "Operating Room / Arthroscopy Suite Fee", category: "Procedure", amount: 3800 },
        { description: "Surgical Specialist Fee - Dr. David Brooks", category: "Consultation", amount: 2200 },
        { description: "Anesthesiology & Intraoperative Monitoring", category: "Anesthesia", amount: 950 },
        { description: "Post-Operative Cryo-Cuff & Recovery Supplies", category: "Medical Equipment", amount: 420 }
      ],
      totalAmount: 7370.00,
      insurancePaid: 6500.00,
      patientPaid: 870.00,
      balanceDue: 0.00,
      paymentMethod: "Aetna Direct Billing Settlement",
      receiptReference: "REC-AET-44182"
    },
    {
      id: "INV-2026-003",
      patientId: "PAT-1003",
      patientName: "Sophia Rodriguez",
      invoiceDate: "2026-10-02",
      dueDate: "2026-10-17",
      status: "Pending",
      items: [
        { description: "Neurology Specialist Outpatient Consultation", category: "Consultation", amount: 260 },
        { description: "Cranial MRI Scan with Contrast", category: "Radiology", amount: 890 }
      ],
      totalAmount: 1150.00,
      insurancePaid: 0.00,
      patientPaid: 0.00,
      balanceDue: 1150.00,
      paymentMethod: "Pending Patient Verification",
      receiptReference: "UNPAID"
    }
  ],
  rooms: [
    { id: "RM-301", name: "Room 301 (Private)", department: "Cardiology", floor: "Floor 3", bedCapacity: 1 },
    { id: "RM-302", name: "Room 302 (Semi-Private)", department: "Cardiology", floor: "Floor 3", bedCapacity: 2 },
    { id: "RM-201", name: "Post-Op Bay 1", department: "Orthopedics & Sports Medicine", floor: "Floor 2", bedCapacity: 4 },
    { id: "RM-ICU", name: "Intensive Care Unit", department: "Emergency & Trauma", floor: "Floor 4", bedCapacity: 6 }
  ],
  beds: [
    {
      id: "BED-301-A",
      room: "Room 301 (Private)",
      department: "Cardiology",
      type: "Electric ICU Bed",
      status: "Available",
      assignedPatient: null
    },
    {
      id: "BED-302-A",
      room: "Room 302 (Semi-Private)",
      department: "Cardiology",
      type: "Standard Ward Bed",
      status: "Occupied",
      assignedPatient: "Eleanor Vance (PAT-1001)"
    },
    {
      id: "BED-302-B",
      room: "Room 302 (Semi-Private)",
      department: "Cardiology",
      type: "Standard Ward Bed",
      status: "Available",
      assignedPatient: null
    },
    {
      id: "BED-SURG-14",
      room: "Post-Op Bay 1",
      department: "Orthopedics & Sports Medicine",
      type: "Orthopedic Traction Bed",
      status: "Occupied",
      assignedPatient: "Marcus Aurelius Chen (PAT-1002)"
    },
    {
      id: "BED-ICU-01",
      room: "Intensive Care Unit",
      department: "Emergency & Trauma",
      type: "Critical Cardiac Monitor Bed",
      status: "Reserved",
      assignedPatient: "Emergency Intake Holding"
    },
    {
      id: "BED-ICU-02",
      room: "Intensive Care Unit",
      department: "Emergency & Trauma",
      type: "Critical Cardiac Monitor Bed",
      status: "Maintenance",
      assignedPatient: null
    }
  ],
  equipment: [
    {
      id: "EQ-101",
      name: "Siemens SOMATOM CT Scanner",
      category: "Radiology & Imaging",
      department: "Radiology",
      serialNumber: "SN-SOM-881290",
      location: "Radiology Suite 102",
      purchaseDate: "2023-04-15",
      status: "Operational",
      lastMaintenance: "2026-08-10",
      nextMaintenance: "2026-11-10"
    },
    {
      id: "EQ-102",
      name: "GE Healthcare Vivid E95 Ultrasound",
      category: "Cardiology Diagnostics",
      department: "Cardiology",
      serialNumber: "SN-GE-441829",
      location: "Cardio Echo Lab, Room 304",
      purchaseDate: "2024-01-20",
      status: "Operational",
      lastMaintenance: "2026-09-05",
      nextMaintenance: "2026-12-05"
    },
    {
      id: "EQ-103",
      name: "Stryker Crossfire Arthroscopy System",
      category: "Surgical Equipment",
      department: "Orthopedics & Sports Medicine",
      serialNumber: "SN-STR-99120",
      location: "Operating Theater 3",
      purchaseDate: "2023-11-12",
      status: "Operational",
      lastMaintenance: "2026-07-22",
      nextMaintenance: "2026-10-22"
    },
    {
      id: "EQ-104",
      name: "Hamilton C6 Mechanical Ventilator",
      category: "Critical Care Respiration",
      department: "Emergency & Trauma",
      serialNumber: "SN-HAM-33821",
      location: "ICU Bay 4",
      purchaseDate: "2022-09-08",
      status: "Maintenance",
      lastMaintenance: "2026-09-28",
      nextMaintenance: "2026-10-05"
    }
  ],
  labTests: [
    {
      id: "LAB-2026-01",
      patientId: "PAT-1001",
      patientName: "Eleanor Vance",
      doctorId: "DOC-101",
      testName: "Comprehensive Metabolic Panel (CMP) + Lipid Profile",
      department: "Clinical Biochemistry",
      requestedDate: "2026-09-28",
      status: "Completed",
      sampleCollectedDate: "2026-09-28 08:30 AM",
      reportedDate: "2026-09-28 02:00 PM",
      resultsSummary: "eGFR: 88 mL/min (Normal), Total Cholesterol: 198 mg/dL, HDL: 52 mg/dL, LDL: 122 mg/dL",
      labTechnician: "Sarah Lin, MLS(ASCP)"
    },
    {
      id: "LAB-2026-02",
      patientId: "PAT-1003",
      patientName: "Sophia Rodriguez",
      doctorId: "DOC-103",
      testName: "Complete Blood Count (CBC) with Differential",
      department: "Hematology",
      requestedDate: "2026-10-02",
      status: "Sample Collected",
      sampleCollectedDate: "2026-10-02 10:15 AM",
      reportedDate: "Pending Analysis",
      resultsSummary: "Awaiting automated hematology analyzer batch run",
      labTechnician: "David Thorne, MLT"
    }
  ],
  radiologyServices: [
    {
      id: "RAD-2026-01",
      patientId: "PAT-1002",
      patientName: "Marcus Aurelius Chen",
      doctorId: "DOC-102",
      modality: "MRI Scan",
      bodyPart: "Right Knee High-Resolution",
      requestedDate: "2026-09-30",
      status: "Report Uploaded",
      conductedDate: "2026-09-30 02:30 PM",
      findings: "Complete disruption of mid-substance anterior cruciate ligament (ACL) fibers. Moderate joint effusion and posterior horn lateral meniscus fraying.",
      radiologist: "Dr. Ronald Harris, Radiologist MD"
    },
    {
      id: "RAD-2026-02",
      patientId: "PAT-1003",
      patientName: "Sophia Rodriguez",
      doctorId: "DOC-103",
      modality: "MRI Scan",
      bodyPart: "Brain with and without IV Contrast",
      requestedDate: "2026-10-02",
      status: "Scheduled",
      conductedDate: "2026-10-04 10:00 AM",
      findings: "Pending scan execution",
      radiologist: "Dr. Ronald Harris, Radiologist MD"
    }
  ],
  staff: [
    {
      id: "STF-01",
      name: "Rachel Adams, RN, BSN",
      role: "Head Charge Nurse",
      department: "Cardiology & ICU",
      email: "r.adams@apexcare-hospital.org",
      phone: "+1 (555) 720-3011",
      shift: "Day Shift (07:00 - 19:00)",
      status: "Active"
    },
    {
      id: "STF-02",
      name: "Markus Thorne, PharmD",
      role: "Chief Pharmacist",
      department: "Hospital Pharmacy",
      email: "m.thorne@apexcare-hospital.org",
      phone: "+1 (555) 720-4015",
      shift: "Morning Shift (08:00 - 16:00)",
      status: "Active"
    },
    {
      id: "STF-03",
      name: "Hannah Schmidt, CPB",
      role: "Medical Billing & Revenue Cycle Manager",
      department: "Hospital Billing & Accounts",
      email: "h.schmidt@apexcare-hospital.org",
      phone: "+1 (555) 720-5012",
      shift: "Regular (09:00 - 17:00)",
      status: "Active"
    }
  ],
  auditLogs: [
    {
      id: "LOG-1001",
      timestamp: "2026-10-02 02:45 PM",
      user: "System / Patient Portal",
      role: "PATIENT",
      module: "Patient Requests",
      action: "Submitted triage request for Cardiology review",
      status: "Success",
      ipAddress: "192.168.1.104"
    },
    {
      id: "LOG-1002",
      timestamp: "2026-10-02 11:40 AM",
      user: "Hospital Manager",
      role: "MANAGER",
      module: "Patient Requests",
      action: "Reviewed and accepted request REQ-2026-001; assigned Dr. Emily Taylor",
      status: "Success",
      ipAddress: "10.0.4.15"
    },
    {
      id: "LOG-1003",
      timestamp: "2026-10-02 10:15 AM",
      user: "Dr. David Brooks",
      role: "DOCTOR",
      module: "Prescriptions",
      action: "Issued post-op prescription RX-2026-402 for patient Marcus Chen",
      status: "Success",
      ipAddress: "10.0.2.88"
    },
    {
      id: "LOG-1004",
      timestamp: "2026-10-01 04:30 PM",
      user: "Hannah Schmidt",
      role: "BILLING STAFF",
      module: "Billing",
      action: "Processed settlement for Invoice INV-2026-002 ($7,370)",
      status: "Success",
      ipAddress: "10.0.5.12"
    }
  ],
  notifications: [
    {
      id: "NOTIF-01",
      targetRole: "MANAGER",
      title: "New Patient Consultation Request",
      message: "Evelyn Reed submitted a cardiac assessment request (Priority: High).",
      timestamp: "10m ago",
      read: false,
      link: "requests"
    },
    {
      id: "NOTIF-02",
      targetRole: "DOCTOR",
      title: "New Patient Assigned",
      message: "Hospital Manager assigned Sophia Rodriguez (Neurology) to your schedule.",
      timestamp: "2h ago",
      read: false,
      link: "appointments"
    },
    {
      id: "NOTIF-03",
      targetRole: "PATIENT",
      title: "Consultation Request Accepted",
      message: "Your neurology consultation with Dr. Emily Taylor has been approved for Oct 3.",
      timestamp: "3h ago",
      read: false,
      link: "appointments"
    }
  ]
};
