import { useState } from "react";
import { Check, Eye, X, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

type Nurse = {
  id: string;
  initials: string;
  name: string;
  role: string;
  statusBadge: string;
  statusColor: "green" | "red";
  date: string;
};

type DocumentField = {
  id: string;
  label: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
};

const NURSES: Nurse[] = [
  {
    id: "andrea",
    initials: "AP",
    name: "Lic. Andrea Palomino",
    role: "Geriatría y Adulto Mayor",
    statusBadge: "Listo para aprobar",
    statusColor: "green",
    date: "2026-04-11",
  },
  {
    id: "marco",
    initials: "MV",
    name: "Tec. Marco Villanueva",
    role: "Signos Vitales y Medicación",
    statusBadge: "Tiene rechazados",
    statusColor: "red",
    date: "2026-04-10",
  },
  {
    id: "sofia",
    initials: "SR",
    name: "Lic. Sofía Ramírez",
    role: "Pediatría y Cuidado Infantil",
    statusBadge: "Listo para aprobar",
    statusColor: "green",
    date: "2026-04-09",
  },
];

const INITIAL_FIELDS: DocumentField[] = [
  { id: "dni-frontal", label: "DNI Frontal", status: "approved" },
  { id: "dni-posterior", label: "DNI Posterior", status: "approved" },
  { id: "titulo-profesional", label: "Título Profesional", status: "pending" },
  { id: "registro-sunedu", label: "Registro SUNEDU", status: "pending" },
  { id: "antecedentes-penales", label: "Antecedentes Penales", status: "rejected" },
];

const initialStatusByNurse = NURSES.reduce<Record<string, DocumentField[]>>(
  (acc, nurse) => {
    acc[nurse.id] = INITIAL_FIELDS.map((field) => ({ ...field }));
    return acc;
  },
  {}
);

export default function VerificacionesPage() {
  const [selectedNurseId, setSelectedNurseId] = useState(NURSES[1].id);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, DocumentField[]>>(initialStatusByNurse);
  
  const [visiblePdfFieldId, setVisiblePdfFieldId] = useState<string | null>(null);
  const [visibleRejectFieldId, setVisibleRejectFieldId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  const selectedNurse = NURSES.find((nurse) => nurse.id === selectedNurseId) ?? NURSES[0];
  const fields = fieldStatuses[selectedNurseId] ?? INITIAL_FIELDS;

  const allApproved = fields.every((field) => field.status === "approved");

  const currentPdfField = fields.find((field) => field.id === visiblePdfFieldId) ?? null;
  const currentRejectField = fields.find((field) => field.id === visibleRejectFieldId) ?? null;

  const handleApproveField = (fieldId: string) => {
    setFieldStatuses((current) => ({
      ...current,
      [selectedNurseId]: current[selectedNurseId].map((field) =>
        field.id === fieldId ? { ...field, status: "approved", reason: undefined } : field
      ),
    }));
  };

  const handleApproveAll = () => {
    setFieldStatuses((current) => ({
      ...current,
      [selectedNurseId]: current[selectedNurseId].map((field) => ({
        ...field,
        status: "approved",
        reason: undefined,
      })),
    }));
  };

  const handleRejectSubmit = () => {
    if (!currentRejectField) return;
    setFieldStatuses((current) => ({
      ...current,
      [selectedNurseId]: current[selectedNurseId].map((field) =>
        field.id === currentRejectField.id
          ? { ...field, status: "rejected", reason: rejectReason || "Motivo no especificado" }
          : field
      ),
    }));
    setVisibleRejectFieldId(null);
    setRejectReason("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      
      {/* --- COLUMNA IZQUIERDA: LISTA DE SOLICITUDES --- */}
      <aside>
        <h3 className="mb-3 text-sm font-bold text-slate-900">
          Solicitudes Pendientes ({NURSES.length})
        </h3>
        <div className="space-y-3">
          {NURSES.map((nurse) => {
            const isSelected = selectedNurseId === nurse.id;
            return (
              <button
                key={nurse.id}
                type="button"
                onClick={() => setSelectedNurseId(nurse.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#00c59e] bg-[#f2fdfa]"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                {/* Iniciales más pequeñas */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                  {nurse.initials}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold text-slate-900">{nurse.name}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{nurse.role}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        nurse.statusColor === "green"
                          ? "bg-[#e5f9f4] text-[#00a884]"
                          : "bg-[#ffeef0] text-[#f43f5e]"
                      }`}
                    >
                      {nurse.statusBadge}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{nurse.date}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* --- COLUMNA DERECHA: REVISIÓN DE DOCUMENTOS --- */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        
        {/* Cabecera del Perfil a Revisar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-teal-700">
              {selectedNurse.initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{selectedNurse.name}</h2>
              <p className="text-xs text-slate-500">
                {selectedNurse.role} · Enviado: {selectedNurse.date}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApproveAll}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0db39e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0aa38f]"
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Aprobar Todo
          </button>
        </div>

        {/* Lista de Documentos */}
        <div className="space-y-3">
          {fields.map((field) => {
            const isApproved = field.status === "approved";
            const isRejected = field.status === "rejected";
            const isPending = field.status === "pending";

            return (
              <div
                key={field.id}
                className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                  isApproved
                    ? "border-[#a5edd9] bg-[#f2fdfa]"
                    : isRejected
                    ? "border-[#fbcfe8] bg-[#fff5f6]"
                    : "border-slate-200 bg-[#fafafa]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                      isApproved
                        ? "bg-[#d1f4eb] text-[#0db39e]"
                        : isRejected
                        ? "bg-[#ffe4e6] text-[#f43f5e]"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isApproved ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : isRejected ? (
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <FileText className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{field.label}</p>
                    <p
                      className={`text-xs font-medium ${
                        isApproved
                          ? "text-[#0db39e]"
                          : isRejected
                          ? "text-[#f43f5e]"
                          : "text-slate-400"
                      }`}
                    >
                      {isApproved
                        ? "Aprobado"
                        : isRejected
                        ? "Rechazado"
                        : "Pendiente de revisión"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisiblePdfFieldId(field.id)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#a5edd9] bg-white px-3 py-1.5 text-xs font-bold text-[#0db39e] transition hover:bg-[#f2fdfa]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ver
                  </button>

                  {(isPending || isRejected) && (
                    <button
                      type="button"
                      onClick={() => handleApproveField(field.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#0db39e] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0aa38f]"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      Aprobar
                    </button>
                  )}

                  {(isPending || isApproved) && (
                    <button
                      type="button"
                      onClick={() => setVisibleRejectFieldId(field.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#f43f5e] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#e11d48]"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                      Rechazar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón de Publicación compacto */}
        {allApproved && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => setShowPublishSuccess(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14b8a6] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f9788]"
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
              Publicar Perfil en Directorio
            </button>
          </div>
        )}
      </section>

      {/* --- MODALES --- */}
      {/* (Los modales se mantienen similares, pero he ajustado ligeramente sus fuentes para que hagan juego) */}

      {currentPdfField && (
        <Modal 
          title={`Documento: ${currentPdfField.label}`} 
          onClose={() => setVisiblePdfFieldId(null)} 
          maxWidthClass="max-w-4xl"
        >
          <div className="flex flex-col h-[70vh]">
            <p className="mb-3 text-xs text-slate-500">
              Visualizando el documento subido por el profesional.
            </p>
            <iframe
              src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              title="Visor PDF"
              className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>
        </Modal>
      )}

      {currentRejectField && (
        <Modal
          title="Rechazar documento"
          onClose={() => {
            setVisibleRejectFieldId(null);
            setRejectReason("");
          }}
          maxWidthClass="max-w-md"
        >
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Motivo del rechazo
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-[#0db39e] focus:bg-white"
              placeholder="Explica aquí el motivo..."
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setVisibleRejectFieldId(null);
                  setRejectReason("");
                }}
                className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 rounded-lg bg-[#f43f5e] py-2 text-xs font-bold text-white hover:bg-[#e11d48]"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showPublishSuccess && (
        <Modal
          title=""
          onClose={() => setShowPublishSuccess(false)}
          maxWidthClass="max-w-xs"
        >
          <div className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#d1f4eb] text-[#0db39e]">
              <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-900">¡Perfil Publicado!</h3>
            <p className="text-xs text-slate-500">
              El perfil de {selectedNurse.name} ha sido verificado.
            </p>
            <button
              onClick={() => setShowPublishSuccess(false)}
              className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              Aceptar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}