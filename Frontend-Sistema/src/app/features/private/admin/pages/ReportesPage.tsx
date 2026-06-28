import { useEffect, useState } from "react";
import { User, Tag, Flag, Clock, Search, CheckCheck, Check, RefreshCw, X, Loader2 } from "lucide-react";
import { useReportesStats, useReportes, useActualizarReporte } from "../hooks/useReportsData";

type Status = "abierto" | "en_revision" | "resuelto";

const FILTERS = ["Todos", "Abiertos", "En revisión", "Resueltos"] as const;

const FILTER_STATUS_MAP: Record<(typeof FILTERS)[number], Status | null> = {
  Todos: null,
  Abiertos: "abierto",
  "En revisión": "en_revision",
  Resueltos: "resuelto",
};

const statusLabelMap: Record<string, string> = {
  abierto: 'Abierto',
  en_revision: 'En revisión',
  resuelto: 'Resuelto',
};

const severityLabelMap: Record<string, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

const severityStyle: Record<string, { bg: string; dot: string; text: string }> = {
  alta: { bg: "bg-rose-50", dot: "bg-rose-500", text: "text-rose-600" },
  media: { bg: "bg-amber-50", dot: "bg-amber-500", text: "text-amber-600" },
  baja: { bg: "bg-slate-50", dot: "bg-slate-500", text: "text-slate-600" },
};

const statusStyle: Record<string, string> = {
  resuelto: "bg-[#ccfbf1] text-[#0db39e]",
  abierto: "bg-[#e5f9f4] text-[#0db39e]",
  en_revision: "bg-[#fffbeb] text-[#d97706]",
};

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatShortDate(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }).replace('.', '-');
}

export default function ReportesPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");
  const [pendingAction, setPendingAction] = useState<Status | "Update" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: stats } = useReportesStats();
  const { data: reportes, isLoading } = useReportes(
    FILTER_STATUS_MAP[activeFilter] ?? 'Todos'
  );
  const actualizarMutation = useActualizarReporte();

  const selectedReport = reportes?.find((r) => r.id === selectedReportId) || null;

  useEffect(() => {
    if (reportes && reportes.length > 0 && !reportes.some((r) => r.id === selectedReportId)) {
      setSelectedReportId(reportes[0].id);
    } else if (reportes?.length === 0) {
      setSelectedReportId(null);
    }
  }, [reportes, selectedReportId]);

  useEffect(() => {
    setResponseText(selectedReport?.response || "");
  }, [selectedReportId]);

  const handleConfirmAction = () => {
    if (!selectedReport || !pendingAction) return;

    actualizarMutation.mutate({
      reportId: selectedReport.id,
      newStatus: pendingAction === "Update" ? selectedReport.status : pendingAction,
      respuesta: responseText.trim() || null,
    }, {
      onSuccess: () => {
        setPendingAction(null);
        setShowConfirmModal(false);
      },
    });
  };

  const renderStatusBadge = (status: string, isSmall = false) => {
    const label = statusLabelMap[status] || status;
    const baseStyle = statusStyle[status] || 'bg-slate-100 text-slate-500';
    const iconSize = isSmall ? "h-3 w-3" : "h-3.5 w-3.5";
    const textSize = isSmall ? "text-[10px]" : "text-[11px]";

    return (
      <span className={`inline-flex items-center gap-1 flex-shrink-0 rounded-full px-2.5 py-1 ${textSize} font-bold ${baseStyle}`}>
        {status === 'resuelto' && <Check className={iconSize} strokeWidth={3} />}
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-slate-400">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">

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
              <p className="text-xl font-bold text-slate-900">{stats?.abiertos ?? 0}</p>
              <p className="text-sm font-medium text-slate-500">Abiertos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#fffbeb] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#d97706] shadow-sm">
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats?.enRevision ?? 0}</p>
              <p className="text-sm font-medium text-slate-500">En revisión</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#f0fdfa] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0db39e] shadow-sm">
              <CheckCheck className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats?.resueltos ?? 0}</p>
              <p className="text-sm font-medium text-slate-500">Resueltos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-5 gap-x-6 lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">

        <div className="flex flex-wrap items-center gap-3 overflow-x-auto whitespace-nowrap lg:col-start-1 lg:row-start-1">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilter === filter
                  ? "border-transparent bg-[#0db39e] text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
          {(reportes ?? []).length > 0 ? (
            reportes!.map((report) => {
              const isSelected = selectedReportId === report.id;
              const sevStyle = severityStyle[report.severity] || severityStyle.media;
              const severityLabel = severityLabelMap[report.severity] || report.severity;

              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`flex flex-col gap-3 rounded-[1.75rem] border p-5 text-left transition-all ${isSelected
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
                      {report.category}
                    </span>
                    <span className="rounded-full bg-white border border-slate-100 px-3 py-1 text-sm font-medium text-slate-500 shadow-sm">
                      {report.reporter_role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full gap-3 mt-1">
                    <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${sevStyle.bg} ${sevStyle.text}`}>
                      <span className={`h-2 w-2 rounded-full ${sevStyle.dot}`}></span>
                      {severityLabel}
                    </div>
                    <span className="text-sm font-semibold text-slate-400">{formatShortDate(report.created_at)}</span>
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

        <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8 lg:col-start-2 lg:row-start-2">
          {selectedReport ? (
            <div className="flex flex-col h-full">

              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">{selectedReport.title}</h2>
                {renderStatusBadge(selectedReport.status)}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{selectedReport.reporter_role}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  <span>{selectedReport.category}</span>
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${(severityStyle[selectedReport.severity] || severityStyle.media).bg} ${(severityStyle[selectedReport.severity] || severityStyle.media).text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${(severityStyle[selectedReport.severity] || severityStyle.media).dot}`}></span>
                  {severityLabelMap[selectedReport.severity] || selectedReport.severity}
                </div>
                <span className="text-slate-500">{formatDate(selectedReport.created_at)}</span>
              </div>

              <div className="mt-8 flex-1 space-y-6">
                <div>
                  <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Descripción del reporte</h3>
                  <div className="rounded-2xl border border-slate-100 bg-[#fafafa] p-5 text-[14px] text-slate-700">
                    {selectedReport.description}
                  </div>
                </div>

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

                <div className="flex flex-col gap-4 sm:flex-row pt-4">
                  {selectedReport.status === 'resuelto' ? (
                    <button
                      type="button"
                      onClick={() => { setPendingAction("Update"); setShowConfirmModal(true); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0db39e] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#0a8e7c]"
                    >
                      <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                      Actualizar respuesta
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { setPendingAction("en_revision"); setShowConfirmModal(true); }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f59e0b] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#d97706]"
                      >
                        <Search className="h-4 w-4" strokeWidth={2.5} />
                        Poner En Revisión
                      </button>

                      <button
                        type="button"
                        onClick={() => { setPendingAction("resuelto"); setShowConfirmModal(true); }}
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

      {showConfirmModal && pendingAction && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {pendingAction === "resuelto" ? "Marcar como Resuelto" :
                    pendingAction === "en_revision" ? "Poner en Revisión" :
                      "Actualizar Respuesta"}
                </h2>
                <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-[14px] font-medium text-slate-600 mb-6">
                {pendingAction === "Update" ? (
                  <>¿Estás seguro de que deseas actualizar la respuesta para el reporte <span className="font-bold text-slate-900">"{selectedReport.title}"</span>?</>
                ) : (
                  <>¿Estás seguro de que deseas cambiar el estado del reporte <span className="font-bold text-slate-900">"{selectedReport.title}"</span> a <span className="font-bold text-slate-900">"{statusLabelMap[pendingAction]}"</span>?</>
                )}
              </p>

              <div className="flex gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-bold text-slate-700 hover:bg-slate-50">
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={actualizarMutation.isPending}
                  className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold text-white disabled:opacity-50 ${pendingAction === "resuelto" || pendingAction === "Update"
                      ? "bg-[#0db39e] hover:bg-[#0a8e7c]"
                      : "bg-[#f59e0b] hover:bg-[#d97706]"
                    }`}
                >
                  {actualizarMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}