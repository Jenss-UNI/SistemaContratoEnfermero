import { CheckCircle2, Circle, Clock, FileCheck } from "lucide-react";
import type { ContratacionEstado } from "../../../../core/models/hiring.model";

const CONFIG: Record<
  ContratacionEstado,
  { label: string; className: string; icon: typeof Clock }
> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-50 text-amber-700",
    icon: Clock,
  },
  confirmado: {
    label: "Confirmado",
    className: "bg-sky-50 text-sky-700",
    icon: FileCheck,
  },
  activo: {
    label: "Activo",
    className: "bg-emerald-50 text-emerald-700",
    icon: Circle,
  },
  completado: {
    label: "Completado",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
};

type ContratacionStatusBadgeProps = {
  estado: ContratacionEstado;
};

export default function ContratacionStatusBadge({ estado }: ContratacionStatusBadgeProps) {
  const { label, className, icon: Icon } = CONFIG[estado];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
