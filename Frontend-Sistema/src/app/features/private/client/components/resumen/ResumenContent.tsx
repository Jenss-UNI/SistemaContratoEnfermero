import { Calendar, Heart, UserRound, Wallet } from "lucide-react";
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

interface ResumenContentProps {
  onPinRegenerado?: () => void;
}

export default function ResumenContent({ onPinRegenerado: _onPinRegenerado }: ResumenContentProps) {
  const { patients } = usePatients();
  const { subscription } = useClienteProfile();
  
  const stats = {
    activos: "0",
    proximos: "11",
    pacientes: patients.filter(p => p.parentesco !== "Yo mismo").length.toString(),
    invertido: "S/ 206",
  };

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

  const planData = {
    planName: subscription?.plan_nombre ?? "Sin Plan",
    status: subscription?.status ?? "inactive",
    expirationDate: subscription?.fecha_vence ? formatDate(subscription.fecha_vence) : "—",
    memberSince: subscription?.fecha_inicio ? formatDate(subscription.fecha_inicio) : "—",
    ciclo: subscription?.ciclo ?? "—",
  };

  const servicios = [
    {
      id: "SER-000069",
      status: "Pendiente",
      type: "Asistencial",
      professionalName: "Carlos Sanchez Martinez",
      specialty: "Geriatría y Cuidado del Adulto Mayor",
      patientName: "Elena Rodriguez",
      dateRange: "03 jun. 2026 — 03 jun. 2026",
      schedule: "0:00 - 6:00",
      rate: "S/ 20/hr",
      total: "S/ 120",
      hours: "6 hrs",
    },
    {
      id: "SER-000068",
      status: "Pendiente",
      type: "Asistencial",
      professionalName: "Carlos Sanchez Martinez",
      specialty: "Geriatría y Cuidado del Adulto Mayor",
      patientName: "Elena Rodriguez",
      dateRange: "17 jun. 2026 — 17 jun. 2026",
      schedule: "0:00 - 6:00",
      rate: "S/ 20/hr",
      total: "S/ 120",
      hours: "6 hrs",
    },
    {
      id: "SER-000067",
      status: "Pendiente",
      type: "Asistencial",
      professionalName: "Carlos Sanchez Martinez",
      specialty: "Geriatría y Cuidado del Adulto Mayor",
      patientName: "Elena Rodriguez",
      dateRange: "09 jun. 2026 — 09 jun. 2026",
      schedule: "7:00 - 13:00",
      rate: "S/ 20/hr",
      total: "S/ 120",
      hours: "6 hrs",
    },
    {
      id: "SER-000041",
      status: "Confirmado",
      type: "Acompañamiento",
      professionalName: "Carlos Sanchez Martinez",
      specialty: "Geriatría y Cuidado del Adulto Mayor",
      patientName: "Monica Perez",
      dateRange: "29 may. 2026 — 29 may. 2026",
      schedule: "8:00 - 13:00",
      rate: "S/ 15/hr",
      total: "S/ 75",
      hours: "5 hrs",
    },
  ];

  // We only show real family members (excluding "Yo mismo") in this section.
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
          {servicios.map((servicio) => (
            <ServiceCard key={servicio.id} {...servicio} />
          ))}
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