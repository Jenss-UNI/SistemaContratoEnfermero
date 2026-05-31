import { useState } from "react";
import { Search, Eye, Ban } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

// Tipo de dato adaptado a la imagen
type Professional = {
  id: string;
  initials: string;
  name: string;
  role: string;
  district: string;
  status: string;
  date: string;
  specialty?: string;
  bio?: string;
};

// Datos exactos de la imagen de referencia
const MOCK_DATA: Professional[] = [
  {
    id: "1",
    initials: "JC",
    name: "Juan Luis Caseres",
    role: "Enfermero Especializado",
    district: "Ate",
    status: "Publicado",
    date: "19/5/2026",
    specialty: "Geriatría y Cuidado del Adulto Mayor",
    bio: "soy profesional",
  },
  {
    id: "2",
    initials: "CS",
    name: "Carlos Sanchez Martinez",
    role: "Enfermero Especializado",
    district: "Lince",
    status: "Publicado",
    date: "19/5/2026",
    specialty: "Cuidado General",
    bio: "Profesional con experiencia",
  },
];

const FILTERS = ["Todos", "Publicado", "En revisión", "Sin enviar"];

type ModalType = null | "profile" | "unpublish" | "suspend" | "unpublish-success";

export default function GestionClientesPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");

  const handleOpenProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
    setActiveModal("profile");
  };

  const handleOpenUnpublish = (professional: Professional) => {
    setSelectedProfessional(professional);
    setActiveModal("unpublish");
  };

  const handleConfirmUnpublish = () => {
    // Cambiar estado a "Despublicado" visualmente
    if (selectedProfessional) {
      setSelectedProfessional({
        ...selectedProfessional,
        status: "Despublicado",
      });
    }
    setActiveModal("unpublish-success");
  };

  const handleOpenSuspend = (professional: Professional) => {
    setSelectedProfessional(professional);
    setSuspensionReason("");
    setActiveModal("suspend");
  };

  const handleConfirmSuspend = () => {
    setActiveModal(null);
    setSuspensionReason("");
  };

  const handleSearchChange = (value: string) => {
    // Solo permite letras (bloquea números, caracteres especiales y espacios)
    const validInput = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ]/g, "");
    setSearchQuery(validInput);
  };

  // Filtrar datos según el filtro activo y búsqueda
  const filteredData = MOCK_DATA.filter((professional) => {
    const matchesFilter =
      activeFilter === "Todos" ||
      professional.status.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch = professional.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Tarjeta Principal Blanca */}
      <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
        
        {/* Cabecera de la Tabla: Título, Filtros y Buscador */}
        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Enfermeros Registrados</h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            
            {/* Botones de Filtro */}
            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-[#14b8a6] text-white" // Fondo verde agua si está activo
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Input de Búsqueda */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-400 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Tabla Contenedora */}
        <div className="overflow-x-auto">
          <table className="min-w-[860px] table-auto w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-[13px] text-slate-500">
                <th className="px-3 pb-4 font-bold">Profesional</th>
                <th className="px-3 pb-4 font-bold">Nivel</th>
                <th className="px-3 pb-4 font-bold">Distrito</th>
                <th className="px-3 pb-4 font-bold">Estado</th>
                <th className="px-3 pb-4 font-bold">Registro</th>
                <th className="px-3 pb-4 font-bold">Acciones</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                  
                  {/* Profesional */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[13px] font-bold text-[#0f766e]">
                        {item.initials}
                      </div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  
                  {/* Nivel */}
                  <td className="px-3 py-4 text-[13px] font-medium text-slate-500">{item.role}</td>
                  
                  {/* Distrito */}
                  <td className="px-3 py-4 text-[13px] font-medium text-slate-500">{item.district}</td>
                  
                  {/* Estado (Badge) */}
                  <td className="px-3 py-4">
                    <span className="inline-flex items-center rounded-full bg-[#ccfbf1] px-3 py-1 text-[11px] font-bold text-[#0f766e]">
                      {item.status}
                    </span>
                  </td>
                  
                  {/* Registro */}
                  <td className="px-3 py-4 text-[13px] font-medium text-slate-400">{item.date}</td>
                  
                  {/* Acciones */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProfile(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver perfil
                      </button>
                      <button
                        onClick={() => handleOpenUnpublish(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#fbcfe8] px-3 py-1.5 text-[12px] font-bold text-[#f43f5e] transition hover:bg-[#fff5f6]"
                      >
                        Despublicar
                      </button>
                      <button
                        onClick={() => handleOpenSuspend(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#fbcfe8] px-3 py-1.5 text-[12px] font-bold text-[#f43f5e] transition hover:bg-[#fff5f6]"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Suspender
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de la Tabla */}
        <div className="mt-6 text-[13px] font-medium text-slate-400">
          Mostrando {filteredData.length} de {MOCK_DATA.length} enfermeros
        </div>
        
      </div>

      {/* MODAL: Ver Perfil */}
      {activeModal === "profile" && selectedProfessional && (
        <Modal
          title={selectedProfessional.name}
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-lg"
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setTimeout(() => handleOpenSuspend(selectedProfessional), 100);
                }}
                className="rounded-2xl bg-[#f43f5e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Suspender Cuenta
              </button>
            </div>
          }
        >
          <div className="space-y-6 p-2">
            {/* Avatar y Info Principal */}
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-2xl font-bold text-[#0f766e]">
                {selectedProfessional.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedProfessional.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedProfessional.role} · {selectedProfessional.district}
                </p>
              </div>
            </div>

            {/* Secciones de Información */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400">
                Estado Verificación
              </label>
              <p className="mt-2 text-base font-bold text-slate-900">Approved</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400">
                Registro
              </label>
              <p className="mt-2 text-base font-bold text-slate-900">
                {selectedProfessional.date}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400">
                Especialidad
              </label>
              <p className="mt-2 text-base font-bold text-slate-900">
                {selectedProfessional.specialty || "No especificada"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400">
                Biografía
              </label>
              <p className="mt-2 text-base text-slate-900">
                {selectedProfessional.bio || "Sin biografía"}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Confirmar Despublicación */}
      {activeModal === "unpublish" && selectedProfessional && (
        <Modal
          title="Despublicar Enfermero"
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-md"
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUnpublish}
                className="rounded-2xl bg-[#f43f5e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Despublicar
              </button>
            </div>
          }
        >
          <div className="space-y-4 p-2">
            <p className="text-base text-slate-700">
              ¿Estás seguro de que deseas despublicar a{" "}
              <span className="font-bold">{selectedProfessional.name}</span>? Este
              enfermero no aparecerá más en el directorio.
            </p>
          </div>
        </Modal>
      )}

      {/* MODAL: Éxito Despublicación */}
      {activeModal === "unpublish-success" && selectedProfessional && (
        <Modal
          title="Éxito"
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-md"
          footer={
            <div className="flex justify-center">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-2xl bg-teal-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Cerrar
              </button>
            </div>
          }
        >
          <div className="space-y-4 p-2 text-center">
            <p className="text-base text-slate-700">
              ✓ Enfermero despublicado correctamente
            </p>
          </div>
        </Modal>
      )}

      {/* MODAL: Suspender Cuenta */}
      {activeModal === "suspend" && selectedProfessional && (
        <Modal
          title="Suspender cuenta"
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-md"
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="rounded-2xl bg-[#f43f5e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
              >
                Suspender
              </button>
            </div>
          }
        >
          <div className="space-y-5 p-2">
            <div>
              <p className="text-sm font-semibold text-slate-600">
                {selectedProfessional.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Motivo de suspensión
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={4}
                placeholder="Describe el motivo de la suspensión..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition focus:border-teal-400"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}