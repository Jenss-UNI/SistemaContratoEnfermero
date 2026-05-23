import { Calendar, Heart, UserRound, Wallet } from "lucide-react";
import { CLIENT_PANEL_BASE } from "../../clientNav";
import {
  PatientSummaryCard,
  PinCodeCard,
  PlanSummaryCard,
  SectionHeader,
  ServiceCard,
  StatCard,
} from "../../../../../shared/components/client/resumen";

type ResumenContentProps = {
  onPinRegenerado?: () => void;
};

/** Plantilla Resumen — props vendrán del backend. */
export default function ResumenContent({ onPinRegenerado }: ResumenContentProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <PinCodeCard onPinRegenerado={onPinRegenerado} />
        <PlanSummaryCard />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Servicios Activos" value="—" icon={Heart} />
        <StatCard
          label="Próximos Servicios"
          value="—"
          icon={Calendar}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Mis Pacientes"
          value="—"
          icon={UserRound}
          iconClassName="bg-pink-50 text-pink-600"
        />
        <StatCard label="Total Invertido" value="—" icon={Wallet} />
      </div>

      <section>
        <SectionHeader title="Servicios Activos y Próximos" />
        <div className="space-y-4">
          <ServiceCard />
          <ServiceCard />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Mis Pacientes"
          linkTo={`${CLIENT_PANEL_BASE}/mis-pacientes`}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PatientSummaryCard />
          <PatientSummaryCard />
        </div>
      </section>
    </div>
  );
}
