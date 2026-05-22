import { CheckCircle2, Clock } from "lucide-react";
import type { PaymentHistoryStatus } from "../../../core/models/payment.model";

const CONFIG: Record<
  PaymentHistoryStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  pagado: {
    label: "Pagado",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  custodia: {
    label: "En Custodia",
    className: "bg-teal-50 text-teal-700",
    icon: CheckCircle2,
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-50 text-amber-700",
    icon: Clock,
  },
};

type PaymentStatusBadgeProps = {
  status: PaymentHistoryStatus;
};

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const { label, className, icon: Icon } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
