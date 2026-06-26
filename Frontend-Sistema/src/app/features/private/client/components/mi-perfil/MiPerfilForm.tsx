import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Camera,
  ShieldCheck,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useClienteProfile } from "../../hooks/useClienteProfile";
import type { ClienteProfileUpdate } from "../../services/clienteProfile.service";
import { useAuth } from "../../../../../core/contexts/AuthContext";
import { supabase } from "../../../../../core/services/supabase";
import { cancelSubscription } from "../../services/subscription.service";
import {
  FormField,
  PlanCard,
} from "../../../../../shared/components/client/mi-perfil";

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
  const { profile, subscription, loading, saving, error, saveError, save, refetch } =
    useClienteProfile();

  const { refetchAuthProfile } = useAuth();

  const handleCancelSubscription = async () => {
    if (!profile?.id) return;
    await cancelSubscription(profile.id);
    await refetch();
    await refetchAuthProfile();
  };

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

  const [photoPreview, setPhotoPreview] = useState<string | undefined>();
  const [photoError, setPhotoError]     = useState<string | undefined>();
  const [photoSuccess, setPhotoSuccess] = useState<string | undefined>();
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // ── Pre-rellenar formulario con datos de Supabase ─────────────────────────
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

  // ── Foto de perfil ─────────────────────────────────────────────────────────
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("La imagen no puede superar 5 MB");
      setPhotoSuccess(undefined);
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Solo se aceptan JPG, PNG o WebP");
      setPhotoSuccess(undefined);
      return;
    }
    setPhotoError(undefined);
    setPhotoSuccess(undefined);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));

    setIsPhotoUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `clientes/${profile?.id}/${fileName}`;

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("foto_perfil")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data } = supabase.storage
        .from("foto_perfil")
        .getPublicUrl(filePath);

      const uploadedFotoUrl = data.publicUrl;

      // Guardar en la base de datos inmediatamente
      const payload: ClienteProfileUpdate = {
        nombres:      form.nombres.trim(),
        apellidos_pa: form.apellidos_pa.trim(),
        apellidos_ma: form.apellidos_ma.trim(),
        correo:       form.correo.trim(),
        telefono:     form.telefono.trim() || null,
        distrito:     form.distrito.trim() || null,
        direccion:    form.direccion.trim() || null,
        foto_url:     uploadedFotoUrl,
      };

      const success = await save(payload);
      if (success) {
        await refetchAuthProfile();
        setPhotoSuccess("Foto actualizada correctamente");
      }
    } catch (uploadErr: any) {
      console.error("Error al subir o guardar la foto de perfil:", uploadErr);
      setPhotoError("Error al guardar la imagen de perfil");
    } finally {
      setIsPhotoUploading(false);
    }
  };

  // ── Guardar ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            {photoSuccess && (
              <p className="text-xs text-teal-600 mt-1.5 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                {photoSuccess}
              </p>
            )}
            {photoError && (
              <p className="text-xs text-red-500 mt-1.5 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                {photoError}
              </p>
            )}
          </div>
        </div>

        {/* ── Campos de texto ── */}
        <div className="grid gap-5 sm:grid-cols-2">

          <FormField
            label="Nombres"
            name="nombres"
            value={form.nombres}
            readOnly
            required
          />

          <FormField
            label="Apellido Paterno"
            name="apellidos_pa"
            value={form.apellidos_pa}
            readOnly
            required
          />

          <FormField
            label="Apellido Materno"
            name="apellidos_ma"
            value={form.apellidos_ma}
            readOnly
          />

          <FormField
            label="Correo electrónico"
            name="correo"
            type="email"
            value={form.correo}
            readOnly
            required
          />

          <FormField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            readOnly
            required
          />

          {/* DNI read-only con badge de verificación */}
          <div className="relative">
            <FormField
              label="DNI"
              name="dni"
              value={profile?.dni ?? ""}
              readOnly
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

          <FormField
            label="Distrito"
            name="distrito"
            value={form.distrito}
            readOnly
            required
          />

        </div>

        {/* ── Plan activo ── */}
        <PlanCard
          planNombre={subscription?.plan_nombre}
          planVence={subscription?.fecha_vence}
          ciclo={subscription?.ciclo}
          status={subscription?.status}
          onCancelSubscription={handleCancelSubscription}
        />

        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          Para modificar datos sensibles como DNI o correo, contacta a{" "}
          <a href="mailto:soporte@cuidame.pe" className="text-teal-600 hover:underline font-medium">
            soporte@cuidame.pe
          </a>
        </p>

        {/* ── Error al guardar ── */}
        {saveError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {saveError}
          </div>
        )}



      </form>
    </div>
  );
}
