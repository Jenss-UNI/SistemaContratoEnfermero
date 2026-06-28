import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileDown,
  FileText,
  Lock,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
  CalendarDays,
  History,
  CircleDollarSign,
  Stethoscope,
  Sun,
  Timer,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ContratoDetalle } from "../../../../core/models/hiring.model";
import { fetchContractDetail } from "../../../../features/private/client/services/hiring.service";
import ConfirmarContratoModal from "./ConfirmarContratoModal";

type ContractDetailViewProps = {
  serviceId: string;
  onBack: () => void;
  onFirmado?: () => void;
};

export default function ContractDetailView({
  serviceId,
  onBack,
  onFirmado,
}: ContractDetailViewProps) {
  const [contrato, setContrato] = useState<ContratoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showFirmaModal, setShowFirmaModal] = useState(false);

  const loadContract = () => {
    setLoading(true);
    fetchContractDetail(Number(serviceId))
      .then((data) => {
        setContrato(data);
      })
      .catch((err) => {
        console.error("Error loading contract:", err);
        setErrorMsg("Ocurrió un error al cargar los detalles del contrato.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (serviceId) {
      loadContract();
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 bg-white rounded-2xl shadow-sm border border-slate-100">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
        <p className="text-sm font-semibold text-slate-500">Cargando detalles del contrato...</p>
      </div>
    );
  }

  if (errorMsg || !contrato) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
        <p className="text-red-500 font-semibold">{errorMsg || "No se encontró el contrato."}</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition">
          Volver
        </button>
      </div>
    );
  }

  const comision = Math.round(
    (contrato.montoTotal * contrato.comisionPorcentaje) / 100
  );
  const subtotal = contrato.montoTotal - comision;

  const estadoStr =
    contrato.estado === "confirmado" ? "Confirmado — Pendiente de firma" :
    contrato.estado === "activo"     ? "Activo" :
    contrato.estado === "completado" ? "Completado" :
    "Pendiente";

  // El cliente puede firmar solo cuando el enfermero ya aceptó (estado = 'confirmado')
  const isPendienteFirma = contrato.estado === "confirmado";

  // Badge de color según estado del contrato
  const estadoBadgeClass =
    contrato.estado === "activo"     ? "bg-teal-100 text-teal-700" :
    contrato.estado === "confirmado" ? "bg-blue-100 text-blue-700" :
    contrato.estado === "completado" ? "bg-emerald-100 text-emerald-700" :
    "bg-amber-100 text-amber-700";

  const estadoDotClass =
    contrato.estado === "activo"     ? "bg-teal-500" :
    contrato.estado === "confirmado" ? "bg-blue-500" :
    contrato.estado === "completado" ? "bg-emerald-500" :
    "bg-amber-500";

  const handleExportPdf = () => {
    window.print();
  };


  return (
    <div id="printable-contract-view" className="mx-auto max-w-5xl space-y-6 pb-12">
      <style>{`
        @media print {
          /* Ocultar elementos de navegación, cabecera de bienvenida, pie de página y botones */
          header, 
          footer, 
          nav, 
          button,
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Ajustar y resetear los contenedores padres en la impresión */
          html, body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }

          /* Eliminar el relleno superior de 170px de la vista privada del cliente */
          div.min-h-screen {
            padding-top: 0 !important;
            background-color: white !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          
          /* Ajustar contenedor principal de impresión para ocupar toda la página de forma estática */
          #printable-contract-view {
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* Convertir grids complejos a bloque para evitar saltos de línea raros */
          .grid {
            display: block !important;
          }
          .grid > * {
            margin-bottom: 20px !important;
            width: 100% !important;
          }
          /* Evitar que se corten secciones individuales a la mitad, pero permitir que las columnas fluyan */
          section, 
          .rounded-2xl {
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
          }
        }
      `}</style>
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-teal-600 inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
        <span>›</span>
        <span className="font-semibold text-slate-800">Contrato {contrato.codigo}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm print:shadow-none">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Contrato {contrato.codigo}</h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${estadoBadgeClass}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${estadoDotClass}`}></span>
              {estadoStr}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Emitido el {contrato.emitidoEl} · Servicio {contrato.tipoServicio}
          </p>
        </div>
        <button
          onClick={handleExportPdf}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 print:hidden"
        >
          <FileDown className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

    
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        
        <div className="space-y-6 lg:col-span-2">
          
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
              <Users className="h-5 w-5 text-teal-600" />
              Partes del Contrato
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-teal-50/50 p-5 border border-teal-100/50">
                <p className="mb-3 text-xs font-bold text-teal-600">PROFESIONAL DE SALUD</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
                    {contrato.profesionalIniciales}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{contrato.profesionalNombre}</h3>
                    <p className="text-xs text-slate-550">{contrato.especialidad}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-400"/> {contrato.profesionalRol}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400"/> {contrato.profesionalUbicacion}</div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verificado
                </div>
              </div>

              <div className="rounded-xl bg-rose-50/40 p-5 border border-rose-100/50">
                <p className="mb-3 text-xs font-bold text-rose-500">PACIENTE A ATENDER</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{contrato.paciente}</h3>
                    <p className="text-xs text-slate-500">{contrato.pacienteEdad}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5"/> 
                    {contrato.pacienteDireccion}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarDays className="h-5 w-5 text-teal-600" />
              Detalles del Servicio
            </h2>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-6">
              {[
                { label: "Tipo de Servicio", value: contrato.tipoServicio, icon: Stethoscope },
                { label: "Fecha de Inicio", value: contrato.fechaInicio, icon: Calendar },
                { label: "Fecha de Fin", value: contrato.fechaFin, icon: CalendarDays },
                { label: "Horario", value: contrato.horario, icon: Clock },
                { label: "Total de Días", value: `${contrato.duracionDias} días`, icon: Sun },
                { label: "Total de Horas", value: `${contrato.duracionHoras} horas`, icon: Timer },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Icon className="h-3.5 w-3.5 text-teal-500" />
                    {label}
                  </p>
                  <p className="font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">JORNADAS PROGRAMADAS</h3>
              <div className="space-y-2">
                {contrato.jornadas.map((j, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      {j.fecha}
                    </div>
                    <span className="text-sm text-slate-500">{j.horario}</span>
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Pendiente</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
              <FileText className="h-5 w-5 text-teal-600" />
              Términos y Condiciones
            </h2>
            <ul className="space-y-4 text-sm text-slate-600 mb-6">
              {contrato.terminos.map((term, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-bold text-teal-600">{i + 1}</span>
                  <p>{term}</p>
                </li>
              ))}
            </ul>

            {contrato.firma ? (
              <div className="rounded-xl bg-teal-50/50 border border-teal-100 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-teal-900">Firma Digital — Ya se firmó</h4>
                    <p className="text-xs text-slate-550 mt-1">El contrato ha sido validado y firmado digitalmente por el cliente.</p>
                  </div>
                </div>
                
                <div className="mt-4 border border-slate-200/60 rounded-xl bg-white p-4 max-w-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Firma del Cliente</p>
                  <img 
                    src={contrato.firma.signature_url} 
                    alt="Firma del cliente" 
                    className="h-20 object-contain mx-auto bg-slate-50/30 rounded border border-slate-100" 
                  />
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Nombre:</span>
                      <span className="font-semibold text-slate-800">{contrato.clienteNombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">DNI:</span>
                      <span className="font-mono font-bold text-slate-800">{contrato.firma.dni}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Fecha y Hora:</span>
                      <span className="font-medium text-slate-800">{new Date(contrato.firma.signed_at).toLocaleString("es-PE")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-teal-50 border border-teal-100 p-5 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-teal-900">Firma Digital</h4>
                  <p className="text-sm text-teal-700 mt-1">Este contrato está pendiente de firma digital por parte del cliente para activar el servicio.</p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
              <History className="h-5 w-5 text-teal-600" />
              Historial del Contrato
            </h2>
            <div className="space-y-4">
              {contrato.historial.map((item: any, i: number) => {
                const isAceptado = item.titulo.toLowerCase().includes("aceptó");
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        isAceptado ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isAceptado ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      {i !== contrato.historial.length - 1 && <div className="h-full w-px bg-slate-200 my-2"></div>}
                    </div>
                    <div className="pb-4 pt-1">
                      <p className="font-semibold text-slate-900">{item.titulo}</p>
                      <p className="text-sm text-slate-500">{item.fecha}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

   
        <div className="space-y-6">
          
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
              <CircleDollarSign className="h-5 w-5 text-teal-600" />
              Resumen de Pago
            </h2>
            
            <div className="space-y-3 text-sm text-slate-600 border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span>{contrato.horasTarifa} hrs × S/ {contrato.tarifaHora}</span>
                <span className="font-medium text-slate-900">S/ {subtotal.toLocaleString("es-PE")}</span>
              </div>
              <div className="flex justify-between">
                <span>Comisión plataforma ({contrato.comisionPorcentaje}%)</span>
                <span className="font-medium text-slate-900">S/ {comision.toLocaleString("es-PE")}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-xl font-bold text-teal-600">S/ {contrato.montoTotal.toLocaleString("es-PE")}</span>
            </div>

            <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-orange-600" />
                <h4 className="text-xs font-bold text-orange-800 uppercase tracking-wide">Pago en Custodia</h4>
              </div>
              <p className="text-xs text-orange-700 leading-relaxed">
                El dinero está retenido de forma segura. Se libera al enfermero solo cuando confirmas que el servicio fue satisfactorio.
              </p>
            </div>

            {isPendienteFirma && (
              <button
                type="button"
                onClick={() => setShowFirmaModal(true)}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 print:hidden"
              >
                <FileText className="h-4 w-4" />
                Firmar Contrato
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
              <UserRound className="h-5 w-5 text-teal-600" />
              Datos del Cliente
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Cliente</span>
                <span className="font-medium text-slate-900">{contrato.clienteNombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plan</span>
                <span className="font-medium text-slate-900">{contrato.clientePlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PIN de servicio</span>
                <span className="font-bold text-slate-900">{contrato.pinServicio}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {showFirmaModal && (
        <ConfirmarContratoModal
          serviceId={contrato.id}
          clientName={contrato.clienteNombre}
          clientDni={contrato.clienteDni || ""}
          onClose={() => setShowFirmaModal(false)}
          onSuccess={() => {
            setShowFirmaModal(false);
            loadContract();
            if (onFirmado) onFirmado();
          }}
        />
      )}
    </div>
  );
}