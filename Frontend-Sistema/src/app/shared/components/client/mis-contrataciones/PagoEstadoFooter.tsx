import { CheckCircle2, Clock, Shield } from "lucide-react";
import type { PagoEstado } from "../../../../core/models/hiring.model";

const CONFIG: Record<
  PagoEstado,
  { label: string; className: string; icon: typeof Shield }
> = {
  pendiente: {
    label: "Pendiente",
    className: "text-slate-500",
    icon: Clock,
  },
  preautorizado: {
    label: "Preautorizado",
    className: "text-amber-600",
    icon: Shield,
  },
  liberado: {
    label: "Liberado",
    className: "text-emerald-600",
    icon: CheckCircle2,
  },
};

type PagoEstadoFooterProps = {
  estado: PagoEstado;
  codigo?: string;
  codigoExtra?: string;
};

export default function PagoEstadoFooter({
  estado,
  codigo,
  codigoExtra,
}: PagoEstadoFooterProps) {
  const { label, className, icon: Icon } = CONFIG[estado];
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {codigo && <span className="font-mono text-xs text-slate-500">{codigo}</span>}
      {codigoExtra && (
        <span className="font-mono text-xs text-slate-500">{codigoExtra}</span>
      )}
      <span className={`inline-flex items-center gap-1.5 font-medium ${className}`}>
        <Icon className="h-4 w-4" />
        {label}
      </span>
    </div>
  );
}
