import { CheckCircle2, Circle, Clock, FileCheck } from "lucide-react";
import type { ContratacionEstado } from "../../../../core/models/hiring.model";

const CONFIG: Record<
  ContratacionEstado,
  { label: string; className: string; icon: typeof Clock }
> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-50 text-amber-700 border border-amber-200/50",
    icon: Clock,
  },
  firma_requerida: {
    label: "Firma Requerida",
    className: "bg-orange-50 text-orange-705 border border-orange-200/50 text-orange-750",
    icon: FileCheck,
  },
  confirmado: {
    label: "Confirmado",
    className: "bg-sky-50 text-sky-700 border border-sky-200/50",
    icon: Circle,
  },
  en_curso: {
    label: "En curso",
    className: "bg-teal-50 text-teal-700 border border-teal-200/50",
    icon: Circle,
  },
  completado: {
    label: "Completado",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
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
