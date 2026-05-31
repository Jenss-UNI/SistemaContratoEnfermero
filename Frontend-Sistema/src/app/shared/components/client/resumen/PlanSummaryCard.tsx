import { Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type PlanSummaryCardProps = {
  planName?: string;
  status?: string;
  expirationDate?: string;
  memberSince?: string;
};

export default function PlanSummaryCard({
  planName = "—",
  status = "—",
  expirationDate = "—",
  memberSince = "—",
}: PlanSummaryCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tu Plan</p>
              <h3 className="text-lg font-bold text-slate-900">{planName}</h3>
            </div>
          </div>
          {status === "Activo" && (
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
              Activo
            </span>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Vence</span>
            <span className="font-medium text-slate-700">{expirationDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Miembro desde</span>
            <span className="font-medium text-slate-700">{memberSince}</span>
          </div>
        </div>
      </div>

      <Link
        to="/planes"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-500 py-2.5 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
      >
        Cambiar o renovar plan
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}