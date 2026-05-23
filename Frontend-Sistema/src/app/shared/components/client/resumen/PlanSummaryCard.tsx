import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

type PlanSummaryCardProps = {
  planNombre?: string;
  planVence?: string;
  miembroDesde?: string;
  activo?: boolean;
};

export default function PlanSummaryCard({
  planNombre = "—",
  planVence = "—",
  miembroDesde = "—",
  activo = false,
}: PlanSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-teal-500" />
          <h3 className="font-bold text-slate-900">Tu Plan</h3>
        </div>
        {activo && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            Activo
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">{planNombre}</p>
      <p className="mt-1 text-sm text-slate-600">Vence: {planVence}</p>
      <p className="text-sm text-slate-500">Miembro desde: {miembroDesde}</p>

      <Link
        to="/planes"
        className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700"
      >
        Ver planes →
      </Link>
    </div>
  );
}
