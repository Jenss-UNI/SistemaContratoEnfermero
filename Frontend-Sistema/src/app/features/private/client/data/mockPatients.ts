import type { Patient } from "../../../../core/models/patient.model";

/** Datos de prueba — reemplazar por respuesta del backend. */
export const MOCK_PATIENTS: Patient[] = [
  {
    id: "p-1",
    nombreCompleto: "Elena Rodríguez",
    edad: 78,
    parentesco: "Madre",
    tipoSangre: "O+",
    fotoUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
    condicionesMedicas: [
      "Artrosis de cadera",
      "Hipertensión arterial",
      "Diabetes tipo 2",
    ],
    medicamentos: ["Metformina 850mg", "Losartán 50mg", "Calcio + Vitamina D"],
    alergias: ["Penicilina", "Ibuprofeno"],
    contactoEmergencia: "Dr. Ramírez",
    telefonoEmergencia: "987654321",
    direccion: "Av. Larco 1234, Dpto 502",
    distrito: "Miraflores",
    referencia: "Frente al Parque Kennedy, edificio beige",
    notasCuidado:
      "Requiere asistencia para movilización. Dieta baja en sodio y azúcar. Control glucémico diario.",
  },
  {
    id: "p-2",
    nombreCompleto: "Mateo Rodríguez",
    edad: 6,
    parentesco: "Hijo",
    tipoSangre: "A+",
    fotoUrl:
      "https://images.unsplash.com/photo-1503454537845-cef8a998a013?w=120&h=120&fit=crop&crop=face",
    condicionesMedicas: ["Asma leve", "Rinitis alérgica"],
    medicamentos: ["Salbutamol inhalador", "Loratadina 5mg"],
    alergias: ["Polen", "Ácaros"],
    contactoEmergencia: "Carmen Rodríguez",
    telefonoEmergencia: "987123456",
    direccion: "Av. Larco 1234, Dpto 502",
    distrito: "Miraflores",
    referencia: "Frente al Parque Kennedy, edificio beige",
    notasCuidado:
      "Evitar exposición a polvo. Mantener inhalador accesible. Supervisión en actividades al aire libre.",
  },
];
