import { useState } from "react";
import { Search, Eye, Ban, Check, X } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

// Tipo de dato adaptado para incluir el estado de suspensión e imagen
type Professional = {
  id: string;
  initials: string;
  image?: string;
  name: string;
  role: string;
  district: string;
  status: string;
  date: string;
  specialty?: string;
  bio?: string;
  isSuspended?: boolean;
};

// Datos exactos basados en tu nueva imagen de referencia
const MOCK_DATA: Professional[] = [
  {
    id: "1",
    initials: "LP",
    name: "Luura Perez Tello",
    role: "Técnico en Enfermería",
    district: "Surco",
    status: "Sin documentos",
    date: "12/6/2026",
    specialty: "Cuidado General",
    bio: "Técnico especialista",
    isSuspended: true,
  },
  {
    id: "2",
    initials: "JL",
    image: "https://i.pravatar.cc/150?u=jens",
    name: "Jens Jeremies Luna Levita",
    role: "Enfermero Especializado",
    district: "Miraflores",
    status: "Sin documentos",
    date: "12/6/2026",
    specialty: "Geriatría y Cuidado del Adulto Mayor",
    bio: "Profesional con experiencia",
    isSuspended: false,
  },
];

const FILTERS = ["Todos", "Publicados", "En revisión", "Sin enviar"];

type ModalType = null | "profile" | "unpublish" | "suspend" | "unpublish-success" | "suspend-success" | "activate-success";

export default function EnfermerosPage() {
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_DATA);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");

  const handleOpenProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
    setActiveModal("profile");
  };

  const handleConfirmUnpublish = () => {
    if (selectedProfessional) {
      const updatedProfessional = {
        ...selectedProfessional,
        status: "Despublicado",
      };
      setProfessionals((prev) =>
        prev.map((professional) =>
          professional.id === selectedProfessional.id ? updatedProfessional : professional
        )
      );
      setSelectedProfessional(updatedProfessional);
    }
    setActiveModal("unpublish-success");
  };

  const handleOpenSuspend = (professional: Professional) => {
    setSelectedProfessional(professional);
    setSuspensionReason("");
    setActiveModal("suspend");
  };

  const handleConfirmSuspend = () => {
    if (selectedProfessional) {
      const updatedProfessional = {
        ...selectedProfessional,
        isSuspended: true,
      };
      setProfessionals((prev) =>
        prev.map((professional) =>
          professional.id === selectedProfessional.id ? updatedProfessional : professional
        )
      );
      setSelectedProfessional(updatedProfessional);
    }
    setSuspensionReason("");
    setActiveModal("suspend-success");
  };

  const handleActivateProfessional = (professional: Professional) => {
    const updatedProfessional = {
      ...professional,
      isSuspended: false,
    };
    setSelectedProfessional(updatedProfessional);
    setProfessionals((prev) =>
      prev.map((item) => (item.id === professional.id ? updatedProfessional : item))
    );
    setActiveModal("activate-success");
  };

  const handleSearchChange = (value: string) => {
    const validInput = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ ]/g, "");
    setSearchQuery(validInput);
  };

  const filteredData = professionals.filter((professional) => {
    const matchesFilter =
      activeFilter === "Todos" ||
      professional.status.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch = professional.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const isSuspendConfirmDisabled = suspensionReason.trim().length === 0;

  return (
    <div className="w-full">
      {/* Tarjeta Principal Blanca */}
      <div className="rounded-lg bg-white p-3.5 shadow-sm border border-slate-100">
        
        {/* Cabecera de la Tabla: Título, Filtros y Buscador */}
        <div className="mb-3.5 flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-sm font-bold text-slate-900">Enfermeros Registrados</h2>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Botones de Filtro */}
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-[11px] font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-[#14b8a6] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Input de Búsqueda */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-1.5 pl-8.5 pr-3 text-xs text-slate-900 outline-none transition focus:border-teal-400 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Tabla Contenedora */}
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
              {filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  className={`transition-colors hover:bg-slate-50/50 ${item.isSuspended ? "bg-rose-50/40" : ""}`}
                >
                  <td className="px-2.5 py-2">
                    <div className="flex items-center gap-2">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-9 w-9 flex-shrink-0 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[11px] font-bold text-[#0f766e]">
                          {item.initials}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[12px]">{item.name}</span>
                        {item.isSuspended && (
                          <span className="text-[10px] font-medium text-rose-500 mt-0.5">Suspendido</span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-2.5 py-2 text-[12px] font-medium text-slate-500">{item.role}</td>
                  <td className="px-2.5 py-2 text-[12px] font-medium text-slate-500">{item.district}</td>
                  
                  <td className="px-2.5 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      item.status === "Publicado" ? "bg-[#ccfbf1] text-[#0f766e]" : "bg-slate-100 text-slate-500"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  <td className="px-2.5 py-2 text-[11px] font-medium text-slate-400">{item.date}</td>
                  
                  <td className="px-2.5 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenProfile(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver perfil
                      </button>

                      <button
                        disabled={item.isSuspended}
                        className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition ${
                          item.isSuspended
                            ? "border-[#a5edd9]/50 text-[#0db39e]/50 cursor-not-allowed"
                            : "border-[#a5edd9] text-[#0db39e] hover:bg-[#f0fdfa]"
                        }`}
                      >
                        Publicar
                      </button>

                      {item.isSuspended ? (
                        <button
                          onClick={() => handleActivateProfessional(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[11px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa]"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          Activar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenSuspend(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#fbcfe8] px-3 py-1.5 text-[11px] font-bold text-[#f43f5e] transition hover:bg-[#fff5f6]"
                        >
                          <Ban className="h-3.5 w-3.5" strokeWidth={2.5} />
                          Suspender
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de la Tabla */}
        <div className="mt-2.5 text-[11px] font-medium text-slate-400">
          Mostrando {filteredData.length} de {professionals.length} enfermeros
        </div>
      </div>

      {/* MODAL: Ver Perfil */}
      {activeModal === "profile" && selectedProfessional && (
        <Modal
          title=""
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-[520px]"
          hideCloseIcon={true}
          footer={
            <div className="flex w-full gap-3 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setTimeout(() => handleOpenSuspend(selectedProfessional), 100);
                }}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                Suspender Cuenta
              </button>
            </div>
          }
        >
          <div className="space-y-5 p-1">
            {/* Cabecera integrada con la X en la misma recta */}
            <div className="flex items-start justify-between gap-4 w-full">
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-xl font-bold text-[#0f766e]">
                  {selectedProfessional.initials}
                </div>
                <div className="pt-0.5 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {selectedProfessional.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 truncate">
                    {selectedProfessional.role} · {selectedProfessional.district}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Secciones de Información con letra más grande y equilibrada */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Estado Verificación
                </label>
                <p className="mt-1 text-sm font-bold text-slate-900">Approved</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Registro
                </label>
                <p className="mt-1 text-sm font-bold text-slate-900">{selectedProfessional.date}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Especialidad
              </label>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {selectedProfessional.specialty || "No especificada"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3.5 break-words">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Biografía
              </label>
              <p className="mt-1 text-sm font-medium text-slate-700 leading-relaxed">
                {selectedProfessional.bio || "Sin biografía"}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Confirmar Despublicación */}
      {activeModal === "unpublish" && selectedProfessional && (
        <Modal
          title=""
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-md"
          hideCloseIcon={true}
          footer={
            <div className="flex w-full gap-3 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUnpublish}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
              >
                Despublicar
              </button>
            </div>
          }
        >
          <div className="space-y-4 p-2">
            <div className="flex items-start justify-between gap-4 w-full">
              <h2 className="text-xl font-bold text-slate-900">Despublicar Enfermero</h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              ¿Estás seguro de que deseas despublicar a{" "}
              <span className="font-bold text-slate-900">"{selectedProfessional.name}"</span>? Este
              enfermero no aparecerá más en el directorio.
            </p>
          </div>
        </Modal>
      )}

      {/* MODAL: Suspender Cuenta */}
      {activeModal === "suspend" && selectedProfessional && (
        <Modal
          title=""
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-md"
          hideCloseIcon={true}
          footer={
            <div className="flex w-full gap-3 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSuspend}
                disabled={isSuspendConfirmDisabled}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Suspender
              </button>
            </div>
          }
        >
          <div className="space-y-4 p-2">
            {/* Cabecera del Modal con la "X" en la misma recta */}
            <div className="flex items-start justify-between gap-4 w-full">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900 truncate">Suspender cuenta</h2>
                <p className="mt-1 text-sm font-medium text-slate-500 truncate">
                  {selectedProfessional.name}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Input del Motivo */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Motivo de suspensión
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Ej: Documentos falsos, conducta inapropiada,&#10;incumplimiento de normas..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition focus:border-rose-400 placeholder:text-slate-400"
              />
              <div className="mt-1.5 text-xs font-medium text-slate-400">
                {suspensionReason.length}/500
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Éxito Suspensión */}
      {activeModal === "suspend-success" && selectedProfessional && (
        <Modal title="" onClose={() => setActiveModal(null)} maxWidthClass="max-w-xs">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <p className="mb-6 text-sm font-bold text-slate-900">
              Cuenta suspendida correctamente
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: Éxito Activación */}
      {activeModal === "activate-success" && selectedProfessional && (
        <Modal title="" onClose={() => setActiveModal(null)} maxWidthClass="max-w-xs">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#0db39e]">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <p className="mb-6 text-sm font-bold text-slate-900">
              Cuenta activada correctamente
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: Éxito Despublicación */}
      {activeModal === "unpublish-success" && selectedProfessional && (
        <Modal title="" onClose={() => setActiveModal(null)} maxWidthClass="max-w-xs">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#0db39e]">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <p className="mb-6 text-sm font-bold text-slate-900">
              Enfermero despublicado correctamente
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}