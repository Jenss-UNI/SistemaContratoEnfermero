export type ContratacionEstado = "pendiente" | "confirmado" | "activo" | "completado";

export type PagoEstado = "pendiente" | "preautorizado" | "liberado";

export type PagoContratoEstado = "pendiente" | "pagado" | "custodia";

export type ContratacionFiltro = "todos" | ContratacionEstado;

export type BusquedaCampo = "todo" | "enfermero" | "paciente" | "codigo";

export type Contratacion = {
  id: string;
  codigo: string;
  codigoServicio?: string;
  codigoContrato?: string;
  estado: ContratacionEstado;
  pagoEstado: PagoEstado;
  pagoContrato: PagoContratoEstado;
  profesionalNombre: string;
  profesionalTitulo?: string;
  especialidad: string;
  profesionalIniciales: string;
  profesionalFotoUrl?: string;
  paciente: string;
  periodoInicio: string;
  periodoFin: string;
  duracionDias: number;
  duracionHoras: number;
  montoTotal: number;
  calificacion?: number;
  comentarioCalificacion?: string;
};

export type JornadaProgramada = {
  fecha: string;
  horario: string;
  estado: "pendiente" | "completada" | "cancelada";
};

export type HistorialContratoItem = {
  titulo: string;
  fecha: string;
};

export type ContratoDetalle = Contratacion & {
  emitidoEl: string;
  tipoServicio: string;
  fechaInicio: string;
  fechaFin: string;
  horario: string;
  profesionalRol: string;
  profesionalUbicacion: string;
  pacienteEdad: string;
  pacienteDireccion: string;
  jornadas: JornadaProgramada[];
  terminos: string[];
  historial: HistorialContratoItem[];
  horasTarifa: number;
  tarifaHora: number;
  comisionPorcentaje: number;
  clienteNombre: string;
  clientePlan: string;
  clienteDni?: string;
  pinServicio: string;
  firma?: {
    signature_url: string;
    signed_at: string;
    dni: string;
    ip_address?: string;
  } | null;
};
