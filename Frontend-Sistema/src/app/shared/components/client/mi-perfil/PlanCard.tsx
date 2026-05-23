import { Link } from "react-router-dom";

type PlanCardProps = {
  planNombre?: string;
  planVence?: string;
};

export default function PlanCard({ planNombre, planVence }: PlanCardProps) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4 sm:p-5">
      <h3 className="text-sm font-bold text-slate-900">Mi Plan</h3>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-900">{planNombre ?? "—"}</p>
          <p className="text-sm text-slate-600">
            {planVence ? `Vence el ${planVence}` : "Fecha de vencimiento pendiente"}
          </p>
        </div>
        <Link
          to="/planes"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-teal-500 px-4 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
        >
          Cambiar plan
        </Link>
      </div>
    </div>
  );
}
