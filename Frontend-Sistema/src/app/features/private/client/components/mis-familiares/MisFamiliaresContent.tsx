import { Plus, Search, Info, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { usePatients } from "../../hooks/usePatients";
import type { Patient, PatientFormData } from "../../../../../core/models/patient.model";
import {
  EMPTY_PATIENT_FORM,
  PatientCard,
  PatientDetailModal,
  PatientFormModal,
  patientToForm,
} from "../../../../../shared/components/client/mis-pacientes";

type ModalMode = "view" | "add" | "edit" | null;

export default function MisFamiliaresContent() {
  const { patients, loading, saving, error, add, edit, remove } = usePatients();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openView = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode("view");
  };

  const openEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalMode("edit");
  };

  const openAdd = () => {
    setSelectedPatient(null);
    setModalMode("add");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPatient(null);
  };

  const handleDelete = async (patient: Patient) => {
    if (patient.parentesco === "Yo mismo") return; // Impedir eliminar al propio cliente
    const ok = window.confirm(
      `¿Eliminar a tu familiar ${patient.nombreCompleto}? Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    await remove(patient.id);
  };

  const handleSaveForm = async (formData: PatientFormData) => {
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
      googleMapsUrl: formData.googleMapsUrl,
      notasCuidado: formData.notasCuidado,
      fotoUrl: formData.fotoUrl,
    };

    let success = false;
    if (modalMode === "edit" && selectedPatient) {
      success = await edit(selectedPatient.id, base, formData.photoFile);
    } else if (modalMode === "add") {
      success = await add(base, formData.photoFile);
    }

    if (success) {
      closeModal();
    }
  };

  // Obtener al titular ("Yo mismo")
  const selfPatient = useMemo(() => {
    return patients.find((p) => p.parentesco === "Yo mismo");
  }, [patients]);

  // Obtener otros familiares
  const otherPatients = useMemo(() => {
    return patients.filter((p) => p.parentesco !== "Yo mismo");
  }, [patients]);

  // Filtrado de otros familiares por nombre completo en tiempo real
  const filteredOtherPatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return otherPatients;
    return otherPatients.filter((p) => p.nombreCompleto.toLowerCase().includes(query));
  }, [otherPatients, searchQuery]);

  const showSelf = !!selfPatient;

  return (
    <div className="space-y-6">
      
      {/* Alertas / Errores */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <Info className="w-4 h-4 shrink-0 text-red-500" />
          {error}
        </div>
      )}

      {/* Contenido / Listado */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-sm font-medium text-slate-500">Cargando familiares...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sección Yo mismo / Titular */}
          {showSelf && selfPatient && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mi ficha personal</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <PatientCard
                  patient={selfPatient}
                  onView={() => openView(selfPatient)}
                  onEdit={() => openEdit(selfPatient)}
                  onDelete={() => handleDelete(selfPatient)}
                />
              </div>
            </div>
          )}

          {/* Divisor */}
          {showSelf && selfPatient && <hr className="border-t border-slate-200 my-6" />}

          {/* Sección Otros Familiares */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mis familiares</h2>
                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Registra los datos de tus familiares antes de contratar un enfermero.
                </p>
              </div>
              <button
                type="button"
                onClick={openAdd}
                disabled={loading || saving}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 sm:shrink-0 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                Agregar Familiar
              </button>
            </div>

            {/* Buscador de familiares */}
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar familiar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {filteredOtherPatients.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
                <p className="text-slate-600">
                  {searchQuery.trim()
                    ? "No se encontraron otros familiares que coincidan con la búsqueda."
                    : "Aún no tienes otros familiares registrados."}
                </p>
                {!searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={openAdd}
                    className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Agregar el primero
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredOtherPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onView={() => openView(patient)}
                    onEdit={() => openEdit(patient)}
                    onDelete={() => handleDelete(patient)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modales */}
      {modalMode === "view" && selectedPatient && (
        <PatientDetailModal patient={selectedPatient} onClose={closeModal} />
      )}

      {modalMode === "edit" && selectedPatient && (
        <PatientFormModal
          title={selectedPatient.parentesco === "Yo mismo" ? "Editar mis datos médicos" : "Editar Familiar"}
          initialForm={patientToForm(selectedPatient)}
          submitLabel="Guardar Cambios"
          onClose={closeModal}
          onSubmit={handleSaveForm}
        />
      )}

      {modalMode === "add" && (
        <PatientFormModal
          title="Agregar Familiar"
          initialForm={EMPTY_PATIENT_FORM}
          submitLabel="Guardar Familiar"
          onClose={closeModal}
          onSubmit={handleSaveForm}
        />
      )}
    </div>
  );
}
