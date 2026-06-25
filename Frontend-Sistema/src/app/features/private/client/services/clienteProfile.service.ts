import { supabase } from "../../../../core/services/supabase";

// ---------------------------------------------------------------------------
// Tipos — alineados 100% con la tabla public.profiles del schema
// ---------------------------------------------------------------------------

/** Datos completos del perfil cliente */
export interface ClienteProfile {
  id:             string;
  nombres:        string;
  apellidos_pa:   string;
  apellidos_ma:   string;
  correo:         string;
  telefono:       string | null;
  dni:            string | null;
  distrito:       string | null;
  direccion:      string | null;
  foto_url:       string | null;   // ← nombre real en la BD (NO avatar_url)
  role:           string;
  dni_verified:   boolean;
  email_verified: boolean;
}

/** Campos que el cliente puede editar desde Mi Perfil */
export type ClienteProfileUpdate = {
  nombres:      string;
  apellidos_pa: string;
  apellidos_ma: string;
  correo:       string;
  telefono:     string | null;
  distrito:     string | null;
  direccion:    string | null;
  foto_url?:    string | null;   // ← Foto de perfil opcional
};

/** Información resumida de la suscripción del cliente */
export interface ClienteSubscription {
  plan_nombre: string;
  fecha_vence: string;
  status:      string;
}

// ---------------------------------------------------------------------------
// Obtener perfil desde Supabase
// ---------------------------------------------------------------------------
export async function fetchClienteProfile(userId: string): Promise<ClienteProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, nombres, apellidos_pa, apellidos_ma, correo, telefono, dni, distrito, direccion, foto_url, role, dni_verified, email_verified"
    )
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as ClienteProfile;
}

// ---------------------------------------------------------------------------
// Actualizar perfil en Supabase
// ---------------------------------------------------------------------------
export async function updateClienteProfile(
  userId: string,
  payload: ClienteProfileUpdate
): Promise<void> {
  const updateData: Record<string, any> = {
    nombres:      payload.nombres.trim(),
    apellidos_pa: payload.apellidos_pa.trim(),
    apellidos_ma: payload.apellidos_ma.trim(),
    correo:       payload.correo.trim(),
    telefono:     payload.telefono?.trim()  ?? null,
    distrito:     payload.distrito?.trim()  ?? null,
    direccion:    payload.direccion?.trim() ?? null,
  };

  if (payload.foto_url !== undefined) {
    updateData.foto_url = payload.foto_url;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId);

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Obtener suscripción activa del cliente
// ---------------------------------------------------------------------------
export async function fetchClienteSubscription(userId: string): Promise<ClienteSubscription | null> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      fecha_vence,
      status,
      plans (
        nombre
      )
    `)
    .eq("client_id", userId)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching client subscription:", error);
    return null;
  }
  if (!data) return null;

  const planInfo = data.plans as unknown as { nombre: string } | null;

  return {
    plan_nombre: planInfo?.nombre ? planInfo.nombre.charAt(0).toUpperCase() + planInfo.nombre.slice(1) : "—",
    fecha_vence: data.fecha_vence ?? "",
    status:      data.status ?? "",
  };
}
