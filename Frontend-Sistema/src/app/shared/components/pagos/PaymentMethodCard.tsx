import { Trash2 } from "lucide-react";
import type { PaymentMethod } from "../../../core/models/payment.model";
import PaymentMethodIcon, { VisaBrandMark } from "./PaymentMethodIcon";
import { getMethodSubtitle, getMethodTitle } from "./paymentUtils";

type PaymentMethodCardProps = {
  method: PaymentMethod;
  onSetPrincipal: () => void;
  onDelete: () => void;
};

export default function PaymentMethodCard({
  method,
  onSetPrincipal,
  onDelete,
}: PaymentMethodCardProps) {
  const isPrincipal = method.esPrincipal;

  return (
    <article
      className={`flex items-center justify-between gap-3 rounded-xl border bg-white px-3 py-3.5 ${
        isPrincipal ? "border-teal-400" : "border-slate-100"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {method.tipo === "tarjeta" ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800">
            <VisaBrandMark />
          </div>
        ) : (
          <PaymentMethodIcon tipo={method.tipo} compact />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-bold text-slate-900">{getMethodTitle(method)}</h3>
            {isPrincipal && (
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                Principal
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{getMethodSubtitle(method)}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {!isPrincipal && (
          <button
            type="button"
            onClick={onSetPrincipal}
            className="whitespace-nowrap text-xs font-semibold text-teal-600 transition hover:text-teal-700"
          >
            Usar principal
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label="Eliminar método de pago"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
