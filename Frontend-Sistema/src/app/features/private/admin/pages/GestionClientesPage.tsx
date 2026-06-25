import { useState } from "react";
import { Search, Eye, Ban, Check, Ban as BanIcon, X } from "lucide-react";
import Modal from "../../../../shared/components/client/mis-pacientes/Modal";

// Tipado de datos adaptado para incluir estado de suspensión e imagen
type Client = {
  id: string;
  initials: string;
  image?: string;
  name: string;
  district: string;
  phone: string;
  date: string;
  isSuspended?: boolean;
  suspensionReason?: string;
};

// Datos de prueba basados en tu imagen
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    initials: "CM",
    name: "Carlos Mendez Pasco",
    district: "Surco",
    phone: "987123456",
    date: "12/6/2026",
    isSuspended: true,
    suspensionReason: "asas",
  },
  {
    id: "2",
    initials: "JP",
    name: "Juan Perez Casas",
    district: "San Martín de Porres",
    phone: "987111112",
    date: "11/6/2026",
    isSuspended: false,
  },
];

type ModalType = null | "profile" | "suspend" | "suspend-success" | "activate-success";

export default function GestionClientesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
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
    if (!selectedClient) return;
    const reason = suspensionReason.trim();
    if (!reason) return;

    setClients((current) =>
      current.map((client) =>
        client.id === selectedClient.id
          ? { ...client, isSuspended: true, suspensionReason: reason }
          : client
      )
    );
    setSelectedClient((current) =>
      current
        ? { ...current, isSuspended: true, suspensionReason: reason }
        : current
    );
    setSuspensionReason("");
    setActiveModal("suspend-success");
  };

  const handleActivateClient = (client: Client) => {
    setClients((current) =>
      current.map((item) =>
        item.id === client.id
          ? { ...item, isSuspended: false, suspensionReason: undefined }
          : item
      )
    );
    if (selectedClient?.id === client.id) {
      setSelectedClient({ ...client, isSuspended: false, suspensionReason: undefined });
    }
    setActiveModal("activate-success");
  };

  const handleSearchChange = (value: string) => {
    const validInput = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ ]/g, "");
    setSearchQuery(validInput);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSuspendConfirmDisabled = suspensionReason.trim().length === 0;

  return (
    <div className="w-full">
      {/* Tarjeta Contenedora Principal */}
      <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm md:p-5">
        
        {/* Cabecera: Título y Buscador */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-slate-900">Clientes Registrados</h2>

          {/* Buscador */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-[12px] text-slate-900 outline-none transition focus:border-teal-400 sm:w-56"
            />
          </div>
        </div>

        {/* Contenedor de la Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-[720px] table-auto w-full text-left text-xs whitespace-nowrap">
            
            {/* Cabecera de la tabla */}
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-500">
                <th className="px-3 pb-2.5 font-bold">Cliente</th>
                <th className="px-3 pb-2.5 font-bold">Distrito</th>
                <th className="px-3 pb-2.5 font-bold">Teléfono</th>
                <th className="px-3 pb-2.5 font-bold">Registro</th>
                <th className="px-3 pb-2.5 font-bold">Acciones</th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla */}
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id} 
                  className={`transition-colors hover:bg-slate-50/50 ${client.isSuspended ? "bg-rose-50/40" : ""}`}
                >
                  
                  {/* Columna: Cliente (Avatar + Nombre) */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      {client.image ? (
                        <img 
                          src={client.image} 
                          alt={client.name} 
                          className="h-9 w-9 flex-shrink-0 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${client.isSuspended ? "bg-rose-100 text-rose-700" : "bg-[#ccfbf1] text-[#0f766e]"}`}>
                          {client.initials}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[12px]">{client.name}</span>
                        {client.isSuspended && (
                          <span className="text-[10px] font-medium text-rose-500 mt-0.5">Suspendido</span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Columna: Distrito */}
                  <td className="px-3 py-2.5 text-[11px] font-medium text-slate-500">
                    {client.district}
                  </td>
                  
                  {/* Columna: Teléfono */}
                  <td className="px-3 py-2.5 text-[11px] font-medium text-slate-500">
                    {client.phone}
                  </td>
                  
                  {/* Columna: Fecha de Registro */}
                  <td className="px-3 py-2.5 text-[11px] font-medium text-slate-400">
                    {client.date}
                  </td>
                  
                  {/* Columna: Acciones */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProfile(client)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver perfil
                      </button>

                      {client.isSuspended ? (
                        <button
                          onClick={() => handleActivateClient(client)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#a5edd9] px-3 py-1.5 text-[12px] font-bold text-[#0db39e] transition hover:bg-[#f0fdfa]"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie de página (Footer) */}
        <div className="mt-3 text-[11px] font-medium text-slate-400">
          Total: {filteredClients.length} de {clients.length} clientes
        </div>
        
      </div>

      {/* MODAL: Ver Perfil */}
      {activeModal === "profile" && selectedClient && (
        <Modal
          title="" // Título vacío
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-[480px]"
          hideCloseIcon={true} // <-- Propiedad sugerida para ocultar la "X" del componente padre
          footer={
            <div className="flex w-full gap-3 pt-2">
              {selectedClient.isSuspended ? (
                <button
                  onClick={() => handleActivateClient(selectedClient)}
                  className="flex-1 rounded-xl bg-[#0db39e] py-3 text-[12px] font-bold text-white transition hover:bg-[#0a8e7c]"
                >
                  <Check className="h-3.5 w-3.5 inline-block mr-1 mb-0.5" strokeWidth={3} />
                  Activar cuenta
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveModal(null);
                    setTimeout(() => handleOpenSuspend(selectedClient), 100);
                  }}
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
          }
        >
          <div className="space-y-4 p-2">
            {/* Cabecera del Modal con la "X" integrada en la misma recta */}
            <div className="flex items-start justify-between gap-4 w-full">
              <div className="flex items-start gap-4 min-w-0">
                {selectedClient.image ? (
                  <img 
                    src={selectedClient.image} 
                    alt={selectedClient.name} 
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-base font-bold ${selectedClient.isSuspended ? "bg-rose-50 text-rose-500" : "bg-[#ccfbf1] text-[#0f766e]"}`}>
                    {selectedClient.initials}
                  </div>
                )}
                <div className="pt-0.5 min-w-0">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">
                    {selectedClient.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">
                    {selectedClient.district} · {selectedClient.phone}
                  </p>
                  {selectedClient.isSuspended && (
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                      <BanIcon className="h-3 w-3" strokeWidth={2.5} />
                      Cuenta suspendida
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de cerrar (X) alineado a la derecha */}
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Grid de Información en 2 Columnas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  TELÉFONO
                </label>
                <p className="mt-0.5 text-[12px] font-bold text-slate-900 truncate">
                  {selectedClient.phone}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  REGISTRO
                </label>
                <p className="mt-0.5 text-[12px] font-bold text-slate-900 truncate">
                  {selectedClient.date}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  DISTRITO
                </label>
                <p className="mt-0.5 text-[12px] font-bold text-slate-900 truncate">
                  {selectedClient.district}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-[#fafafa] p-3 min-w-0">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  ESTADO
                </label>
                <p className="mt-0.5 text-[12px] font-bold text-slate-900 truncate">
                  {selectedClient.isSuspended ? "Suspendido" : "Activo"}
                </p>
              </div>
            </div>

            {/* Motivo de suspensión (Si aplica) */}
            {selectedClient.isSuspended && selectedClient.suspensionReason && (
              <div className="rounded-xl bg-[#fff1f2] p-3 break-words">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  MOTIVO DE SUSPENSIÓN
                </label>
                <p className="mt-0.5 text-[12px] font-medium text-rose-600">
                  {selectedClient.suspensionReason}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* MODAL: Suspender Cuenta */}
      {activeModal === "suspend" && selectedClient && (
        <Modal
          title="" // Título vacío para usar cabecera personalizada
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-md"
          hideCloseIcon={true} // <-- Propiedad sugerida para ocultar la "X" del componente padre
          footer={
            <div className="flex w-full gap-3 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSuspend}
                disabled={isSuspendConfirmDisabled}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-[13px] font-bold text-white transition hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
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
                <p className="mt-1 text-[12px] text-slate-500 truncate">
                  {selectedClient.name}
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
              <label className="block text-[12px] font-bold text-slate-700 mb-2">
                Motivo de suspensión
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Ej: Documentos falsos, conducta inapropiada,&#10;incumplimiento de normas..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-[12px] text-slate-700 outline-none transition focus:border-rose-400 placeholder:text-slate-400"
              />
              <div className="mt-1.5 text-[10px] font-medium text-slate-400">
                {suspensionReason.length}/500
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Éxito Suspensión */}
      {activeModal === "suspend-success" && selectedClient && (
        <Modal
          title=""
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-xs"
        >
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <p className="mb-6 text-[14px] font-bold text-slate-900">
              Cliente suspendido correctamente
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-slate-900 py-3 text-[13px] font-bold text-white transition hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: Éxito Activación */}
      {activeModal === "activate-success" && selectedClient && (
        <Modal
          title=""
          onClose={() => setActiveModal(null)}
          maxWidthClass="max-w-xs"
        >
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#0db39e]">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <p className="mb-6 text-[14px] font-bold text-slate-900">
              Cliente activado correctamente
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-slate-900 py-3 text-[13px] font-bold text-white transition hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}