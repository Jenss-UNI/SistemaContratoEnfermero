import { useEffect, useMemo, useState } from "react";
import { User, Tag, Flag, Clock, Search, CheckCheck, Check, RefreshCw } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

type Severity = "Alta" | "Media" | "Baja";
type Status = "Resuelto" | "Abierto" | "En revisión";

type Report = {
  id: string;
  title: string;
  authorType: string;
  targetType: string;
  severity: Severity;
  status: Status;
  date: string;
  shortDate: string;
  description: string;
  currentResponse: string | null;
};

const INITIAL_REPORTS: Report[] = [
  {
    id: "1",
    title: "Prueba",
    authorType: "Enfermero",
    targetType: "condiciones",
    severity: "Alta",
    status: "Abierto",
    date: "24 de junio de 2026",
    shortDate: "24-jun.",
    description: "Prueba",
    currentResponse: null,
  },
  {
    id: "2",
    title: "jghbvd",
    authorType: "Enfermero",
    targetType: "condiciones",
    severity: "Alta",
    status: "Abierto",
    date: "20 de junio de 2026",
    shortDate: "20-jun.",
    description: "Detalle del reporte jghbvd...",
    currentResponse: null,
  },
  {
    id: "3",
    title: "enfermero llego tarde",
    authorType: "Cliente",
    targetType: "enfermero",
    severity: "Media",
    status: "Abierto",
    date: "12 de junio de 2026",
    shortDate: "12-jun.",
    description: "El enfermero llegó 30 minutos tarde a la cita programada.",
    currentResponse: null,
  },
];

const FILTERS = ["Todos", "Abiertos", "En revisión", "Resueltos"] as const;

const FILTER_STATUS_MAP: Record<(typeof FILTERS)[number], Status | null> = {
  Todos: null,
  Abiertos: "Abierto",
  "En revisión": "En revisión",
  Resueltos: "Resuelto",
};

const severityStyle: Record<Severity, { bg: string; dot: string; text: string }> = {
  Alta: { bg: "bg-rose-50", dot: "bg-rose-500", text: "text-rose-600" },
  Media: { bg: "bg-amber-50", dot: "bg-amber-500", text: "text-amber-600" },
  Baja: { bg: "bg-slate-50", dot: "bg-slate-500", text: "text-slate-600" },
};

const statusStyle: Record<Status, string> = {
  Resuelto: "bg-[#ccfbf1] text-[#0db39e]",
  Abierto: "bg-[#e5f9f4] text-[#0db39e]",
  "En revisión": "bg-[#fffbeb] text-[#d97706]",
};

export default function ReportesPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [responseText, setResponseText] = useState("");
  
  // Usamos "Update" como un estado pendiente adicional para el modal de actualización
  const [pendingAction, setPendingAction] = useState<Status | "Update" | null>(null);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const status = FILTER_STATUS_MAP[activeFilter];
        return status === null || report.status === status;
      }),
    [activeFilter, reports]
  );

  useEffect(() => {
    if (filteredReports.length > 0 && !filteredReports.some((r) => r.id === selectedReportId)) {
      setSelectedReportId(filteredReports[0].id);
    } else if (filteredReports.length === 0) {
      setSelectedReportId("");
    }
  }, [filteredReports, selectedReportId]);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || null;

  useEffect(() => {
    setResponseText(selectedReport?.currentResponse || "");
  }, [selectedReportId]);

  const handleConfirmAction = () => {
    if (!selectedReport || !pendingAction) return;

    setReports((prev) =>
      prev.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              // Si la acción es Update, conservamos el estado actual
              status: pendingAction === "Update" ? report.status : pendingAction,
              currentResponse: responseText.trim() || report.currentResponse,
            }
          : report
      )
    );
    setPendingAction(null);
  };

  // Función auxiliar para renderizar el badge de estado con su icono condicional
  const renderStatusBadge = (status: Status, isSmall = false) => {
    const baseStyle = statusStyle[status];
    const iconSize = isSmall ? "h-3 w-3" : "h-3.5 w-3.5";
    const textSize = isSmall ? "text-[10px]" : "text-[11px]";

    return (
      <span className={`inline-flex items-center gap-1 flex-shrink-0 rounded-full px-2.5 py-1 ${textSize} font-bold ${baseStyle}`}>
        {status === "Resuelto" && <Check className={iconSize} strokeWidth={3} />}
        {status}
      </span>
    );
  };

  const countOpen = reports.filter((r) => r.status === "Abierto").length;
  const countReview = reports.filter((r) => r.status === "En revisión").length;
  const countResolved = reports.filter((r) => r.status === "Resuelto").length;

  return (
    <div className="w-full space-y-6">
      
      {/* CABECERA Y MÉTRICAS SUPERIORES */}
      <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-400">
            <Flag className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Gestión de Reportes</h1>
            <p className="text-sm font-medium text-slate-500">
              Revisa y responde los reportes de clientes y enfermeros
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#f0fdfa] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0db39e] shadow-sm">
              <Clock className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{countOpen}</p>
              <p className="text-sm font-medium text-slate-500">Abiertos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#fffbeb] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#d97706] shadow-sm">
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{countReview}</p>
              <p className="text-sm font-medium text-slate-500">En revisión</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#f0fdfa] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0db39e] shadow-sm">
              <CheckCheck className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{countResolved}</p>
              <p className="text-sm font-medium text-slate-500">Resueltos</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENEDOR MAESTRO-DETALLE ALINEADO CON GRID-ROWS */}
      <div className="flex flex-col gap-y-5 gap-x-6 lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
        
        {/* --- FILTROS FLOTANTES (Fila 1, Columna 1) --- */}
        <div className="flex flex-wrap items-center gap-3 overflow-x-auto whitespace-nowrap lg:col-start-1 lg:row-start-1">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === filter
                  ? "border-transparent bg-[#0db39e] text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* --- COLUMNA IZQUIERDA: LISTA DE REPORTES (Fila 2, Columna 1) --- */}
        <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => {
              const isSelected = selectedReportId === report.id;
              const sevStyle = severityStyle[report.severity];

              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`flex flex-col gap-3 rounded-[1.75rem] border p-5 text-left transition-all ${
                    isSelected
                      ? "border-[#0db39e] bg-[#ecfdf5] shadow-[0_12px_35px_-22px_rgba(13,179,158,0.55)]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 w-full">
                    <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{report.title}</h3>
                    {renderStatusBadge(report.status, true)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white border border-slate-100 px-3 py-1 text-sm font-medium text-slate-500 shadow-sm">
                      {report.targetType}
                    </span>
                    <span className="rounded-full bg-white border border-slate-100 px-3 py-1 text-sm font-medium text-slate-500 shadow-sm">
                      {report.authorType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full gap-3 mt-1">
                    <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${sevStyle.bg} ${sevStyle.text}`}>
                      <span className={`h-2 w-2 rounded-full ${sevStyle.dot}`}></span>
                      {report.severity}
                    </div>
                    <span className="text-sm font-semibold text-slate-400">{report.shortDate}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm font-medium text-slate-400 border border-slate-100 rounded-2xl bg-white">
              No hay reportes en esta categoría.
            </div>
          )}
        </div>

        {/* --- COLUMNA DERECHA: DETALLE DEL REPORTE (Fila 2, Columna 2) --- */}
        <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8 lg:col-start-2 lg:row-start-2">
          {selectedReport ? (
            <div className="flex flex-col h-full">
              
              {/* Cabecera del Detalle */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">{selectedReport.title}</h2>
                {renderStatusBadge(selectedReport.status)}
              </div>

              {/* Metadatos del Detalle */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{selectedReport.targetType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  <span>{selectedReport.authorType}</span>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${severityStyle[selectedReport.severity].bg} ${severityStyle[selectedReport.severity].text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${severityStyle[selectedReport.severity].dot}`}></span>
                  {selectedReport.severity}
                </div>
                <span className="text-slate-500">{selectedReport.date}</span>
              </div>

              <div className="mt-8 flex-1 space-y-6">
                
                {/* Descripción del Reporte */}
                <div>
                  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Descripción del reporte</h3>
                  <div className="rounded-2xl border border-slate-100 bg-[#fafafa] p-5 text-[14px] text-slate-700">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Área de Respuesta del Administrador */}
                <div>
                  <h3 className="mb-3 text-[13px] font-bold text-slate-900">Respuesta del administrador</h3>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Escribe tu respuesta al reporte..."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-[14px] text-slate-700 outline-none transition focus:border-[#0db39e]"
                  />
                </div>

                {/* Botones de Acción Condicionales */}
                <div className="flex flex-col gap-4 sm:flex-row pt-4">
                  {selectedReport.status === "Resuelto" ? (
                    <button
                      type="button"
                      onClick={() => setPendingAction("Update")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0db39e] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#0a8e7c]"
                    >
                      <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                      Actualizar respuesta
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setPendingAction("En revisión")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f59e0b] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#d97706]"
                      >
                        <Search className="h-4 w-4" strokeWidth={2.5} />
                        Poner En Revisión
                      </button>

                      <button
                        type="button"
                        onClick={() => setPendingAction("Resuelto")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0db39e] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#0a8e7c]"
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                        Marcar Resuelto
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <Flag className="h-8 w-8" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Selecciona un reporte</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 max-w-[250px]">
                Elige un reporte de la lista para revisar sus detalles y responder
              </p>
            </div>
          )}
        </section>

      </div>

      {/* Modal Unificado para Cambio de Estado y Actualización */}
      {pendingAction && selectedReport && (
        <Modal
          title={
            pendingAction === "Resuelto" ? "Marcar como Resuelto" :
            pendingAction === "En revisión" ? "Poner en Revisión" :
            "Actualizar Respuesta"
          }
          onClose={() => setPendingAction(null)}
          maxWidthClass="max-w-md"
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setPendingAction(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAction}
                className={`rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition ${
                  pendingAction === "Resuelto" || pendingAction === "Update"
                    ? "bg-[#0db39e] hover:bg-[#0a8e7c]"
                    : "bg-[#f59e0b] hover:bg-[#d97706]"
                }`}
              >
                Confirmar
              </button>
            </div>
          }
        >
          <div className="space-y-4 p-2">
            <p className="text-[14px] font-medium text-slate-600">
              {pendingAction === "Update" ? (
                <>
                  ¿Estás seguro de que deseas actualizar la respuesta para el reporte <span className="font-bold text-slate-900">"{selectedReport.title}"</span>?
                </>
              ) : (
                <>
                  ¿Estás seguro de que deseas cambiar el estado del reporte <span className="font-bold text-slate-900">"{selectedReport.title}"</span> a <span className="font-bold text-slate-900">"{pendingAction}"</span>?
                </>
              )}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}