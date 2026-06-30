import { useState, useRef, useEffect } from "react";
import { Search, Eye, Ban, Check, X, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useEnfermeros, usePublicarEnfermero, useDespublicarEnfermero, useSuspenderEnfermero, useActivarEnfermero } from "../hooks/useNursesData";

type ModalType = null | "profile" | "suspend" | "success";

const FILTERS = ["Todos", "Publicados", "En revisión", "Rechazados", "Sin enviar"];
const ITEMS_PER_PAGE = 5;

const statusLabelMap: Record<string, string> = {
  approved: 'Publicado',
  pending: 'En revisión',
  rejected: 'Rechazado',
  not_submitted: 'Sin documentos',
};

const statusStyle: Record<string, string> = {
  Publicado: "bg-[#ccfbf1] text-[#0f766e]",
  'En revisión': "bg-[#fffbeb] text-[#d97706]",
  Rechazado: "bg-rose-50 text-rose-500",
  'Sin documentos': "bg-slate-100 text-slate-500",
};

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function getInitials(nombres: string, apellidos_pa: string): string {
  return `${nombres?.[0] ?? '?'}${apellidos_pa?.[0] ?? '?'}`;
}

function getStatusLabel(verificacionStatus: string | null): string {
  return statusLabelMap[verificacionStatus ?? ''] ?? 'Sin documentos';
}

export default function EnfermerosPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedNurse, setSelectedNurse] = useState<any>(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: enfermeros, isLoading } = useEnfermeros(search, statusFilter);
  const publicarMutation = usePublicarEnfermero();
  const despublicarMutation = useDespublicarEnfermero();
  const suspenderMutation = useSuspenderEnfermero();
  const activarMutation = useActivarEnfermero();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil((enfermeros?.length ?? 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEnfermeros = (enfermeros ?? []).slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setSearch(value);
      setCurrentPage(1);
    }
  };

  const handleOpenProfile = (nurse: any) => {
    setSelectedNurse(nurse);
    setActiveModal("profile");
  };

  const handleOpenSuspend = (nurse: any) => {
    setSelectedNurse(nurse);
    setSuspensionReason("");
    setActiveModal("suspend");
  };

  const handleConfirmSuspend = () => {
    if (!selectedNurse || !suspensionReason.trim()) return;
    suspenderMutation.mutate(
      { userId: selectedNurse.id, motivo: suspensionReason.trim() },
      {
        onSuccess: () => {
          setSuccessMessage("Cuenta suspendida correctamente");
          setActiveModal("success");
        },
      }
    );
  };

  const handleActivate = (nurse: any) => {
    activarMutation.mutate(nurse.id, {
      onSuccess: () => {
        setSelectedNurse(nurse);
        setSuccessMessage("Cuenta activada correctamente");
        setActiveModal("success");
      },
    });
  };

  const handlePublicar = (nurse: any) => {
    publicarMutation.mutate(nurse.id, {
      onSuccess: () => {
        setSuccessMessage("Enfermero publicado correctamente");
        setActiveModal("success");
      },
    });
  };

  const handleDespublicar = (nurse: any) => {
    despublicarMutation.mutate(nurse.id, {
      onSuccess: () => {
        setSuccessMessage("Enfermero despublicado correctamente");
        setActiveModal("success");
      },
    });
  };

  const emptyMessage = search !== "" || statusFilter !== "Todos"
    ? "No se encontraron enfermeros con los filtros actuales."
    : "No se encontraron enfermeros.";

  return (
    <div className="w-full">
      <div className="rounded-lg bg-white p-3.5 shadow-sm border border-slate-100">

        <div className="mb-3.5 flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-slate-900">Enfermeros Registrados</h2>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={handleSearchChange}
                className="w-48 rounded-lg border border-slate-200 py-1.5 pl-8.5 pr-3 text-xs text-slate-900 outline-none transition focus:border-teal-400 sm:w-56"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-colors ${showFilters || statusFilter !== "Todos"
                    ? "border-[#14b8a6] bg-[#f0fdfa] text-[#14b8a6]"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={2.5} />
                {statusFilter !== "Todos" ? statusFilter : "Filtros"}
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-slate-100 bg-white p-2 shadow-lg z-10">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setStatusFilter(filter);
                        setShowFilters(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-[12px] font-bold transition-colors ${statusFilter === filter
                          ? "bg-[#f0fdfa] text-[#14b8a6]"
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
              <table className="min-w-[860px] table-auto w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-500">
                    <th className="px-2.5 pb-2.5 font-bold">Profesional</th>
                    <th className="px-2.5 pb-2.5 font-bold">Nivel</th>
                    <th className="px-2.5 pb-2.5 font-bold">Distrito</th>
                    <th className="px-2.5 pb-2.5 font-bold">Estado</th>
                    <th className="px-2.5 pb-2.5 font-bold">Registro</th>
                    <th className="px-2.5 pb-2.5 font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedEnfermeros.length > 0 ? (
                    paginatedEnfermeros.map((nurse) => {
                      const initials = getInitials(nurse.nombres, nurse.apellidos_pa);
                      const isSuspended = nurse.account_status === 'suspendido';
                      const statusLabel = getStatusLabel(nurse.verificacion_status);
                      const isPublished = nurse.verificacion_status === 'approved';

                      return (
                        <tr
                          key={nurse.id}
                          className={`transition-colors hover:bg-slate-50/50 ${isSuspended ? "bg-rose-50/30" : ""}`}
                        >
                          <td className="px-2.5 py-2">
                            <div className="flex items-center gap-2">
                              {nurse.foto_url ? (
                                <img src={nurse.foto_url} alt="" className="h-9 w-9 rounded-full object-cover border" />
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ccfbf1] text-[11px] font-bold text-[#0f766e]">
                                  {initials}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-[12px]">{nurse.full_name}</span>
                                {isSuspended && (
                                  <span className="text-[10px] font-medium text-rose-500 mt-0.5">Suspendido</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2.5 py-2 text-[12px] font-medium text-slate-500">{nurse.nivel || '—'}</td>
                          <td className="px-2.5 py-2 text-[12px] font-medium text-slate-500">{nurse.distrito || '—'}</td>
                          <td className="px-2.5 py-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${statusStyle[statusLabel] || 'bg-slate-100 text-slate-500'}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-2.5 py-2 text-[11px] font-medium text-slate-400">{formatDate(nurse.created_at)}</td>
                          <td className="px-2.5 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenProfile(nurse)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Ver perfil
                              </button>

                              {!isSuspended && (
                                isPublished ? (
                                  <button
                                    onClick={() => handleDespublicar(nurse)}
                                    disabled={despublicarMutation.isPending}
                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                                  >
                                    {despublicarMutation.isPending ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      'Despublicar'
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handlePublicar(nurse)}
                                    disabled={publicarMutation.isPending}
                                    className="inline-flex items-center gap-1 rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[11px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa] disabled:opacity-50"
                                  >
                                    {publicarMutation.isPending ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      'Publicar'
                                    )}
                                  </button>
                                )
                              )}

                              {isSuspended ? (
                                <button
                                  onClick={() => handleActivate(nurse)}
                                  disabled={activarMutation.isPending}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[11px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa] disabled:opacity-50"
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
                                  onClick={() => handleOpenSuspend(nurse)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#fbcfe8] px-3 py-1.5 text-[11px] font-bold text-[#f43f5e] transition hover:bg-[#fff5f6]"
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
                      <td colSpan={6} className="py-8 text-center text-[13px] font-medium text-slate-400">
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-400">
                Mostrando {paginatedEnfermeros.length} de {enfermeros?.length ?? 0} enfermeros
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] font-medium text-slate-600">
                    {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL: Ver Perfil */}
      {activeModal === "profile" && selectedNurse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  {selectedNurse.foto_url ? (
                    <img src={selectedNurse.foto_url} alt="" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ccfbf1] text-xl font-bold text-[#0f766e]">
                      {getInitials(selectedNurse.nombres, selectedNurse.apellidos_pa)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedNurse.full_name}</h3>
                    <p className="text-sm font-medium text-slate-500">{selectedNurse.nivel || 'Enfermero'} · {selectedNurse.distrito || '—'}</p>
                    {selectedNurse.account_status === 'suspendido' && (
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

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3.5">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Estado Verificación</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{getStatusLabel(selectedNurse.verificacion_status)}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3.5">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Registro</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{formatDate(selectedNurse.created_at)}</p>
                </div>
              </div>

              {selectedNurse.account_status === 'suspendido' && selectedNurse.suspension_reason && (
                <div className="rounded-xl bg-[#fff1f2] p-3 mb-5">
                  <p className="text-[10px] font-bold uppercase text-rose-400">Motivo de suspensión</p>
                  <p className="mt-0.5 text-[12px] font-medium text-rose-600">{selectedNurse.suspension_reason}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setActiveModal(null)} className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Cerrar
                </button>
                {selectedNurse.account_status !== 'suspendido' && (
                  <button
                    onClick={() => { setActiveModal(null); setTimeout(() => handleOpenSuspend(selectedNurse), 100); }}
                    className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700"
                  >
                    Suspender Cuenta
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Suspender */}
      {activeModal === "suspend" && selectedNurse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Suspender cuenta</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">{selectedNurse.full_name}</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Motivo de suspensión</label>
                <textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Ej: Documentos falsos, conducta inapropiada, incumplimiento de normas..."
                  className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-700 outline-none transition focus:border-rose-400 placeholder:text-slate-400"
                />
                <p className="mt-1.5 text-xs font-medium text-slate-400">{suspensionReason.length}/500</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActiveModal(null)} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  disabled={!suspensionReason.trim() || suspenderMutation.isPending}
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  {suspenderMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Suspender'}
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
              <p className="mb-6 text-sm font-bold text-slate-900">{successMessage}</p>
              <button onClick={() => setActiveModal(null)} className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}