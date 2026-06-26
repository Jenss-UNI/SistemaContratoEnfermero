import { supabase } from "../../../../core/services/supabase";

export interface PaymentMethod {
  id?: string;
  client_id: string;
  tipo: "tarjeta" | "yape" | "plin";
  es_principal: boolean;
  terminacion?: string;
  marca?: string;
  nombre_tarjeta?: string;
  telefono?: string;
  created_at?: string;
}

// ---------------------------------------------------------------------------
// Obtener método de pago principal
// ---------------------------------------------------------------------------
export async function fetchUserPaymentMethod(userId: string): Promise<PaymentMethod | null> {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("client_id", userId)
    .eq("es_principal", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching payment method:", error);
    return null;
  }
  return data as PaymentMethod | null;
}

// ---------------------------------------------------------------------------
// Registrar o actualizar método de pago
// ---------------------------------------------------------------------------
export async function savePaymentMethod(userId: string, pm: Omit<PaymentMethod, "client_id">): Promise<void> {
  // 1. Quitar principal a otros métodos si este es principal
  if (pm.es_principal) {
    await supabase
      .from("payment_methods")
      .update({ es_principal: false })
      .eq("client_id", userId);
  }

  // 2. Insertar el nuevo método
  const { error } = await supabase.from("payment_methods").insert({
    client_id: userId,
    tipo: pm.tipo,
    es_principal: pm.es_principal,
    terminacion: pm.terminacion || null,
    marca: pm.marca || null,
    nombre_tarjeta: pm.nombre_tarjeta || null,
    telefono: pm.telefono || null,
  });

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Mejorar, renovar o activar suscripción
// ---------------------------------------------------------------------------
export async function updateSubscription(
  userId: string,
  planId: number,
  ciclo: "mensual" | "anual"
): Promise<void> {
  // 1. Desactivar cualquier suscripción activa previa
  const { error: deactivateError } = await supabase
    .from("subscriptions")
    .update({ activo: false })
    .eq("client_id", userId)
    .eq("activo", true);

  if (deactivateError) throw deactivateError;

  // 2. Calcular fechas
  const hoy = new Date();
  const fechaInicio = hoy.toISOString().split("T")[0];
  
  const vence = new Date(hoy);
  if (ciclo === "mensual") {
    vence.setMonth(vence.getMonth() + 1);
  } else {
    vence.setMonth(vence.getMonth() + 14); // 12 meses + 2 meses gratis (consistente con el registro)
  }
  const fechaVence = vence.toISOString().split("T")[0];

  // 3. Crear el nuevo registro de suscripción
  const { error: insertError } = await supabase
    .from("subscriptions")
    .insert({
      client_id: userId,
      plan_id: planId,
      ciclo: ciclo,
      fecha_inicio: fechaInicio,
      fecha_vence: fechaVence,
      status: "active",
      activo: true,
    });

  if (insertError) throw insertError;
}

// ---------------------------------------------------------------------------
// Cancelar renovación de suscripción
// ---------------------------------------------------------------------------
export async function cancelSubscription(userId: string): Promise<void> {
  // Cambiar el estado de la suscripción activa a 'cancelled'
  // (mantiene 'activo = true' para que el usuario disfrute del plan hasta que venza)
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("client_id", userId)
    .eq("activo", true);

  if (error) throw error;
}
