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

// Datos exactos basados en la imagen
const MOCK_CONTRACTS: Contract[] = [
  { id: "1", code: "#1", patient: "Luca Alvares", nurse: "Jens Jeremies Luna Levita", status: "Confirmado", amount: "S/ 65", payment: "Custodia", date: "12/6/2026" },
  { id: "2", code: "CONT-2026-0004", patient: "Carmen Mendoza", nurse: "Jens Jeremies Luna Levita", status: "Activo", amount: "S/ 1,800", payment: "Custodia", date: "10/6/2026" },
  { id: "3", code: "CONT-2026-0005", patient: "Luca Alvares", nurse: "Luura Perez Tello", status: "Cancelado", amount: "S/ 100", payment: "Custodia", date: "5/6/2026" },
  { id: "4", code: "CONT-2026-0003", patient: "Rosa Alvares", nurse: "Luura Perez Tello", status: "Completado", amount: "S/ 200", payment: "Custodia", date: "20/5/2026" },
  { id: "5", code: "CONT-2026-0002", patient: "Roberto Pasco", nurse: "Jens Jeremies Luna Levita", status: "Completado", amount: "S/ 1,300", payment: "Custodia", date: "15/5/2026" },
];

const FILTERS = ["Todos", "Activo", "Pendiente", "Confirmado", "Completado", "Cancelado"];

// Colores suavizados exactos para los badges
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
};

export default function ContratosPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setSearchQuery(value);
    }
  };

  const filteredContracts = MOCK_CONTRACTS.filter((contract) => {
    const matchesStatus = activeFilter === "Todos" || contract.status === activeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      contract.patient.toLowerCase().includes(searchLower) ||
      contract.nurse.toLowerCase().includes(searchLower) ||
      contract.code.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">

      {/* 1. Tarjetas Superiores (Métricas) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">Total contratos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">5</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">En custodia</p>
          <p className="mt-2 text-3xl font-bold text-[#d97706]">S/ 1,865</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[13px] font-medium text-slate-400">Total liberado</p>
          <p className="mt-2 text-3xl font-bold text-[#10b981]">S/ 1,500</p>
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
                  className={`rounded-full px-5 py-2.5 text-[13px] font-bold transition-colors ${
                    activeFilter === filter
                      ? "bg-[#0db39e] text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Buscador */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-2xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#0db39e] sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Contenedor de la Tabla */}
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
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-4 text-[13px] font-medium text-slate-600">{contract.code}</td>
                    <td className="px-4 py-4 text-[13px] font-medium text-slate-600">{contract.patient}</td>
                    <td className="px-4 py-4 text-[13px] font-medium text-slate-600">{contract.nurse}</td>
                    
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${statusStyle[contract.status]}`}>
                        {contract.status}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 text-[13px] font-bold text-slate-900">{contract.amount}</td>
                    
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${paymentStyle[contract.payment]}`}>
                        {contract.payment}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 text-[13px] font-medium text-slate-500">{contract.date}</td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {contract.status === "Activo" && (
                          <button className="inline-flex items-center justify-center rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[12px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa]">
                            Liberar
                          </button>
                        )}
                        {(contract.status === "Confirmado" || contract.status === "Activo") && (
                          <button className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-3 py-1.5 text-[12px] font-bold text-rose-500 transition hover:bg-rose-50">
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
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
          Mostrando {filteredContracts.length} de {MOCK_CONTRACTS.length} contratos
        </div>
      </section>

    </div>
  );
}