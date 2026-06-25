import { useState } from "react";
import { Check, Eye, X, FileText, CheckCircle2, ShieldCheck, Shield } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

type Nurse = {
  id: string;
  initials: string;
  name: string;
  role: string;
  statusBadge: string;
  statusColor: "green" | "red" | "yellow";
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
    id: "jens",
    initials: "JL",
    name: "Jens Jeremies Luna Levita",
    role: "Enfermero Especializado · Miraflores",
    statusBadge: "Publicado",
    statusColor: "green",
    date: "12/6/2026",
  },
  {
    id: "luura",
    initials: "LP",
    name: "Luura Perez Tello",
    role: "Técnico en Enfermería · Surco",
    statusBadge: "1 pendientes",
    statusColor: "yellow",
    date: "10/6/2026",
  },
];

const INITIAL_FIELDS: DocumentField[] = [
  { id: "especialidad_rne", label: "especialidad_rne", status: "approved" },
  { id: "colegiatura", label: "Colegiatura", status: "approved" },
  { id: "sunedu", label: "sunedu", status: "pending" },
  { id: "titulo_uni", label: "titulo_uni", status: "pending" },
  { id: "antecedentes_policiales", label: "antecedentes_policiales", status: "rejected" },
  { id: "antecedentes_penales", label: "antecedentes_penales", status: "pending" },
  { id: "dni_back", label: "dni_back", status: "approved" },
];

const initialStatusByNurse = NURSES.reduce<Record<string, DocumentField[]>>(
  (acc, nurse) => {
    acc[nurse.id] = INITIAL_FIELDS.map((field) => ({ ...field }));
    return acc;
  },
  {}
);

export default function VerificacionesPage() {
  const [selectedNurseId, setSelectedNurseId] = useState<string | null>(null);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, DocumentField[]>>(initialStatusByNurse);
  
  const [visiblePdfFieldId, setVisiblePdfFieldId] = useState<string | null>(null);
  const [visibleRejectFieldId, setVisibleRejectFieldId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  const selectedNurse = NURSES.find((nurse) => nurse.id === selectedNurseId) ?? null;
  const fields = selectedNurseId ? (fieldStatuses[selectedNurseId] ?? INITIAL_FIELDS) : [];

  const allApproved = fields.length > 0 && fields.every((field) => field.status === "approved");

  const currentPdfField = fields.find((field) => field.id === visiblePdfFieldId) ?? null;
  const currentRejectField = fields.find((field) => field.id === visibleRejectFieldId) ?? null;

  const handleApproveField = (fieldId: string) => {
    if (!selectedNurseId) return;
    setFieldStatuses((current) => ({
      ...current,
      [selectedNurseId]: current[selectedNurseId].map((field) =>
        field.id === fieldId ? { ...field, status: "approved", reason: undefined } : field
      ),
    }));
  };

  const handleApproveAll = () => {
    if (!selectedNurseId) return;
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
    if (!currentRejectField || !selectedNurseId) return;
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
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      
      {/* --- COLUMNA IZQUIERDA: LISTA DE SOLICITUDES --- */}
      <aside>
        <h3 className="mb-3 text-sm font-bold text-slate-900">
          Solicitudes de Enfermeros ({NURSES.length})
        </h3>
        <div className="space-y-2.5">
          {NURSES.map((nurse) => {
            const isSelected = selectedNurseId === nurse.id;
            return (
              <button
                key={nurse.id}
                type="button"
                onClick={() => setSelectedNurseId(nurse.id)}
                className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-[#0db39e] bg-white shadow-sm"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f0fdfa] text-sm font-bold text-[#0db39e]">
                  {nurse.initials}
                </div>
                <div className="flex-1 overflow-hidden pt-0.5">
                  <p className="truncate text-[13px] font-bold text-slate-900">{nurse.name}</p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">{nurse.role}</p>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        nurse.statusColor === "green"
                          ? "bg-[#ccfbf1] text-[#0f766e]"
                          : nurse.statusColor === "yellow"
                          ? "bg-[#fef3c7] text-[#d97706]"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {nurse.statusBadge}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* --- COLUMNA DERECHA: REVISIÓN DE DOCUMENTOS --- */}
      <section>
        {!selectedNurse ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <Shield className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-medium text-slate-500">
              Selecciona un enfermero para revisar sus documentos
            </p>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            
            {/* Cabecera del Perfil a Revisar */}
            <div className="mb-6 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0fdfa] text-sm font-bold text-[#0db39e]">
                  {selectedNurse.initials}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{selectedNurse.name}</h2>
                  <p className="mt-0.5 text-[12px] font-medium text-slate-500">
                    {selectedNurse.role} · Registrado: {selectedNurse.date}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleApproveAll}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0db39e] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#0aa38f]"
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
                Aprobar Todo
              </button>
            </div>

            {/* Lista de Documentos */}
            <div className="space-y-2.5">
              {fields.map((field) => {
                const isApproved = field.status === "approved";
                const isRejected = field.status === "rejected";
                const isPending = field.status === "pending";

                return (
                  <div
                    key={field.id}
                    className={`flex flex-col gap-2.5 rounded-lg border p-3.5 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                      isApproved
                        ? "border-[#a5edd9] bg-white"
                        : isRejected
                        ? "border-rose-200 bg-[#fff1f2]"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                          isApproved
                            ? "bg-[#ccfbf1] text-[#0db39e]"
                            : isRejected
                            ? "bg-rose-100 text-rose-500"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isApproved ? (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        ) : isRejected ? (
                          <X className="h-4 w-4" strokeWidth={3} />
                        ) : (
                          <FileText className="h-4 w-4" strokeWidth={2.5} />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900">{field.label}</p>
                        <p
                          className={`mt-0.5 text-[11px] font-medium ${
                            isApproved
                              ? "text-[#0db39e]"
                              : isRejected
                              ? "text-rose-500"
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
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#a5edd9] bg-[#f0fdfa] px-3 py-1.5 text-[11px] font-bold text-[#0db39e] transition hover:bg-[#ccfbf1]"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Ver
                      </button>

                      {(isPending || isRejected) && (
                        <button
                          type="button"
                          onClick={() => handleApproveField(field.id)}
                          className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#0db39e] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#0aa38f]"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          Aprobar
                        </button>
                      )}

                      {(isPending || isApproved) && (
                        <button
                          type="button"
                          onClick={() => setVisibleRejectFieldId(field.id)}
                          className="inline-flex items-center justify-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-rose-600"
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

            {/* Botón de Publicación */}
            {allApproved && (
              <div className="mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPublishSuccess(true)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0f766e] px-3.5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#0d655d]"
                >
                  <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                  Publicar Perfil en Directorio
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* --- MODALES --- */}
      {currentPdfField && (
        <Modal 
          title={`Documento: ${currentPdfField.label}`} 
          onClose={() => setVisiblePdfFieldId(null)} 
          maxWidthClass="max-w-4xl"
        >
          <div className="flex flex-col h-[70vh]">
            <p className="mb-2.5 text-xs text-slate-500">
              Visualizando el documento subido por el profesional.
            </p>
            <iframe
              src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              title="Visor PDF"
              className="w-full flex-1 rounded-lg border border-slate-200 bg-slate-50"
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none transition focus:border-[#0db39e] focus:bg-white"
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
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#d1f4eb] text-[#0db39e]">
              <CheckCircle2 className="h-5.5 w-5.5" strokeWidth={2.5} />
            </div>
            <h3 className="mb-1 text-sm font-bold text-slate-900">¡Perfil Publicado!</h3>
            <p className="text-xs text-slate-500">
              El perfil de {selectedNurse?.name} ha sido verificado.
            </p>
            <button
              onClick={() => setShowPublishSuccess(false)}
              className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Aceptar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}