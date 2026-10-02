-- ==============================================================================
-- APEXCARE HOSPITAL MANAGEMENT SYSTEM (HMS)
-- Supabase Database Schema & Initial Setup Script
-- Compatible with Supabase Free Tier (PostgreSQL 15+)
-- ==============================================================================

-- 1. Enable UUID Extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE DEFINITIONS (With Indexed Relational Columns + Lossless JSONB)
-- ==============================================================================

-- 2.1 Hospital Profile & Organization Configuration
CREATE TABLE IF NOT EXISTS hms_hospital (
    id TEXT PRIMARY KEY DEFAULT 'hospital_config',
    name TEXT,
    tagline TEXT,
    registration_number TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    phone TEXT,
    emergency_phone TEXT,
    email TEXT,
    website TEXT,
    working_hours TEXT DEFAULT '24/7 Emergency Care',
    emergency_availability BOOLEAN DEFAULT true,
    billing_currency TEXT DEFAULT 'USD ($)',
    tax_rate NUMERIC DEFAULT 0,
    pharmacy_license TEXT,
    is_configured BOOLEAN DEFAULT false,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Hospital Clinical Departments
CREATE TABLE IF NOT EXISTS hms_departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    head_of_department TEXT,
    code TEXT,
    location TEXT,
    status TEXT DEFAULT 'Active',
    phone TEXT,
    description TEXT,
    active_doctors_count INT DEFAULT 0,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Medical Specialists & Physicians
CREATE TABLE IF NOT EXISTS hms_doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    department TEXT,
    qualifications TEXT,
    registration_number TEXT,
    years_of_experience INT DEFAULT 0,
    professional_bio TEXT,
    areas_of_expertise TEXT,
    languages TEXT,
    consultation_fee NUMERIC DEFAULT 0,
    available_days TEXT,
    available_time TEXT,
    hospital_role TEXT,
    employment_status TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'Active',
    assigned_patients_count INT DEFAULT 0,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Registered Patients (EMR/EHR)
CREATE TABLE IF NOT EXISTS hms_patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    date_of_birth TEXT,
    age INT,
    gender TEXT,
    blood_group TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    insurance_provider TEXT,
    policy_number TEXT,
    allergies TEXT,
    chronic_conditions TEXT,
    admission_status TEXT DEFAULT 'Outpatient',
    admission_date TEXT,
    assigned_department TEXT,
    assigned_doctor TEXT,
    assigned_bed TEXT,
    approval_status TEXT DEFAULT 'Approved',
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Inbound Patient Consultation & Triage Requests
CREATE TABLE IF NOT EXISTS hms_patient_requests (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    patient_contact TEXT,
    issue_category TEXT,
    description TEXT,
    preferred_department TEXT,
    preferred_doctor TEXT,
    priority TEXT DEFAULT 'Medium',
    submitted_date TEXT,
    status TEXT DEFAULT 'Pending',
    assigned_department TEXT,
    assigned_doctor TEXT,
    manager_notes TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Appointments & Consultations
CREATE TABLE IF NOT EXISTS hms_appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    doctor_id TEXT,
    doctor_name TEXT,
    department TEXT,
    date TEXT,
    time TEXT,
    type TEXT,
    status TEXT DEFAULT 'Confirmed',
    room TEXT,
    notes TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Electronic Health Records & Clinical Notes
CREATE TABLE IF NOT EXISTS hms_medical_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    doctor_id TEXT,
    doctor_name TEXT,
    department TEXT,
    date TEXT,
    chief_complaint TEXT,
    diagnosis TEXT,
    vitals JSONB DEFAULT '{}'::jsonb,
    consultation_notes TEXT,
    follow_up_plan TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Digital Prescriptions
CREATE TABLE IF NOT EXISTS hms_prescriptions (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    doctor_id TEXT,
    doctor_name TEXT,
    date TEXT,
    status TEXT DEFAULT 'Issued',
    items JSONB DEFAULT '[]'::jsonb,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.9 Pharmacy Inventory & Formulary
CREATE TABLE IF NOT EXISTS hms_medicines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    generic_name TEXT,
    category TEXT,
    dosage_form TEXT,
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 0,
    unit_price NUMERIC DEFAULT 0,
    manufacturer TEXT,
    batch_number TEXT,
    expiry_date TEXT,
    status TEXT DEFAULT 'In Stock',
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.10 Pharmacy Dispensing Orders
CREATE TABLE IF NOT EXISTS hms_pharmacy_orders (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    prescription_id TEXT,
    order_date TEXT,
    total_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    items_summary TEXT,
    pharmacist_notes TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.11 Billing Invoices & Financial Claims
CREATE TABLE IF NOT EXISTS hms_bills (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    invoice_date TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'Pending',
    items JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC DEFAULT 0,
    insurance_paid NUMERIC DEFAULT 0,
    patient_paid NUMERIC DEFAULT 0,
    balance_due NUMERIC DEFAULT 0,
    payment_method TEXT,
    receipt_reference TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.12 Hospital Rooms
CREATE TABLE IF NOT EXISTS hms_rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT,
    floor TEXT,
    bed_capacity INT DEFAULT 1,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.13 Hospital Beds & Ward Allocations
CREATE TABLE IF NOT EXISTS hms_beds (
    id TEXT PRIMARY KEY,
    room TEXT,
    department TEXT,
    type TEXT,
    status TEXT DEFAULT 'Available',
    assigned_patient TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.14 Clinical & Biomedical Equipment
CREATE TABLE IF NOT EXISTS hms_equipment (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    department TEXT,
    serial_number TEXT,
    location TEXT,
    purchase_date TEXT,
    status TEXT DEFAULT 'Operational',
    last_maintenance TEXT,
    next_maintenance TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.15 Pathology & Diagnostic Lab Tests
CREATE TABLE IF NOT EXISTS hms_lab_tests (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    doctor_id TEXT,
    test_name TEXT,
    department TEXT,
    requested_date TEXT,
    status TEXT DEFAULT 'Pending',
    sample_collected_date TEXT,
    reported_date TEXT,
    results_summary TEXT,
    lab_technician TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.16 Radiology & Diagnostic Imaging
CREATE TABLE IF NOT EXISTS hms_radiology_services (
    id TEXT PRIMARY KEY,
    patient_id TEXT,
    patient_name TEXT,
    doctor_id TEXT,
    modality TEXT,
    body_part TEXT,
    requested_date TEXT,
    status TEXT DEFAULT 'Pending',
    conducted_date TEXT,
    findings TEXT,
    radiologist TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.17 Clinical & Administrative Staff
CREATE TABLE IF NOT EXISTS hms_staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    department TEXT,
    email TEXT,
    phone TEXT,
    shift TEXT,
    status TEXT DEFAULT 'Active',
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.18 Governance & System Audit Logs
CREATE TABLE IF NOT EXISTS hms_audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    user_name TEXT,
    role TEXT,
    module TEXT,
    action TEXT,
    status TEXT,
    ip_address TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.19 Operational Notifications
CREATE TABLE IF NOT EXISTS hms_notifications (
    id TEXT PRIMARY KEY,
    target_role TEXT,
    title TEXT,
    message TEXT,
    timestamp TEXT,
    read BOOLEAN DEFAULT false,
    link TEXT,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Free-tier anon public API key access configuration
-- ==============================================================================

DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'hms_hospital',
        'hms_departments',
        'hms_doctors',
        'hms_patients',
        'hms_patient_requests',
        'hms_appointments',
        'hms_medical_records',
        'hms_prescriptions',
        'hms_medicines',
        'hms_pharmacy_orders',
        'hms_bills',
        'hms_rooms',
        'hms_beds',
        'hms_equipment',
        'hms_lab_tests',
        'hms_radiology_services',
        'hms_staff',
        'hms_audit_logs',
        'hms_notifications'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', 'allow_all_ops_' || tbl, tbl);
        EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (true) WITH CHECK (true);', 'allow_all_ops_' || tbl, tbl);
    END LOOP;
END $$;

-- ==============================================================================
-- 4. REALTIME PUBLICATION (Enables instant multi-tab & multi-device sync)
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE 
    hms_hospital,
    hms_departments,
    hms_doctors,
    hms_patients,
    hms_patient_requests,
    hms_appointments,
    hms_medical_records,
    hms_prescriptions,
    hms_medicines,
    hms_pharmacy_orders,
    hms_bills,
    hms_rooms,
    hms_beds,
    hms_equipment,
    hms_lab_tests,
    hms_radiology_services,
    hms_staff,
    hms_audit_logs,
    hms_notifications;

-- Schema setup complete. All 19 hospital operating collections are ready!
