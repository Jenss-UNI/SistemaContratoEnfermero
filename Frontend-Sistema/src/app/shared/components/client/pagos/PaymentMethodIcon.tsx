import { CreditCard, Smartphone } from "lucide-react";
import type { PaymentMethodType } from "../../../../core/models/payment.model";

type PaymentMethodIconProps = {
  tipo: PaymentMethodType;
  className?: string;
  compact?: boolean;
};

const STYLES: Record<PaymentMethodType, string> = {
  tarjeta: "bg-slate-800 text-white",
  yape: "bg-violet-600 text-white",
  plin: "bg-sky-500 text-white",
};

export default function PaymentMethodIcon({
  tipo,
  className = "",
  compact = false,
}: PaymentMethodIconProps) {
  const size = compact ? "h-11 w-11 rounded-lg" : "h-11 w-11 rounded-xl sm:h-12 sm:w-12";
  const iconSize = compact ? "h-4 w-4" : "h-5 w-5";
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${size} ${STYLES[tipo]} ${className}`}
      aria-hidden
    >
      {tipo === "tarjeta" ? (
        <CreditCard className={iconSize} />
      ) : (
        <Smartphone className={iconSize} />
      )}
    </div>
  );
}

export function VisaBrandMark() {
  return (
    <span className="text-[10px] font-black tracking-tight text-white sm:text-xs">VISA</span>
  );
}
