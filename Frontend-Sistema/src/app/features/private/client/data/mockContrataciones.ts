import type { Contratacion, ContratoDetalle } from "../../../../core/models/hiring.model";

export const MOCK_CLIENT_DNI = "12345678";

export const MOCK_CONTRATACIONES: Contratacion[] = [
  {
    id: "c-1",
    codigo: "CS-2024-095",
    estado: "pendiente",
    pagoEstado: "pendiente",
    pagoContrato: "pendiente",
    profesionalNombre: "Lic. Jorge Castillo",
    profesionalTitulo: "Lic.",
    especialidad: "Oncología y Cuidados Paliativos",
    profesionalIniciales: "JC",
    profesionalFotoUrl: undefined,
    paciente: "Rosa Rodríguez",
    periodoInicio: "2026-04-15",
    periodoFin: "2026-05-30",
    duracionDias: 22,
    duracionHoras: 110,
    montoTotal: 9702,
  },
  {
    id: "c-2",
    codigo: "CS-30727",
    estado: "confirmado",
    pagoEstado: "preautorizado",
    pagoContrato: "custodia",
    profesionalNombre: "Carlos Sanchez Martinez",
    especialidad: "Geriatría y Cuidado del Adulto Mayor",
    profesionalIniciales: "CM",
    paciente: "Elena Rodriguez",
    periodoInicio: "2026-05-20",
    periodoFin: "2026-05-20",
    duracionDias: 1,
    duracionHoras: 6,
    montoTotal: 318,
  },
  {
    id: "c-3",
    codigo: "SER-000034",
    codigoServicio: "SER-000034",
    codigoContrato: "CON-000034",
    estado: "en_curso",
    pagoEstado: "preautorizado",
    pagoContrato: "custodia",
    profesionalNombre: "Carlos Sanchez Martinez",
    especialidad: "Geriatría y Cuidado del Adulto Mayor",
    profesionalIniciales: "CM",
    paciente: "Elena Rodriguez",
    periodoInicio: "2026-05-27",
    periodoFin: "2026-05-27",
    duracionDias: 1,
    duracionHoras: 2,
    montoTotal: 106,
  },
  {
    id: "c-4",
    codigo: "CS-63482",
    estado: "completado",
    pagoEstado: "liberado",
    pagoContrato: "pagado",
    profesionalNombre: "Carlos Sanchez Martinez",
    especialidad: "Geriatría y Cuidado del Adulto Mayor",
    profesionalIniciales: "CM",
    paciente: "Elena Rodriguez",
    periodoInicio: "2026-05-21",
    periodoFin: "2026-05-21",
    duracionDias: 1,
    duracionHoras: 5,
    montoTotal: 100,
    calificacion: 4,
    comentarioCalificacion:
      "Llego un poco tarde pero su atencion fue de buena calidad",
  },
  {
    id: "c-5",
    codigo: "CS-51201",
    estado: "completado",
    pagoEstado: "liberado",
    pagoContrato: "pagado",
    profesionalNombre: "Lic. María Fernández",
    especialidad: "Cuidados Generales",
    profesionalIniciales: "MF",
    paciente: "Pedro Luna",
    periodoInicio: "2026-04-10",
    periodoFin: "2026-04-12",
    duracionDias: 3,
    duracionHoras: 18,
    montoTotal: 540,
    calificacion: 5,
    comentarioCalificacion: "Excelente atención y puntualidad.",
  },
  {
    id: "c-6",
    codigo: "CS-44190",
    estado: "completado",
    pagoEstado: "liberado",
    pagoContrato: "pagado",
    profesionalNombre: "Lic. Ana Torres",
    especialidad: "Pediatría",
    profesionalIniciales: "AT",
    paciente: "Sofía Mendoza",
    periodoInicio: "2026-03-01",
    periodoFin: "2026-03-05",
    duracionDias: 5,
    duracionHoras: 25,
    montoTotal: 875,
    calificacion: 3,
    comentarioCalificacion: "Buen servicio en general.",
  },
];

const TERMINOS_BASE = [
  "El profesional se compromete a brindar el servicio en las fechas y horarios acordados.",
  "El cliente garantiza un entorno seguro y las condiciones necesarias para el cuidado.",
  "Los pagos quedan en custodia de la plataforma hasta la confirmación del servicio.",
  "Cualquier modificación al contrato debe ser aprobada por ambas partes en la plataforma.",
  "La cancelación con menos de 24 horas de anticipación puede generar cargos parciales.",
  "El PIN de servicio debe ser compartido únicamente con el profesional asignado.",
  "Los datos personales se tratan conforme a la política de privacidad de Cuidame.",
];

function buildDetalle(base: Contratacion): ContratoDetalle {
  const horas = base.duracionHoras;
  const tarifa = Math.round(base.montoTotal / Math.max(horas, 1));
  return {
    ...base,
    emitidoEl: "20 de mayo de 2026",
    tipoServicio: "Especializado",
    fechaInicio: "19 de mayo de 2026",
    fechaFin: "19 de mayo de 2026",
    horario: "19:00 - 20:00",
    profesionalRol: "Enfermero Especializado",
    profesionalUbicacion: "Lince",
    pacienteEdad: "12 años",
    pacienteDireccion: "Av. Canto Grande, Miraflores",
    jornadas: [
      { fecha: "mar, 19 may.", horario: "19:00 - 20:00", estado: "pendiente" },
    ],
    terminos: TERMINOS_BASE,
    historial: [
      { titulo: "Contrato generado", fecha: "20 may. 2026, 10:15" },
      { titulo: "Enfermero aceptó la solicitud", fecha: "20 may. 2026, 11:42" },
    ],
    horasTarifa: horas,
    tarifaHora: tarifa,
    comisionPorcentaje: 10,
    clienteNombre: "Jens Jeremies Luna Levita",
    clientePlan: "Premium",
    pinServicio: "RBDC49",
  };
}

export const MOCK_CONTRATO_DETALLES: Record<string, ContratoDetalle> =
  Object.fromEntries(
    MOCK_CONTRATACIONES.filter((c) => c.estado === "confirmado").map((c) => [
      c.id,
      buildDetalle(c),
    ])
  );

export function getContratacionById(id: string): Contratacion | undefined {
  return MOCK_CONTRATACIONES.find((c) => c.id === id);
}

export function getContratoDetalle(id: string): ContratoDetalle | undefined {
  const existing = MOCK_CONTRATO_DETALLES[id];
  if (existing) return existing;
  const base = getContratacionById(id);
  if (!base || base.estado !== "confirmado") return undefined;
  const detalle = buildDetalle(base);
  MOCK_CONTRATO_DETALLES[id] = detalle;
  return detalle;
}
