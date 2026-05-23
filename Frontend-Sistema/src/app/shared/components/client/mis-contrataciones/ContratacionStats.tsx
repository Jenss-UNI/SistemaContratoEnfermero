import { CircleDot, FileText, Target, Wallet } from "lucide-react";
import StatCard from "../resumen/StatCard";

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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total contratos" value={totalContratos} icon={FileText} />
      <StatCard
        label="Activos"
        value={activos}
        icon={CircleDot}
        iconClassName="bg-teal-50 text-teal-600"
      />
      <StatCard
        label="En custodia"
        value={`S/ ${enCustodia.toLocaleString("es-PE")}`}
        icon={Wallet}
        iconClassName="bg-amber-50 text-amber-600"
      />
      <StatCard
        label="Total invertido"
        value={`S/ ${totalInvertido.toLocaleString("es-PE")}`}
        icon={Target}
        iconClassName="bg-emerald-50 text-emerald-600"
      />
    </div>
  );
}
