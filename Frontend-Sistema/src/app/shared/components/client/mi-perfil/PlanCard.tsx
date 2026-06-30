import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "../../../components/Toast";

type PlanCardProps = {
  planNombre?: string;
  planVence?: string;
  ciclo?: string;
  status?: string;
  onCancelSubscription?: () => Promise<void>;
};

export default function PlanCard({
  planNombre,
  planVence,
  ciclo,
  status,
  onCancelSubscription,
}: PlanCardProps) {
  const toast = useToast();
  const [cancelling, setCancelling] = useState(false);

  const isExpired = status === "expired" || (planVence ? new Date(planVence) < new Date() : false);
  const isCancelled = status === "cancelled";
  
  const planClean = planNombre?.toLowerCase() || "";
  const isFamiliar = planClean === "familiar";
  const isAnual = ciclo === "anual";

  // Determinar acción
  let buttonText = "Cambiar plan";
  let targetUrl = "/planes";
  let showButton = true;

  if (isExpired) {
    buttonText = "Renovar plan";
    targetUrl = "/planes?mode=renew";
  } else {
    if (isFamiliar && isAnual) {
      showButton = false;
    } else if (isFamiliar && !isAnual) {
      buttonText = "Cambiar a anual";
      targetUrl = `/planes?mode=upgrade`;
    } else {
      buttonText = "Mejorar plan";
      targetUrl = `/planes?mode=upgrade`;
    }
  }

  const handleCancel = async () => {
    const ok = window.confirm(
      "¿Seguro que deseas cancelar la renovación automática de tu plan? Mantendrás el acceso y todos tus beneficios hasta la fecha de vencimiento."
    );
    if (!ok || !onCancelSubscription) return;

    setCancelling(true);
    try {
      await onCancelSubscription();
    } catch (err: any) {
      toast.error("Error al cancelar la suscripción: " + (err.message || err));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Mi Plan</h3>
        {status === "active" && !isExpired && (
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
            Activo
          </span>
        )}
        {isCancelled && !isExpired && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            No se renovará
          </span>
        )}
        {isExpired && (
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
            Vencido
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-900">
            {planNombre ?? "—"} <span className="text-xs font-normal text-slate-500">({ciclo || "—"})</span>
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {isExpired
              ? "Tu suscripción ha vencido. Renueva para continuar."
              : planVence
              ? `Vence el ${planVence}`
              : "Fecha de vencimiento pendiente"}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          {showButton && (
            <Link
              to={targetUrl}
              className="inline-flex items-center justify-center rounded-xl border border-teal-500 bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              {buttonText}
            </Link>
          )}

          {status === "active" && !isExpired && onCancelSubscription && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium underline inline-flex items-center gap-1 disabled:opacity-50"
            >
              {cancelling && <Loader2 className="w-3 h-3 animate-spin" />}
              Cancelar renovación
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
