import { useState, useRef, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { useContratos, useContratoStats, useLiberarPago, useCancelarContrato } from "../hooks/useContratosData";

type PaymentStatus = "Custodia" | "Liberado" | "Reembolsado";

const FILTERS = ["Todos", "Activo", "Pendiente", "Confirmado", "Completado", "Cancelado"];

const statusStyle: Record<string, string> = {
  Pendiente: "bg-[#fffbeb] text-[#d97706]",
  Activo: "bg-[#ccfbf1] text-[#0db39e]",
  Confirmado: "bg-blue-50 text-blue-600",
  Completado: "bg-[#d1fae5] text-[#059669]",
  Cancelado: "bg-rose-50 text-rose-500",
};

const paymentStyle: Record<string, string> = {
  Custodia: "bg-[#fffbeb] text-[#d97706]",
  Liberado: "bg-[#ccfbf1] text-[#0db39e]",
  Reembolsado: "bg-rose-50 text-rose-500",
};

const statusLabelMap: Record<string, string> = {
  active: 'Activo',
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

function formatAmount(amount: number | null): string {
  return `S/ ${(amount ?? 0).toLocaleString('es-PE')}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function getPaymentLabel(paymentStatus: string | null): PaymentStatus {
  if (paymentStatus === 'released') return 'Liberado';
  if (paymentStatus === 'refunded') return 'Reembolsado';
  return 'Custodia';
}

export default function ContratosPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useContratoStats();
  const { data: contratos, isLoading } = useContratos(search, statusFilter);
  const liberarMutation = useLiberarPago();
  const cancelarMutation = useCancelarContrato();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setSearch(value);
    }
  };

  const hasActiveFilters = statusFilter !== "Todos" || search !== "";
  const emptyMessage = hasActiveFilters
    ? "No se encontraron contratos con los filtros actuales."
    : "No se encontraron contratos.";

  return (
    <div className="w-full space-y-6">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">Total contratos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats?.totalContratos ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">En custodia</p>
          <p className="mt-2 text-3xl font-bold text-[#d97706]">{formatAmount(stats?.enCustodia ?? 0)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">Total liberado</p>
          <p className="mt-2 text-3xl font-bold text-[#10b981]">{formatAmount(stats?.totalLiberado ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">

        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-[15px] font-bold text-slate-900">Contratos del Sistema</h2>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={handleSearchChange}
                className="w-48 rounded-2xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#0db39e] sm:w-64"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13px] font-bold transition-colors ${showFilters || statusFilter !== "Todos"
                    ? "border-[#0db39e] bg-[#f0fdfa] text-[#0db39e]"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
              >
                <Filter className="h-4 w-4" strokeWidth={2.5} />
                {statusFilter !== "Todos" ? statusFilter : "Filtros"}
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg z-10">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setStatusFilter(filter);
                        setShowFilters(false);
                      }}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-[13px] font-bold transition-colors ${statusFilter === filter
                          ? "bg-[#f0fdfa] text-[#0db39e]"
                          : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-[13px] font-medium text-slate-400">Cargando...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[980px] table-auto w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-[13px] text-slate-500">
                    <th className="px-4 pb-4 font-bold">Código</th>
                    <th className="px-4 pb-4 font-bold">Paciente</th>
                    <th className="px-4 pb-4 font-bold">Enfermero</th>
                    <th className="px-4 pb-4 font-bold">Estado</th>
                    <th className="px-4 pb-4 font-bold">Monto</th>
                    <th className="px-4 pb-4 font-bold">Pago</th>
                    <th className="px-4 pb-4 font-bold">Fecha</th>
                    <th className="px-4 pb-4 font-bold">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {(contratos ?? []).length > 0 ? (
                    contratos!.map((contract) => {
                      const statusLabel = statusLabelMap[contract.status ?? ''] ?? 'Pendiente';
                      const paymentLabel = getPaymentLabel(contract.payment_status);

                      return (
                        <tr key={contract.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-600">
                            {contract.contract_code || `#${contract.id}`}
                          </td>
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-600">
                            {contract.patient_name || '—'}
                          </td>
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-600">
                            {contract.nurse_name || '—'}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${statusStyle[statusLabel]}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[13px] font-bold text-slate-900">
                            {formatAmount(contract.total_amount)}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${paymentStyle[paymentLabel]}`}>
                              {paymentLabel}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-500">
                            {formatDate(contract.created_at)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {contract.status === 'active' && contract.payment_status === 'pending' && (
                                <button
                                  onClick={() => liberarMutation.mutate(contract.id)}
                                  disabled={liberarMutation.isPending}
                                  className="inline-flex items-center justify-center rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[12px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa] disabled:opacity-50"
                                >
                                  {liberarMutation.isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    'Liberar'
                                  )}
                                </button>
                              )}
                              {(contract.status === 'pending' || contract.status === 'confirmed' || contract.status === 'active') && (
                                <button
                                  onClick={() => cancelarMutation.mutate(contract.id)}
                                  disabled={cancelarMutation.isPending}
                                  className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-3 py-1.5 text-[12px] font-bold text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                                >
                                  {cancelarMutation.isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    'Cancelar'
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[13px] font-medium text-slate-400">
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-[13px] font-medium text-slate-400">
              Mostrando {contratos?.length ?? 0} contratos
            </div>
          </>
        )}
      </section>
    </div>
  );
}