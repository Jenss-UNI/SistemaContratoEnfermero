import { User, FileText, ShieldCheck, Hourglass } from "lucide-react";
import { useContratosRecientes, useResumenCards } from "../hooks/useResumenData";

const statusStyle: Record<string, string> = {
  confirmado: "bg-blue-100 text-blue-700",
  activo: "bg-[#ccfbf1] text-[#0f766e]",
  cancelado: "bg-rose-100 text-rose-600",
  completado: "bg-[#d1fae5] text-[#059669]",
};

function formatAmount(amount: number | null): string {
  return `S/ ${amount ?? 0}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function ResumenPage() {
  const { data: stats, isLoading: loadingStats } = useResumenCards();
  const { data: contratos, isLoading: loadingContratos } = useContratosRecientes();

  if (loadingStats || loadingContratos) return <div>Cargando...</div>;

  const statCards = [
    { label: "Enfermeros activos", value: stats?.enfermerosActivos ?? 0, icon: Hourglass, colorClass: "text-[#0f766e]", bgClass: "bg-[#f0fdfa]" },
    { label: "Clientes registrados", value: stats?.clientesRegistrados ?? 0, icon: User, colorClass: "text-rose-500", bgClass: "bg-rose-50" },
    { label: "Contratos activos", value: stats?.contratosActivos ?? 0, icon: FileText, colorClass: "text-[#d97706]", bgClass: "bg-[#fffbeb]" },
    { label: "Verificaciones pendientes", value: stats?.verificacionesPendientes ?? 0, icon: ShieldCheck, colorClass: "text-orange-500", bgClass: "bg-orange-50" },
  ];

  const summaryCards = [
    { title: "Total en custodia", value: formatAmount(stats?.totalCustodia ?? 0), detail: "Servicios activos y pendientes", valueColor: "text-[#0f766e]" },
    { title: "Ingresos del mes", value: formatAmount(stats?.ingresosMes ?? 0), detail: "Servicios completados", valueColor: "text-[#0f766e]" },
    { title: "Comisión estimada (10%)", value: formatAmount(stats?.comision ?? 0), detail: "Del mes actual", valueColor: "text-[#d97706]" },
  ];

  return (
    <div className="w-full space-y-6">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className={`mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ${item.bgClass}`}>
              <item.icon className={`h-4 w-4 ${item.colorClass}`} strokeWidth={2} />
            </div>
            <p className={`text-lg font-bold ${item.colorClass}`}>{item.value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {summaryCards.map((card, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-[12px] font-medium text-slate-500">{card.title}</p>
            <p className={`mt-1.5 text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
            <p className="mt-1 text-[11px] font-medium text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-900">Contratos Recientes</h2>

        <div className="overflow-x-auto">
          <table className="min-w-[720px] table-auto w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-500">
                <th className="px-2 pb-3 font-medium">Código</th>
                <th className="px-2 pb-3 font-medium">Paciente</th>
                <th className="px-2 pb-3 font-medium">Tipo</th>
                <th className="px-2 pb-3 font-medium">Estado</th>
                <th className="px-2 pb-3 font-medium">Monto</th>
                <th className="px-2 pb-3 font-medium">Fecha</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {(contratos ?? []).length > 0 ? (
                contratos!.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-2 py-2.5 text-[11px] font-medium text-slate-700">
                      {c.contract_code || `#${c.id}`}
                    </td>
                    <td className="px-2 py-2.5 text-[11px] font-medium text-slate-700">
                      {c.patient_name || 'Sin nombre'}
                    </td>
                    <td className="px-2 py-2.5 text-[11px] font-medium text-slate-500">
                      {c.service_type || '-'}
                    </td>
                    <td className="px-2 py-2.5">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyle[c.status?.toLowerCase() || ''] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status || '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-[11px] font-bold text-slate-900">
                      {formatAmount(c.total_amount)}
                    </td>
                    <td className="px-2 py-2.5 text-[11px] font-medium text-slate-500">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[13px] font-medium text-slate-400">
                    No se encontraron contratos recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}