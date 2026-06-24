import { CircleDot, FileText, Target, Wallet } from "lucide-react";

type ContratacionStatsProps = {
  totalContratos: number;
  activos: number;
  enCustodia: number;
  totalInvertido: number;
};

export default function ContratacionStats({
  totalContratos,
  activos,
  enCustodia,
  totalInvertido,
}: ContratacionStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* Total contratos */}
      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <FileText className="h-4 w-4" />
          <p className="text-xs font-medium">Total contratos</p>
        </div>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {totalContratos}
        </p>
      </div>

      {/* Activos */}
      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-teal-500">
          <CircleDot className="h-4 w-4" />
          <p className="text-xs font-medium">Activos</p>
        </div>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-teal-600">
          {activos}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-amber-500">
          <Wallet className="h-4 w-4" />
          <p className="text-xs font-medium">En custodia</p>
        </div>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-amber-500">
          S/ {enCustodia.toLocaleString("es-PE")}
        </p>
      </div>

      {/* Total invertido */}
      <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-500">
          <Target className="h-4 w-4" />
          <p className="text-xs font-medium">Total invertido</p>
        </div>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">
          S/ {totalInvertido.toLocaleString("es-PE")}
        </p>
      </div>
    </div>
  );
}