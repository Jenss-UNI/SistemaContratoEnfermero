import type { Contratacion } from "../../../../core/models/hiring.model";
import { formatDuracion } from "../../../../core/utils/hiringFormat";
import Modal from "../mis-pacientes/Modal";
import ContratacionStatusBadge from "./ContratacionStatusBadge";

type ContratacionDetailModalProps = {
  contratacion: Contratacion;
  onClose: () => void;
};

function ProfesionalAvatar({ contratacion }: { contratacion: Contratacion }) {
  if (contratacion.profesionalFotoUrl) {
    return (
      <img
        src={contratacion.profesionalFotoUrl}
        alt=""
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
      />
    );
  }
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
      {contratacion.profesionalIniciales}
    </div>
  );
}

export default function ContratacionDetailModal({
  contratacion,
  onClose,
}: ContratacionDetailModalProps) {
  const pagoLabel =
    contratacion.pagoContrato === "pendiente"
      ? "Pendiente"
      : contratacion.pagoContrato === "custodia"
        ? "En custodia"
        : "Pagado";

  return (
    <Modal
      title="Detalle del contrato"
      onClose={onClose}
      maxWidthClass="max-w-lg"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cerrar
        </button>
      }
    >
      <p className="-mt-2 mb-5 font-mono text-sm text-slate-500">#{contratacion.codigo}</p>

      <div className="mb-6 flex items-center gap-4">
        <ProfesionalAvatar contratacion={contratacion} />
        <div>
          <h3 className="font-bold text-slate-900">{contratacion.profesionalNombre}</h3>
          <p className="text-sm text-slate-500">{contratacion.especialidad}</p>
        </div>
      </div>

      <dl className="space-y-4">
        {[
          ["Paciente", contratacion.paciente],
          [
            "Período",
            `${contratacion.periodoInicio} → ${contratacion.periodoFin}`,
          ],
          [
            "Duración",
            formatDuracion(contratacion.duracionDias, contratacion.duracionHoras),
          ],
          ["Monto total", `S/ ${contratacion.montoTotal.toLocaleString("es-PE")}`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-slate-50 pb-3 last:border-0"
          >
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd
              className={`text-right text-sm font-semibold ${
                label === "Monto total" ? "text-teal-600" : "text-slate-900"
              }`}
            >
              {value}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-slate-500">Estado</dt>
          <dd>
            <ContratacionStatusBadge estado={contratacion.estado} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-slate-500">Pago</dt>
          <dd className="text-sm font-medium text-slate-600">{pagoLabel}</dd>
        </div>
      </dl>
    </Modal>
  );
}
