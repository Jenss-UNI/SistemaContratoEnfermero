import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Patient } from "../../../../core/models/patient.model";

const MAX_VISIBLE_TAGS = 2;

type PatientCardProps = {
  patient: Patient;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function PatientCard({ patient, onView, onEdit, onDelete }: PatientCardProps) {
  const isSelf = patient.parentesco === "Yo mismo";
  const visibleTags = patient.condicionesMedicas.slice(0, MAX_VISIBLE_TAGS);
  const extraCount = patient.condicionesMedicas.length - MAX_VISIBLE_TAGS;

  return (
    <article
      className={`rounded-2xl border p-4 shadow-sm sm:p-5 transition-all duration-300 ${
        isSelf ? "border-teal-200 bg-teal-50 shadow-teal-100/40" : "border-slate-100 bg-white"
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        {patient.fotoUrl ? (
          <img
            src={patient.fotoUrl}
            alt={patient.nombreCompleto}
            className={`h-14 w-14 shrink-0 rounded-full object-cover ring-2 sm:h-16 sm:w-16 ${
              isSelf ? "ring-teal-400" : "ring-slate-100"
            }`}
          />
        ) : (
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold sm:h-16 sm:w-16 ${
              isSelf ? "bg-teal-100 text-teal-600" : "bg-pink-100 text-pink-600"
            }`}
            aria-hidden
          >
            {getInitials(patient.nombreCompleto)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900">{patient.nombreCompleto}</h3>
                {patient.tipoSangre && (
                  <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                    {patient.tipoSangre}
                  </span>
                )}
                {isSelf && (
                  <span className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700">
                    Titular (Yo mismo)
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {patient.edad} años · {patient.parentesco === "Yo mismo" ? "Titular" : patient.parentesco}
              </p>
            </div>

            {(onView || onEdit || onDelete) && (
              <div className="flex shrink-0 items-center gap-0.5">
                {onView && (
                  <button
                    type="button"
                    onClick={onView}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-teal-600"
                    aria-label={`Ver ficha de ${patient.nombreCompleto}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-teal-600"
                    aria-label={`Editar ${patient.nombreCompleto}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                {!isSelf && onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar ${patient.nombreCompleto}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {visibleTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600"
                >
                  {tag}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                  +{extraCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {patient.googleMapsUrl ? (
        <a
          href={patient.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition"
        >
          <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
          <span>Ver ubicación en Google Maps</span>
        </a>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-400">
          <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
          <span>Ubicación no especificada</span>
        </div>
      )}
    </article>
  );
}
