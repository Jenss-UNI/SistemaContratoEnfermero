import type { Patient, PatientFormData } from "../../../../core/models/patient.model";
import {
  validateAge,
  validateBloodType,
  validateDistrito,
  validateEmergencyContact,
  validateName,
  validateNotes,
  validateParentesco,
  validatePhone,
} from "../../../utils/validation";

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
  distrito: "",
  googleMapsUrl: "",
  notasCuidado: "",
  fotoUrl: undefined,
};

export const PARENTESCO_OPTIONS = [
  "Yo mismo",
  "Madre",
  "Padre",
  "Hijo",
  "Hija",
  "Cónyuge",
  "Abuelo",
  "Abuela",
  "Hermano",
  "Hermana",
  "Otro",
];

export const BLOOD_TYPE_OPTIONS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const DISTRITOS_PACIENTE = [
  "Ancón",
  "Ate",
  "Barranco",
  "Breña",
  "Carabayllo",
  "Chaclacayo",
  "Chorrillos",
  "Cieneguilla",
  "Comas",
  "El Agustino",
  "Independencia",
  "Jesús María",
  "La Molina",
  "La Victoria",
  "Lima",
  "Lince",
  "Los Olivos",
  "Lurigancho",
  "Lurín",
  "Magdalena del Mar",
  "Miraflores",
  "Pachacámac",
  "Pucusana",
  "Pueblo Libre",
  "Puente Piedra",
  "Punta Hermosa",
  "Punta Negra",
  "Rímac",
  "San Bartolo",
  "San Borja",
  "San Isidro",
  "San Juan de Lurigancho",
  "San Juan de Miraflores",
  "San Luis",
  "San Martín de Porres",
  "San Miguel",
  "Santa Anita",
  "Santa María del Mar",
  "Santa Rosa",
  "Santiago de Surco",
  "Surquillo",
  "Villa El Salvador",
  "Villa María del Triunfo"
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
    distrito: patient.distrito,
    googleMapsUrl: patient.googleMapsUrl || "",
    notasCuidado: patient.notasCuidado,
    fotoUrl: patient.fotoUrl,
  };
}

export function validatePatientForm(form: PatientFormData): {
  errors: Record<string, string>;
  data: Omit<Patient, "id" | "clientId" | "fotoUrl"> | null;
} {
  const errors: Record<string, string> = {};

  const nombreErr = validateName(form.nombreCompleto, "Nombre completo");
  const edadErr = validateAge(form.edad);
  const parentescoErr = validateParentesco(form.parentesco);
  const sangreErr = validateBloodType(form.tipoSangre);
  const contactoErr = validateEmergencyContact(form.contactoEmergencia);
  const telErr = validatePhone(form.telefonoEmergencia);
  const distritoErr = validateDistrito(form.distrito);
  const notasErr = validateNotes(form.notasCuidado);

  if (nombreErr) errors.nombreCompleto = nombreErr;
  if (edadErr) errors.edad = edadErr;
  if (parentescoErr) errors.parentesco = parentescoErr;
  if (sangreErr) errors.tipoSangre = sangreErr;
  if (contactoErr) errors.contactoEmergencia = contactoErr;
  if (telErr) errors.telefonoEmergencia = telErr;
  if (distritoErr) errors.distrito = distritoErr;
  if (notasErr) errors.notasCuidado = notasErr;

  const url = form.googleMapsUrl.trim();
  if (!url) {
    errors.googleMapsUrl = "Link de Google Maps obligatorio";
  } else if (!/^https?:\/\//i.test(url)) {
    errors.googleMapsUrl = "El link debe comenzar con http:// o https://";
  }

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
      distrito: form.distrito.trim(),
      googleMapsUrl: url,
      notasCuidado: form.notasCuidado.trim(),
    },
  };
}
