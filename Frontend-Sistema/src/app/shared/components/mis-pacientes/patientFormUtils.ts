import type { Patient, PatientFormData } from "../../../core/models/patient.model";
import {
  validateAddress,
  validateAge,
  validateBloodType,
  validateDistrito,
  validateEmergencyContact,
  validateName,
  validateNotes,
  validateParentesco,
  validatePhone,
  validateReference,
} from "../../utils/validation";

export const EMPTY_PATIENT_FORM: PatientFormData = {
  nombreCompleto: "",
  edad: "",
  parentesco: "",
  tipoSangre: "",
  condicionesMedicas: [],
  medicamentos: [],
  alergias: [],
  contactoEmergencia: "",
  telefonoEmergencia: "",
  direccion: "",
  distrito: "",
  referencia: "",
  notasCuidado: "",
};

export const PARENTESCO_OPTIONS = [
  "Madre",
  "Padre",
  "Esposo/a",
  "Hijo/a",
  "Hermano/a",
  "Abuelo/a",
  "Otro",
];

export const BLOOD_TYPE_OPTIONS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const DISTRITOS_PACIENTE = [
  "Miraflores",
  "San Isidro",
  "Surco",
  "San Borja",
  "La Molina",
  "Pueblo Libre",
  "Lince",
  "Barranco",
];

export function patientToForm(patient: Patient): PatientFormData {
  return {
    nombreCompleto: patient.nombreCompleto,
    edad: String(patient.edad),
    parentesco: patient.parentesco,
    tipoSangre: patient.tipoSangre,
    condicionesMedicas: [...patient.condicionesMedicas],
    medicamentos: [...patient.medicamentos],
    alergias: [...patient.alergias],
    contactoEmergencia: patient.contactoEmergencia,
    telefonoEmergencia: patient.telefonoEmergencia,
    direccion: patient.direccion,
    distrito: patient.distrito,
    referencia: patient.referencia,
    notasCuidado: patient.notasCuidado,
  };
}

export function validatePatientForm(form: PatientFormData): {
  errors: Record<string, string>;
  data: Omit<Patient, "id" | "fotoUrl"> | null;
} {
  const errors: Record<string, string> = {};

  const nombreErr = validateName(form.nombreCompleto, "Nombre completo");
  const edadErr = validateAge(form.edad);
  const parentescoErr = validateParentesco(form.parentesco);
  const sangreErr = validateBloodType(form.tipoSangre);
  const contactoErr = validateEmergencyContact(form.contactoEmergencia);
  const telErr = validatePhone(form.telefonoEmergencia);
  const dirErr = validateAddress(form.direccion);
  const distritoErr = validateDistrito(form.distrito);
  const refErr = validateReference(form.referencia);
  const notasErr = validateNotes(form.notasCuidado);

  if (nombreErr) errors.nombreCompleto = nombreErr;
  if (edadErr) errors.edad = edadErr;
  if (parentescoErr) errors.parentesco = parentescoErr;
  if (sangreErr) errors.tipoSangre = sangreErr;
  if (contactoErr) errors.contactoEmergencia = contactoErr;
  if (telErr) errors.telefonoEmergencia = telErr;
  if (dirErr) errors.direccion = dirErr;
  if (distritoErr) errors.distrito = distritoErr;
  if (refErr) errors.referencia = refErr;
  if (notasErr) errors.notasCuidado = notasErr;

  if (Object.keys(errors).length > 0) {
    return { errors, data: null };
  }

  return {
    errors: {},
    data: {
      nombreCompleto: form.nombreCompleto.trim(),
      edad: Number(form.edad),
      parentesco: form.parentesco.trim(),
      tipoSangre: form.tipoSangre.trim(),
      condicionesMedicas: form.condicionesMedicas,
      medicamentos: form.medicamentos,
      alergias: form.alergias,
      contactoEmergencia: form.contactoEmergencia.trim(),
      telefonoEmergencia: form.telefonoEmergencia.replace(/\D/g, ""),
      direccion: form.direccion.trim(),
      distrito: form.distrito.trim(),
      referencia: form.referencia.trim(),
      notasCuidado: form.notasCuidado.trim(),
    },
  };
}
