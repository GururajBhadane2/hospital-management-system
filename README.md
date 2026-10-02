# ApexCare — Hospital Management & Operations Platform

> A full-featured, production-ready Hospital Management and Operations System built with **React 19**, **Vite**, **Express**, and **Supabase (PostgreSQL)**.

---

## 🏥 Platform Overview

**ApexCare** is designed for real-world hospital operational administration. It is **not** a generic marketing website; it is an active clinical, administrative, and resource management platform with dedicated portals for Hospital Administrators, Medical Practitioners, and Patients.

### Key Capabilities

- **Role-Based Access Portals**:
  - **Hospital Administrator / Manager**: Department configuration, physician credentialing, patient triage, resource & bed scheduling, pharmacy inventory, billing, lab orders, and compliance audit trail.
  - **Doctor / Physician Portal**: Daily appointments, patient medical records (EMR/EHR), clinical diagnosis notes, digital e-prescriptions, and diagnostic requisitions.
  - **Patient Portal**: Consultation and triage requests, appointment overview, digital prescription history, lab/radiology reports, and online billing checkout.
- **Dual-Mode Data Architecture**:
  - **Clean Slate Mode**: Ready for immediate production setup with an empty database wizard.
  - **Clinical Demo Dataset**: 1-click toggle to explore verified medical records, active inpatient cases, diagnostic reports, and operational audits.
- **Cloud Database (Supabase Free Tier)**:
  - Instant synchronization with a cloud-hosted PostgreSQL database.
  - Automatic fallback to local persistence if API credentials are not yet configured.

---

## 🗄️ Database Architecture (19 Collections)

The system includes [`supabase_schema.sql`](./supabase_schema.sql) with ready-to-run PostgreSQL definitions, indexes, and Row Level Security (RLS) policies:

1. `hms_hospital`: Organization details, emergency availability, tax rates, billing currency.
2. `hms_departments`: Clinical departments, head of department, location, doctor counts.
3. `hms_doctors`: Specialist profiles, licenses, consultation fees, shift availability.
4. `hms_patients`: Full patient registration (EMR/EHR, insurance, blood groups, allergies).
5. `hms_patient_requests`: Inbound patient consultation & triage approval queue.
6. `hms_appointments`: Scheduled appointments, consulting rooms, status tracking.
7. `hms_medical_records`: Clinical examination notes, vitals, diagnosis, follow-up plans.
8. `hms_prescriptions`: Multi-item electronic prescriptions and dosage schedules.
9. `hms_medicines`: Pharmacy formulary, batch numbers, stock thresholds, expiry alerts.
10. `hms_pharmacy_orders`: Medication dispensing orders and fulfillment status.
11. `hms_bills`: Itemized invoicing, insurance co-pay splits, simulated payment settlements.
12. `hms_rooms`: Hospital ward units, floor allocations, and capacities.
13. `hms_beds`: Bed statuses (Available, Occupied, Maintenance, Reserved) & patient assignments.
14. `hms_equipment`: Biomedical equipment tracking, serial numbers, maintenance schedules.
15. `hms_lab_tests`: Specimen collection, clinical biochemistry & hematology reports.
16. `hms_radiology_services`: X-Ray, CT, MRI imaging orders, reports, and radiologist findings.
17. `hms_staff`: Nursing, pharmacy, and billing staff rosters and duty shifts.
18. `hms_audit_logs`: Immutable security and operations audit log trail.
19. `hms_notifications`: Role-targeted operational alert system.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/GururajBhadane2/hospital-management-system.git
cd hospital-management-system

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Configure Supabase Cloud Database (Free Tier)

1. Create a free account at [supabase.com](https://supabase.com) and start a **New Project**.
2. Open the **SQL Editor** tab in your Supabase dashboard.
3. Copy the entire contents of [`supabase_schema.sql`](./supabase_schema.sql), paste into the query editor, and click **Run**.
4. In Supabase, go to **Project Settings** -> **API** and copy:
   - **Project URL**
   - **anon public API Key**
5. Create a `client/.env` file:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*(If `.env` is omitted, the platform runs in Local Storage mode automatically without crashing!)*

### 3. Run the Development Servers

```bash
# Terminal 1: Run Frontend (Vite)
cd client
npm run dev

# Terminal 2: Run Backend (Express)
cd server
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, Vanilla CSS (Glassmorphism, Dark UI, Responsive Design), Lucide Icons
- **Backend**: Node.js, Express 4, CORS
- **Database**: Supabase (PostgreSQL 15+) with Row Level Security & Realtime Replication
- **Client Sync**: `@supabase/supabase-js` with hybrid optimistic local store & cloud sync

---

## 🔒 Security & Privacy

- Client credentials stored via Vite environment variables (`.env` is git-ignored).
- Supabase Row Level Security (RLS) configured for data governance.
- Role-based authorization layers separating Manager, Doctor, and Patient access scopes.

---

## 📄 License

This project is licensed under the MIT License.