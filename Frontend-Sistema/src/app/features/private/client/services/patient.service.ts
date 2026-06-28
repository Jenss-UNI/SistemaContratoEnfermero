import { supabase } from "../../../../core/services/supabase";
import type { Patient } from "../../../../core/models/patient.model";

// ---------------------------------------------------------------------------
// Obtener todos los familiares de un cliente
// ---------------------------------------------------------------------------
export async function fetchPatients(clientId: string): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("patients")
    .select(`
      id,
      client_id,
      full_name,
      age,
      photo_url,
      relationship,
      blood_type,
      emergency_contact,
      emergency_phone,
      notes,
      district,
      google_maps_url,
      lat,
      lng,
      patient_conditions ( condition ),
      patient_medications ( medication ),
      patient_allergies ( allergy )
    `)
    .eq("client_id", clientId);

  if (error) throw error;
  if (!data) return [];

  return data.map((p: any) => ({
    id: p.id,
    clientId: p.client_id,
    nombreCompleto: p.full_name,
    edad: p.age,
    parentesco: p.relationship,
    tipoSangre: p.blood_type || "",
    fotoUrl: p.photo_url || undefined,
    condicionesMedicas: p.patient_conditions?.map((c: any) => c.condition) || [],
    medicamentos: p.patient_medications?.map((m: any) => m.medication) || [],
    alergias: p.patient_allergies?.map((a: any) => a.allergy) || [],
    contactoEmergencia: p.emergency_contact || "",
    telefonoEmergencia: p.emergency_phone || "",
    distrito: p.district || "",
    googleMapsUrl: p.google_maps_url || "",
    notasCuidado: p.notes || "",
  }));
}

// ---------------------------------------------------------------------------
// Insertar un nuevo familiar con sus condiciones/medicamentos/alergias
// ---------------------------------------------------------------------------
export async function insertPatient(
  clientId: string,
  patient: Omit<Patient, "id" | "clientId">
): Promise<Patient> {
  // 1. Insertar el registro principal en patients
  const { data: patientData, error: patientError } = await supabase
    .from("patients")
    .insert({
      client_id: clientId,
      full_name: patient.nombreCompleto,
      age: patient.edad,
      relationship: patient.parentesco,
      blood_type: patient.tipoSangre || null,
      emergency_contact: patient.contactoEmergencia || null,
      emergency_phone: patient.telefonoEmergencia || null,
      notes: patient.notasCuidado || null,
      address: null,
      district: patient.distrito || null,
      address_reference: null,
      google_maps_url: patient.googleMapsUrl || null,
      photo_url: patient.fotoUrl || null,
    })
    .select()
    .single();

  if (patientError) throw patientError;
  const newPatientId = patientData.id;

  // 2. Insertar condiciones, medicamentos y alergias en paralelo
  const inserts = [];

  if (patient.condicionesMedicas?.length > 0) {
    inserts.push(
      supabase
        .from("patient_conditions")
        .insert(patient.condicionesMedicas.map((c) => ({ patient_id: newPatientId, condition: c })))
    );
  }

  if (patient.medicamentos?.length > 0) {
    inserts.push(
      supabase
        .from("patient_medications")
        .insert(patient.medicamentos.map((m) => ({ patient_id: newPatientId, medication: m })))
    );
  }

  if (patient.alergias?.length > 0) {
    inserts.push(
      supabase
        .from("patient_allergies")
        .insert(patient.alergias.map((a) => ({ patient_id: newPatientId, allergy: a })))
    );
  }

  if (inserts.length > 0) {
    const results = await Promise.all(inserts);
    const firstErr = results.find((r) => r.error)?.error;
    if (firstErr) throw firstErr;
  }

  return {
    ...patient,
    id: newPatientId,
    clientId,
  };
}

// ---------------------------------------------------------------------------
// Actualizar familiar existente y sus subtablas
// ---------------------------------------------------------------------------
export async function updatePatient(
  patientId: string,
  patient: Omit<Patient, "id" | "clientId">
): Promise<void> {
  // 1. Actualizar el registro principal en patients
  const { error: patientError } = await supabase
    .from("patients")
    .update({
      full_name: patient.nombreCompleto,
      age: patient.edad,
      relationship: patient.parentesco,
      blood_type: patient.tipoSangre || null,
      emergency_contact: patient.contactoEmergencia || null,
      emergency_phone: patient.telefonoEmergencia || null,
      notes: patient.notasCuidado || null,
      address: null,
      district: patient.distrito || null,
      address_reference: null,
      google_maps_url: patient.googleMapsUrl || null,
      photo_url: patient.fotoUrl || null,
    })
    .eq("id", patientId);

  if (patientError) throw patientError;

  // 2. Limpiar registros anteriores de las subtablas
  const deletes = [
    supabase.from("patient_conditions").delete().eq("patient_id", patientId),
    supabase.from("patient_medications").delete().eq("patient_id", patientId),
    supabase.from("patient_allergies").delete().eq("patient_id", patientId),
  ];
  await Promise.all(deletes);

  // 3. Insertar los nuevos registros en paralelo
  const inserts = [];

  if (patient.condicionesMedicas?.length > 0) {
    inserts.push(
      supabase
        .from("patient_conditions")
        .insert(patient.condicionesMedicas.map((c) => ({ patient_id: patientId, condition: c })))
    );
  }

  if (patient.medicamentos?.length > 0) {
    inserts.push(
      supabase
        .from("patient_medications")
        .insert(patient.medicamentos.map((m) => ({ patient_id: patientId, medication: m })))
    );
  }

  if (patient.alergias?.length > 0) {
    inserts.push(
      supabase
        .from("patient_allergies")
        .insert(patient.alergias.map((a) => ({ patient_id: patientId, allergy: a })))
    );
  }

  if (inserts.length > 0) {
    const results = await Promise.all(inserts);
    const firstErr = results.find((r) => r.error)?.error;
    if (firstErr) throw firstErr;
  }
}

// ---------------------------------------------------------------------------
// Eliminar un familiar (ON DELETE CASCADE eliminará automáticamente las subtablas)
// ---------------------------------------------------------------------------
export async function deletePatient(patientId: string): Promise<void> {
  const { error } = await supabase
    .from("patients")
    .delete()
    .eq("id", patientId);

  if (error) throw error;
}
