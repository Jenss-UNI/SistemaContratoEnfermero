import {
  CalendarDays, Clock3, CheckCircle2, Wallet, ChevronRight, Calendar, FileText, MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumenPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-6">

      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 shadow-sm text-white">
        <p className="text-sm opacity-90">
          Bienvenido de vuelta
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Carlos Sanchez Martinez
        </h1>

        <p className="text-sm mt-2 opacity-90">
          Tienes 1 servicio programado y 0 pendientes de confirmación
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <MetricCard
          icon={<CalendarDays className="h-5 w-5 text-teal-600" />}
          value="1"
          label="Servicios activos"
        />

        <MetricCard
          icon={<Clock3 className="h-5 w-5 text-amber-500" />}
          value="0"
          label="Pendientes"
        />

        <MetricCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          value="1"
          label="Completados"
        />

        <MetricCard
          icon={<Wallet className="h-5 w-5 text-violet-600" />}
          value="S/ 65"
          label="En custodia"
        />
      </div>

      {/* Sección Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Próximos Servicios */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-sm">

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

          <div className="border border-slate-100 rounded-xl p-4 hover:border-teal-200 transition">

            <div className="flex items-start justify-between">

              <div className="flex gap-4">

                <div className="h-14 w-14 rounded-xl bg-teal-50 flex flex-col items-center justify-center border border-teal-100">
                  <span className="text-lg font-bold text-teal-600">
                    13
                  </span>
                  <span className="text-[10px] font-bold text-teal-500 uppercase">
                    Jun
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">
                    Roberto Pasco
                  </h4>

                  <p className="text-xs text-slate-400 mt-1">
                    Servicio Especializado
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    12:00 PM - 1:00 PM
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full">
                Confirmado
              </span>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="space-y-6">

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

          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">

            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Solicitudes Pendientes
            </h3>

            <div className="flex flex-col items-center justify-center py-8">

              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock3 className="h-5 w-5 text-slate-400" />
              </div>

              <p className="text-xs text-slate-400 mt-3 text-center">
                No tienes solicitudes pendientes
              </p>
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

          <button className="text-xs font-semibold text-teal-600">
            Ver todo
          </button>
        </div>

        <div className="space-y-4">

          <ActivityItem
            title="Servicio completado"
            description="Atención asistencial para Carmen Mendoza"
            time="Hace 2 días"
          />

          <ActivityItem
            title="Bitácora enviada"
            description="Registro clínico enviado correctamente"
            time="Hace 4 días"
          />

          <ActivityItem
            title="Perfil actualizado"
            description="Cambios guardados en información profesional"
            time="Hace 1 semana"
          />

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
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>

      <h2 className="text-3xl font-bold text-slate-800">
        {value}
      </h2>

      <p className="text-xs text-slate-400 mt-1">
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

        <span className="text-sm font-medium text-slate-700">
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
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-500"></div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>

        <p className="text-[11px] text-slate-400 mt-1">
          {time}
        </p>
      </div>
    </div>
  );
}