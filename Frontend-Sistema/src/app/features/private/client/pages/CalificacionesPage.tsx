import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import { CalendarDays, Star, UserRound, Loader2, X, CheckCheck, Clock, Heart, Brain } from "lucide-react";

interface DBRatingItem {
  id: string; // Service ID
  initials: string;
  professionalName: string;
  type: string;
  patientName: string;
  date: string;
  price: string;
  rating: number;
  comment: string;
  estado: "Calificados" | "Pendientes";
  nurseId: string;
  photo?: string;
  subRatings?: {
    punctuality: number;
    treatment: number;
    knowledge: number;
  };
}

const FILTROS = ["Todos", "Calificados", "Pendientes"];

export default function CalificacionesPage() {
  const { user } = useAuth();
  
  const [items, setItems] = useState<DBRatingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  // Rating modal states
  const [selectedService, setSelectedService] = useState<DBRatingItem | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Stars scoring
  const [punctuality, setPunctuality] = useState(5);
  const [treatment, setTreatment] = useState(5);
  const [knowledge, setKnowledge] = useState(5);
  const [commentText, setCommentText] = useState("");

  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch completed services
      const { data: services, error: servicesErr } = await supabase
        .from("services")
        .select(`
          id,
          created_at,
          service_type,
          patient_name,
          total_amount,
          nurse_id,
          profiles:nurse_id (
            nombres,
            apellidos_pa,
            foto_url
          )
        `)
        .eq("client_id", user.id)
        .eq("status", "completed");

      if (servicesErr) throw servicesErr;

      // 2. Fetch ratings by client
      const { data: ratingsData, error: ratingsErr } = await supabase
        .from("ratings")
        .select(`
          id,
          service_id,
          rating,
          punctuality,
          treatment,
          knowledge,
          comment
        `)
        .eq("client_id", user.id);

      if (ratingsErr) throw ratingsErr;

      const mapped: DBRatingItem[] = (services || []).map((s: any) => {
        const nurseProfile = s.profiles;
        const nurseName = nurseProfile 
          ? `${nurseProfile.nombres} ${nurseProfile.apellidos_pa || ""}`.trim() 
          : "Profesional Cuidame";
        
        const ini = nurseName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
        
        // Find existing rating
        const existingRating = (ratingsData || []).find((r: any) => Number(r.service_id) === s.id);
        const hasRated = !!existingRating;

        return {
          id: String(s.id),
          initials: ini || "PR",
          professionalName: nurseName,
          type: s.service_type || "Asistencia General",
          patientName: s.patient_name || "Paciente",
          date: new Date(s.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" }),
          price: `S/ ${Number(s.total_amount).toLocaleString("es-PE")}`,
          rating: existingRating ? Number(existingRating.rating) : 0,
          comment: existingRating ? existingRating.comment || "" : "",
          estado: hasRated ? "Calificados" : "Pendientes",
          nurseId: s.nurse_id,
          photo: nurseProfile?.foto_url || undefined,
          subRatings: existingRating ? {
            punctuality: Number(existingRating.punctuality) || 0,
            treatment: Number(existingRating.treatment) || 0,
            knowledge: Number(existingRating.knowledge) || 0,
          } : undefined,
        };
      });

      setItems(mapped);
    } catch (err) {
      console.error("Error loading client ratings view:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredCalificaciones = useMemo(() => {
    if (activeFilter === "Todos") return items;
    return items.filter((item) => item.estado === activeFilter);
  }, [items, activeFilter]);

  const handleOpenRating = (item: DBRatingItem) => {
    setSelectedService(item);
    setPunctuality(5);
    setTreatment(5);
    setKnowledge(5);
    setCommentText("");
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !user?.id) return;

    setSaving(true);
    try {
      const avg = (punctuality + treatment + knowledge) / 3;

      const { error } = await supabase
        .from("ratings")
        .insert([
          {
            service_id: Number(selectedService.id),
            nurse_id: selectedService.nurseId,
            client_id: user.id,
            rating: avg,
            punctuality,
            treatment,
            knowledge,
            comment: commentText.trim(),
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      showToast("¡Calificación guardada correctamente! Gracias por tu feedback.", "success");
      setSelectedService(null);
      setActiveFilter("Calificados");
      loadData();
    } catch (err: any) {
      console.error("Error saving rating:", err);
      showToast(`Error al guardar calificación: ${err.message || err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 select-none">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 shrink-0 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const InteractiveStars = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
    return (
      <div className="flex gap-1.5 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="hover:scale-110 transition active:scale-95 cursor-pointer"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? "fill-amber-400 text-amber-400" : "fill-slate-55 text-slate-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Cargando evaluaciones...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Calificaciones Post-Servicio</h1>
          <p className="text-xs text-slate-400">Califica la labor de los enfermeros asignados a tus solicitudes completadas</p>
        </div>
        
        <div className="flex items-center gap-2">
          {FILTROS.map((filtro) => (
            <button
              key={filtro}
              onClick={() => setActiveFilter(filtro)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === filtro
                  ? "border border-teal-500 bg-white text-teal-600"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-55"
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredCalificaciones.length > 0 ? (
          filteredCalificaciones.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 rounded-[1.25rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
            >
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.professionalName}
                  className="h-[3.25rem] w-[3.25rem] shrink-0 rounded-full object-cover border border-slate-100"
                />
              ) : (
                <div className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#0db39e] text-lg font-bold text-white uppercase">
                  {item.initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900">
                    {item.professionalName}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.type}</span>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <UserRound className="h-[14px] w-[14px] text-pink-400" />
                    {item.patientName}
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-[14px] w-[14px] text-teal-500" />
                    {item.date}
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="font-bold text-slate-700">
                    {item.price}
                  </div>
                </div>

                {item.estado === "Calificados" ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50/80 px-3 py-1.5 border border-amber-100 shrink-0 w-fit">
                        <span className="text-[15px] font-black text-amber-500 leading-none">
                          {item.rating.toFixed(1)}
                        </span>
                        {renderStars(item.rating)}
                      </div>
                      {item.comment && (
                        <p className="text-xs italic text-slate-650 font-medium leading-relaxed">
                          &ldquo;{item.comment}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Breakdown de Calificación: Puntualidad, Trato, Técnico */}
                    <div className="rounded-2xl bg-teal-50/40 p-3 border border-teal-100/60 max-w-md">
                      <div className="grid grid-cols-3 gap-2 text-center divide-x divide-teal-100/80">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                            <Clock className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span>{(item.subRatings?.punctuality ?? item.rating).toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Puntualidad</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                            <Heart className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span>{(item.subRatings?.treatment ?? item.rating).toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Trato</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs">
                            <Brain className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span>{(item.subRatings?.knowledge ?? item.rating).toFixed(1)}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Técnico</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenRating(item)}
                    className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
                  >
                    ★ Calificar servicio
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.25rem] border border-slate-100 bg-white p-12 text-center text-xs text-slate-400 shadow-sm border-dashed">
            No hay calificaciones para mostrar en esta categoría.
          </div>
        )}
      </div>

      {/* RATING FORM MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 w-full max-w-md relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-55 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-base font-extrabold text-slate-900 mb-2 mt-2">Calificar Servicio Profesional</h2>
            <p className="text-xs text-slate-450 mb-5 leading-relaxed">
              Tu feedback es anónimo y ayuda a mantener altos estándares de calidad en {selectedService.professionalName}.
            </p>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              {/* Category 1 */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Puntualidad</h4>
                  <p className="text-[10px] text-slate-400">Llegada a las horas pactadas</p>
                </div>
                <InteractiveStars value={punctuality} onChange={setPunctuality} />
              </div>

              {/* Category 2 */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Trato al Paciente</h4>
                  <p className="text-[10px] text-slate-400">Empatía y amabilidad brindadas</p>
                </div>
                <InteractiveStars value={treatment} onChange={setTreatment} />
              </div>

              {/* Category 3 */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Conocimiento Técnico</h4>
                  <p className="text-[10px] text-slate-400">Destreza en tareas clínicas</p>
                </div>
                <InteractiveStars value={knowledge} onChange={setKnowledge} />
              </div>

              {/* Text review comment */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comentario / Opinión Escrita</label>
                <textarea
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ej: Excelente servicio, muy profesional y atento. Recomendado..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  disabled={saving}
                  className="border border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl cursor-pointer text-xs shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Enviar Calificación</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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