import { MapPin } from "lucide-react";
import { useState } from "react";
import type { PatientFormData } from "../../../../core/models/patient.model";
import { DistritoCombobox, FormField } from "../mi-perfil";
import {
  allowDigitsOnly,
  blockNonDigitKey,
  sanitizeText,
} from "../../../utils/validation";
import GoogleMapPlaceholder from "./GoogleMapPlaceholder";
import {
  BLOOD_TYPE_OPTIONS,
  DISTRITOS_PACIENTE,
  PARENTESCO_OPTIONS,
  validatePatientForm,
} from "./patientFormUtils";
import TagListInput from "./TagListInput";

type PatientFormProps = {
  initialForm: PatientFormData;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (data: PatientFormData) => void;
};

export default function PatientForm({
  initialForm,
  submitLabel,
  onCancel,
  onSubmit,
}: PatientFormProps) {
  const [form, setForm] = useState<PatientFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let next = value;

    if (name === "edad") {
      next = allowDigitsOnly(value, 3);
    } else if (name === "nombreCompleto" || name === "contactoEmergencia") {
      next = sanitizeText(value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,'-]/g, ""), 80);
    } else if (name === "telefonoEmergencia") {
      next = allowDigitsOnly(value, 9);
    } else if (name === "direccion" || name === "referencia") {
      next = sanitizeText(value, 200);
    } else if (name === "notasCuidado") {
      next = sanitizeText(value, 500);
    }

    setForm((prev) => ({ ...prev, [name]: next }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: nextErrors, data } = validatePatientForm(form);
    setErrors(nextErrors);
    if (!data) return;
    onSubmit({
      ...form,
      nombreCompleto: data.nombreCompleto,
      edad: String(data.edad),
      parentesco: data.parentesco,
      tipoSangre: data.tipoSangre,
      condicionesMedicas: data.condicionesMedicas,
      medicamentos: data.medicamentos,
      alergias: data.alergias,
      contactoEmergencia: data.contactoEmergencia,
      telefonoEmergencia: data.telefonoEmergencia,
      direccion: data.direccion,
      distrito: data.distrito,
      referencia: data.referencia,
      notasCuidado: data.notasCuidado,
    });
  };

  const notasLength = form.notasCuidado.length;

  return (
    <form id="patient-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Nombre completo"
          name="nombreCompleto"
          value={form.nombreCompleto}
          onChange={handleChange}
          error={errors.nombreCompleto}
          placeholder="Ej: Elena Rodríguez"
          required
          maxLength={80}
          className="sm:col-span-2"
        />
        <FormField
          label="Edad"
          name="edad"
          inputMode="numeric"
          value={form.edad}
          onChange={handleChange}
          onKeyDown={blockNonDigitKey}
          error={errors.edad}
          placeholder="78"
          required
          maxLength={3}
        />
        <FormField
          label="Parentesco"
          name="parentesco"
          as="select"
          value={form.parentesco}
          onChange={handleChange}
          error={errors.parentesco}
          options={PARENTESCO_OPTIONS}
          selectPlaceholder="Seleccionar"
          required
        />
        <FormField
          label="Tipo de sangre"
          name="tipoSangre"
          as="select"
          value={form.tipoSangre}
          onChange={handleChange}
          error={errors.tipoSangre}
          options={BLOOD_TYPE_OPTIONS}
          selectPlaceholder="Seleccionar"
        />
        <FormField
          label="Contacto emergencia"
          name="contactoEmergencia"
          value={form.contactoEmergencia}
          onChange={handleChange}
          error={errors.contactoEmergencia}
          placeholder="Ej: Dr. Ramírez"
          required
          maxLength={80}
        />
        <FormField
          label="Teléfono emergencia"
          name="telefonoEmergencia"
          inputMode="numeric"
          value={form.telefonoEmergencia}
          onChange={handleChange}
          onKeyDown={blockNonDigitKey}
          error={errors.telefonoEmergencia}
          placeholder="987654321"
          required
          maxLength={9}
        />
      </div>

      <TagListInput
        label="Condiciones médicas"
        placeholder="Ej: Hipertensión"
        tags={form.condicionesMedicas}
        variant="condition"
        onChange={(condicionesMedicas) => setForm((p) => ({ ...p, condicionesMedicas }))}
      />
      <TagListInput
        label="Medicamentos"
        placeholder="Ej: Metformina 850mg"
        tags={form.medicamentos}
        variant="medication"
        onChange={(medicamentos) => setForm((p) => ({ ...p, medicamentos }))}
      />
      <TagListInput
        label="Alergias"
        placeholder="Ej: Penicilina"
        tags={form.alergias}
        variant="allergy"
        onChange={(alergias) => setForm((p) => ({ ...p, alergias }))}
      />

      <section className="space-y-4 border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <MapPin className="h-4 w-4 text-teal-600" />
          Ubicación del Paciente
          <span className="font-normal text-slate-500">(donde irá el enfermero)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            error={errors.direccion}
            placeholder="Av. Larco 1234, Dpto 502"
            required
            maxLength={200}
            className="sm:col-span-2"
          />
          <DistritoCombobox
            label="Distrito"
            value={form.distrito}
            onChange={(distrito) => {
              setForm((p) => ({ ...p, distrito }));
              if (errors.distrito) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.distrito;
                  return copy;
                });
              }
            }}
            options={DISTRITOS_PACIENTE}
            error={errors.distrito}
            required
          />
          <FormField
            label="Referencia"
            name="referencia"
            value={form.referencia}
            onChange={handleChange}
            error={errors.referencia}
            placeholder="Frente al parque..."
            maxLength={200}
          />
        </div>

        <GoogleMapPlaceholder />
      </section>

      <div className="space-y-1.5">
        <FormField
          label="Notas adicionales"
          name="notasCuidado"
          as="textarea"
          value={form.notasCuidado}
          onChange={handleChange}
          error={errors.notasCuidado}
          placeholder="Instrucciones de cuidado, dieta, movilización..."
          maxLength={500}
        />
        <p className="text-right text-xs text-slate-400">
          {notasLength}/500
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
