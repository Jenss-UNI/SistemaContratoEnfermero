import { useState } from "react";
import { CheckCircle2, Eye, FileText, ShieldCheck, User, XCircle } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

type Nurse = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  status: string;
  notice: string;
  date: string;
};

type DocumentField = {
  id: string;
  label: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
};

const NURSES: Nurse[] = [
  {
    id: "andrea",
    name: "Lic. Andrea Palomino",
    role: "Geriatría y Adulto Mayor",
    specialty: "Documentos pendientes",
    status: "5 solicitudes",
    notice: "5 pendientes",
    date: "2026-04-11",
  },
  {
    id: "marco",
    name: "Tec. Marco Villanueva",
    role: "Signos Vitales y Medicación",
    specialty: "Revisión necesaria",
    status: "3 solicitudes",
    notice: "Tiene rechazados",
    date: "2026-04-10",
  },
  {
    id: "sofia",
    name: "Lic. Sofía Ramírez",
    role: "Pediatría y Cuidado Infantil",
    specialty: "Listo para publicar",
    status: "2 solicitudes",
    notice: "Listo para aprobar",
    date: "2026-04-09",
  },
];

const INITIAL_FIELDS: DocumentField[] = [
  {
    id: "dni-frontal",
    label: "DNI Frontal",
    description: "Documento de identidad visible y legible.",
    status: "pending",
  },
  {
    id: "dni-posterior",
    label: "DNI Posterior",
    description: "Reverso del documento de identidad.",
    status: "pending",
  },
  {
    id: "titulo-profesional",
    label: "Título Profesional",
    description: "Certificado emitido por la universidad.",
    status: "pending",
  },
  {
    id: "registro-sunedu",
    label: "Registro SUNEDU",
    description: "Constancia de registro profesional.",
    status: "pending",
  },
  {
    id: "antecedentes-penales",
    label: "Antecedentes Penales",
    description: "Certificado de antecedentes penales.",
    status: "pending",
  },
];

const initialStatusByNurse = NURSES.reduce<Record<string, DocumentField[]>>(
  (acc, nurse) => {
    acc[nurse.id] = INITIAL_FIELDS.map((field) => ({ ...field }));
    return acc;
  },
  {}
);

const statusLabel = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
} as const;

const statusStyles = {
  pending: "border-slate-200 bg-slate-100 text-slate-600",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function VerificacionesPage() {
  const [selectedNurseId, setSelectedNurseId] = useState(NURSES[0].id);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, DocumentField[]>>(initialStatusByNurse);
  const [visiblePdfFieldId, setVisiblePdfFieldId] = useState<string | null>(null);
  const [visibleRejectFieldId, setVisibleRejectFieldId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  const selectedNurse = NURSES.find((nurse) => nurse.id === selectedNurseId) ?? NURSES[0];
  const fields = fieldStatuses[selectedNurseId] ?? INITIAL_FIELDS;

  const approvedCount = fields.filter((field) => field.status === "approved").length;
  const rejectedCount = fields.filter((field) => field.status === "rejected").length;
  const pendingCount = fields.filter((field) => field.status === "pending").length;

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

  const handlePublishProfile = () => {
    setShowPublishSuccess(true);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Verificaciones</p>
        <h1 className="text-3xl font-semibold text-slate-900">Revisión de enfermeros</h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          Selecciona un profesional a la izquierda para revisar cada documento y aprobar o rechazar el perfil.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          {NURSES.map((nurse) => (
            <button
              key={nurse.id}
              type="button"
              onClick={() => setSelectedNurseId(nurse.id)}
              className={`group w-full rounded-3xl border px-4 py-4 text-left transition ${
                selectedNurseId === nurse.id
                  ? "border-teal-300 bg-teal-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white">
                  <User className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900">{nurse.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{nurse.role}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full border bg-white px-3 py-1 text-slate-600">{nurse.notice}</span>
                <span className="rounded-full border bg-white px-3 py-1 text-slate-600">{nurse.date}</span>
              </div>
            </button>
          ))}
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Perfil en revisión</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">{selectedNurse.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{selectedNurse.role} · {selectedNurse.specialty}</p>
              </div>
              <button
                type="button"
                onClick={handleApproveAll}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                <ShieldCheck className="h-4 w-4" />
                Aprobar todo
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Aprobados</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{approvedCount}</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pendientes</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{pendingCount}</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rechazados</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{rejectedCount}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">{field.label}</p>
                        <p className="mt-1 text-sm text-slate-500">{field.description}</p>
                        {field.status === "rejected" && field.reason ? (
                          <p className="mt-3 text-sm text-rose-600">Motivo: {field.reason}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles[field.status]}`}
                      >
                        {statusLabel[field.status]}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setVisiblePdfFieldId(field.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveField(field.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Aprobar
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisibleRejectFieldId(field.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={handlePublishProfile}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Publicar perfil en Directorio
              </button>
            </div>
          </div>
        </section>
      </div>

      {currentPdfField && (
        <Modal title={`Ver: ${currentPdfField.label}`} onClose={() => setVisiblePdfFieldId(null)} maxWidthClass="max-w-3xl">
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Vista previa del documento en formato PDF. Aquí se podrá mostrar el archivo o la información de cada campo cuando se integre con el backend.
            </p>
            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-6">
              <div className="mb-4 flex items-center gap-3">
                <FileText className="h-5 w-5 text-teal-600" />
                <p className="text-base font-semibold text-slate-900">{currentPdfField.label}</p>
              </div>
              <div className="h-64 rounded-3xl bg-white p-5 shadow-inner">
                <div className="h-4 w-52 rounded-full bg-slate-200" />
                <div className="mt-4 h-4 w-5/6 rounded-full bg-slate-200" />
                <div className="mt-3 h-4 w-4/6 rounded-full bg-slate-200" />
                <div className="mt-6 space-y-3">
                  <div className="h-3 w-full rounded-full bg-slate-200" />
                  <div className="h-3 w-full rounded-full bg-slate-200" />
                  <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {currentRejectField && (
        <Modal
          title={`Rechazar: ${currentRejectField.label}`}
          onClose={() => {
            setVisibleRejectFieldId(null);
            setRejectReason("");
          }}
          maxWidthClass="max-w-2xl"
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setVisibleRejectFieldId(null);
                  setRejectReason("");
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Rechazar
              </button>
            </div>
          }
        >
          <div className="space-y-5">
            <p className="text-sm leading-6 text-slate-600">
              Añade el motivo del rechazo para que el profesional pueda corregir la documentación.
            </p>
            <label className="block text-sm font-medium text-slate-700">Motivo del rechazo</label>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={6}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
              placeholder="Describe aquí el motivo por el que rechazas este documento"
            />
          </div>
        </Modal>
      )}

      {showPublishSuccess && (
        <Modal
          title="Perfil publicado"
          onClose={() => setShowPublishSuccess(false)}
          maxWidthClass="max-w-md"
          footer={
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPublishSuccess(false)}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Aceptar
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-slate-900">¡Publicación exitosa!</p>
            <p className="text-sm leading-6 text-slate-600">
              El perfil del enfermero se ha publicado en el directorio correctamente. Ahora el profesional estará visible para clientes.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
