import { useState, useEffect } from "react";
import { usePatients } from "../../../private/client/hooks/usePatients";
import {
  EMPTY_PATIENT_FORM,
  PatientFormModal,
} from "../../../../shared/components/client/mis-pacientes";
import type { PatientFormData } from "../../../../core/models/patient.model";
import { Loader2 } from "lucide-react";

interface Props {
  selectedPatient: string;
  setSelectedPatient: (id: string) => void;
  bookingNotes: string;
  setBookingNotes: (notes: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function BookingPatientStep({
  selectedPatient,
  setSelectedPatient,
  bookingNotes,
  setBookingNotes,
  onBack,
  onNext
}: Props) {
  const { patients, loading, add } = usePatients();
  const [showAddForm, setShowAddForm] = useState(false);
  const [lastAddedName, setLastAddedName] = useState<string | null>(null);

  useEffect(() => {
    if (lastAddedName && patients.length > 0) {
      const found = patients.find(p => p.nombreCompleto === lastAddedName);
      if (found) {
        setSelectedPatient(found.id);
        setLastAddedName(null);
      }
    } else if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0].id);
    }
  }, [patients, selectedPatient, setSelectedPatient, lastAddedName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Cargando familiares registrados...</p>
      </div>
    );
  }

  const defaultPhoto = "https://cdn-icons-png.flaticon.com/512/3048/3048127.png";

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-6">
        Selecciona el familiar
      </h3>

      {/* FAMILIARES LIST */}
      <div className="space-y-4">
        {patients.length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-2xl text-center">
            No tienes familiares registrados. Por favor agrega uno a continuación.
          </p>
        ) : (
          patients.map((patient) => {
            const active = selectedPatient === patient.id;
            return (
              <button
                key={patient.id}
                type="button"
                onClick={() => setSelectedPatient(patient.id)}
                className={`w-full border rounded-3xl p-5 transition-all text-left ${
                  active ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={patient.fotoUrl || defaultPhoto}
                    alt={patient.nombreCompleto}
                    className="w-16 h-16 rounded-full object-cover border border-slate-100 bg-slate-50"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {patient.nombreCompleto}
                    </h4>
                    <p className="text-slate-500 text-sm mt-1">
                      {patient.edad} años · {patient.parentesco}
                    </p>
                    {patient.distrito && (
                      <p className="text-slate-400 text-sm mt-1">
                        Distrito: {patient.distrito}
                      </p>
                    )}
                  </div>
                  {/* CHECK */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      active ? "bg-teal-500 border-teal-500" : "border-slate-300"
                    }`}
                  >
                    {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            );
          })
        )}

        {/* ADD FAMILIAR BUTTON */}
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="mt-5 text-teal-600 font-medium hover:text-teal-700 block transition-colors font-semibold"
        >
          + Agregar nuevo familiar
        </button>
      </div>

      {/* ADD FAMILIAR FORM MODAL */}
      {showAddForm && (
        <PatientFormModal
          title="Agregar Familiar"
          initialForm={EMPTY_PATIENT_FORM}
          submitLabel="Guardar Familiar"
          onClose={() => setShowAddForm(false)}
          onSubmit={async (formData: PatientFormData) => {
            const base = {
              nombreCompleto: formData.nombreCompleto,
              edad: Number(formData.edad),
              parentesco: formData.parentesco,
              tipoSangre: formData.tipoSangre,
              condicionesMedicas: formData.condicionesMedicas,
              medicamentos: formData.medicamentos,
              alergias: formData.alergias,
              contactoEmergencia: formData.contactoEmergencia,
              telefonoEmergencia: formData.telefonoEmergencia.replace(/\D/g, ""),
              distrito: formData.distrito,
              googleMapsUrl: formData.googleMapsUrl || "",
              notasCuidado: formData.notasCuidado || "",
              fotoUrl: formData.fotoUrl,
            };
            setLastAddedName(base.nombreCompleto);
            const success = await add(base, formData.photoFile);
            if (success) {
              setShowAddForm(false);
            } else {
              setLastAddedName(null);
            }
          }}
        />
      )}

      {/* ADDITIONAL NOTES */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Notas adicionales para el enfermero
        </label>
        <textarea
          value={bookingNotes}
          onChange={(e) => setBookingNotes(e.target.value)}
          rows={4}
          placeholder="Indicaciones especiales, rutinas, preferencias..."
          className="w-full border border-slate-200 rounded-2xl px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between gap-4 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-slate-200 font-medium hover:bg-slate-50 transition"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!selectedPatient}
          className="flex-1 py-4 rounded-2xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}