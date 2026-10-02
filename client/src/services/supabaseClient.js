import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('...') &&
    supabaseAnonKey.length > 20
  );
};

// Singleton client instance or null if not configured
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Table name mappings to state properties
export const TABLE_MAP = {
  hospital: 'hms_hospital',
  departments: 'hms_departments',
  doctors: 'hms_doctors',
  patients: 'hms_patients',
  patientRequests: 'hms_patient_requests',
  appointments: 'hms_appointments',
  medicalRecords: 'hms_medical_records',
  prescriptions: 'hms_prescriptions',
  medicines: 'hms_medicines',
  pharmacyOrders: 'hms_pharmacy_orders',
  bills: 'hms_bills',
  rooms: 'hms_rooms',
  beds: 'hms_beds',
  equipment: 'hms_equipment',
  labTests: 'hms_lab_tests',
  radiologyServices: 'hms_radiology_services',
  staff: 'hms_staff',
  auditLogs: 'hms_audit_logs',
  notifications: 'hms_notifications'
};

/**
 * Transforms an entity object into a Supabase record row
 */
export function entityToRow(tableName, entity) {
  if (tableName === 'hms_hospital') {
    return {
      id: 'hospital_config',
      name: entity.name || '',
      tagline: entity.tagline || '',
      registration_number: entity.registrationNumber || '',
      address: entity.address || '',
      city: entity.city || '',
      state: entity.state || '',
      postal_code: entity.postalCode || '',
      phone: entity.phone || '',
      emergency_phone: entity.emergencyPhone || '',
      email: entity.email || '',
      website: entity.website || '',
      working_hours: entity.workingHours || '24/7 Emergency Care',
      emergency_availability: entity.emergencyAvailability !== false,
      billing_currency: entity.billingCurrency || 'USD ($)',
      tax_rate: Number(entity.taxRate) || 0,
      pharmacy_license: entity.pharmacyLicense || '',
      is_configured: Boolean(entity.isConfigured),
      raw_data: entity,
      updated_at: new Date().toISOString()
    };
  }

  // Generic entity row mapping with raw_data preservation
  const row = {
    id: entity.id || String(Date.now()),
    raw_data: entity,
    updated_at: new Date().toISOString()
  };

  // Add specific indexed columns if available
  if (entity.name) row.name = entity.name;
  if (entity.status) row.status = entity.status;
  if (entity.department) row.department = entity.department;
  if (entity.specialization) row.specialization = entity.specialization;
  if (entity.patientId) row.patient_id = entity.patientId;
  if (entity.patientName) row.patient_name = entity.patientName;
  if (entity.doctorId) row.doctor_id = entity.doctorId;
  if (entity.doctorName) row.doctor_name = entity.doctorName;
  if (entity.date) row.date = entity.date;
  if (entity.time) row.time = entity.time;
  if (entity.type) row.type = entity.type;
  if (entity.role) row.role = entity.role;
  if (entity.totalAmount !== undefined) row.total_amount = entity.totalAmount;
  if (entity.stockQuantity !== undefined) row.stock_quantity = entity.stockQuantity;
  if (entity.unitPrice !== undefined) row.unit_price = entity.unitPrice;

  return row;
}

/**
 * Hydrates state from Supabase tables
 */
export async function fetchAllHospitalData() {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const results = {};
    const fetchPromises = Object.entries(TABLE_MAP).map(async ([stateKey, tableName]) => {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.warn(`[Supabase] Table ${tableName} query notice:`, error.message);
        return { stateKey, data: null };
      }
      return { stateKey, data };
    });

    const settled = await Promise.all(fetchPromises);

    let hasAnyData = false;
    for (const { stateKey, data } of settled) {
      if (data && data.length > 0) {
        hasAnyData = true;
        if (stateKey === 'hospital') {
          // Single object
          const firstRow = data[0];
          results.hospital = firstRow.raw_data || {
            isConfigured: firstRow.is_configured,
            name: firstRow.name,
            tagline: firstRow.tagline,
            registrationNumber: firstRow.registration_number,
            address: firstRow.address,
            city: firstRow.city,
            state: firstRow.state,
            postalCode: firstRow.postal_code,
            phone: firstRow.phone,
            emergencyPhone: firstRow.emergency_phone,
            email: firstRow.email,
            website: firstRow.website,
            workingHours: firstRow.working_hours,
            emergencyAvailability: firstRow.emergency_availability,
            billingCurrency: firstRow.billing_currency,
            taxRate: firstRow.tax_rate,
            pharmacyLicense: firstRow.pharmacy_license
          };
        } else {
          // Array of objects
          results[stateKey] = data.map(item => item.raw_data || item);
        }
      }
    }

    if (!hasAnyData) {
      return null; // Empty tables
    }

    return results;
  } catch (err) {
    console.error('[Supabase] Failed to fetch data from cloud:', err);
    return null;
  }
}

/**
 * Upsert an item into Supabase asynchronously
 */
export async function syncEntityToSupabase(stateKey, entity) {
  if (!isSupabaseConfigured() || !supabase || !entity) return;

  const tableName = TABLE_MAP[stateKey];
  if (!tableName) return;

  try {
    const row = entityToRow(tableName, entity);
    const { error } = await supabase.from(tableName).upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn(`[Supabase Sync] Upsert failed for ${tableName}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase Sync Error] ${tableName}:`, err);
  }
}

/**
 * Delete an item from Supabase
 */
export async function deleteEntityFromSupabase(stateKey, id) {
  if (!isSupabaseConfigured() || !supabase || !id) return;

  const tableName = TABLE_MAP[stateKey];
  if (!tableName) return;

  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      console.warn(`[Supabase Sync] Delete failed for ${tableName}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase Sync Error] ${tableName}:`, err);
  }
}

/**
 * Bulk sync all collections to Supabase (e.g. when seeding or initializing)
 */
export async function syncAllStateToSupabase(state) {
  if (!isSupabaseConfigured() || !supabase || !state) return false;

  try {
    console.info('[Supabase] Beginning full state upload...');

    // 1. Sync Hospital Config
    if (state.hospital) {
      const configRow = entityToRow('hms_hospital', state.hospital);
      await supabase.from('hms_hospital').upsert(configRow, { onConflict: 'id' });
    }

    // 2. Sync all other array collections
    const arrayKeys = Object.keys(TABLE_MAP).filter(k => k !== 'hospital');
    for (const key of arrayKeys) {
      const items = state[key];
      const tableName = TABLE_MAP[key];
      if (Array.isArray(items) && items.length > 0 && tableName) {
        const rows = items.map(item => entityToRow(tableName, item));
        const { error } = await supabase.from(tableName).upsert(rows, { onConflict: 'id' });
        if (error) {
          console.warn(`[Supabase] Batch upsert warning on ${tableName}:`, error.message);
        }
      }
    }

    console.info('[Supabase] Full state successfully uploaded to cloud database.');
    return true;
  } catch (err) {
    console.error('[Supabase] Full state sync failed:', err);
    return false;
  }
}
