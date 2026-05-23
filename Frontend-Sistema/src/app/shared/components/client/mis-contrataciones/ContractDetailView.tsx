import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lock,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import type { ContratoDetalle } from "../../../../core/models/hiring.model";
import { MOCK_CLIENT_DNI } from "../../../../features/private/client/data/mockContrataciones";
import ConfirmarContratoModal from "./ConfirmarContratoModal";

type ContractDetailViewProps = {
  contrato: ContratoDetalle;
  onBack: () => void;
  onFirmado?: () => void;
};

export default function ContractDetailView({
  contrato,
  onBack,
  onFirmado,
}: ContractDetailViewProps) {
  const [showFirmaModal, setShowFirmaModal] = useState(false);
  const comision = Math.round(
    (contrato.montoTotal * contrato.comisionPorcentaje) / 100
  );
  const subtotal = contrato.montoTotal - comision;

  const handleFirma = (dni: string) => {
    if (dni !== MOCK_CLIENT_DNI) {
      window.alert("DNI incorrecto. Usa 12345678 para simular la firma.");
      return;
    }
    setShowFirmaModal(false);
    window.alert("Contrato firmado correctamente (simulación).");
    onFirmado?.();
  };

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg p-1 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-teal-600"
          aria-label="Volver a mis contrataciones"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-900">Contrato {contrato.codigo}</span>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Contrato {contrato.codigo}
            </h1>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              Confirmado — Pendiente de firma
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Emitido el {contrato.emitidoEl} · Servicio {contrato.tipoServicio}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Descargar PDF
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Partes del Contrato</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-xs font-bold tracking-wide text-emerald-700">
                  PROFESIONAL DE SALUD
                </p>
                <div className="mt-3 flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 font-bold text-white">
                    {contrato.profesionalIniciales}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{contrato.profesionalNombre}</p>
                    <p className="text-sm text-slate-600">{contrato.especialidad}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <User className="h-3.5 w-3.5" />
                      {contrato.profesionalRol}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {contrato.profesionalUbicacion}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verificado
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-pink-100 bg-pink-50/50 p-4">
                <p className="text-xs font-bold tracking-wide text-pink-700">
                  PACIENTE A ATENDER
                </p>
                <div className="mt-3 flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-200 text-pink-700">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{contrato.paciente}</p>
                    <p className="text-sm text-slate-600">{contrato.pacienteEdad}</p>
                    <p className="mt-1 flex items-start gap-1 text-xs text-slate-500">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {contrato.pacienteDireccion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Detalles del Servicio</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Tipo de Servicio", contrato.tipoServicio],
                ["Fecha de Inicio", contrato.fechaInicio],
                ["Fecha de Fin", contrato.fechaFin],
                ["Horario", contrato.horario],
                ["Total de Días", `${contrato.duracionDias} días`],
                ["Total de Horas", `${contrato.duracionHoras} horas`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-slate-700">Jornadas Programadas</p>
              {contrato.jornadas.map((j, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">{j.fecha}</span>
                    <span className="text-slate-400">·</span>
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{j.horario}</span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    Pendiente
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Términos y Condiciones</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
              {contrato.terminos.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ol>
            <div className="mt-4 flex gap-3 rounded-xl bg-sky-50 p-4">
              <Shield className="h-5 w-5 shrink-0 text-sky-600" />
              <p className="text-sm text-sky-800">
                Este contrato está pendiente de firma digital por parte del cliente para activar
                el servicio.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Historial del Contrato</h2>
            <ul className="space-y-4">
              {contrato.historial.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.titulo}</p>
                    <p className="text-xs text-slate-500">{item.fecha}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Resumen de Pago</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>
                  {contrato.horasTarifa} hrs × S/ {contrato.tarifaHora}
                </span>
                <span>S/ {subtotal.toLocaleString("es-PE")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Comisión plataforma ({contrato.comisionPorcentaje}%)</span>
                <span>S/ {comision.toLocaleString("es-PE")}</span>
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-emerald-600">
              S/ {contrato.montoTotal.toLocaleString("es-PE")}
            </p>
            <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              <Lock className="h-4 w-4 shrink-0" />
              <p>
                Pago en custodia: los fondos se liberan al confirmar la satisfacción del servicio.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFirmaModal(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <FileText className="h-4 w-4" />
              Confirmar Contrato
            </button>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Descargar Contrato
            </button>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Datos del Cliente</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Cliente</dt>
                <dd className="font-semibold text-slate-900">{contrato.clienteNombre}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Plan</dt>
                <dd className="font-semibold text-slate-900">{contrato.clientePlan}</dd>
              </div>
              <div>
                <dt className="text-slate-500">PIN de servicio</dt>
                <dd className="font-mono font-bold text-teal-600">{contrato.pinServicio}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {showFirmaModal && (
        <ConfirmarContratoModal
          onClose={() => setShowFirmaModal(false)}
          onConfirm={handleFirma}
        />
      )}
    </div>
  );
}
