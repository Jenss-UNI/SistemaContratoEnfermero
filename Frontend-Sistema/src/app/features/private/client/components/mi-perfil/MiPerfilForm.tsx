import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { useClienteProfile } from "../../hooks/useClienteProfile";
import type { ClienteProfileUpdate } from "../../services/clienteProfile.service";
import { useAuth } from "../../../../../core/contexts/AuthContext";
import { supabase } from "../../../../../core/services/supabase";
import {
  allowDigitsOnly,
  blockNonDigitKey,
  sanitizeText,
  validateDistrito,
  validateEmail,
  validateName,
  validatePhone,
} from "../../../../../shared/utils/validation";
import {
  DistritoCombobox,
  FormField,
  PlanCard,
} from "../../../../../shared/components/client/mi-perfil";

const LIMA_DISTRICTS = [
  "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla",
  "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lima",
  "Lince", "Los Olivos", "Lurigancho", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac",
  "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo",
  "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres",
  "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador",
  "Villa María del Triunfo"
];

// ---------------------------------------------------------------------------
// Helpers locales
// ---------------------------------------------------------------------------
function getInitials(nombres: string, apellidos: string): string {
  const n = nombres.trim().split(/\s+/)[0] || "";
  const a = apellidos.trim().split(/\s+/)[0] || "";
  return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase();
}

/** Convierte un texto en formato Title Case (ej: "VERTILA GUSHINA" -> "Vertila Gushina") */
function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Convierte un archivo File a su representación base64 */
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ---------------------------------------------------------------------------
// Skeleton animado para carga
// ---------------------------------------------------------------------------
function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8 animate-pulse">
      <div className="h-6 w-48 rounded bg-slate-200" />
      <div className="mt-8 flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-3 w-48 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-10 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function MiPerfilForm() {
  const { profile, subscription, loading, saving, error, saveError, saved, save } =
    useClienteProfile();

  const { refetchAuthProfile } = useAuth();

  // ── Estado del formulario ─────────────────────────────────────────────────
  const [form, setForm] = useState({
    nombres:      "",
    apellidos_pa: "",
    apellidos_ma: "",
    correo:       "",
    telefono:     "",
    distrito:     "",
    direccion:    "",
  });

  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | undefined>();
  const [photoFile, setPhotoFile]       = useState<File | null>(null);
  const [photoError, setPhotoError]     = useState<string | undefined>();
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // ── Pre-rellenar formulario con datos de Supabase ─────────────────────────
  // Se ejecuta cuando el perfil llega de la BD y lo formatea a Title Case
  useEffect(() => {
    if (!profile) return;
    setForm({
      nombres:      toTitleCase(profile.nombres      ?? ""),
      apellidos_pa: toTitleCase(profile.apellidos_pa ?? ""),
      apellidos_ma: toTitleCase(profile.apellidos_ma ?? ""),
      correo:       profile.correo       ?? "",
      telefono:     profile.telefono     ?? "",
      distrito:     profile.distrito     ?? "",
      direccion:    profile.direccion    ?? "",
    });
  }, [profile]);

  const initials = useMemo(
    () => getInitials(form.nombres, form.apellidos_pa),
    [form.nombres, form.apellidos_pa]
  );

  // ── Manejo de cambios ──────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let next = value;

    if (name === "telefono") {
      next = allowDigitsOnly(value, 9);
    } else if (
      name === "nombres" ||
      name === "apellidos_pa" ||
      name === "apellidos_ma"
    ) {
      next = sanitizeText(
        value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, ""),
        60
      );
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

  // ── Foto de perfil ─────────────────────────────────────────────────────────
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setPhotoError(undefined);
    setPhotoFile(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ── Validación ─────────────────────────────────────────────────────────────
  const validate = (): ClienteProfileUpdate | null => {
    const next: Record<string, string> = {};

    const nombresErr  = validateName(form.nombres,      "Nombres");
    const apePatErr   = validateName(form.apellidos_pa, "Apellido Paterno");
    const apeMatErr   = validateName(form.apellidos_ma, "Apellido Materno");
    const correoErr   = validateEmail(form.correo);
    const telErr      = validatePhone(form.telefono);
    const distritoErr = validateDistrito(form.distrito);

    if (nombresErr)  next.nombres      = nombresErr;
    if (apePatErr)   next.apellidos_pa = apePatErr;
    if (apeMatErr)   next.apellidos_ma = apeMatErr;
    if (correoErr)   next.correo       = correoErr;
    if (telErr)      next.telefono     = telErr;
    if (distritoErr) next.distrito     = distritoErr;

    setErrors(next);
    if (Object.keys(next).length > 0) return null;

    return {
      nombres:      form.nombres.trim(),
      apellidos_pa: form.apellidos_pa.trim(),
      apellidos_ma: form.apellidos_ma.trim(),
      correo:       form.correo.trim(),
      telefono:     form.telefono || null,
      distrito:     form.distrito || null,
      direccion:    form.direccion || null,
    };
  };

  // ── Guardar ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = validate();
    if (!payload) return;

    let uploadedFotoUrl: string | null = null;
    if (photoFile) {
      setIsPhotoUploading(true);
      try {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
        const filePath = `clientes/${fileName}`;

        // Intentar subir a Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, photoFile, { upsert: true });

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        uploadedFotoUrl = data.publicUrl;
      } catch (uploadErr) {
        console.warn("Storage upload failed, falling back to base64 inside DB:", uploadErr);
        // Si falla por permisos o bucket inexistente, usamos Base64 como fallback robusto
        try {
          uploadedFotoUrl = await convertToBase64(photoFile);
        } catch (base64Err) {
          setPhotoError("Error al procesar la imagen de perfil");
          setIsPhotoUploading(false);
          return;
        }
      } finally {
        setIsPhotoUploading(false);
      }
      
      payload.foto_url = uploadedFotoUrl;
    }

    const success = await save(payload);
    if (success) {
      await refetchAuthProfile();
      setPhotoFile(null); // Limpiar archivo cargado
    }
  };

  const isSaving = saving || isPhotoUploading;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return <ProfileSkeleton />;

  // ── Error de carga ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-400 mb-3" />
        <p className="font-semibold text-red-700">Error al cargar el perfil</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  // ── Formulario ─────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-slate-900">Información Personal</h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">

        {/* ── Foto de perfil ── */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {photoPreview || profile?.foto_url ? (
              <img
                src={photoPreview ?? profile?.foto_url ?? ""}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {initials}
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-teal-400 flex items-center justify-center cursor-pointer hover:bg-teal-50 transition-colors shadow"
            >
              <Camera className="w-3.5 h-3.5 text-teal-600" />
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhoto}
              disabled={isSaving}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Foto de perfil</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG o WebP - máx. 5 MB</p>
            {photoError && (
              <p className="text-xs text-red-500 mt-1 font-medium">{photoError}</p>
            )}
          </div>
        </div>

        {/* ── Campos de texto ── */}
        <div className="grid gap-5 sm:grid-cols-2">

          <FormField
            label="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            error={errors.nombres}
            required
          />

          <FormField
            label="Apellido Paterno"
            name="apellidos_pa"
            value={form.apellidos_pa}
            onChange={handleChange}
            error={errors.apellidos_pa}
            required
          />

          <FormField
            label="Apellido Materno"
            name="apellidos_ma"
            value={form.apellidos_ma}
            onChange={handleChange}
            error={errors.apellidos_ma}
          />

          <FormField
            label="Correo electrónico"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            error={errors.correo}
            required
          />

          <FormField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            onKeyDown={blockNonDigitKey}
            error={errors.telefono}
            maxLength={9}
            required
          />

          {/* DNI read-only con badge de verificación */}
          <div className="relative">
            <FormField
              label="DNI"
              name="dni"
              value={profile?.dni ?? ""}
              readOnly
              className="bg-slate-50 text-slate-500 cursor-not-allowed select-none"
            />
            {profile?.dni_verified && (
              <div className="absolute right-3 top-[38px] flex items-center text-teal-600" title="Verificado con RENIEC">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <p className="text-[10px] text-teal-600 mt-1 flex items-center gap-1">
              ✓ Verificado con RENIEC - No puede modificarse
            </p>
          </div>

          <DistritoCombobox
            label="Distrito"
            value={form.distrito}
            onChange={(val) => {
              setForm((prev) => ({ ...prev, distrito: val }));
              if (errors.distrito) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.distrito;
                  return copy;
                });
              }
            }}
            options={LIMA_DISTRICTS}
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
            maxLength={200}
            className="sm:col-span-2"
          />

        </div>

        {/* ── Plan activo ── */}
        <PlanCard
          planNombre={subscription?.plan_nombre}
          planVence={subscription?.fecha_vence}
        />

        {/* ── Error al guardar ── */}
        {saveError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {saveError}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
          {saved && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-teal-700 sm:mr-auto">
              <CheckCircle2 className="w-4 h-4" />
              Cambios guardados correctamente
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
