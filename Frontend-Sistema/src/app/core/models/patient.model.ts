/** Paciente del cliente (molde listo para API). */
export type Patient = {
  id: string;
  nombreCompleto: string;
  edad: number;
  parentesco: string;
  tipoSangre: string;
  fotoUrl?: string;
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
