/** Paciente del cliente — alineado con tabla public.patients + tablas auxiliares. */
export type Patient = {
  id: string;
  clientId: string;
  nombreCompleto: string;   // full_name
  edad: number;             // age
  parentesco: string;       // relationship
  tipoSangre: string;      // blood_type
  fotoUrl?: string;         // photo_url
  condicionesMedicas: string[];  // patient_conditions
  medicamentos: string[];        // patient_medications
  alergias: string[];            // patient_allergies
  contactoEmergencia: string;    // emergency_contact
  telefonoEmergencia: string;    // emergency_phone
  distrito: string;              // district
  googleMapsUrl: string;         // google_maps_url
  notasCuidado: string;          // notes
};

export type PatientFormData = {
  nombreCompleto: string;
  edad: string;
  parentesco: string;
  tipoSangre: string;
  condicionesMedicas: string[];
  medicamentos: string[];
  alergias: string[];
  contactoEmergencia: string;
  telefonoEmergencia: string;
  distrito: string;
  googleMapsUrl: string;
  notasCuidado: string;
  fotoUrl?: string;
  photoFile?: File | null;
};
