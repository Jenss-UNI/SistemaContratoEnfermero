import { MapPin } from "lucide-react";
import type { Patient } from "../../../../core/models/patient.model";
import Modal from "./Modal";
import TagBadge from "./TagBadge";

type PatientDetailModalProps = {
  patient: Patient;
  onClose: () => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 9) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return phone;
}

export default function PatientDetailModal({ patient, onClose }: PatientDetailModalProps) {
  const addressLine = `${patient.direccion}, ${patient.distrito}`;

  return (
    <Modal title="Ficha del Paciente" onClose={onClose} maxWidthClass="max-w-xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {patient.fotoUrl ? (
            <img
              src={patient.fotoUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600">
              {getInitials(patient.nombreCompleto)}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-slate-900">{patient.nombreCompleto}</h3>
            <p className="text-sm text-slate-500">
              {patient.edad} años · {patient.parentesco}
            </p>
            {patient.tipoSangre && (
              <span className="mt-1 inline-block rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                {patient.tipoSangre}
              </span>
            )}
          </div>
        </div>

        {patient.condicionesMedicas.length > 0 && (
          <section>
            <p className="mb-2 text-xs font-bold tracking-wide text-slate-500">
              CONDICIONES MÉDICAS
            </p>
            <div className="flex flex-wrap gap-2">
              {patient.condicionesMedicas.map((c) => (
                <TagBadge key={c} label={c} variant="condition" />
              ))}
            </div>
          </section>
        )}

        {patient.medicamentos.length > 0 && (
          <section>
            <p className="mb-2 text-xs font-bold tracking-wide text-slate-500">MEDICAMENTOS</p>
            <div className="flex flex-wrap gap-2">
              {patient.medicamentos.map((m) => (
                <TagBadge key={m} label={m} variant="medication" />
              ))}
            </div>
          </section>
        )}

        {patient.alergias.length > 0 && (
          <section>
            <p className="mb-2 text-xs font-bold tracking-wide text-slate-500">ALERGIAS</p>
            <div className="flex flex-wrap gap-2">
              {patient.alergias.map((a) => (
                <TagBadge key={a} label={a} variant="allergy" showWarning />
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold tracking-wide text-slate-500">CONTACTO EMERGENCIA</p>
            <p className="mt-2 font-semibold text-slate-900">{patient.contactoEmergencia}</p>
            <p className="text-sm text-slate-600">{formatPhone(patient.telefonoEmergencia)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold tracking-wide text-slate-500">UBICACIÓN</p>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
              <span>{addressLine}</span>
            </p>
            {patient.referencia && (
              <p className="mt-1 text-xs text-slate-500">{patient.referencia}</p>
            )}
          </div>
        </div>

        {patient.notasCuidado && (
          <section className="rounded-xl bg-sky-50 p-4">
            <p className="text-xs font-bold tracking-wide text-sky-700">NOTAS DEL CUIDADO</p>
            <p className="mt-2 text-sm leading-relaxed text-sky-900">{patient.notasCuidado}</p>
          </section>
        )}
      </div>
    </Modal>
  );
}
