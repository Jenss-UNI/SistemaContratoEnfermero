import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import {
  Calendar,
  Camera,
  CheckCheck,
  CornerDownRight,
  Plus,
  Search,
  UserRound,
  X,
  Loader2,
} from "lucide-react";

interface DBIncidentReport {
  id: string;
  titulo: string;
  estado: string;
  severidad: string;
  categoria: string;
  profesional: string;
  fecha: string;
  fechaHoraDetalle: string;
  descripcion: string;
  respuesta: string;
  respondido: boolean;
  serviceId?: number;
  evidence_urls?: string[];
}

interface ServiceOption {
  id: number;
  label: string;
  nurseName: string;
  serviceCode: string;
}

interface DayOption {
  id: number;
  dateStr: string;
  horario: string;
}

function DetalleReporteModal({ reporte, onClose }: { reporte: DBIncidentReport; onClose: () => void }) {
  if (!reporte) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-5 right-5 rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-655 transition cursor-pointer">
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pr-10">Detalle del Reporte</h2>

          {/* Etiquetas */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
              reporte.estado === "Resuelto" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
              reporte.estado === "En revisión" ? "bg-amber-50 text-amber-750 border border-amber-100 animate-pulse" :
              "bg-rose-50 text-rose-700 border border-rose-100"
            }`}>
              {reporte.estado}
            </span>
            <span className="rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-bold text-rose-500 uppercase tracking-wide">
              Prioridad {reporte.severidad}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
              Categoría: {reporte.categoria}
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 leading-snug">{reporte.titulo}</h3>

          {/* Descripción */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Descripción detallada</p>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed whitespace-pre-wrap">{reporte.descripcion}</p>
          </div>

          {/* Enfermero y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-655">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-teal-650 shrink-0" />
              <span>Enfermero: <strong className="text-slate-800 font-bold">{reporte.profesional}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Reportado: {reporte.fechaHoraDetalle}</span>
            </div>
          </div>

          {/* Evidencias */}
          {reporte.evidence_urls && reporte.evidence_urls.length > 0 && (
            <div className="border-t border-slate-50 pt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Evidencias Fotográficas</p>
              <div className="flex flex-wrap gap-2">
                {reporte.evidence_urls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 block hover:scale-105 hover:shadow transition"
                  >
                    <img src={url} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Respuesta de la plataforma */}
          {reporte.respondido && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <CornerDownRight className="h-4 w-4" />
                Respuesta de la plataforma
              </div>
              <p className="pl-6 text-xs text-emerald-800 leading-relaxed font-semibold">{reporte.respuesta}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NuevoReporteModal({
  services,
  onClose,
  onSubmitSuccess,
  onShowToast,
}: {
  services: ServiceOption[];
  onClose: () => void;
  onSubmitSuccess: () => void;
  onShowToast: (msg: string, type: "success" | "error") => void;
}) {
  const { user } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  
  const [days, setDays] = useState<DayOption[]>([]);
  const [selectedDayId, setSelectedDayId] = useState("");
  const [loadingDays, setLoadingDays] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Enfermero");
  const [severity, setSeverity] = useState("Media");
  const [description, setDescription] = useState("");
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Filter services by search
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return services.filter(
      (s) =>
        s.nurseName.toLowerCase().includes(q) ||
        s.label.toLowerCase().includes(q) ||
        s.serviceCode.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, services]);

  // Load service days when selecting a service
  useEffect(() => {
    if (!selectedService) {
      setDays([]);
      setSelectedDayId("");
      return;
    }
    const loadDays = async () => {
      setLoadingDays(true);
      try {
        const { data, error } = await supabase
          .from("service_days")
          .select("id, day_date, start_hour, end_hour")
          .eq("service_id", selectedService.id)
          .order("day_date", { ascending: true });

        if (error) throw error;
        
        const formatShortDay = (dateStr: string) => {
          const d = new Date(dateStr + "T12:00:00");
          return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
        };
        const formatHour = (h: number) => {
          const suffix = h >= 12 ? "pm" : "am";
          const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
          return `${display}:00 ${suffix}`;
        };

        const mapped: DayOption[] = (data || []).map((d: any) => ({
          id: d.id,
          dateStr: formatShortDay(d.day_date),
          horario: `${formatHour(d.start_hour)} - ${formatHour(d.end_hour)}`,
        }));
        setDays(mapped);
      } catch (err) {
        console.error("Error loading service days:", err);
      } finally {
        setLoadingDays(false);
      }
    };
    loadDays();
  }, [selectedService]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);

    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!title.trim() || !description.trim()) {
      onShowToast("Por favor completa los campos obligatorios (*).", "error");
      return;
    }

    setSaving(true);
    try {
      // 1. Upload files
      const uploadedUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const ext = file.name.split(".").pop() || "jpg";
          const path = `reports/${user.id}/${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("imagens")
            .upload(path, file, { upsert: true });

          if (uploadErr) throw uploadErr;

          const { data } = supabase.storage.from("imagens").getPublicUrl(path);
          return data.publicUrl;
        })
      );

      // 2. Insert report
      const { error: insertErr } = await supabase
        .from("incident_reports")
        .insert([
          {
            reporter_id: user.id,
            reporter_role: "cliente",
            service_id: selectedService ? Number(selectedService.id) : null,
            service_day_id: selectedDayId ? Number(selectedDayId) : null,
            title: title.trim(),
            description: description.trim(),
            category: category.toLowerCase(),
            severity: severity.toLowerCase(),
            status: "abierto",
            evidence_urls: uploadedUrls,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertErr) throw insertErr;

      // 3. Mark service payment status to dispute if incident is active
      if (selectedService) {
        await supabase
          .from("services")
          .update({ payment_status: "in_custody" }) // Ensure it is retained in custody
          .eq("id", selectedService.id);
      }

      onShowToast("El incidente ha sido reportado con éxito. Nuestro equipo lo revisará a la brevedad.", "success");
      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error creating incident report:", err);
      onShowToast(`Error al registrar reporte: ${err.message || err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl sm:p-8 max-h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-5 right-5 rounded-xl p-2 text-slate-400 hover:bg-slate-55 transition cursor-pointer">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-900 mb-6 pr-10">Crear Nuevo Reporte de Incidente</h2>

        <form className="space-y-4 overflow-y-auto flex-1 pr-1" onSubmit={handleFormSubmit}>
          {/* Service Search */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">Servicio Relacionado (Opcional)</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Busca por código, nombre del enfermero o especialidad..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-4 pr-10 text-xs focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none bg-slate-55/20 animate-in fade-in"
              />
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
              
              {selectedService && (
                <div className="mt-2 text-xs bg-rose-50 border border-rose-105 text-rose-800 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span>
                    Contrato asociado: <strong>{selectedService.nurseName} - {selectedService.label} ({selectedService.serviceCode})</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="text-rose-600 font-bold ml-2 cursor-pointer hover:underline text-[10px]"
                  >
                    Remover
                  </button>
                </div>
              )}

              {showResults && filteredServices.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-40 overflow-y-auto p-1.5 animate-in fade-in duration-100">
                  {filteredServices.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedService(s);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className="px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-semibold text-slate-750 flex flex-col"
                    >
                      <strong>{s.nurseName} - {s.label}</strong>
                      <span className="text-[10px] text-slate-400 mt-0.5">{s.serviceCode}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Service Day Selection */}
          {selectedService && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">Jornada Específica (Opcional)</label>
              {loadingDays ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span className="text-[10px] text-slate-400 font-medium">Cargando jornadas...</span>
                </div>
              ) : days.length === 0 ? (
                <div className="text-[11px] text-slate-450 italic">No hay jornadas asociadas para calificar.</div>
              ) : (
                <select
                  value={selectedDayId}
                  onChange={(e) => setSelectedDayId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-655 bg-white cursor-pointer"
                >
                  <option value="">Cualquier día del servicio</option>
                  {days.map((d) => (
                    <option key={d.id} value={d.id}>
                      Día {d.dateStr} ({d.horario})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">Título de Reclamación *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Ausencia injustificada en horario de ingreso"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none bg-slate-50/20 text-slate-700"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none bg-white cursor-pointer text-slate-655"
              >
                <option value="Enfermero">Enfermero (Asistencia)</option>
                <option value="Pagos">Pagos / Cobros</option>
                <option value="Plataforma">Plataforma / App</option>
                <option value="Salud">Salud del paciente</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">Severidad</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none bg-white cursor-pointer text-slate-655"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción detallada *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente los hechos, fechas, horas y cualquier dato relevante..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none bg-slate-50/20 text-slate-700 resize-none"
              maxLength={500}
            ></textarea>
            <div className="mt-1 text-right text-[10px] text-slate-400 font-bold">{description.length}/500</div>
          </div>

          {/* Adjuntar Evidencia */}
          <div>
            <label className="mb-2.5 block text-xs font-bold text-slate-500 uppercase tracking-wider">Fotos de Evidencia (Opcional)</label>
            <div className="flex flex-wrap gap-2.5 items-center">
              <label className="flex flex-col items-center justify-center w-16 h-16 border border-dashed border-slate-300 hover:border-rose-455 rounded-2xl cursor-pointer hover:bg-slate-50 transition shrink-0">
                <Camera className="h-5 w-5 text-slate-400" />
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">Subir</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {previews.map((previewUrl, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                  <img src={previewUrl} alt="Previa" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow cursor-pointer transition scale-90"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 pt-4 border-t border-slate-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-550 transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[#c2533c] hover:bg-[#a93f2a] disabled:bg-rose-350 py-3 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Enviar Reporte</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReportesPage() {
  const { user } = useAuth();
  
  const [reports, setReports] = useState<DBIncidentReport[]>([]);
  const [clientServices, setClientServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DBIncidentReport | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos los estados");

  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch incident reports
      const { data: reportsData, error: reportsErr } = await supabase
        .from("incident_reports")
        .select(`
          id,
          title,
          description,
          category,
          severity,
          status,
          response,
          evidence_urls,
          created_at,
          services (
            service_type,
            nurse_id,
            profiles:nurse_id (
              nombres,
              apellidos_pa
            )
          )
        `)
        .eq("reporter_id", user.id)
        .order("created_at", { ascending: false });

      if (reportsErr) throw reportsErr;

      const mapped: DBIncidentReport[] = (reportsData || []).map((r: any) => {
        const nurseProfile = r.services?.profiles;
        const nurseName = nurseProfile 
          ? `${nurseProfile.nombres} ${nurseProfile.apellidos_pa || ""}`.trim() 
          : "Enfermero por asignar";

        let statusText = "Abierto";
        if (r.status === "resuelto") statusText = "Resuelto";
        else if (r.status === "en_revision") statusText = "En revisión";

        let severityText = "Media";
        if (r.severity === "alta") severityText = "Alta";
        else if (r.severity === "baja") severityText = "Baja";

        return {
          id: `REP-${String(r.id).slice(-4)}`,
          titulo: r.title,
          estado: statusText,
          severidad: severityText,
          categoria: r.category ? r.category.charAt(0).toUpperCase() + r.category.slice(1) : "General",
          profesional: nurseName,
          fecha: new Date(r.created_at).toLocaleDateString("es-PE"),
          fechaHoraDetalle: new Date(r.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" }) + " a las " + new Date(r.created_at).toLocaleTimeString("es-PE", { hour: "numeric", minute: "2-digit", hour12: true }),
          descripcion: r.description || "",
          respuesta: r.response || "",
          respondido: !!r.response,
          evidence_urls: r.evidence_urls || [],
        };
      });

      setReports(mapped);

      // 2. Fetch client services
      const { data: servicesData, error: servicesErr } = await supabase
        .from("services")
        .select(`
          id,
          service_type,
          contract_code,
          service_code,
          profiles:nurse_id (
            nombres,
            apellidos_pa
          )
        `)
        .eq("client_id", user.id);

      if (servicesErr) throw servicesErr;

      const mappedServices: ServiceOption[] = (servicesData || []).map((s: any) => {
        const name = s.profiles 
          ? `${s.profiles.nombres} ${s.profiles.apellidos_pa || ""}`.trim() 
          : "Profesional por asignar";
        return {
          id: s.id,
          label: s.service_type || "Asistencia General",
          nurseName: name,
          serviceCode: s.contract_code || s.service_code || `SRV-${s.id}`,
        };
      });

      setClientServices(mappedServices);
    } catch (err) {
      console.error("Error loading client incidents page:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute status cards stats
  const stats = useMemo(() => {
    const abiertos = reports.filter((r) => r.estado === "Abierto").length;
    const revision = reports.filter((r) => r.estado === "En revisión").length;
    const resueltos = reports.filter((r) => r.estado === "Resuelto").length;
    return { abiertos, revision, resueltos };
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q 
        ? r.titulo.toLowerCase().includes(q) || r.profesional.toLowerCase().includes(q)
        : true;
        
      const matchesStatus = filterStatus === "Todos los estados" 
        ? true 
        : r.estado.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, filterStatus]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-semibold">Cargando incidentes...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 min-h-[70vh] pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mis Reportes</h1>
          <p className="text-xs text-slate-400">Reporta problemas o incidentes con tus servicios y jornadas</p>
        </div>
        <button
          onClick={() => setIsNewReportOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c2533c] hover:bg-[#a93f2a] px-5 py-3 text-xs font-bold text-white transition shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo Reporte
        </button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#f2fdfa] p-5 shadow-sm border border-[#ccfbf1]/50">
          <p className="text-xs font-semibold text-slate-455 uppercase tracking-wider">Abiertos</p>
          <p className="mt-2 text-3xl font-black text-[#0db39e]">{stats.abiertos}</p>
        </div>
        <div className="rounded-2xl bg-[#fffcf0] p-5 shadow-sm border border-[#fef3c7]/50">
          <p className="text-xs font-semibold text-slate-455 uppercase tracking-wider">En revisión</p>
          <p className="mt-2 text-3xl font-black text-[#f59e0b]">{stats.revision}</p>
        </div>
        <div className="rounded-2xl bg-[#f0fdf4] p-5 shadow-sm border border-[#dcfce7]/50">
          <p className="text-xs font-semibold text-slate-455 uppercase tracking-wider">Resueltos</p>
          <p className="mt-2 text-3xl font-black text-[#10b981]">{stats.resueltos}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row items-center bg-white p-4 rounded-2xl border border-slate-105 shadow-sm w-full">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar reporte por título o enfermero..."
            className="w-full rounded-xl border border-slate-150 py-2 pl-10 pr-4 text-xs bg-slate-50/20 focus:border-teal-400 focus:outline-none focus:ring-0 text-slate-700"
          />
        </div>
        <div className="h-8 w-px bg-slate-105 hidden sm:block"></div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none bg-white text-slate-655 focus:outline-none focus:ring-2 focus:ring-teal-100 cursor-pointer sm:w-48"
        >
          <option>Todos los estados</option>
          <option>Abierto</option>
          <option>En revisión</option>
          <option>Resuelto</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between hover:border-rose-200 transition"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-900">{item.titulo}</h3>
                  <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                    item.estado === "Resuelto" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    item.estado === "En revisión" ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                    "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                    {item.estado}
                  </span>
                  <span className="rounded-lg border border-rose-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-rose-500 uppercase tracking-wide">
                    Prioridad {item.severidad}
                  </span>
                </div>

                <p className="text-xs text-slate-455 font-bold uppercase tracking-wider">
                  <span className="text-slate-500">{item.categoria}</span> · Enfermero: {item.profesional}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {item.fecha}
                  </span>
                  {item.respondido && (
                    <span className="flex items-center gap-1.5 font-bold text-emerald-600 uppercase tracking-wider text-[10px]">
                      <CheckCheck className="h-4 w-4" />
                      Respondido
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(item)}
                className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-655 transition sm:w-auto cursor-pointer shadow-sm text-center"
              >
                Ver detalle
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400 shadow-sm border-dashed">
            No hay reportes para mostrar en esta categoría.
          </div>
        )}
      </div>

      {isNewReportOpen && (
        <NuevoReporteModal
          services={clientServices}
          onClose={() => setIsNewReportOpen(false)}
          onSubmitSuccess={loadData}
          onShowToast={showToast}
        />
      )}

      {selectedReport && (
        <DetalleReporteModal
          reporte={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* TOAST SYSTEM */}
      {toast && toast.show && (
        <div className="fixed top-6 right-6 z-[120] pointer-events-none animate-in fade-in duration-200">
          <div className={`flex items-start gap-3 w-[320px] px-4 py-3.5 rounded-2xl shadow-xl border bg-white pointer-events-auto ${
            toast.type === "success" ? "border-emerald-100 bg-white" : "border-rose-100 bg-white"
          }`}>
            <div className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 ${
              toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              {toast.type === "success" ? <CheckCheck className="h-5 w-5" /> : <X className="h-5 w-5" />}
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