import { Plus } from "lucide-react";
import { useState } from "react";
import type { Patient, PatientFormData } from "../../../../../core/models/patient.model";
import {
  EMPTY_PATIENT_FORM,
  PatientCard,
  PatientDetailModal,
  PatientFormModal,
  patientToForm,
} from "../../../../../shared/components/mis-pacientes";
import { MOCK_PATIENTS } from "../../data/mockPatients";

type ModalMode = "view" | "add" | "edit" | null;

function createId(): string {
  return `p-${Date.now()}`;
}

export default function MisPacientesContent() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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

  const handleDelete = (patient: Patient) => {
    const ok = window.confirm(
      `¿Eliminar a ${patient.nombreCompleto}? Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    setPatients((prev) => prev.filter((p) => p.id !== patient.id));
  };

  const handleSaveForm = (formData: PatientFormData) => {
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
      direccion: formData.direccion,
      distrito: formData.distrito,
      referencia: formData.referencia,
      notasCuidado: formData.notasCuidado,
    };

    if (modalMode === "edit" && selectedPatient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id ? { ...p, ...base } : p
        )
      );
    } else if (modalMode === "add") {
      setPatients((prev) => [
        ...prev,
        {
          id: createId(),
          fotoUrl: undefined,
          ...base,
        },
      ]);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Mis Pacientes</h2>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Registra los datos de tus pacientes antes de contratar un enfermero
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 sm:shrink-0"
        >
          <Plus className="h-4 w-4" />
          Agregar Paciente
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-slate-600">Aún no tienes pacientes registrados.</p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            Agregar el primero
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {patients.map((patient) => (
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

      {modalMode === "view" && selectedPatient && (
        <PatientDetailModal patient={selectedPatient} onClose={closeModal} />
      )}

      {modalMode === "edit" && selectedPatient && (
        <PatientFormModal
          title="Editar Paciente"
          initialForm={patientToForm(selectedPatient)}
          submitLabel="Guardar Cambios"
          onClose={closeModal}
          onSubmit={handleSaveForm}
        />
      )}

      {modalMode === "add" && (
        <PatientFormModal
          title="Agregar Paciente"
          initialForm={EMPTY_PATIENT_FORM}
          submitLabel="Guardar Paciente"
          onClose={closeModal}
          onSubmit={handleSaveForm}
        />
      )}
    </div>
  );
}
