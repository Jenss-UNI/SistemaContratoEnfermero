import { Calendar, Heart, UserRound, Wallet, Loader2 } from "lucide-react";
import { CLIENT_PANEL_BASE } from "../../clientNav";
import {
  PinCodeCard,
  PlanSummaryCard,
  SectionHeader,
  ServiceCard,
  StatCard,
} from "../../../../../shared/components/client/resumen";
import { PatientCard } from "../../../../../shared/components/client/mis-pacientes";
import { usePatients } from "../../hooks/usePatients";
import { useClienteProfile } from "../../hooks/useClienteProfile";
import { useAuth } from "../../../../../core/contexts/AuthContext";
import { fetchClientHirings } from "../../services/hiring.service";
import { useState, useEffect } from "react";
import type { Contratacion } from "../../../../../core/models/hiring.model";

interface ResumenContentProps {
  onPinRegenerado?: () => void;
}

export default function ResumenContent({ onPinRegenerado: _onPinRegenerado }: ResumenContentProps) {
  const { user } = useAuth();
  const { patients } = usePatients();
  const { subscription } = useClienteProfile();
  const [contrataciones, setContrataciones] = useState<Contratacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchClientHirings(user.id)
      .then((data) => {
        setContrataciones(data);
      })
      .catch((err) => {
        console.error("Error fetching client hirings in resumen:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const months = ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."];
    const mIdx = parseInt(month, 10) - 1;
    const mName = months[mIdx] || month;
    return `${parseInt(day, 10)} ${mName} ${year}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-3xl shadow-sm border border-slate-100/50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Cargando resumen de cuenta...</p>
      </div>
    );
  }

  const activosCount = contrataciones.filter(c => c.estado === "activo").length;
  const proximosCount = contrataciones.filter(c => c.estado === "pendiente" || c.estado === "confirmado").length;
  const totalInvertido = contrataciones
    .filter(c => c.estado === "completado")
    .reduce((sum, c) => sum + c.montoTotal, 0);

  const stats = {
    activos: String(activosCount),
    proximos: String(proximosCount),
    pacientes: patients.filter(p => p.parentesco !== "Yo mismo").length.toString(),
    invertido: `S/ ${totalInvertido.toLocaleString("es-PE")}`,
  };

  const planData = {
    planName: subscription?.plan_nombre ?? "Sin Plan",
    status: subscription?.status ?? "inactive",
    expirationDate: subscription?.fecha_vence ? formatDate(subscription.fecha_vence) : "—",
    memberSince: subscription?.fecha_inicio ? formatDate(subscription.fecha_inicio) : "—",
    ciclo: subscription?.ciclo ?? "—",
  };

  const activeOrUpcoming = contrataciones.filter(
    (c) => c.estado === "activo" || c.estado === "confirmado" || c.estado === "pendiente"
  );

  const servicios = activeOrUpcoming.map((c) => ({
    id: c.codigoServicio || c.codigo,
    status: c.estado === "activo" ? "Activo" : c.estado === "confirmado" ? "Confirmado" : "Pendiente",
    type: "Asistencial",
    professionalName: c.profesionalNombre,
    specialty: c.especialidad,
    patientName: c.paciente,
    dateRange: `${formatDate(c.periodoInicio)} — ${formatDate(c.periodoFin)}`,
    schedule: c.duracionHoras > 0 ? `${c.duracionHoras} horas` : "Horario variable",
    rate: c.duracionHoras > 0 ? `S/ ${(c.montoTotal / c.duracionHoras).toFixed(0)}/hr` : "Tarifa fija",
    total: `S/ ${c.montoTotal.toLocaleString("es-PE")}`,
    hours: `${c.duracionDias} días`,
  }));

  const familyMembers = patients.filter(p => p.parentesco !== "Yo mismo");

  return (
    <div className="space-y-8 w-full">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <PinCodeCard />
        <PlanSummaryCard {...planData} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Servicios Activos"
          value={stats.activos}
          icon={Heart}
          iconClassName="bg-teal-50 text-teal-500"
        />
        <StatCard
          label="Próximos Servicios"
          value={stats.proximos}
          icon={Calendar}
          iconClassName="bg-amber-50 text-amber-500"
        />
        <StatCard
          label="Mis Familiares"
          value={stats.pacientes}
          icon={UserRound}
          iconClassName="bg-pink-50 text-pink-500"
        />
        <StatCard
          label="Total Invertido"
          value={stats.invertido}
          icon={Wallet}
          iconClassName="bg-teal-50 text-teal-500"
        />
      </div>

      <section>
        <SectionHeader title="Servicios Activos y Próximos" />
        <div className="space-y-4">
          {servicios.length > 0 ? (
            servicios.map((servicio) => (
              <ServiceCard key={servicio.id} {...servicio} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
              <p className="text-sm text-slate-500">No tienes servicios activos o próximos programados.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Mis Familiares"
          linkTo={`${CLIENT_PANEL_BASE}/mis-familiares`}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {familyMembers.length > 0 ? (
            familyMembers.slice(0, 2).map((paciente) => (
              <PatientCard key={paciente.id} patient={paciente} />
            ))
          ) : (
            <p className="text-sm text-slate-500 col-span-2">Aún no tienes familiares registrados.</p>
          )}
        </div>
      </section>
    </div>
  );
}