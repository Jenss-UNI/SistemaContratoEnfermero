import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import { Loader2, X } from "lucide-react";

type IncidentStatus = "abierto" | "en_revision" | "resuelto";
type IncidentSeverity = "baja" | "media" | "alta";

interface ServiceOption {
  id: number;
  patient_name: string;
  service_type: string;
  service_code?: string;
  contract_code?: string;
  clientName?: string;
}

interface IncidentRow {
  id: number;
  service_id: number | null;
  title: string;
  description: string;
  category: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  response: string | null;
  created_at: string;
  patientName?: string;
  evidence_urls?: string[];
}

const STATUS_CONFIG: Record<IncidentStatus, { label: string; bg: string; text: string; icon: string }> = {
  abierto: { label: "Abierto", bg: "bg-[#ffe4e6]", text: "text-rose-700", icon: "ri-time-line" },
  en_revision: { label: "En revisión", bg: "bg-[#fef3c7]", text: "text-amber-700", icon: "ri-search-eye-line" },
  resuelto: { label: "Resuelto", bg: "bg-[#d1fae5]", text: "text-emerald-700", icon: "ri-check-double-line" },
};

const SEVERITY_CONFIG: Record<IncidentSeverity, { label: string; dot: string; text: string }> = {
  baja: { label: "Baja", dot: "bg-sky-400", text: "text-gray-700" },
  media: { label: "Media", dot: "bg-amber-400", text: "text-gray-700" },
  alta: { label: "Alta", dot: "bg-rose-500", text: "text-gray-700" },
};

const CATEGORY_LABELS: Record<string, string> = {
  comportamiento: "Comportamiento del cliente",
  condiciones: "Condiciones del domicilio",
  seguridad: "Seguridad",
  salud: "Salud del paciente",
  pago: "Pago / Remuneración",
  otro: "Otro",
};

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const datePart = d.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("es-PE", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} a las ${timePart.toLowerCase()}`;
}

export default function IncidentReports() {
  const { user } = useAuth();
  
  const [reports, setReports] = useState<IncidentRow[]>([]);
  const [nurseServices, setNurseServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailReport, setDetailReport] = useState<IncidentRow | null>(null);
  const [createModal, setCreateModal] = useState(false);
  
  // Create report form states
  const [saving, setSaving] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSeverity, setFormSeverity] = useState<IncidentSeverity>("media");
  const [formCategory, setFormCategory] = useState("comportamiento");
  const [formServiceSearch, setFormServiceSearch] = useState("");
  const [formSelectedService, setFormSelectedService] = useState<ServiceOption | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [evidencePreviews, setEvidencePreviews] = useState<string[]>([]);
  const [showServiceResults, setShowServiceResults] = useState(false);
  
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch incident reports
      const { data: reportsData, error: reportsError } = await supabase
        .from("incident_reports")
        .select(`
          id,
          service_id,
          reporter_id,
          reporter_role,
          title,
          description,
          category,
          severity,
          status,
          response,
          evidence_urls,
          created_at,
          services (
            patient_name,
            nurse_id
          )
        `)
        .order("created_at", { ascending: false });

      if (reportsError) throw reportsError;

      // Filter reports relevant to the nurse
      const relevantReports = (reportsData || [])
        .filter((r: any) => r.reporter_id === user.id || r.services?.nurse_id === user.id)
        .map((r: any) => ({
          id: r.id,
          service_id: r.service_id,
          title: r.title,
          description: r.description || "",
          category: r.category || "otro",
          severity: (r.severity || "media") as IncidentSeverity,
          status: (r.status || "abierto") as IncidentStatus,
          response: r.response || null,
          created_at: r.created_at,
          patientName: r.services?.patient_name || "",
          evidence_urls: r.evidence_urls || [],
        }));

      setReports(relevantReports);

      // 2. Fetch nurse's active services
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select(`
          id,
          patient_name,
          service_type,
          contract_code,
          service_code,
          profiles:client_id (
            nombres,
            apellidos_pa
          )
        `)
        .eq("nurse_id", user.id);

      if (servicesError) throw servicesError;

      const mappedServices: ServiceOption[] = (servicesData || []).map((s: any) => {
        const clientName = s.profiles 
          ? `${s.profiles.nombres} ${s.profiles.apellidos_pa || ""}`.trim() 
          : "Cliente";
        return {
          id: s.id,
          patient_name: s.patient_name || "Paciente",
          service_type: s.service_type || "General",
          service_code: s.service_code || `SRV-${s.id}`,
          contract_code: s.contract_code,
          clientName,
        };
      });

      setNurseServices(mappedServices);
    } catch (err) {
      console.error("Error loading nurse incidents:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredServiceResults = useMemo(() => {
    if (!formServiceSearch.trim()) return [];
    const q = formServiceSearch.toLowerCase();
    return nurseServices.filter(
      (s) =>
        (s.service_code || "").toLowerCase().includes(q) ||
        (s.contract_code || "").toLowerCase().includes(q) ||
        (s.clientName || "").toLowerCase().includes(q) ||
        (s.patient_name || "").toLowerCase().includes(q)
    ).slice(0, 6);
  }, [formServiceSearch, nurseServices]);

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormSeverity("media");
    setFormCategory("comportamiento");
    setFormServiceSearch("");
    setFormSelectedService(null);
    setSelectedFiles([]);
    evidencePreviews.forEach((url) => URL.revokeObjectURL(url));
    setEvidencePreviews([]);
    setShowServiceResults(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);
    
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setEvidencePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index: number) => {
    URL.revokeObjectURL(evidencePreviews[index]);
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
    setEvidencePreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const titleTrimmed = formTitle.trim();

    const duplicateExists = reports.some(
      (r) => r.title === titleTrimmed && r.description === formDescription
    );

    if (duplicateExists) {
      showToast("Ya existe un reporte con el mismo título e información", "error");
      return;
    }

    setSaving(true);
    try {
      // 1. Upload files to imagens bucket
      const uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileExt = file.name.split(".").pop() || "jpg";
          const path = `reports/${user.id}/${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("imagens")
            .upload(path, file, { upsert: true });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from("imagens").getPublicUrl(path);
          return data.publicUrl;
        })
      );

      // 2. Insert incident report into database
      const { error: insertError } = await supabase
        .from("incident_reports")
        .insert([
          {
            reporter_id: user.id,
            reporter_role: "enfermero",
            service_id: formSelectedService ? Number(formSelectedService.id) : null,
            title: titleTrimmed,
            description: formDescription.trim(),
            category: formCategory,
            severity: formSeverity,
            status: "abierto",
            evidence_urls: uploadedUrls,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      showToast("Reporte enviado correctamente", "success");
      setCreateModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      console.error("Error creating incident:", err);
      showToast(`Error al guardar reporte: ${err.message || err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    let result = [...reports];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.patientName || "").toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }
    return result;
  }, [reports, searchQuery, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-semibold">Cargando incidentes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header and Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reportes de Incidentes</h2>
          <p className="text-xs text-slate-400">Reporta problemas de seguridad, condiciones de vivienda o disputas</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#c2533c] hover:bg-[#a93f2a] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          <i className="ri-alert-line text-sm"></i>Reportar incidente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 text-base"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por título o paciente..."
            className="w-full border-none pl-11 pr-4 py-2 text-xs focus:outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <div className="h-8 w-px bg-slate-105 hidden md:block"></div>
        <div className="flex gap-2 w-full md:w-auto">
          {["all", "abierto", "en_revision", "resuelto"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === status
                  ? "bg-slate-100 text-slate-800 shadow-sm"
                  : "border border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
            >
              {status === "all" ? "Todos" : status === "en_revision" ? "En revisión" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-xl mx-auto mb-3">
              <i className="ri-shield-check-line text-slate-300 text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-slate-655">No hay reportes de incidentes</p>
            <p className="text-xs text-slate-400 mt-1">Todo marcha de manera correcta por ahora.</p>
          </div>
        ) : (
          paginated.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between gap-4 hover:border-rose-200 transition cursor-pointer"
              onClick={() => setDetailReport(r)}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg shrink-0 ${STATUS_CONFIG[r.status].bg} ${STATUS_CONFIG[r.status].text}`}>
                    {STATUS_CONFIG[r.status].label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{CATEGORY_LABELS[r.category] || r.category}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 leading-tight truncate">{r.title}</h4>
                <p className="text-xs text-slate-450 font-medium">
                  {r.patientName ? `Paciente: ${r.patientName} · ` : ""}{new Date(r.created_at).toLocaleDateString("es-PE")}
                </p>
              </div>
              <i className="ri-arrow-right-s-line text-slate-300 text-lg shrink-0 mt-2"></i>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold cursor-pointer ${
                currentPage === p
                  ? "bg-rose-500 text-white shadow"
                  : "border border-slate-200 text-slate-655 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      )}

      {/* CREATE MODAL */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative border border-slate-100 my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-55/30 shrink-0">
              <h3 className="text-base font-bold text-slate-800">Reportar Nuevo Incidente</h3>
              <button
                onClick={() => setCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-655 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Servicio Asociado (Opcional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formServiceSearch}
                    onChange={(e) => {
                      setFormServiceSearch(e.target.value);
                      setShowServiceResults(true);
                    }}
                    onFocus={() => setShowServiceResults(true)}
                    placeholder="Escribe paciente, código o cliente..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 bg-slate-50/20"
                  />
                  {formSelectedService && (
                    <div className="mt-2 text-xs bg-rose-50 border border-rose-100 text-rose-800 rounded-xl px-3 py-2 flex items-center justify-between">
                      <span>
                        Servicio seleccionado: <strong>{formSelectedService.patient_name} ({formSelectedService.service_code})</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormSelectedService(null)}
                        className="text-rose-600 font-bold ml-2 cursor-pointer hover:underline text-[10px]"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                  {showServiceResults && filteredServiceResults.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto p-1.5">
                      {filteredServiceResults.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setFormSelectedService(s);
                            setShowServiceResults(false);
                            setFormServiceSearch("");
                          }}
                          className="px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-medium text-slate-750 flex flex-col"
                        >
                          <strong>{s.patient_name} ({s.service_code})</strong>
                          <span className="text-[10px] text-slate-400 mt-0.5">{s.service_type} · Cliente: {s.clientName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Título de la incidencia</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: Ausencia de materiales básicos de cuidado"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-655 bg-white cursor-pointer"
                  >
                    <option value="comportamiento">Comportamiento del cliente</option>
                    <option value="condiciones">Condiciones del domicilio</option>
                    <option value="seguridad">Seguridad personal</option>
                    <option value="salud">Salud del paciente</option>
                    <option value="pago">Pago / Remuneración</option>
                    <option value="otro">Otro inconveniente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gravedad</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-655 bg-white cursor-pointer"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción detallada</label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Por favor describe lo sucedido con el mayor detalle posible..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/20 resize-none"
                />
              </div>

              {/* Adjunto de Evidencias */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Evidencias Fotográficas</label>
                <div className="flex flex-wrap gap-2.5 items-center">
                  <label className="flex flex-col items-center justify-center w-16 h-16 border border-dashed border-slate-300 hover:border-rose-400 rounded-2xl cursor-pointer hover:bg-slate-50 transition shrink-0">
                    <i className="ri-camera-line text-lg text-slate-400"></i>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {evidencePreviews.map((previewUrl, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                      <img src={previewUrl} alt="Evidencia" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow transition cursor-pointer scale-90"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  disabled={saving}
                  className="flex-1 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-350 text-white font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line"></i>
                      <span>Enviar Reporte</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] shadow-2xl flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0">
              <h3 className="text-base font-bold text-slate-800">Detalle del Reporte</h3>
              <button
                onClick={() => setDetailReport(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-655 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 flex-wrap pb-1">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border ${STATUS_CONFIG[detailReport.status].bg} ${STATUS_CONFIG[detailReport.status].text}`}>
                  <i className={`${STATUS_CONFIG[detailReport.status].icon} text-sm`}></i>
                  {STATUS_CONFIG[detailReport.status].label}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${SEVERITY_CONFIG[detailReport.severity].text} bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-150`}>
                  <span className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG[detailReport.severity].dot}`}></span>
                  Prioridad {SEVERITY_CONFIG[detailReport.severity].label}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{detailReport.title}</h3>

              {detailReport.patientName && (
                <div className="flex items-center gap-2.5 text-xs text-rose-800 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3.5">
                  <i className="ri-user-heart-line text-rose-550 text-base shrink-0"></i>
                  <span>
                    Paciente relacionado: <strong className="font-bold text-rose-900">{detailReport.patientName}</strong>
                  </span>
                </div>
              )}

              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <i className="ri-file-text-line text-sm text-slate-400"></i>Descripción de los Hechos
                </p>
                <p className="text-xs text-slate-705 leading-relaxed font-medium">
                  {detailReport.description}
                </p>
              </div>

              <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <i className="ri-calendar-event-line text-base text-slate-350"></i>
                <span>Enviado: {formatDate(detailReport.created_at)}</span>
              </div>

              {detailReport.response && (
                <div className="bg-[#f0fdf4] border border-green-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <i className="ri-reply-line text-sm"></i>Resolución de la Plataforma
                  </p>
                  <p className="text-xs text-emerald-900 leading-relaxed font-semibold">
                    {detailReport.response}
                  </p>
                </div>
              )}

              {detailReport.evidence_urls &&
                Array.isArray(detailReport.evidence_urls) &&
                detailReport.evidence_urls.length > 0 && (
                  <div className="border-t border-slate-50 pt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Evidencias Fotográficas Adjuntas
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {detailReport.evidence_urls.map((url: string, idx: number) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 block hover:scale-105 transition-all shadow-sm"
                        >
                          <img
                            src={url}
                            alt={`Evidencia ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="px-6 py-4 border-t border-slate-50 shrink-0">
              <button
                onClick={() => setDetailReport(null)}
                className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-655 font-bold py-3 rounded-xl cursor-pointer text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast && toast.show && (
        <div className="fixed top-6 right-6 z-[120] pointer-events-none">
          <div className={`flex items-start gap-3 w-[320px] px-4 py-3.5 rounded-2xl shadow-xl border bg-white animate-in fade-in slide-in-from-right-5 duration-350 pointer-events-auto ${
            toast.type === "success" ? "border-emerald-100" : "border-rose-100"
          }`}>
            <div className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 ${
              toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              <i className={`text-lg ${toast.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}`}></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800">
                {toast.type === "success" ? "Operación exitosa" : "Error"}
              </p>
              <p className="text-[10px] text-slate-450 leading-snug font-semibold mt-0.5">
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}