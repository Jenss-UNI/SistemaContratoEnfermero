import { Calendar, FileText, X } from "lucide-react";
import type { Contratacion } from "../../../../core/models/hiring.model";
import { formatDuracion, formatPeriodo } from "../../../../core/utils/hiringFormat";
import ContratacionStatusBadge from "./ContratacionStatusBadge";
import PagoEstadoFooter from "./PagoEstadoFooter";
import StarRating from "./StarRating";

type ContratacionCardProps = {
  contratacion: Contratacion;
  onVerDetalle?: () => void;
  onCancelar?: () => void;
  onFirmarContrato?: () => void;
  onVerJornadas?: () => void;
  onVerContrato?: () => void;
};

function ProfesionalHeader({ contratacion }: { contratacion: Contratacion }) {
  return (
    <div className="flex min-w-0 gap-3 sm:gap-4">
      {contratacion.profesionalFotoUrl ? (
        <img
          src={contratacion.profesionalFotoUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white sm:h-14 sm:w-14 sm:text-base">
          {contratacion.profesionalIniciales}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-bold text-slate-900">{contratacion.profesionalNombre}</h3>
        <p className="text-sm text-slate-500">{contratacion.especialidad}</p>
      </div>
    </div>
  );
}

function DetalleGrid({ contratacion }: { contratacion: Contratacion }) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ["PACIENTE", contratacion.paciente],
        [
          "PERÍODO",
          formatPeriodo(contratacion.periodoInicio, contratacion.periodoFin),
        ],
        [
          "DURACIÓN",
          formatDuracion(contratacion.duracionDias, contratacion.duracionHoras),
        ],
        ["TOTAL", `S/ ${contratacion.montoTotal.toLocaleString("es-PE")}`],
      ].map(([label, value]) => (
        <div key={label}>
          <p className="text-[10px] font-bold tracking-wide text-slate-400 sm:text-xs">
            {label}
          </p>
          <p
            className={`mt-0.5 text-sm text-slate-900 ${
              label === "TOTAL" ? "font-bold" : "font-medium"
            }`}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

const outlineTeal =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-teal-500 px-4 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50";
const outlineSlate =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";
const outlineRed =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50";

export default function ContratacionCard({
  contratacion,
  onVerDetalle,
  onCancelar,
  onFirmarContrato,
  onVerJornadas,
  onVerContrato,
}: ContratacionCardProps) {
  const { estado } = contratacion;

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <ProfesionalHeader contratacion={contratacion} />
        <ContratacionStatusBadge estado={estado} />
      </div>

      <DetalleGrid contratacion={contratacion} />

      {estado === "completado" &&
        contratacion.calificacion != null &&
        contratacion.comentarioCalificacion && (
          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
            <StarRating value={contratacion.calificacion} />
            <p className="text-sm text-amber-900">{contratacion.comentarioCalificacion}</p>
          </div>
        )}

      <div className="mt-4 flex flex-col gap-4 border-t border-slate-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <PagoEstadoFooter
          estado={contratacion.pagoEstado}
          codigo={contratacion.codigoServicio ?? contratacion.codigo}
          codigoExtra={contratacion.codigoContrato}
        />

        <div className="flex flex-wrap gap-2 sm:justify-end">
         {estado === "pendiente" && (
  <>
    <button type="button" onClick={onCancelar} className={outlineRed}>
      <X className="h-4 w-4" />
      Cancelar  
    </button>
    <button type="button" onClick={onVerDetalle} className={outlineTeal}>
      Ver detalle
    </button>
            </>
          )}
          {estado === "confirmado" && (
            <button type="button" onClick={onFirmarContrato} className={outlineTeal}>
              <FileText className="h-4 w-4" />
              Firmar contrato
            </button>
          )}
          {(estado === "activo" || estado === "completado") && (
            <>
              <button type="button" onClick={onVerJornadas} className={outlineTeal}>
                <Calendar className="h-4 w-4" />
                Ver jornadas
              </button>
              <button type="button" onClick={onVerContrato} className={outlineSlate}>
                <FileText className="h-4 w-4" />
                Ver contrato
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
