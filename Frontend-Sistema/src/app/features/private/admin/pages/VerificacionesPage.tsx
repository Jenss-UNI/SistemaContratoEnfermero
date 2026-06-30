import { useState, useEffect, useCallback, useMemo } from "react";
import { Check, Eye, X, FileText, CheckCircle2, ShieldCheck, Shield, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "../../../../core/services/supabase";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

type NurseType = "Licenciado con Especialidad" | "Licenciado en Enfermería" | "Técnico Titulado";

interface Nurse {
  id: string;
  initials: string;
  name: string;
  role: string;
  statusBadge: string;
  statusColor: "green" | "red" | "yellow";
  date: string;
  verificacion_status: string;
  nivel: NurseType;
}

interface DocumentField {
  id: string; // doc_type
  label: string;
  status: "not_submitted" | "pending" | "approved" | "rejected";
  file_url?: string;
  reason?: string; // admin_notes
}

interface DocSlot {
  id: string;
  label: string;
  description: string;
}

// Catálogo de documentos requeridos
const commonDocs: DocSlot[] = [
  { id: "dni_front", label: "DNI — Cara Frontal", description: "Foto clara del frente de tu DNI vigente" },
  { id: "dni_back", label: "DNI — Cara Posterior", description: "Foto clara del reverso de tu DNI vigente" },
  { id: "antecedentes_penales", label: "Antecedentes Penales", description: "Certificado de antecedentes penales" },
  { id: "antecedentes_policiales", label: "Antecedentes Policiales", description: "Certificado de antecedentes policiales" },
];

const specialistDocs: DocSlot[] = [
  { id: "titulo_uni", label: "Título Universitario", description: "Título de Licenciado en Enfermería" },
  { id: "sunedu", label: "Constancia SUNEDU", description: "Constancia de registro de título" },
  { id: "colegiatura", label: "Número de Colegiatura CEP", description: "Constancia de colegiatura activa" },
  { id: "especialidad_rne", label: "Certificado de Especialidad / RNE", description: "Especialidad registrada o RNE vigente" },
];

const assistentialDocs: DocSlot[] = [
  { id: "titulo_uni", label: "Título Universitario", description: "Título de Licenciado en Enfermería" },
  { id: "sunedu", label: "Constancia SUNEDU", description: "Constancia de registro de título" },
  { id: "colegiatura", label: "Número de Colegiatura", description: "Constancia de colegiatura activa" },
  { id: "habilidad_cep", label: "Certificado de Habilidad CEP", description: "Certificado de habilidad vigente" },
];

const technicalDocs: DocSlot[] = [
  { id: "titulo_tecnico", label: "Título Técnico", description: "Título de Técnico en Enfermería" },
  { id: "certificado_estudios", label: "Certificado de Estudios", description: "Certificado de estudios técnicos" },
  { id: "minedu_sinace", label: "Constancia MINEDU / SINACE", description: "Constancia ante MINEDU o SINACE" },
];

const docSets: Record<NurseType, DocSlot[]> = {
  "Licenciado con Especialidad": [...commonDocs, ...specialistDocs],
  "Licenciado en Enfermería": [...commonDocs, ...assistentialDocs],
  "Técnico Titulado": [...commonDocs, ...technicalDocs],
};

export default function VerificacionesPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [selectedNurseId, setSelectedNurseId] = useState<string | null>(null);
  
  const [fields, setFields] = useState<DocumentField[]>([]);
  const [loadingNurses, setLoadingNurses] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [visiblePdfFieldId, setVisiblePdfFieldId] = useState<string | null>(null);
  const [visibleRejectFieldId, setVisibleRejectFieldId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  const selectedNurse = useMemo(() => {
    return nurses.find((n) => n.id === selectedNurseId) || null;
  }, [nurses, selectedNurseId]);

  const loadNursesList = useCallback(async () => {
    setLoadingNurses(true);
    try {
      const { data, error } = await supabase
        .from("nurse_profiles")
        .select(`
          id,
          verificacion_status,
          nivel,
          especialidad,
          profiles!nurse_profiles_id_fkey (
            nombres,
            apellidos_pa,
            apellidos_ma,
            distrito,
            created_at
          )
        `);

      if (error) throw error;

      const mapped: Nurse[] = (data || []).map((n: any) => {
        const prof = n.profiles;
        const name = prof 
          ? `${prof.nombres} ${prof.apellidos_pa || ""} ${prof.apellidos_ma || ""}`.trim()
          : "Profesional Cuidame";
        const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "EN";
        
        let statusBadge = "Sin enviar";
        let statusColor: "green" | "red" | "yellow" = "yellow";
        if (n.verificacion_status === "approved") {
          statusBadge = "Aprobado";
          statusColor = "green";
        } else if (n.verificacion_status === "rejected") {
          statusBadge = "Rechazado";
          statusColor = "red";
        } else if (n.verificacion_status === "pending") {
          statusBadge = "Pendiente";
          statusColor = "yellow";
        }

        return {
          id: n.id,
          initials,
          name,
          role: `${n.nivel || "Técnico"} · ${n.especialidad || prof?.distrito || "Lima"}`,
          statusBadge,
          statusColor,
          date: prof?.created_at ? new Date(prof.created_at).toLocaleDateString("es-PE") : "N/A",
          verificacion_status: n.verificacion_status || "not_submitted",
          nivel: (n.nivel || "Técnico Titulado") as NurseType,
        };
      });

      // Sort pending first
      mapped.sort((a, b) => {
        if (a.verificacion_status === "pending" && b.verificacion_status !== "pending") return -1;
        if (a.verificacion_status !== "pending" && b.verificacion_status === "pending") return 1;
        return 0;
      });

      setNurses(mapped);
    } catch (err) {
      console.error("Error loading nurses list in Admin:", err);
    } finally {
      setLoadingNurses(false);
    }
  }, []);

  const loadNurseDocs = useCallback(async (nurseId: string, level: NurseType) => {
    setLoadingDocs(true);
    try {
      const { data, error } = await supabase
        .from("nurse_documents")
        .select("id, doc_type, file_url, status, admin_notes")
        .eq("nurse_id", nurseId);

      if (error) throw error;

      const requiredSlots = docSets[level] || [];
      const mappedFields: DocumentField[] = requiredSlots.map((slot) => {
        const dbDoc = (data || []).find((d: any) => d.doc_type === slot.id);
        return {
          id: slot.id,
          label: slot.label,
          status: dbDoc ? (dbDoc.status as any) : "not_submitted",
          file_url: dbDoc?.file_url || undefined,
          reason: dbDoc?.admin_notes || undefined,
        };
      });

      setFields(mappedFields);
    } catch (err) {
      console.error("Error loading nurse docs in Admin:", err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    loadNursesList();
  }, [loadNursesList]);

  useEffect(() => {
    if (selectedNurseId && selectedNurse) {
      loadNurseDocs(selectedNurseId, selectedNurse.nivel);
    } else {
      setFields([]);
    }
  }, [selectedNurseId, selectedNurse, loadNurseDocs]);

  // Compute stats
  const allApproved = useMemo(() => {
    return fields.length > 0 && fields.every((f) => f.status === "approved");
  }, [fields]);

  const currentPdfField = useMemo(() => {
    return fields.find((f) => f.id === visiblePdfFieldId) || null;
  }, [fields, visiblePdfFieldId]);

  const currentRejectField = useMemo(() => {
    return fields.find((f) => f.id === visibleRejectFieldId) || null;
  }, [fields, visibleRejectFieldId]);

  // Handlers
  const handleApproveField = async (fieldId: string) => {
    if (!selectedNurseId || !selectedNurse) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("nurse_documents")
        .update({ status: "approved", admin_notes: null })
        .eq("nurse_id", selectedNurseId)
        .eq("doc_type", fieldId);

      if (error) throw error;
      await loadNurseDocs(selectedNurseId, selectedNurse.nivel);
    } catch (err) {
      console.error("Error approving doc:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveAll = async () => {
    if (!selectedNurseId || !selectedNurse || fields.length === 0) return;
    setActionLoading(true);
    try {
      const docTypes = fields.map((f) => f.id);
      const { error } = await supabase
        .from("nurse_documents")
        .update({ status: "approved", admin_notes: null })
        .eq("nurse_id", selectedNurseId)
        .in("doc_type", docTypes);

      if (error) throw error;
      await loadNurseDocs(selectedNurseId, selectedNurse.nivel);
    } catch (err) {
      console.error("Error approving all docs:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!currentRejectField || !selectedNurseId || !selectedNurse) return;
    setActionLoading(true);
    try {
      // 1. Update document status
      const { error: docErr } = await supabase
        .from("nurse_documents")
        .update({ status: "rejected", admin_notes: rejectReason || "Motivo no especificado" })
        .eq("nurse_id", selectedNurseId)
        .eq("doc_type", currentRejectField.id);

      if (docErr) throw docErr;

      // 2. Turn overall profile status to rejected, visibility to privada
      await supabase
        .from("nurse_profiles")
        .update({ verificacion_status: "rejected", visibilidad: "despublicado" })
        .eq("id", selectedNurseId);

      setVisibleRejectFieldId(null);
      setRejectReason("");
      
      await loadNurseDocs(selectedNurseId, selectedNurse.nivel);
      await loadNursesList();
    } catch (err) {
      console.error("Error rejecting doc:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCertifyProfile = async () => {
    if (!selectedNurseId) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("nurse_profiles")
        .update({ verificacion_status: "approved" })
        .eq("id", selectedNurseId);

      if (error) throw error;
      
      setShowPublishSuccess(true);
      await loadNursesList();
    } catch (err) {
      console.error("Error certifying nurse profile:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loadingNurses) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-semibold">Cargando solicitudes de verificación...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] border border-slate-100 rounded-3xl p-4 bg-slate-50/20">
      
      {/* --- COLUMNA IZQUIERDA: LISTA DE SOLICITUDES --- */}
      <aside>
        <h3 className="mb-3 text-sm font-bold text-slate-900 px-1">
          Solicitudes de Enfermeros ({nurses.length})
        </h3>
        <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
          {nurses.map((nurse) => {
            const isSelected = selectedNurseId === nurse.id;
            return (
              <button
                key={nurse.id}
                type="button"
                onClick={() => setSelectedNurseId(nurse.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#0db39e] bg-white shadow-md ring-1 ring-[#0db39e]/20"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f0fdfa] text-sm font-bold text-[#0db39e] border border-[#d1f4eb]">
                  {nurse.initials}
                </div>
                <div className="flex-1 overflow-hidden pt-0.5">
                  <p className="truncate text-[13px] font-bold text-slate-900">{nurse.name}</p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">{nurse.role}</p>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold border ${
                        nurse.statusColor === "green"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                          : nurse.statusColor === "yellow"
                          ? "bg-amber-50 border-amber-100 text-amber-700"
                          : "bg-rose-50 border-rose-100 text-rose-700"
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-350">
              <Shield className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] font-bold text-slate-400">
              Selecciona un enfermero para revisar sus documentos
            </p>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8 relative">
            {actionLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-[2rem] z-10">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            )}

            {/* Cabecera del Perfil a Revisar */}
            <div className="mb-6 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0fdfa] text-sm font-bold text-[#0db39e] border border-[#d1f4eb]">
                  {selectedNurse.initials}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">{selectedNurse.name}</h2>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-450">
                    {selectedNurse.role} · Registrado: {selectedNurse.date}
                  </p>
                </div>
              </div>
              
              {fields.some((f) => f.status === "pending" || f.status === "rejected") && (
                <button
                  type="button"
                  onClick={handleApproveAll}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0db39e] hover:bg-[#0aa38f] px-4 py-2.5 text-xs font-bold text-white transition cursor-pointer shadow-sm"
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Aprobar Todo
                </button>
              )}
            </div>

            {loadingDocs ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
                <span className="text-xs text-slate-450 font-medium">Cargando expedientes...</span>
              </div>
            ) : (
              /* Lista de Documentos */
              <div className="space-y-3">
                {fields.map((field) => {
                  const isApproved = field.status === "approved";
                  const isRejected = field.status === "rejected";
                  const isPending = field.status === "pending";
                  const notSubmitted = field.status === "not_submitted";

                  return (
                    <div
                      key={field.id}
                      className={`flex flex-col gap-2.5 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 ${
                        isApproved
                          ? "border-[#ccfbf1] bg-teal-50/10"
                          : isRejected
                          ? "border-rose-100 bg-rose-50/10"
                          : isPending
                          ? "border-amber-100 bg-amber-50/10"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border ${
                            isApproved
                              ? "bg-teal-50 border-teal-100 text-[#0db39e]"
                              : isRejected
                              ? "bg-rose-50 border-rose-100 text-rose-500"
                              : isPending
                              ? "bg-amber-50 border-amber-100 text-amber-600"
                              : "bg-slate-50 border-slate-100 text-slate-400"
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
                          <p className="text-[13px] font-bold text-slate-800">{field.label}</p>
                          <p
                            className={`mt-0.5 text-[11px] font-bold ${
                              isApproved
                                ? "text-teal-650"
                                : isRejected
                                ? "text-rose-550"
                                : isPending
                                ? "text-amber-650"
                                : "text-slate-400"
                            }`}
                          >
                            {isApproved
                              ? "Verificado"
                              : isRejected
                              ? `Rechazado: ${field.reason || "Sin motivo"}`
                              : notSubmitted
                              ? "No presentado"
                              : "Pendiente de revisión"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {field.file_url && (
                          <button
                            type="button"
                            onClick={() => setVisiblePdfFieldId(field.id)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#a5edd9] bg-[#f0fdfa] px-3 py-1.5 text-[11px] font-bold text-[#0db39e] transition hover:bg-[#ccfbf1] cursor-pointer shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Ver
                          </button>
                        )}

                        {(isPending || isRejected) && field.file_url && (
                          <button
                            type="button"
                            onClick={() => handleApproveField(field.id)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#0db39e] hover:bg-[#0aa38f] px-3 py-1.5 text-[11px] font-bold text-white transition cursor-pointer shadow-sm"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Aprobar
                          </button>
                        )}

                        {(isPending || isApproved) && field.file_url && (
                          <button
                            type="button"
                            onClick={() => setVisibleRejectFieldId(field.id)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg bg-rose-500 hover:bg-rose-600 px-3 py-1.5 text-[11px] font-bold text-white transition cursor-pointer shadow-sm"
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
            )}

            {/* Certificar Botón */}
            {allApproved && selectedNurse.verificacion_status !== "approved" && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={handleCertifyProfile}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] hover:bg-[#0d655d] px-4 py-3.5 text-xs font-bold text-white transition cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                  Certificar y Aprobar Expediente
                </button>
              </div>
            )}
            
            {selectedNurse.verificacion_status === "approved" && (
              <div className="mt-8 border-t border-slate-100 pt-6 bg-teal-50/20 border border-teal-100/50 p-4 rounded-2xl flex items-center gap-2.5">
                <ShieldCheck className="text-teal-650 h-5 w-5 shrink-0" />
                <p className="text-xs text-teal-700 font-semibold leading-relaxed">
                  Este expediente está plenamente certificado. El enfermero tiene los permisos habilitados para publicar su perfil de forma voluntaria en su panel.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* --- MODAL VISUALIZADOR --- */}
      {currentPdfField && currentPdfField.file_url && (
        <Modal 
          title={`Documento: ${currentPdfField.label}`} 
          onClose={() => setVisiblePdfFieldId(null)} 
          maxWidthClass="max-w-4xl"
        >
          <div className="flex flex-col h-[75vh]">
            <p className="mb-3 text-xs text-slate-500 font-medium">
              Visualizando el archivo cargado para el proceso de certificación.
            </p>
            {currentPdfField.file_url.toLowerCase().endsWith(".pdf") || currentPdfField.file_url.toLowerCase().includes(".pdf?") ? (
              <iframe
                src={currentPdfField.file_url}
                title="Visor PDF"
                className="w-full flex-1 rounded-2xl border border-slate-200 bg-slate-50 shadow-inner"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center overflow-auto rounded-2xl border border-slate-200 bg-slate-50 shadow-inner p-4">
                <img
                  src={currentPdfField.file_url}
                  alt={currentPdfField.label}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md transition duration-200 hover:scale-[1.02]"
                />
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* --- MODAL RECHAZO --- */}
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
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3 rounded-xl mb-1 text-rose-700">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-[11px] leading-relaxed font-semibold">
                Al rechazar este documento, el estado general del enfermero cambiará a &ldquo;Rechazado&rdquo; y se inhabilitará temporalmente su visibilidad pública.
              </p>
            </div>
            
            <label className="block text-xs font-bold text-slate-655 uppercase tracking-wider">
              Motivo del rechazo
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs outline-none transition focus:border-rose-400 focus:bg-white resize-none text-slate-700"
              placeholder="Ej: Foto borrosa, DNI vencido, etc."
            />
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  setVisibleRejectFieldId(null);
                  setRejectReason("");
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-600 hover:bg-slate-55 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-rose-350 py-3 text-xs font-bold text-white transition cursor-pointer shadow-sm"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- MODAL ÉXITO DE CERTIFICACIÓN --- */}
      {showPublishSuccess && (
        <Modal
          title=""
          onClose={() => setShowPublishSuccess(false)}
          maxWidthClass="max-w-xs"
        >
          <div className="text-center pb-2 pt-2">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 border border-teal-100 text-[#0db39e]">
              <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <h3 className="mb-1.5 text-sm font-bold text-slate-900">¡Expediente Certificado!</h3>
            <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
              Los documentos de {selectedNurse?.name} han sido marcados como aprobados. El profesional ha sido notificado y ya tiene permitido publicar su perfil voluntariamente.
            </p>
            <button
              onClick={() => setShowPublishSuccess(false)}
              className="mt-5 w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-xs font-bold text-white transition cursor-pointer shadow-sm"
            >
              Aceptar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}