import { useState } from "react";
import { Search } from "lucide-react";

type ContractStatus = "Pendiente" | "Activo" | "Confirmado" | "Completado" | "Cancelado";
type PaymentStatus = "Custodia" | "Liberado";

type Contract = {
  id: string;
  code: string;
  patient: string;
  nurse: string;
  status: ContractStatus;
  amount: string;
  payment: PaymentStatus;
  date: string;
};

const MOCK_CONTRACTS: Contract[] = [
  { id: "1", code: "CON-000039", patient: "Elena Rodriguez", nurse: "Carlos Sanchez Martinez", status: "Pendiente", amount: "S/ 120", payment: "Custodia", date: "23/5/2026" },
  { id: "2", code: "CON-000038", patient: "Elena Rodriguez", nurse: "Carlos Sanchez Martinez", status: "Pendiente", amount: "S/ 75", payment: "Custodia", date: "23/5/2026" },
  { id: "3", code: "CON-000037", patient: "Elena Rodriguez", nurse: "Carlos Sanchez Martinez", status: "Pendiente", amount: "S/ 180", payment: "Custodia", date: "23/5/2026" },
  { id: "4", code: "CON-000036", patient: "Elena Rodriguez", nurse: "Carlos Sanchez Martinez", status: "Pendiente", amount: "S/ 120", payment: "Custodia", date: "22/5/2026" },
  { id: "5", code: "CON-000035", patient: "Elena Rodriguez", nurse: "Carlos Sanchez Martinez", status: "Pendiente", amount: "S/ 318", payment: "Custodia", date: "22/5/2026" },
  { id: "6", code: "CON-000034", patient: "Elena Rodriguez", nurse: "Carlos Sanchez Martinez", status: "Activo", amount: "S/ 106", payment: "Custodia", date: "22/5/2026" },
];

const FILTERS = ["Todos", "Activo", "Pendiente", "Confirmado", "Completado", "Cancelado"];

const statusStyle: Record<string, string> = {
  Pendiente: "bg-[#fef3c7] text-[#b45309]",
  Activo: "bg-[#ccfbf1] text-[#0f766e]",
  Confirmado: "bg-[#dbeafe] text-[#1d4ed8]",
  Completado: "bg-slate-100 text-slate-600",
  Cancelado: "bg-[#ffe4e6] text-[#e11d48]",
};

const paymentStyle: Record<string, string> = {
  Custodia: "bg-[#fef3c7] text-[#b45309]",
  Liberado: "bg-[#ccfbf1] text-[#0f766e]",
};

export default function ContratosPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Función para manejar el buscador con restricción estricta
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]*$/.test(value)) {
      setSearchQuery(value);
    }
  };

  const filteredContracts = MOCK_CONTRACTS.filter((contract) => {
    const matchesStatus = activeFilter === "Todos" || contract.status === activeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      contract.patient.toLowerCase().includes(searchLower) ||
      contract.nurse.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">

      {/* 1. Tarjetas Superiores (Métricas) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">Total contratos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">9</p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">En custodia</p>
          <p className="mt-2 text-3xl font-bold text-[#f59e0b]">S/ 1,577</p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">Total liberado</p>
          <p className="mt-2 text-3xl font-bold text-[#10b981]">S/ 100</p>
        </div>
      </div>

      {/* 2. Sección Principal: Tabla de Contratos */}
      <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">

        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[15px] font-bold text-slate-900">Contratos del Sistema</h2>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* Filtros de Estado Interactivos */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${activeFilter === filter
                      ? "bg-[#14b8a6] text-white border border-[#14b8a6]"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Buscador con validación */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Buscar nombre..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-400 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Contenedor de la Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-[980px] table-auto w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-50 text-[13px] text-slate-500">
                <th className="px-3 pb-4 font-medium">Código</th>
                <th className="px-3 pb-4 font-medium">Paciente</th>
                <th className="px-3 pb-4 font-medium">Enfermero</th>
                <th className="px-3 pb-4 font-medium">Estado</th>
                <th className="px-3 pb-4 font-medium">Monto</th>
                <th className="px-3 pb-4 font-medium">Pago</th>
                <th className="px-3 pb-4 font-medium">Fecha</th>
                <th className="px-3 pb-4 font-medium">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {/* Rendereamos 'filteredContracts' en lugar de 'MOCK_CONTRACTS' */}
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-3 py-4 text-[13px] font-medium text-slate-600">{contract.code}</td>
                    <td className="px-3 py-4 text-[13px] font-medium text-slate-600">{contract.patient}</td>
                    <td className="px-3 py-4 text-[13px] font-medium text-slate-600">{contract.nurse}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${statusStyle[contract.status]}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[13px] font-bold text-slate-800">{contract.amount}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${paymentStyle[contract.payment]}`}>
                        {contract.payment}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[13px] font-medium text-slate-500">{contract.date}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        {contract.status === "Activo" && (
                          <button className="inline-flex items-center justify-center rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[12px] font-bold text-[#0db39e] transition hover:bg-[#f2fdfa]">
                            Liberar
                          </button>
                        )}
                        <button className="inline-flex items-center justify-center rounded-lg border border-[#fbcfe8] px-3 py-1.5 text-[12px] font-bold text-[#f43f5e] transition hover:bg-[#fff5f6]">
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Mensaje cuando no hay resultados */
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[13px] font-medium text-slate-400">
                    No se encontraron contratos con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer dinámico */}
        <div className="mt-6 text-[13px] font-medium text-slate-400">
          Mostrando {filteredContracts.length} contratos
        </div>
      </section>

    </div>
  );
}