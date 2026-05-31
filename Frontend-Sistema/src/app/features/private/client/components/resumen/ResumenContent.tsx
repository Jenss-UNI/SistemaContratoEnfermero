import { Calendar, Heart, UserRound, Wallet } from "lucide-react";
import { CLIENT_PANEL_BASE } from "../../clientNav";
import {
  PatientSummaryCard,
  PinCodeCard,     // <-- ¡Aquí importamos la tarjeta del PIN!
  PlanSummaryCard,
  SectionHeader,
  ServiceCard,
  StatCard,
} from "../../../../../shared/components/client/resumen";

export default function ResumenContent() {
  const stats = {
    activos: "0",
    proximos: "11",
    pacientes: "2",
    invertido: "S/ 206",
  };

  const planData = {
    planName: "Premium",
    status: "Activo",
    expirationDate: "19 jun. 2026",
    memberSince: "may. 2026",
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

  const pacientes = [
    {
      id: 1,
      name: "Monica Perez",
      details: "34 años • Otro",
      location: "San Isidro",
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      details: "12 años • Hijo/a",
      location: "Miraflores",
    },
  ];

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
        />
        <StatCard
          label="Próximos Servicios"
          value={stats.proximos}
          icon={Calendar}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Mis Pacientes"
          value={stats.pacientes}
          icon={UserRound}
          iconClassName="bg-pink-50 text-pink-600"
        />
        <StatCard
          label="Total Invertido"
          value={stats.invertido}
          icon={Wallet}
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
          title="Mis Pacientes"
          linkTo={`${CLIENT_PANEL_BASE}/mis-pacientes`}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {pacientes.map((paciente) => (
            <PatientSummaryCard key={paciente.id} {...paciente} />
          ))}
        </div>
      </section>
    </div>
  );
}