import { useEffect, useMemo, useState } from "react";
import { User, Tag } from "lucide-react";

type Severity = "alta" | "media" | "baja";
type Status = "Resuelto" | "Abierto" | "En revisión";

type Report = {
  id: string;
  title: string;
  authorType: string;
  targetType: string;
  severity: Severity;
  status: Status;
  date: string;
  description: string;
  currentResponse: string | null;
};

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Enfermero llegó tarde",
    authorType: "enfermero",
    targetType: "cliente",
    severity: "alta",
    status: "Resuelto",
    date: "22/5/2026",
    description: "Llegó 30 min tarde sin justificación.",
    currentResponse: "Su reporte fue revisado.",
  },
  {
    id: "2",
    title: "Problema en condiciones de trabajo",
    authorType: "cliente",
    targetType: "enfermero",
    severity: "media",
    status: "Abierto",
    date: "22/5/2026",
    description: "Las condiciones de trabajo no fueron las acordadas previamente.",
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

const severityStyle: Record<Severity, string> = {
  alta: "bg-[#ffe4e6] text-[#e11d48]",
  media: "bg-[#fef3c7] text-[#d97706]",
  baja: "bg-slate-100 text-slate-600",
};

const statusStyle: Record<Status, string> = {
  Resuelto: "bg-[#d1f4eb] text-[#0db39e]",
  Abierto: "bg-[#dbeafe] text-[#2563eb]",
  "En revisión": "bg-[#fef3c7] text-[#d97706]",
};

export default function ReportesPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const [selectedReportId, setSelectedReportId] = useState(MOCK_REPORTS[0]?.id ?? "");
  const [responseText, setResponseText] = useState("");
  const [reportResponses, setReportResponses] = useState<Record<string, string>>({});

  const filteredReports = useMemo(
    () =>
      MOCK_REPORTS.filter((report) => {
        const status = FILTER_STATUS_MAP[activeFilter];
        return status === null || report.status === status;
      }),
    [activeFilter]
  );

  useEffect(() => {
    if (!filteredReports.some((report) => report.id === selectedReportId)) {
      setSelectedReportId(filteredReports[0]?.id ?? "");
    }
  }, [filteredReports, selectedReportId]);

  const selectedReport = filteredReports.find((r) => r.id === selectedReportId) || filteredReports[0] || null;
  const currentResponse = selectedReport ? reportResponses[selectedReport.id] ?? selectedReport.currentResponse : null;

  const handleSendResponse = () => {
    if (!selectedReport || !responseText.trim()) return;
    setReportResponses((current) => ({
      ...current,
      [selectedReport.id]: responseText.trim(),
    }));
    setResponseText("");
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Contenedor Principal dividido en dos columnas */}
      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        
        {/* --- COLUMNA IZQUIERDA: LISTA DE REPORTES --- */}
        <aside className="flex flex-col gap-4">
          
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors ${
                  activeFilter === filter
                    ? "border-[#0db39e] bg-[#0db39e] text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Lista de Tarjetas */}
          <div className="flex flex-col gap-3">
            {MOCK_REPORTS.map((report) => {
              const isSelected = selectedReportId === report.id;

              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[#0db39e] bg-white shadow-[0_0_0_1px_rgba(13,179,158,1)]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{report.title}</h3>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyle[report.status]}`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-[12px] text-slate-400">
                    {report.authorType} · {report.targetType}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${severityStyle[report.severity]}`}>
                      Severidad: {report.severity}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{report.date}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* --- COLUMNA DERECHA: DETALLE DEL REPORTE --- */}
        <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          {selectedReport ? (
            <div className="flex flex-col h-full">
              
              {/* Cabecera del Detalle */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">{selectedReport.title}</h2>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusStyle[selectedReport.status]}`}>
                  {selectedReport.status}
                </span>
              </div>

              {/* Metadatos del Detalle */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{selectedReport.targetType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  <span>{selectedReport.authorType}</span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${severityStyle[selectedReport.severity]}`}>
                  Severidad: {selectedReport.severity}
                </span>
                <span className="text-slate-400">{selectedReport.date}</span>
              </div>

              <div className="mt-8 flex-1 space-y-6">
                
                {/* Descripción del Reporte */}
                <div>
                  <h3 className="mb-2 text-[13px] font-medium text-slate-500">Descripción del reporte</h3>
                  <div className="rounded-2xl bg-[#f8fafc] p-4 text-[14px] text-slate-700">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Área de Respuesta del Administrador */}
                <div>
                  <h3 className="mb-2 text-[13px] font-medium text-slate-500">Respuesta del administrador</h3>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-[14px] text-slate-700 outline-none transition focus:border-[#0db39e]"
                  />

                  <button
                    type="button"
                    onClick={handleSendResponse}
                    disabled={!responseText.trim()}
                    className="mt-3 inline-flex items-center justify-center rounded-2xl bg-[#0db39e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0a8e7c] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    Enviar respuesta
                  </button>
                </div>

                {/* Respuesta Actual (Solo se muestra si existe) */}
                {currentResponse && (
                  <div className="rounded-2xl border border-[#a5edd9] bg-[#f2fdfa] p-4">
                    <p className="mb-1 text-[12px] font-bold text-[#0db39e]">Respuesta actual:</p>
                    <p className="text-[14px] text-[#0db39e]">
                      {selectedReport.currentResponse}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Estado vacío por si no hay reporte seleccionado
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Selecciona un reporte para ver los detalles.
            </div>
          )}
        </section>

      </div>
    </div>
  );
}