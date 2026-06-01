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
  direccion: string;             // address
  distrito: string;              // district
  referencia: string;            // address_reference
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
  direccion: string;
  distrito: string;
  referencia: string;
  notasCuidado: string;
};
