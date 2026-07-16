import { useState, useRef, useEffect } from "react";
import { Search, Filter, Loader2, FileText, FileSpreadsheet, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useContratos, useContratoStats, useLiberarPago, useCancelarContrato } from "../hooks/useContratosData";
import * as XLSX from 'xlsx';

type PaymentStatus = "Custodia" | "Liberado" | "Reembolsado";
type ModalType = null | "report";

const FILTERS = ["Todos", "Activo", "Pendiente", "Confirmado", "Completado", "Cancelado"];
const ITEMS_PER_PAGE = 5;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const { data: stats } = useContratoStats();
  const { data: contratos, isLoading } = useContratos(search, statusFilter);
  const liberarMutation = useLiberarPago();
  const cancelarMutation = useCancelarContrato();

  // Datos para reporte
  const reportData = (contratos ?? []).map(c => ({
    codigo: c.contract_code || `#${c.id}`,
    paciente: c.patient_name || '—',
    enfermero: c.nurse_name || '—',
    estado: statusLabelMap[c.status ?? ''] ?? 'Pendiente',
    monto: formatAmount(c.total_amount),
    pago: getPaymentLabel(c.payment_status),
    fecha: formatDate(c.created_at),
  }));

  const now = new Date();
  const reportDate = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const reportTime = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  const handleDownloadExcel = () => {
    const headers = ['Código', 'Paciente', 'Enfermero', 'Estado', 'Monto', 'Pago', 'Fecha'];
    const rows = reportData.map(r => [r.codigo, r.paciente, r.enfermero, r.estado, r.monto, r.pago, r.fecha]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contratos');
    XLSX.writeFile(workbook, `reporte_contratos_${reportDate.replace(/\//g, '-')}.xlsx`);
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const rowsHtml = reportData.map(r => `<tr><td>${r.codigo}</td><td>${r.paciente}</td><td>${r.enfermero}</td><td>${r.estado}</td><td>${r.monto}</td><td>${r.pago}</td><td>${r.fecha}</td></tr>`).join('');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Reporte de Contratos</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1a1a1a}h1{font-size:20px;border-bottom:2px solid #000;padding-bottom:10px}.info{font-size:12px;color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#1a1a1a;color:#fff;padding:10px;text-align:left;font-size:11px;text-transform:uppercase}td{padding:10px;border-bottom:1px solid #e2e8f0;font-size:12px}tr:nth-child(even){background:#f8fafc}.footer{margin-top:20px;font-size:12px;color:#666}</style></head><body><h1>Reporte de Contratos</h1><p class="info">Emisión: ${reportDate} ${reportTime} | Filtro: ${statusFilter} | Resultados: ${reportData.length}</p><table><thead><tr><th>Código</th><th>Paciente</th><th>Enfermero</th><th>Estado</th><th>Monto</th><th>Pago</th><th>Fecha</th></tr></thead><tbody>${rowsHtml}</tbody></table><p class="footer">Total: ${reportData.length} contratos</p></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Paginación
  const totalPages = Math.ceil((contratos?.length ?? 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContratos = (contratos ?? []).slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setSearch(value);
      setCurrentPage(1);
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

        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-[15px] font-bold text-slate-900">Contratos del Sistema</h2>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-400" strokeWidth={2.5} />
              <input type="text" placeholder="Buscar..." value={search} onChange={handleSearchChange}
                className="w-48 rounded-2xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#0db39e] sm:w-64" />
            </div>
            <div className="relative" ref={filterRef}>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13px] font-bold transition-colors cursor-pointer ${showFilters || statusFilter !== "Todos" ? "border-[#0db39e] bg-[#f0fdfa] text-[#0db39e]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}>
                <Filter className="h-4 w-4" strokeWidth={2.5} /> {statusFilter !== "Todos" ? statusFilter : "Filtros"}
              </button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg z-10">
                  {FILTERS.map((filter) => (
                    <button key={filter} onClick={() => { setStatusFilter(filter); setShowFilters(false); setCurrentPage(1); }}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-[13px] font-bold transition-colors cursor-pointer ${statusFilter === filter ? "bg-[#f0fdfa] text-[#0db39e]" : "text-slate-600 hover:bg-slate-50"}`}>{filter}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setActiveModal("report")}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 cursor-pointer">
              <FileText className="h-4 w-4" /> Exportar
            </button>
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
                    <th className="px-4 pb-4 font-bold">Código</th><th className="px-4 pb-4 font-bold">Paciente</th><th className="px-4 pb-4 font-bold">Enfermero</th>
                    <th className="px-4 pb-4 font-bold">Estado</th><th className="px-4 pb-4 font-bold">Monto</th><th className="px-4 pb-4 font-bold">Pago</th>
                    <th className="px-4 pb-4 font-bold">Fecha</th><th className="px-4 pb-4 font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedContratos.length > 0 ? (
                    paginatedContratos.map((contract) => {
                      const statusLabel = statusLabelMap[contract.status ?? ''] ?? 'Pendiente';
                      const paymentLabel = getPaymentLabel(contract.payment_status);
                      return (
                        <tr key={contract.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-600">{contract.contract_code || `#${contract.id}`}</td>
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-600">{contract.patient_name || '—'}</td>
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-600">{contract.nurse_name || '—'}</td>
                          <td className="px-4 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${statusStyle[statusLabel]}`}>{statusLabel}</span></td>
                          <td className="px-4 py-4 text-[13px] font-bold text-slate-900">{formatAmount(contract.total_amount)}</td>
                          <td className="px-4 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${paymentStyle[paymentLabel]}`}>{paymentLabel}</span></td>
                          <td className="px-4 py-4 text-[13px] font-medium text-slate-500">{formatDate(contract.created_at)}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {contract.status === 'active' && contract.payment_status === 'pending' && (
                                <button onClick={() => liberarMutation.mutate(contract.id)} disabled={liberarMutation.isPending}
                                  className="inline-flex items-center justify-center rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[12px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa] disabled:opacity-50 cursor-pointer">
                                  {liberarMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Liberar'}
                                </button>
                              )}
                              {(contract.status === 'pending' || contract.status === 'confirmed' || contract.status === 'active') && (
                                <button onClick={() => cancelarMutation.mutate(contract.id)} disabled={cancelarMutation.isPending}
                                  className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-3 py-1.5 text-[12px] font-bold text-rose-500 transition hover:bg-rose-50 disabled:opacity-50 cursor-pointer">
                                  {cancelarMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Cancelar'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={8} className="py-8 text-center text-[13px] font-medium text-slate-400">{emptyMessage}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-[13px] font-medium text-slate-400">
                Mostrando {paginatedContratos.length} de {contratos?.length ?? 0} contratos
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[12px] font-medium text-slate-600">{currentPage} de {totalPages}</span>
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* MODAL: Reporte */}
      {activeModal === "report" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
            <div className="border-b-2 border-slate-900 px-8 py-6 flex items-center justify-between">
              <div><h2 className="text-xl font-bold text-slate-900">Reporte de Contratos</h2><p className="text-xs text-slate-500 mt-1">Emisión: {reportDate} {reportTime} | Filtro: {statusFilter} | Resultados: {reportData.length}</p></div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-auto px-8 py-4">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-900 text-white"><th className="px-4 py-3 text-left font-bold uppercase">Código</th><th className="px-4 py-3 text-left font-bold uppercase">Paciente</th><th className="px-4 py-3 text-left font-bold uppercase">Enfermero</th><th className="px-4 py-3 text-left font-bold uppercase">Estado</th><th className="px-4 py-3 text-left font-bold uppercase">Monto</th><th className="px-4 py-3 text-left font-bold uppercase">Pago</th><th className="px-4 py-3 text-left font-bold uppercase">Fecha</th></tr></thead>
                <tbody className="divide-y divide-slate-200">
                  {reportData.length > 0 ? reportData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-3 font-mono text-slate-600">{row.codigo}</td><td className="px-4 py-3 font-medium text-slate-900">{row.paciente}</td><td className="px-4 py-3 text-slate-600">{row.enfermero}</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyle[row.estado] || 'bg-slate-100 text-slate-500'}`}>{row.estado}</span></td>
                      <td className="px-4 py-3 text-slate-700">{row.monto}</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${paymentStyle[row.pago] || 'bg-slate-100 text-slate-500'}`}>{row.pago}</span></td>
                      <td className="px-4 py-3 text-slate-500">{row.fecha}</td>
                    </tr>
                  )) : <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">Sin datos para los filtros seleccionados</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 px-8 py-4 flex items-center justify-between bg-slate-50">
              <p className="text-xs text-slate-500">Total: {reportData.length} contratos</p>
              <div className="flex items-center gap-3">
                <button onClick={handleDownloadPDF} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"><FileText className="h-4 w-4" /> PDF</button>
                <button onClick={handleDownloadExcel} className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d5f58] transition cursor-pointer"><FileSpreadsheet className="h-4 w-4" /> Excel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}