import { useMemo, useState } from "react";
import type { ClientProfileUpdate } from "../../../../core/models/client-profile.model";
import { DistritoCombobox, FormField, PlanCard, ProfilePhotoUpload } from "../../components";
import {
  allowDigitsOnly,
  blockNonDigitKey,
  sanitizeText,
  validateAddress,
  validateDistrito,
  validateEmail,
  validateName,
  validatePhone,
  validateProfileImage,
} from "../../../../shared/utils/validation";

const DISTRITOS = [
  "Pueblo Libre",
  "San Borja",
  "Miraflores",
  "Surco",
  "La Molina",
  "San Isidro",
  "Lince",
];

const EMPTY_FORM = {
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  distrito: "",
  direccion: "",
};

function getInitials(nombres: string, apellidos: string): string {
  const a = nombres.trim().charAt(0);
  const b = apellidos.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "?";
}

export default function MiPerfilForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState<string | undefined>();
  const [photoPreview, setPhotoPreview] = useState<string | undefined>();
  const [mensaje, setMensaje] = useState("");

  const initials = useMemo(
    () => getInitials(form.nombres, form.apellidos),
    [form.nombres, form.apellidos]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let next = value;

    if (name === "telefono") {
      next = allowDigitsOnly(value, 9);
    } else if (name === "nombres" || name === "apellidos") {
      next = sanitizeText(value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, ""), 60);
    } else if (name === "correo") {
      next = value.replace(/[^a-zA-Z0-9@._+-]/g, "").slice(0, 120);
    } else if (name === "direccion") {
      next = sanitizeText(value, 200);
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

  const handlePhoto = (file: File) => {
    const err = validateProfileImage(file);
    if (err) {
      setPhotoError(err);
      return;
    }
    setPhotoError(undefined);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = (): ClientProfileUpdate | null => {
    const next: Record<string, string> = {};
    const nombresErr = validateName(form.nombres, "Nombres");
    const apellidosErr = validateName(form.apellidos, "Apellidos");
    const correoErr = validateEmail(form.correo);
    const telErr = validatePhone(form.telefono);
    const distritoErr = validateDistrito(form.distrito);
    const dirErr = validateAddress(form.direccion);

    if (nombresErr) next.nombres = nombresErr;
    if (apellidosErr) next.apellidos = apellidosErr;
    if (correoErr) next.correo = correoErr;
    if (telErr) next.telefono = telErr;
    if (distritoErr) next.distrito = distritoErr;
    if (dirErr) next.direccion = dirErr;

    setErrors(next);
    if (Object.keys(next).length > 0) return null;

    return {
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono,
      distrito: form.distrito.trim(),
      direccion: form.direccion.trim(),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    const payload = validate();
    if (!payload) return;
    setMensaje("Cambios validados correctamente (pendiente de conexión con el backend).");
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-slate-900">Información Personal</h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <ProfilePhotoUpload
          initials={initials}
          previewUrl={photoPreview}
          error={photoError}
          onFileSelect={handlePhoto}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            error={errors.nombres}
            placeholder="Ingresa tus nombres"
            required
            maxLength={60}
          />
          <FormField
            label="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            error={errors.apellidos}
            placeholder="Ingresa tus apellidos"
            required
            maxLength={60}
          />
          <FormField
            label="Correo electrónico"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            error={errors.correo}
            placeholder="correo@ejemplo.com"
            required
            maxLength={120}
            autoComplete="email"
          />
          <FormField
            label="Teléfono"
            name="telefono"
            inputMode="numeric"
            value={form.telefono}
            onChange={handleChange}
            onKeyDown={blockNonDigitKey}
            error={errors.telefono}
            placeholder="987123456"
            required
            maxLength={9}
          />
          <FormField
            label="DNI"
            name="dni"
            value=""
            disabled
            readOnly
            placeholder="Se cargará desde tu cuenta"
            helperText="El DNI no puede modificarse"
          />
          <DistritoCombobox
            label="Distrito"
            value={form.distrito}
            onChange={(distrito) => {
              setForm((prev) => ({ ...prev, distrito }));
              if (errors.distrito) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.distrito;
                  return copy;
                });
              }
            }}
            options={DISTRITOS}
            error={errors.distrito}
            required
          />
          <FormField
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            error={errors.direccion}
            placeholder="Av. Canto Grande 123"
            required
            maxLength={200}
            className="sm:col-span-2"
          />
        </div>

        <PlanCard />

        <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
          {mensaje && (
            <p className="text-sm font-medium text-teal-700 sm:mr-auto sm:text-left">{mensaje}</p>
          )}
          <button
            type="submit"
            className="rounded-xl bg-teal-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
