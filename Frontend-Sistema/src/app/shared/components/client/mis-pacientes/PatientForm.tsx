import { MapPin, Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import type { PatientFormData } from "../../../../core/models/patient.model";
import { DistritoCombobox, FormField } from "../mi-perfil";
import {
  allowDigitsOnly,
  blockNonDigitKey,
} from "../../../utils/validation";
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
  onSubmit: (data: PatientFormData) => void | Promise<void>;
};

export default function PatientForm({
  initialForm,
  submitLabel,
  onCancel,
  onSubmit,
}: PatientFormProps) {
  const [form, setForm] = useState<PatientFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isSelf = initialForm.parentesco === "Yo mismo";
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("La imagen no puede superar 5 MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Solo se aceptan JPG, PNG o WebP");
      return;
    }
    setPhotoError(null);
    setPhotoFile(file);
    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, fotoUrl: localUrl }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let next = value;

    if (name === "edad") {
      next = allowDigitsOnly(value, 3);
    } else if (name === "nombreCompleto" || name === "contactoEmergencia") {
      next = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,'-]/g, "").slice(0, 80);
    } else if (name === "telefonoEmergencia") {
      next = allowDigitsOnly(value, 9);
    } else if (name === "direccion" || name === "referencia") {
      next = value.replace(/[<>]/g, "").slice(0, 200);
    } else if (name === "notasCuidado") {
      next = value.replace(/[<>]/g, "").slice(0, 500);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { errors: nextErrors, data } = validatePatientForm(form);
    setErrors(nextErrors);
    if (!data) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
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
        distrito: data.distrito,
        notasCuidado: data.notasCuidado,
        photoFile: photoFile,
      });
    } catch (err: any) {
      console.error("Error al guardar familiar:", err);
      setPhotoError(err.message || "Error al guardar el familiar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const notasLength = form.notasCuidado.length;

  return (
    <form id="patient-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Sección Editar Foto de Perfil */}
      <div className="flex items-center gap-6 border-b border-slate-100 pb-5">
        <div className="relative">
          {form.fotoUrl ? (
            <img
              src={form.fotoUrl}
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full object-cover border-2 border-teal-200 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Camera className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="photo-upload-patient"
            className="inline-flex items-center gap-2 rounded-xl border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-600 hover:bg-teal-50 transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-teal-600" />
            Subir foto
          </label>
          <input
            id="photo-upload-patient"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <p className="text-xs text-slate-500">JPG o PNG, máx. 5MB</p>
          {photoError && (
            <p className="text-xs text-red-500 font-medium">{photoError}</p>
          )}
        </div>
      </div>

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
          readOnly={isSelf}
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
          disabled={isSelf}
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
          readOnly={isSelf}
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
          {isSelf ? "Ubicación" : "Ubicación del Familiar"}
          {!isSelf && <span className="font-normal text-slate-500">(donde irá el enfermero)</span>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
            readOnly={isSelf}
          />
          <FormField
            label="Link de Google Maps"
            name="googleMapsUrl"
            value={form.googleMapsUrl}
            onChange={(e) => {
              const val = e.target.value;
              setForm((p) => ({ ...p, googleMapsUrl: val }));
              if (errors.googleMapsUrl) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.googleMapsUrl;
                  return copy;
                });
              }
            }}
            error={errors.googleMapsUrl}
            placeholder="https://maps.app.goo.gl/..."
            required
            helperText="Pega el link de Google Maps de la ubicación exacta. El enfermero hará clic para abrir la dirección."
            className="sm:col-span-2"
          />
        </div>
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
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
