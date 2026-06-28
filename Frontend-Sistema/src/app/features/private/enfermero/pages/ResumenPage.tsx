import { useEffect, useState } from "react";
import {
  CalendarDays, Clock3, CheckCircle2, Wallet, ChevronRight, Calendar, FileText, MapPin, Loader2, Check, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import {
  fetchDashboardMetrics,
  respondToServiceRequest,
} from "../services/enfermeroProfile.service";
import type { DashboardMetrics } from "../services/enfermeroProfile.service";

export default function ResumenPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      
      // 1. Cargar métricas del dashboard
      const data = await fetchDashboardMetrics(user.id);
      setMetrics(data);

      // 2. Cargar el nombre completo del enfermero
      const { data: profile } = await supabase
        .from("profiles")
        .select("nombres, apellidos_pa, apellidos_ma")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setFullName(`${profile.nombres} ${profile.apellidos_pa} ${profile.apellidos_ma}`);
      }
    } catch (err: any) {
      console.error("[Dashboard] Error al cargar los datos:", err);
      setError(err.message || "Error al conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleAction = async (serviceId: number, action: "confirm" | "cancel") => {
    setActionId(serviceId);
    try {
      await respondToServiceRequest(serviceId, action);
      await loadData();
    } catch (err: any) {
      console.error("[Dashboard] Error al procesar solicitud:", err);
      alert("Error al procesar la solicitud: " + (err.message || "Inténtalo de nuevo"));
    } finally {
      setActionId(null);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-sm font-semibold text-slate-500">Cargando resumen del panel...</p>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
        <p className="text-sm font-bold text-rose-800">Error de Conexión</p>
        <p className="text-xs text-rose-600 mt-2">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const upcomingCount = metrics?.upcomingServices?.length || 0;
  const pendingRequestsCount = metrics?.pendingRequests?.length || 0;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">

      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 shadow-sm text-white">
        <p className="text-sm opacity-90">
          Bienvenido de vuelta
        </p>

        <h1 className="text-3xl font-bold mt-1">
          {fullName || "Profesional de la Salud"}
        </h1>

        <p className="text-sm mt-2 opacity-90">
          Tienes {upcomingCount} servicio{upcomingCount !== 1 ? "s" : ""} programado{upcomingCount !== 1 ? "s" : ""} y {pendingRequestsCount} pendiente{pendingRequestsCount !== 1 ? "s" : ""} de confirmación
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <MetricCard
          icon={<CalendarDays className="h-5 w-5 text-teal-600" />}
          value={String(metrics?.activeServices || 0)}
          label="Servicios activos"
        />

        <MetricCard
          icon={<Clock3 className="h-5 w-5 text-amber-500" />}
          value={String(metrics?.pendingServices || 0)}
          label="Pendientes"
        />

        <MetricCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          value={String(metrics?.completedServices || 0)}
          label="Completados"
        />

        <MetricCard
          icon={<Wallet className="h-5 w-5 text-violet-600" />}
          value={`S/ ${metrics?.inCustodyAmount || 0}`}
          label="En custodia"
        />
      </div>

      {/* Sección Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Próximos Servicios */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col">

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-800">
              Próximos Servicios
            </h3>

            <button
              onClick={() => navigate("../mi-agenda")}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition cursor-pointer"
            >
              Ver agenda completa
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {!metrics?.upcomingServices || metrics.upcomingServices.length === 0 ? (
              <div className="h-full min-h-[120px] flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl p-6">
                <Calendar className="h-8 w-8 text-slate-350" />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  No tienes próximos servicios programados
                </p>
              </div>
            ) : (
              metrics.upcomingServices.map((item, idx) => {
                const parts = item.dateStr.split(" ");
                const day = parts[0] || "";
                const month = parts[1] || "";

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="border border-slate-100 rounded-xl p-4 hover:border-teal-200 hover:bg-slate-50/20 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="h-14 w-14 rounded-xl bg-teal-50 flex flex-col items-center justify-center border border-teal-100 shrink-0">
                          <span className="text-lg font-bold text-teal-600 leading-none">
                            {day}
                          </span>
                          <span className="text-[10px] font-bold text-teal-500 uppercase mt-0.5">
                            {month}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">
                            {item.patient_name || "Paciente"}
                          </h4>

                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.service_type || "Servicio General"}
                          </p>

                          <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1">
                            <Clock3 className="h-3 w-3 text-slate-400" />
                            {item.timeStr}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full capitalize ${
                        item.status === "active"
                          ? "bg-teal-50 text-teal-600 border-teal-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}>
                        {item.status === "active" ? "Activo" : "Confirmado"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Acciones rápidas & Solicitudes */}
        <div className="space-y-6">

          {/* Acciones Rápidas */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Acciones rápidas
            </h3>

            <div className="space-y-3">
              <QuickAction
                icon={<Calendar className="h-4 w-4" />}
                title="Configurar disponibilidad"
                onClick={() => navigate("../mi-agenda")}
              />

              <QuickAction
                icon={<FileText className="h-4 w-4" />}
                title="Subir documentos"
                onClick={() => navigate("../verificacion")}
              />

              <QuickAction
                icon={<MapPin className="h-4 w-4" />}
                title="Editar zonas de atención"
                onClick={() => navigate("../mi-perfil")}
              />
            </div>
          </div>

          {/* Solicitudes Pendientes */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Solicitudes Pendientes
            </h3>

            <div className="space-y-4">
              {!metrics?.pendingRequests || metrics.pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Clock3 className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-450 mt-3 text-center">
                    No tienes solicitudes pendientes
                  </p>
                </div>
              ) : (
                metrics.pendingRequests.map((req) => (
                  <div key={req.id} className="border border-slate-100 rounded-xl p-3.5 space-y-3 bg-slate-50/10">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">
                        {req.patient_name || "Paciente nuevo"}
                      </h4>
                      <p className="text-[11px] text-slate-450 mt-0.5">
                        {req.service_type || "Cuidado general"}
                      </p>
                      {req.notes && (
                        <p className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100 italic">
                          "{req.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(req.id, "confirm")}
                        disabled={actionId !== null}
                        className="flex-1 py-1.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {actionId === req.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "cancel")}
                        disabled={actionId !== null}
                        className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-800">
            Actividad reciente
          </h3>

          <button
            onClick={() => navigate("../mis-servicios")}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
          >
            Ver historial
          </button>
        </div>

        <div className="space-y-4">
          {!metrics?.recentActivity || metrics.recentActivity.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No registras actividad reciente todavía.</p>
          ) : (
            metrics.recentActivity.map((activity) => (
              <ActivityItem
                key={activity.id}
                title={activity.title}
                description={activity.description}
                time={activity.timeStr}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}

/* COMPONENTES */

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:border-slate-200 transition">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
        {icon}
      </div>

      <h2 className="text-3xl font-bold text-slate-800">
        {value}
      </h2>

      <p className="text-xs text-slate-400 mt-1 font-medium">
        {label}
      </p>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-teal-200 hover:bg-teal-50/30 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="text-teal-600">{icon}</div>

        <span className="text-sm font-semibold text-slate-650">
          {title}
        </span>
      </div>

      <ChevronRight className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></div>

      <div>
        <p className="text-xs font-bold text-slate-700">
          {title}
        </p>

        <p className="text-xs text-slate-450 mt-0.5">
          {description}
        </p>

        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
          {time}
        </p>
      </div>
    </div>
  );
}
