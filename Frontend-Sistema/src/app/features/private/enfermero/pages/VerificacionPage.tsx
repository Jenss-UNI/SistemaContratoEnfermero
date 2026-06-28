import { useState, useEffect } from "react";
import {
  IdCard,
  GraduationCap,
  ShieldCheck,
  Award,
  FileText,
  BookOpen,
  Landmark,
  ShieldAlert,
  FileCheck,
  UploadCloud,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Check,
  Upload,
  AlertCircle,
  Send,
  Info,
  X,
} from "lucide-react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import {
  fetchEnfermeroProfile,
  fetchNurseDocuments,
  uploadNurseDocument,
  deleteNurseDocument,
  submitVerificationRequest,
} from "../services/enfermeroProfile.service";

// Tipos de enfermeros
type NurseType = "Enfermero Especializado" | "Licenciado en Enfermería" | "Técnico en Enfermería";
type DocStatus = "not_submitted" | "pending" | "approved" | "rejected";

interface DocSlot {
  id: string;
  label: string;
  description: string;
  icon: any;
}

interface NurseDoc {
  id: string;
  doc_type: string;
  label: string;
  file_url: string | null;
  status: "approved" | "pending" | "rejected" | "not_submitted";
  admin_notes: string | null;
}

// Catálogo de documentos requeridos
const commonDocs: DocSlot[] = [
  {
    id: "dni_front",
    label: "DNI — Cara Frontal",
    description: "Foto clara del frente de tu DNI vigente",
    icon: IdCard,
  },
  {
    id: "dni_back",
    label: "DNI — Cara Posterior",
    description: "Foto clara del reverso de tu DNI vigente",
    icon: IdCard,
  },
  {
    id: "antecedentes_penales",
    label: "Antecedentes Penales",
    description: "Certificado de antecedentes penales (máx. 3 meses)",
    icon: ShieldAlert,
  },
  {
    id: "antecedentes_policiales",
    label: "Antecedentes Policiales",
    description: "Certificado de antecedentes policiales vigente",
    icon: FileCheck,
  },
];

const specialistDocs: DocSlot[] = [
  {
    id: "titulo_uni",
    label: "Título Universitario",
    description: "Título de Licenciado en Enfermería escaneado",
    icon: GraduationCap,
  },
  {
    id: "sunedu",
    label: "Constancia SUNEDU",
    description: "Constancia de registro o verificación de título",
    icon: ShieldCheck,
  },
  {
    id: "colegiatura",
    label: "Número de Colegiatura CEP",
    description: "Constancia de colegiatura activa en el CEP",
    icon: Award,
  },
  {
    id: "especialidad_rne",
    label: "Certificado de Especialidad / RNE",
    description: "Especialidad registrada o RNE vigente",
    icon: Award,
  },
];

const assistentialDocs: DocSlot[] = [
  {
    id: "titulo_uni",
    label: "Título Universitario",
    description: "Título de Licenciado en Enfermería escaneado",
    icon: GraduationCap,
  },
  {
    id: "sunedu",
    label: "Constancia SUNEDU",
    description: "Constancia de registro o verificación de título",
    icon: ShieldCheck,
  },
  {
    id: "colegiatura",
    label: "Número de Colegiatura",
    description: "Constancia de colegiatura activa",
    icon: Award,
  },
  {
    id: "habilidad_cep",
    label: "Certificado de Habilidad CEP",
    description: "Certificado de habilidad profesional vigente",
    icon: FileText,
  },
];

const technicalDocs: DocSlot[] = [
  {
    id: "titulo_tecnico",
    label: "Título Técnico",
    description: "Título de Técnico en Enfermería escaneado",
    icon: GraduationCap,
  },
  {
    id: "certificado_estudios",
    label: "Certificado de Estudios",
    description: "Certificado completo de estudios técnicos",
    icon: BookOpen,
  },
  {
    id: "minedu_sinace",
    label: "Constancia MINEDU / SINACE",
    description: "Constancia de registro ante MINEDU o SINACE",
    icon: Landmark,
  },
];

const docSets: Record<NurseType, DocSlot[]> = {
  "Enfermero Especializado": [...commonDocs, ...specialistDocs],
  "Licenciado en Enfermería": [...commonDocs, ...assistentialDocs],
  "Técnico en Enfermería": [...commonDocs, ...technicalDocs],
};

export default function VerificacionPage() {
  const { user } = useAuth();

  // Estados de carga y datos reales
  const [pageLoading, setPageLoading] = useState(true);
  const [nurseType, setNurseType] = useState<NurseType>("Enfermero Especializado");
  const [requiredDocs, setRequiredDocs] = useState<DocSlot[]>(docSets["Enfermero Especializado"]);
  const [dbDocs, setDbDocs] = useState<NurseDoc[]>([]);
  
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<DocStatus>("not_submitted");
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  const loadVerificationData = async () => {
    if (!user?.id) return;
    try {
      setPageLoading(true);
      
      // 1. Obtener perfil para tipo y estado de verificación
      const profileData = await fetchEnfermeroProfile(user.id);
      const level = (profileData.nurse_profile?.nivel || "Técnico en Enfermería") as NurseType;
      setNurseType(level);
      setRequiredDocs(docSets[level] || []);
      setCurrentStatus((profileData.nurse_profile?.verificacion_status || "not_submitted") as DocStatus);

      // 2. Obtener documentos subidos
      const docs = await fetchNurseDocuments(user.id);
      const mappedDocs: NurseDoc[] = docs.map((d) => ({
        id: d.id,
        doc_type: d.doc_type,
        label: docSets[level]?.find((x) => x.id === d.doc_type)?.label || d.doc_type,
        file_url: d.file_url,
        status: d.status as any,
        admin_notes: d.admin_notes || null,
      }));

      setDbDocs(mappedDocs);
    } catch (err: any) {
      console.error("[Verification] Error al cargar los datos:", err);
      showToast("Error al cargar la información de verificación.", "error");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationData();
  }, [user?.id]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const getDocStatus = (docId: string): "approved" | "pending" | "rejected" | "not_submitted" => {
    const doc = dbDocs.find((d) => d.doc_type === docId);
    if (!doc) return "not_submitted";
    return doc.status;
  };

  const getDoc = (docId: string): NurseDoc | undefined => {
    return dbDocs.find((d) => d.doc_type === docId);
  };

  // Métricas de progreso
  const uploadedCount = requiredDocs.filter(
    (d) => getDocStatus(d.id) !== "not_submitted"
  ).length;
  
  const allUploaded = requiredDocs.length > 0 && uploadedCount === requiredDocs.length;

  const handleFileChange = async (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setLoadingDocId(docId);
    try {
      await uploadNurseDocument(user.id, docId, file);
      await loadVerificationData();
      showToast("Documento subido correctamente", "success");
    } catch (err: any) {
      console.error("[Verification] Error al subir documento:", err);
      showToast("Error al subir el archivo: " + (err.message || ""), "error");
    } finally {
      setLoadingDocId(null);
    }
  };

  const removeFile = async (docId: string) => {
    const doc = getDoc(docId);
    if (!doc || !doc.file_url || !user?.id) return;

    try {
      await deleteNurseDocument(user.id, docId, doc.file_url);
      await loadVerificationData();
      showToast("Documento eliminado correctamente", "success");
    } catch (err: any) {
      console.error("[Verification] Error al eliminar documento:", err);
      showToast("Error al eliminar el archivo: " + (err.message || ""), "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allUploaded || !user?.id) return;

    setSubmitting(true);
    try {
      await submitVerificationRequest(user.id);
      await loadVerificationData();
      showToast("Documentos enviados correctamente para verificación", "success");
    } catch (err: any) {
      console.error("[Verification] Error al enviar verificación:", err);
      showToast("Error al enviar la solicitud: " + (err.message || ""), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig: Record<
    DocStatus,
    { label: string; color: string; icon: any; desc: string }
  > = {
    not_submitted: {
      label: "Sin enviar",
      color: "bg-slate-100 text-slate-600 border-slate-200",
      icon: UploadCloud,
      desc: "Sube todos los documentos requeridos según tu tipo profesional para iniciar la verificación.",
    },
    pending: {
      label: "En revisión",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
      desc: "Tus documentos están siendo revisados por el equipo administrativo. Tiempo estimado: 24-48 horas.",
    },
    approved: {
      label: "Verificado",
      color: "bg-teal-50 text-teal-700 border-teal-200",
      icon: CheckCircle2,
      desc: "Tu perfil está verificado y visible en el directorio.",
    },
    rejected: {
      label: "Rechazado",
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
      desc: "Algunos documentos no fueron aceptados. Revisa los comentarios y vuelve a subir.",
    },
  };

  const statusInfo = statusConfig[currentStatus] || statusConfig["not_submitted"];

  if (pageLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-sm font-semibold text-slate-500">Cargando módulo de verificación...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-6">
      
      {/* Formulario Principal */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full animate-in fade-in duration-300">
        
        {/* Banner de Estado General */}
        <div
          className={`rounded-2xl p-5 border flex items-start gap-4 transition duration-350 ${
            currentStatus === "approved"
              ? "bg-teal-50/50 border-teal-200"
              : currentStatus === "pending"
              ? "bg-amber-50/40 border-amber-200"
              : currentStatus === "rejected"
              ? "bg-rose-50/40 border-rose-200"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0 ${
              currentStatus === "approved"
                ? "bg-teal-100 text-teal-700"
                : currentStatus === "pending"
                ? "bg-amber-100 text-amber-700"
                : currentStatus === "rejected"
                ? "bg-rose-100 text-rose-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            <statusInfo.icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <h3 className="font-bold text-slate-850 text-sm">Estado de Verificación</h3>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  currentStatus === "approved"
                    ? "bg-teal-50 text-teal-700 border-teal-200/50"
                    : currentStatus === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200/50"
                    : currentStatus === "rejected"
                    ? "bg-rose-50 text-rose-700 border-rose-200/50"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {statusInfo.label}
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{statusInfo.desc}</p>
          </div>
        </div>

        {/* Tipo Profesional */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3.5">Tu Tipo Profesional</h3>
          <p className="text-xs text-slate-400 mb-3">Basado en tu registro inicial:</p>
          <span className="text-xs font-bold px-4 py-2.5 rounded-xl bg-teal-500 text-white whitespace-nowrap inline-block shadow-sm">
            {nurseType}
          </span>
        </div>

        {/* Progreso de Carga */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bold text-slate-800 text-sm">Progreso de documentos</h3>
            <span className="text-xs font-semibold text-slate-500">
              {uploadedCount}/{requiredDocs.length} subidos
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${requiredDocs.length > 0 ? (uploadedCount / requiredDocs.length) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2.5">
            {allUploaded
              ? "✓ Todos los documentos requeridos están listos"
              : `Faltan ${requiredDocs.length - uploadedCount} documento(s) por subir`}
          </p>
        </div>

        {/* Grilla de Documentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requiredDocs.map((doc) => {
            const status = getDocStatus(doc.id);
            const existingDoc = getDoc(doc.id);
            const Icon = doc.icon;
            const isLoading = loadingDocId === doc.id;

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-2xl border p-5 transition-colors duration-300 ${
                  status !== "not_submitted" ? "border-teal-200 bg-teal-50/5" : "border-slate-100"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition duration-300 ${
                      status !== "not_submitted" ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{doc.label}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{doc.description}</p>
                  </div>
                </div>

                {/* Subida o Visualización del Archivo */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-500 mr-2" />
                    <span className="text-xs text-slate-500 font-medium">Subiendo archivo...</span>
                  </div>
                ) : existingDoc?.file_url ? (
                  <div className="flex items-center gap-3 bg-teal-50/50 border border-teal-100/50 rounded-xl px-4 py-2.5 animate-in fade-in duration-200">
                    <Check className="text-teal-600 h-4.5 w-4.5 shrink-0 bg-teal-100 rounded-full p-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-teal-800 truncate">
                        {existingDoc.file_url.split("/").pop()}
                      </p>
                      <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                        existingDoc.status === "approved"
                          ? "text-teal-600"
                          : existingDoc.status === "pending"
                          ? "text-amber-600"
                          : existingDoc.status === "rejected"
                          ? "text-rose-600"
                          : "text-slate-500"
                      }`}>
                        {existingDoc.status === "approved"
                          ? "Aprobado"
                          : existingDoc.status === "pending"
                          ? "Pendiente de revisión"
                          : existingDoc.status === "rejected"
                          ? "Rechazado"
                          : "Sin enviar"}
                      </p>
                      {existingDoc.admin_notes && (
                        <p className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 p-1.5 rounded-lg mt-1 italic">
                          Nota: {existingDoc.admin_notes}
                        </p>
                      )}
                    </div>
                    
                    {/* Botón de eliminar */}
                    {currentStatus !== "pending" && existingDoc.status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => removeFile(doc.id)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer flex-shrink-0 transition"
                        aria-label={`Eliminar ${doc.label}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-3.5 cursor-pointer hover:border-teal-300 hover:bg-teal-50/10 transition duration-200 ${
                    currentStatus === "pending" ? "opacity-50 pointer-events-none" : ""
                  }`}>
                    <Upload className="text-slate-400 h-4 w-4" />
                    <span className="text-xs text-slate-500 font-semibold">Subir archivo</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      disabled={currentStatus === "pending"}
                      className="hidden"
                      onChange={(e) => handleFileChange(doc.id, e)}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTÓN SOLICITAR VERIFICACIÓN */}
        {currentStatus !== "approved" && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            
            {/* Aviso Informativo */}
            <div className="flex items-start gap-3">
              <Info className="text-teal-500 h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Al enviar tu solicitud, confirmas que todos los documentos cargados son auténticos, vigentes y legibles. El equipo de administración de Cuídame revisará tu documentación en un plazo máximo de 24 a 48 horas hábiles.
              </p>
            </div>

            {/* Botón */}
            {allUploaded ? (
              <button
                type="submit"
                disabled={submitting || currentStatus === "pending"}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-350 text-white font-bold py-3.5 rounded-xl transition cursor-pointer whitespace-nowrap text-sm shadow-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando solicitud...
                  </>
                ) : currentStatus === "pending" ? (
                  <>
                    <Clock className="h-4 w-4 animate-pulse" />
                    Solicitud enviada (En revisión)
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Solicitar Verificación
                  </>
                )}
              </button>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex items-center gap-3">
                <AlertCircle className="text-slate-400 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 text-xs">Botón de verificación bloqueado</p>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    Sube todos los documentos requeridos para habilitar la solicitud. Faltan {requiredDocs.length - uploadedCount} documento(s) por cargar.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Aviso de Perfil Verificado */}
        {currentStatus === "approved" && (
          <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-5 flex items-center gap-3">
            <CheckCircle2 className="text-teal-600 h-6 w-6 shrink-0" />
            <div>
              <p className="font-bold text-teal-800 text-sm">Perfil verificado</p>
              <p className="text-xs text-teal-600 mt-0.5">
                Tu perfil está aprobado y visible en el directorio. No se requieren acciones adicionales.
              </p>
            </div>
          </div>
        )}

      </form>

      {/* Notificaciones flotantes */}
      {toast && toast.show && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-6 duration-300">
          {toast.type === "success" ? (
            <div className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded-full shrink-0">
              <Check className="text-white h-4 w-4" />
            </div>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center bg-rose-500 rounded-full shrink-0">
              <AlertCircle className="text-white h-4 w-4" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold">
              {toast.type === "success" ? "Éxito" : "Alerta de Validación"}
            </p>
            <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
              {toast.message}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

