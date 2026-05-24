import { useState } from "react";
import { Search, Eye, Ban } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

// Tipado de datos para los clientes
type Client = {
  id: string;
  initials: string;
  name: string;
  district: string;
  phone: string;
  date: string;
};

// Datos de prueba basados en tu imagen
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    initials: "AP",
    name: "Axel Perez",
    district: "San Isidro",
    phone: "744994733",
    date: "20/5/2026",
  },
  {
    id: "2",
    initials: "KL",
    name: "Katy Luna Levita",
    district: "Miraflores",
    phone: "938444849",
    date: "20/5/2026",
  },
  {
    id: "3",
    initials: "JL",
    name: "Jens Jeremies Luna Levita",
    district: "Pueblo Libre",
    phone: "987123456",
    date: "19/5/2026",
  },
];

type ModalType = null | "profile" | "suspend" | "suspend-success";

export default function GestionClientesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [suspensionReason, setSuspensionReason] = useState("");

  const handleOpenProfile = (client: Client) => {
    setSelectedClient(client);
    setActiveModal("profile");
  };

  const handleOpenSuspend = (client: Client) => {
    setSelectedClient(client);
    setSuspensionReason("");
    setActiveModal("suspend");
  };

  const handleConfirmSuspend = () => {
    setActiveModal("suspend-success");
  };

  const handleSearchChange = (value: string) => {
    // Solo permite letras (bloquea números, caracteres especiales y espacios)
    const validInput = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ]/g, "");
    setSearchQuery(validInput);
  };

  // Filtrar datos según la búsqueda
  const filteredClients = MOCK_CLIENTS.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Tarjeta Contenedora Principal */}
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        
        {/* Cabecera: Título y Buscador */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Clientes Registrados</h2>

          {/* Buscador */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-400 sm:w-64"
            />
          </div>
        </div>

        {/* Contenedor de la Tabla (con scroll horizontal en móviles) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            
            {/* Cabecera de la tabla */}
            <thead>
              <tr className="border-b border-slate-100 text-[13px] text-slate-500">
                <th className="pb-4 pl-2 font-bold">Cliente</th>
                <th className="pb-4 font-bold">Distrito</th>
                <th className="pb-4 font-bold">Teléfono</th>
                <th className="pb-4 font-bold">Registro</th>
                <th className="pb-4 font-bold">Acciones</th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla */}
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-slate-50/50">
                  
                  {/* Columna: Cliente (Avatar + Nombre) */}
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-4">
                      {/* Círculo del Avatar (Rosa) */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-[13px] font-bold text-rose-700">
                        {client.initials}
                      </div>
                      <span className="font-bold text-slate-900">{client.name}</span>
                    </div>
                  </td>
                  
                  {/* Columna: Distrito */}
                  <td className="py-4 text-[13px] font-medium text-slate-500">
                    {client.district}
                  </td>
                  
                  {/* Columna: Teléfono */}
                  <td className="py-4 text-[13px] font-medium text-slate-500">
                    {client.phone}
                  </td>
                  
                  {/* Columna: Fecha de Registro */}
                  <td className="py-4 text-[13px] font-medium text-slate-400">
                    {client.date}
                  </td>
                  
                  {/* Columna: Acciones */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenProfile(client)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver perfil
                      </button>
                      <button
                        onClick={() => handleOpenSuspend(client)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-[12px] font-bold text-rose-600 transition hover:bg-rose-50"
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

        {/* Pie de página (Footer) */}
        <div className="mt-6 text-[13px] font-medium text-slate-400">
          Total: {filteredClients.length} de {MOCK_CLIENTS.length} clientes
        </div>
        
      </div>

      {/* MODAL: Ver Perfil */}
      {activeModal === "profile" && selectedClient && (
        <Modal
          title={selectedClient.name}
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-lg"
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-2xl border bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setTimeout(() => handleOpenSuspend(selectedClient), 100);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                <Ban className="h-4 w-4" />
                Suspender cuenta
              </button>
            </div>
          }
        >
          <div className="space-y-6 p-2">
            {/* Avatar y Info Principal */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-700">
                {selectedClient.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedClient.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {selectedClient.district} · {selectedClient.phone}
                </p>
              </div>
            </div>

            {/* Grid de Información en 2 Columnas */}
            <div className="grid grid-cols-2 gap-6">
              {/* Teléfono */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Teléfono
                </label>
                <p className="text-sm font-bold text-slate-900">
                  {selectedClient.phone}
                </p>
              </div>

              {/* Registro */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Registro
                </label>
                <p className="text-sm font-bold text-slate-900">
                  {selectedClient.date}
                </p>
              </div>

              {/* Distrito */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Distrito
                </label>
                <p className="text-sm font-bold text-slate-900">
                  {selectedClient.district}
                </p>
              </div>

              {/* Estado */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Estado
                </label>
                <p className="text-sm font-bold text-slate-900">
                  Activo
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Suspender Cuenta */}
      {activeModal === "suspend" && selectedClient && (
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
                className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Suspender
              </button>
            </div>
          }
        >
          <div className="space-y-5 p-2">
            <div>
              <p className="text-sm font-semibold text-slate-600">
                {selectedClient.name}
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
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition focus:border-rose-400"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Éxito Suspensión */}
      {activeModal === "suspend-success" && selectedClient && (
        <Modal
          title="Éxito"
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-md"
          footer={
            <div className="flex justify-center">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-2xl bg-rose-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Cerrar
              </button>
            </div>
          }
        >
          <div className="space-y-4 p-2 text-center">
            <p className="text-base text-slate-700">
              ✓ Cliente suspendido correctamente
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}