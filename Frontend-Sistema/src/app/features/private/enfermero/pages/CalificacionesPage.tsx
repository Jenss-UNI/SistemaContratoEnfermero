import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import { Loader2 } from "lucide-react";

interface RatingRow {
  id: number;
  service_id: number;
  client_id: string;
  rating: number;
  calculatedRating?: number;
  punctuality: number;
  treatment: number;
  knowledge: number;
  comment: string | null;
  created_at: string;
  clientName?: string;
  patientName?: string;
  clientPhoto?: string;
}

const ITEMS_PER_PAGE = 6;

function StarRating({ value, max = 5, size = "md" }: { value: number; max?: number; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeMap = { sm: "text-xs", md: "text-sm", lg: "text-2xl", xl: "text-5xl" };
  return (
    <div className="flex items-center gap-0.5 animate-in fade-in duration-200">
      {Array.from({ length: max }, (_, i) => (
        <i
          key={i}
          className={`${sizeMap[size]} ${i < Math.round(value) ? "ri-star-fill text-amber-400" : "ri-star-line text-slate-200"}`}
        ></i>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : date.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default function RatingsManager() {
  const { user } = useAuth();
  
  const [ratings, setRatings] = useState<RatingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailRating, setDetailRating] = useState<RatingRow | null>(null);

  const loadRatings = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ratings")
        .select(`
          id,
          service_id,
          client_id,
          rating,
          punctuality,
          treatment,
          knowledge,
          comment,
          created_at,
          profiles:client_id (
            nombres,
            apellidos_pa,
            foto_url
          ),
          services!inner (
            patient_name
          )
        `)
        .eq("nurse_id", user.id);

      if (error) throw error;

      const mapped: RatingRow[] = (data || []).map((r: any) => {
        const clientProfile = r.profiles;
        const clientName = clientProfile 
          ? `${clientProfile.nombres} ${clientProfile.apellidos_pa || ""}`.trim() 
          : "Cliente";

        const punct = Number(r.punctuality) || 0;
        const treat = Number(r.treatment) || 0;
        const know = Number(r.knowledge) || 0;
        const subAvg = (punct + treat + know) / 3;

        return {
          id: r.id,
          service_id: r.service_id,
          client_id: r.client_id,
          rating: Number(r.rating) || subAvg,
          calculatedRating: subAvg || Number(r.rating) || 0,
          punctuality: punct,
          treatment: treat,
          knowledge: know,
          comment: r.comment || "",
          created_at: r.created_at,
          clientName,
          patientName: r.services?.patient_name || "Paciente",
          clientPhoto: clientProfile?.foto_url || undefined,
        };
      });

      setRatings(mapped);
    } catch (err) {
      console.error("Error fetching nurse ratings:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const filteredRatings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return ratings.filter((rating) => {
      const matchesSearch = normalizedQuery
        ? [rating.clientName, rating.patientName].some((value) =>
            value?.toLowerCase().includes(normalizedQuery)
          )
        : true;

      const matchesRating =
        filterRating === "all"
          ? true
          : Math.round(rating.calculatedRating ?? rating.rating) === filterRating;

      return matchesSearch && matchesRating;
    });
  }, [ratings, searchQuery, filterRating]);

  const totalPages = Math.max(1, Math.ceil(filteredRatings.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    return filteredRatings.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredRatings, currentPage]);

  const getMean = (values: number[]) =>
    values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

  const avgRating = getMean(ratings.map((r) => r.calculatedRating ?? r.rating));
  const avgPunctuality = getMean(ratings.map((r) => r.punctuality));
  const avgTreatment = getMean(ratings.map((r) => r.treatment));
  const avgKnowledge = getMean(ratings.map((r) => r.knowledge));

  const fiveStarCount = ratings.filter(
    (r) => Math.round(r.calculatedRating ?? r.rating) === 5
  ).length;
  
  const positiveCount = ratings.filter(
    (r) => Math.round(r.calculatedRating ?? r.rating) >= 4
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-semibold">Cargando calificaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#fefce8] border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-white border border-amber-100 rounded-xl flex-shrink-0">
            <i className="ri-star-fill text-amber-400 text-2xl animate-pulse"></i>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-slate-500 font-semibold">Promedio general</p>
          </div>
        </div>

        <div className="bg-[#e0f8f5] border border-teal-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-white border border-teal-100 rounded-xl flex-shrink-0">
            <i className="ri-user-voice-line text-teal-500 text-2xl"></i>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">{ratings.length}</p>
            <p className="text-xs text-slate-500 font-semibold">Total calificaciones</p>
          </div>
        </div>

        <div className="bg-[#f0fdf4] border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-white border border-green-100 rounded-xl flex-shrink-0">
            <i className="ri-thumb-up-line text-green-500 text-2xl"></i>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">{positiveCount}</p>
            <p className="text-xs text-slate-500 font-semibold">Positivas (4-5★)</p>
          </div>
        </div>

        <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-white border border-blue-100 rounded-xl flex-shrink-0 shadow-sm">
            <i className="ri-award-line text-blue-500 text-2xl"></i>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-none mb-1">{fiveStarCount}</p>
            <p className="text-xs text-slate-500 font-semibold">5 estrellas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Star Distribution */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-855 mb-5 flex items-center gap-2">
            <i className="ri-bar-chart-grouped-fill text-teal-600"></i>
            Distribución de estrellas
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratings.filter(
                (r) => Math.round(r.calculatedRating ?? r.rating) === star
              ).length;
              const pct = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 w-3 text-right">
                    {star}
                  </span>
                  <i className="ri-star-fill text-amber-400 text-xs shrink-0"></i>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 w-6 text-right font-bold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdowns */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-855 mb-8 flex items-center gap-2">
            <i className="ri-pie-chart-2-line text-teal-600"></i>
            Desglose por categoría
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Puntualidad",
                value: avgPunctuality,
                icon: "ri-timer-line",
                color: "text-teal-600",
                bg: "bg-[#e0f8f5]",
              },
              {
                label: "Trato al paciente",
                value: avgTreatment,
                icon: "ri-heart-line",
                color: "text-rose-500",
                bg: "bg-rose-50",
              },
              {
                label: "Conocimiento técnico",
                value: avgKnowledge,
                icon: "ri-brain-line",
                color: "text-blue-500",
                bg: "bg-blue-55/60",
              },
            ].map((cat) => (
              <div key={cat.label} className="text-center flex flex-col items-center">
                <div className={`w-11 h-11 flex items-center justify-center ${cat.bg} rounded-2xl mb-4 border border-slate-100`}>
                  <i className={`${cat.icon} ${cat.color} text-lg`}></i>
                </div>
                <p className="text-xl font-black text-slate-800 mb-1.5">
                  {cat.value.toFixed(1)}
                </p>
                <div className="mb-2">
                  <StarRating value={cat.value} size="sm" />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por cliente o paciente..."
              className="w-full border-none pl-12 pr-4 py-2 text-xs focus:outline-none focus:ring-0 bg-transparent placeholder:text-slate-400 text-slate-700"
            />
          </div>
          <div className="h-10 w-px bg-slate-105 hidden sm:block"></div>
          <select
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-200 rounded-xl px-4 py-2 text-xs bg-white cursor-pointer text-slate-655 focus:outline-none focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">Todas las estrellas</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} estrellas
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ratings list */}
      <div className="space-y-4">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-xl mx-auto mb-3">
              <i className="ri-star-line text-slate-300 text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-slate-655">No hay calificaciones</p>
            <p className="text-xs text-slate-450 mt-1">
              Intenta cambiar los filtros para ver más resultados
            </p>
          </div>
        ) : (
          paginated.map((r) => {
            const reviewAvg = r.calculatedRating ?? r.rating;
            const initials = (r.clientName || "C")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start sm:items-center gap-4 transition-all duration-200 hover:border-teal-200 hover:shadow-md cursor-pointer"
                onClick={() => setDetailRating(r)}
              >
                {r.clientPhoto ? (
                  <img
                    src={r.clientPhoto}
                    alt={r.clientName}
                    className="w-11 h-11 shrink-0 rounded-full object-cover border border-slate-100"
                  />
                ) : (
                  <div className="w-11 h-11 flex items-center justify-center bg-teal-50 rounded-xl text-teal-700 text-sm font-black flex-shrink-0">
                    {initials}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-800">{r.clientName}</p>
                    <div className="flex items-center gap-1">
                      <StarRating value={reviewAvg} size="sm" />
                      <span className="text-xs font-bold text-amber-500 ml-1">{reviewAvg.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-semibold mb-2">
                    {r.patientName} · {formatDate(r.created_at)}
                  </p>

                  {r.comment && (
                    <p className="text-xs text-slate-550 leading-relaxed italic line-clamp-2">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  )}
                </div>

                <i className="ri-arrow-right-s-line text-slate-400 text-xl flex-shrink-0 ml-2 mt-2 sm:mt-0"></i>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                currentPage === p
                  ? "bg-teal-650 text-white shadow"
                  : "border border-slate-200 text-slate-655 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {detailRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDetailRating(null)}
          ></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setDetailRating(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-655 cursor-pointer z-10"
            >
              <i className="ri-close-line text-lg"></i>
            </button>

            <div className="text-center pt-3 pb-6 border-b border-slate-50 mb-5">
              <div className="flex justify-center mb-3.5 gap-2">
                <StarRating
                  value={(detailRating.punctuality + detailRating.treatment + detailRating.knowledge) / 3}
                  size="lg"
                />
              </div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-black text-slate-800 tracking-tight">
                  {((detailRating.punctuality + detailRating.treatment + detailRating.knowledge) / 3).toFixed(1)}
                </span>
                <span className="text-base text-slate-400 font-bold">/5</span>
              </div>
            </div>

            <div className="mb-5 pl-3 border-l-2 border-teal-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Evaluador
              </p>
              <p className="text-sm font-bold text-slate-800">{detailRating.clientName}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-semibold">Paciente: {detailRating.patientName}</p>
              <p className="text-[10px] text-slate-450 font-medium mt-1">{formatDate(detailRating.created_at)}</p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                {
                  label: "Puntualidad",
                  val: detailRating.punctuality,
                  icon: "ri-timer-line",
                  bg: "bg-[#e0f8f5]",
                  color: "text-teal-600",
                },
                {
                  label: "Trato",
                  val: detailRating.treatment,
                  icon: "ri-heart-line",
                  bg: "bg-rose-50",
                  color: "text-rose-500",
                },
                {
                  label: "Conocimientos",
                  val: detailRating.knowledge,
                  icon: "ri-brain-line",
                  bg: "bg-blue-50",
                  color: "text-blue-55",
                },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className="bg-slate-50/50 rounded-2xl p-3 text-center border border-slate-100"
                >
                  <div className={`w-8 h-8 flex items-center justify-center ${cat.bg} rounded-xl mx-auto mb-2`}>
                    <i className={`${cat.icon} ${cat.color} text-sm`}></i>
                  </div>
                  <p className="text-base font-black text-slate-800 leading-none mb-1">
                    {(cat.val ?? 0).toFixed(1)}
                  </p>
                  <StarRating value={cat.val || 0} size="sm" />
                  <p className="text-[8px] text-slate-400 font-bold uppercase mt-2">{cat.label}</p>
                </div>
              ))}
            </div>

            {detailRating.comment && (
              <div className="mb-6 pl-3 border-l-2 border-amber-400">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <i className="ri-chat-quote-line mr-1"></i>Comentario del Cliente
                </p>
                <p className="text-xs text-slate-650 leading-relaxed italic">
                  &ldquo;{detailRating.comment}&rdquo;
                </p>
              </div>
            )}

            <button
              onClick={() => setDetailRating(null)}
              className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-655 font-bold py-3 rounded-xl cursor-pointer text-xs transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}