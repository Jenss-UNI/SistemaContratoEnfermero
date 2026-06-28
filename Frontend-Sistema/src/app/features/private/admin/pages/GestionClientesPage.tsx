import { useState } from "react";
import { Search, Eye, Ban, Check, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useClientes, useSuspenderCliente, useActivarCliente } from "../hooks/useClientsData";

type ModalType = null | "profile" | "suspend" | "success";

const ITEMS_PER_PAGE = 5;

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function getInitials(nombres: string, apellidos_pa: string): string {
  return `${nombres?.[0] ?? '?'}${apellidos_pa?.[0] ?? '?'}`;
}

export default function GestionClientesPage() {
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: clientes, isLoading } = useClientes(search);
  const suspenderMutation = useSuspenderCliente();
  const activarMutation = useActivarCliente();

  // Paginación
  const totalPages = Math.ceil((clientes?.length ?? 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClientes = (clientes ?? []).slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setSearch(value);
      setCurrentPage(1); // Reset a página 1 al buscar
    }
  };

  const handleOpenProfile = (client: any) => {
    setSelectedClient(client);
    setActiveModal("profile");
  };

  const handleOpenSuspend = (client: any) => {
    setSelectedClient(client);
    setSuspensionReason("");
    setActiveModal("suspend");
  };

  const handleConfirmSuspend = () => {
    if (!selectedClient || !suspensionReason.trim()) return;
    suspenderMutation.mutate(
      { userId: selectedClient.id, motivo: suspensionReason.trim() },
      {
        onSuccess: () => {
          setSuccessMessage("Cliente suspendido correctamente");
          setActiveModal("success");
        },
      }
    );
  };

  const handleActivate = (client: any) => {
    activarMutation.mutate(client.id, {
      onSuccess: () => {
        setSelectedClient(client);
        setSuccessMessage("Cliente activado correctamente");
        setActiveModal("success");
      },
    });
  };

  const emptyMessage = search !== ""
    ? "No se encontraron clientes con los filtros actuales."
    : "No se encontraron clientes.";

  return (
    <div className="w-full">
      <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm md:p-5">

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-slate-900">Clientes Registrados</h2>

          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-[12px] text-slate-900 outline-none transition focus:border-teal-400 sm:w-56"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-[13px] font-medium text-slate-400">Cargando...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[720px] table-auto w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] text-slate-500">
                    <th className="px-3 pb-2.5 font-bold">Cliente</th>
                    <th className="px-3 pb-2.5 font-bold">Distrito</th>
                    <th className="px-3 pb-2.5 font-bold">Teléfono</th>
                    <th className="px-3 pb-2.5 font-bold">Registro</th>
                    <th className="px-3 pb-2.5 font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedClientes.length > 0 ? (
                    paginatedClientes.map((client) => {
                      const initials = getInitials(client.nombres, client.apellidos_pa);
                      const isSuspended = client.account_status === 'suspendido';

                      return (
                        <tr
                          key={client.id}
                          className={`transition-colors hover:bg-slate-50/50 ${isSuspended ? "bg-rose-50/30" : ""}`}
                        >
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-3">
                              {client.foto_url ? (
                                <img
                                  src={client.foto_url}
                                  alt={client.full_name}
                                  className="h-9 w-9 flex-shrink-0 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${isSuspended ? "bg-rose-100 text-rose-700" : "bg-[#ccfbf1] text-[#0f766e]"}`}>
                                  {initials}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-[12px]">{client.full_name}</span>
                                {isSuspended && (
                                  <span className="text-[10px] font-medium text-rose-500 mt-0.5">Suspendido</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-[11px] font-medium text-slate-500">
                            {client.distrito || '—'}
                          </td>
                          <td className="px-3 py-2.5 text-[11px] font-medium text-slate-500">
                            {client.telefono || '—'}
                          </td>
                          <td className="px-3 py-2.5 text-[11px] font-medium text-slate-400">
                            {formatDate(client.created_at)}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenProfile(client)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Ver perfil
                              </button>

                              {isSuspended ? (
                                <button
                                  onClick={() => handleActivate(client)}
                                  disabled={activarMutation.isPending}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[12px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa] disabled:opacity-50"
                                >
                                  {activarMutation.isPending ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                                  )}
                                  Activar
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleOpenSuspend(client)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#fbcfe8] px-3 py-1.5 text-[12px] font-bold text-[#f43f5e] transition hover:bg-[#fff5f6]"
                                >
                                  <Ban className="h-3.5 w-3.5" strokeWidth={2.5} />
                                  Suspender
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[13px] font-medium text-slate-400">
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer con paginación */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-400">
                Mostrando {paginatedClientes.length} de {clientes?.length ?? 0} clientes
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[12px] font-medium text-slate-600">
                    {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL: Ver Perfil */}
      {activeModal === "profile" && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  {selectedClient.foto_url ? (
                    <img src={selectedClient.foto_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold ${selectedClient.account_status === 'suspendido' ? "bg-rose-50 text-rose-500" : "bg-[#ccfbf1] text-[#0f766e]"}`}>
                      {getInitials(selectedClient.nombres, selectedClient.apellidos_pa)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">{selectedClient.full_name}</h3>
                    <p className="text-[11px] text-slate-500">{selectedClient.distrito || '—'} · {selectedClient.telefono || '—'}</p>
                    {selectedClient.account_status === 'suspendido' && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                        <Ban className="h-3 w-3" strokeWidth={2.5} />
                        Cuenta suspendida
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">Teléfono</p>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-900">{selectedClient.telefono || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">Registro</p>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-900">{formatDate(selectedClient.created_at)}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">Distrito</p>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-900">{selectedClient.distrito || '—'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">Estado</p>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-900">
                    {selectedClient.account_status === 'suspendido' ? 'Suspendido' : 'Activo'}
                  </p>
                </div>
              </div>

              {selectedClient.account_status === 'suspendido' && selectedClient.suspension_reason && (
                <div className="rounded-xl bg-[#fff1f2] p-3 mb-5">
                  <p className="text-[10px] font-bold uppercase text-rose-400">Motivo de suspensión</p>
                  <p className="mt-0.5 text-[12px] font-medium text-rose-600">{selectedClient.suspension_reason}</p>
                </div>
              )}

              <div className="flex gap-3">
                {selectedClient.account_status === 'suspendido' ? (
                  <button
                    onClick={() => { handleActivate(selectedClient); setActiveModal(null); }}
                    className="flex-1 rounded-xl bg-[#0db39e] py-3 text-[12px] font-bold text-white transition hover:bg-[#0a8e7c]"
                  >
                    <Check className="h-3.5 w-3.5 inline-block mr-1 mb-0.5" strokeWidth={3} />
                    Activar cuenta
                  </button>
                ) : (
                  <button
                    onClick={() => { setActiveModal(null); setTimeout(() => handleOpenSuspend(selectedClient), 100); }}
                    className="flex-1 rounded-xl bg-rose-600 py-3 text-[12px] font-bold text-white transition hover:bg-rose-700"
                  >
                    <Ban className="h-3.5 w-3.5 inline-block mr-1 mb-0.5" />
                    Suspender cuenta
                  </button>
                )}
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-[12px] font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Suspender */}
      {activeModal === "suspend" && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Suspender cuenta</h2>
                  <p className="mt-1 text-[12px] text-slate-500">{selectedClient.full_name}</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-[12px] font-bold text-slate-700 mb-2">Motivo de suspensión</label>
                <textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Ej: Documentos falsos, conducta inapropiada, incumplimiento de normas..."
                  className="w-full resize-none rounded-xl border border-slate-200 p-3 text-[12px] text-slate-700 outline-none transition focus:border-rose-400 placeholder:text-slate-400"
                />
                <p className="mt-1.5 text-[10px] font-medium text-slate-400">{suspensionReason.length}/500</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  disabled={!suspensionReason.trim() || suspenderMutation.isPending}
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 text-[13px] font-bold text-white transition hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {suspenderMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin inline-block" />
                  ) : (
                    'Suspender'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Éxito */}
      {activeModal === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-xs shadow-xl">
            <div className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#0db39e]">
                <Check className="h-6 w-6" strokeWidth={3} />
              </div>
              <p className="mb-6 text-[14px] font-bold text-slate-900">{successMessage}</p>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full rounded-xl bg-slate-900 py-3 text-[13px] font-bold text-white transition hover:bg-slate-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}