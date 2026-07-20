import { supabase } from "../../../../core/services/supabase";
import type { Contratacion, ContratoDetalle, JornadaProgramada } from "../../../../core/models/hiring.model";

export interface CreateHiringParams {
  clientId: string;
  nurseId: string;
  patientId: string;
  serviceType: string;
  hourlyRate: number;
  totalHours: number;
  totalAmount: number;
  notes?: string;
  days: {
    date: Date;
    start: string;
    end: string;
  }[];
}

// Helper to convert time format (e.g. "8:00 am", "1:00 pm") to 24-hour integer
export function parseHour(value: string): number {
  const [hourStr] = value.split(":");
  let hour = parseInt(hourStr);
  const isPM = value.toLowerCase().includes("pm");
  if (isPM && hour !== 12) {
    hour += 12;
  }
  if (!isPM && hour === 12) {
    hour = 0;
  }
  return hour;
}

// Helper to format hour integer back to "8:00 am" or "1:00 pm"
export function formatHour(h: number): string {
  const period = h >= 12 ? "pm" : "am";
  const adjusted = h % 12 === 0 ? 12 : h % 12;
  return `${adjusted}:00 ${period}`;
}

/**
 * Creates a hiring service request and its corresponding service days in Supabase.
 */
export async function createHiring(params: CreateHiringParams): Promise<number> {
  // 1. Fetch patient details to capture snapshots in the service record
  const { data: patient, error: patientErr } = await supabase
    .from("patients")
    .select("full_name, age, notes, address, district")
    .eq("id", params.patientId)
    .single();

  if (patientErr) throw patientErr;

  // 2. Generate unique codes and PIN
  const randomSuffix = () => Math.floor(100000 + Math.random() * 900000).toString();
  const contractCode = `CON-${randomSuffix()}`;
  const serviceCode = `SRV-${randomSuffix()}`;
  const pinCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN

  // 3. Insert service cabecera
  const { data: service, error: serviceErr } = await supabase
    .from("services")
    .insert({
      client_id: params.clientId,
      nurse_id: params.nurseId,
      patient_id: params.patientId,
      status: "pending",
      payment_status: "in_custody", // Preauthorized/In Escrow
      service_type: params.serviceType,
      total_hours: params.totalHours,
      total_amount: params.totalAmount,
      hourly_rate: params.hourlyRate,
      notes: params.notes || null,
      contract_code: contractCode,
      service_code: serviceCode,
      pin_code: pinCode,
      patient_name: patient.full_name,
      patient_age: patient.age,
      address: patient.address || "Dirección registrada",
      district: patient.district || "Lima",
    })
    .select("id")
    .single();

  if (serviceErr) throw serviceErr;
  const serviceId = service.id;

  // 4. Insert service days
  const serviceDaysData = params.days.map((day) => {
    // Format Date to YYYY-MM-DD local timezone-safe
    const year = day.date.getFullYear();
    const month = String(day.date.getMonth() + 1).padStart(2, "0");
    const dateStr = String(day.date.getDate()).padStart(2, "0");
    const dayDateStr = `${year}-${month}-${dateStr}`;

    return {
      service_id: serviceId,
      day_date: dayDateStr,
      start_hour: parseHour(day.start),
      end_hour: parseHour(day.end),
      status: "scheduled",
    };
  });

  const { error: daysErr } = await supabase
    .from("service_days")
    .insert(serviceDaysData);

  if (daysErr) throw daysErr;

  return serviceId;
}

/**
 * Fetches all hirings/contracts for a specific client.
 */
export async function fetchClientHirings(clientId: string): Promise<Contratacion[]> {
  const { data, error } = await supabase
    .from("services")
    .select(`
      id,
      status,
      payment_status,
      service_code,
      contract_code,
      service_type,
      total_hours,
      total_amount,
      hourly_rate,
      notes,
      patient_name,
      created_at,
      updated_at,
      pin_code,
      profiles:nurse_id (
        nombres,
        apellidos_pa,
        apellidos_ma,
        foto_url,
        nurse_profiles (
          nivel,
          especialidad
        )
      ),
      service_days (
        id,
        day_date,
        start_hour,
        end_hour,
        status,
        real_start,
        real_end
      ),
      incident_reports (
        status
      )
    `)
    .eq("client_id", clientId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((row: any) => {
    // El alias del join es "profiles" según la relación de Supabase
    const n = row.profiles || row.nurse || {};
    const npArr = n.nurse_profiles;
    const np = Array.isArray(npArr) ? npArr[0] || {} : npArr || {};

    const prefix = np.nivel === "Técnico en Enfermería" ? "Tec. " : "Lic. ";
    const fullName = `${prefix}${n.nombres || ""} ${n.apellidos_pa || ""}`.trim();

    // Calculate duration in days and period
    const dayDates = (row.service_days || []).map((sd: any) => sd.day_date);
    let minDate = "";
    let maxDate = "";
    if (dayDates.length > 0) {
      dayDates.sort();
      minDate = dayDates[0];
      maxDate = dayDates[dayDates.length - 1];
    }

    const allDaysCompleted = (row.service_days || []).length > 0 &&
      (row.service_days || []).every((d: any) => d.status === "completed");

    // Map DB status to hiring.model.ts ContratacionEstado
    let estado: any = "pendiente";
    if (row.status === "completed" || allDaysCompleted) {
      estado = "completado";
    } else if (row.status === "confirmed") {
      estado = "firma_requerida";
    } else if (row.status === "active") {
      const hasActiveDay = (row.service_days || []).some(
        (d: any) => d.status === "active"
      );
      estado = hasActiveDay ? "en_curso" : "confirmado";
    } else if (row.status === "in_progress") {
      estado = "en_curso";
    }

    const hasOpenIncident = (row.incident_reports || []).some(
      (inc: any) => inc.status === "abierto"
    );

    const ini = [
      (n.nombres || "").charAt(0),
      (n.apellidos_pa || "").charAt(0),
    ].filter(Boolean).join("").toUpperCase() || "EN";

    // Regla de Auto-Liberación: 48 horas desde la finalización si no hay incidente abierto
    let lastCompletionTime = row.updated_at ? new Date(row.updated_at).getTime() : (row.created_at ? new Date(row.created_at).getTime() : new Date().getTime());
    if (allDaysCompleted && row.service_days && row.service_days.length > 0) {
      const maxDate = Math.max(...row.service_days.map((d: any) => new Date(d.updated_at || d.created_at || lastCompletionTime).getTime()));
      lastCompletionTime = maxDate;
    }
    const hoursPassed = (new Date().getTime() - lastCompletionTime) / (1000 * 60 * 60);
    const isAutoReleaseEligible = (row.status === "completed" || allDaysCompleted) && hoursPassed >= 48 && !hasOpenIncident;

    // Map DB payment_status: pending, in_custody, released, refunded
    let pagoEstado: any = "pendiente";
    if (row.payment_status === "released" || isAutoReleaseEligible) {
      if (isAutoReleaseEligible && row.payment_status !== "released") {
        releasePayment(row.client_id, row.id).catch(console.error);
      }
      pagoEstado = "liberado";
    } else if (row.payment_status === "in_custody") {
      pagoEstado = "preautorizado";
    }

    const createdAtStr = row.created_at ? String(row.created_at).split("T")[0] : "";

    return {
      id: String(row.id),
      codigo: row.contract_code || row.service_code || `SRV-${row.id}`,
      codigoServicio: row.service_code,
      codigoContrato: row.contract_code,
      estado,
      pagoEstado,
      pagoContrato: row.payment_status === "in_custody" ? "custodia" : "pendiente",
      profesionalNombre: fullName,
      profesionalTitulo: np.nivel || "Profesional de Salud",
      especialidad: np.especialidad || "General",
      profesionalIniciales: ini,
      profesionalFotoUrl: n.foto_url || undefined,
      paciente: row.patient_name || "Paciente",
      periodoInicio: minDate || createdAtStr,
      periodoFin: maxDate || createdAtStr,
      duracionDias: dayDates.length || 1,
      duracionHoras: row.total_hours || 0,
      montoTotal: Number(row.total_amount || 0),
      pin_code: row.pin_code,
      service_days: (row.service_days || []).map((d: any) => ({
        id: d.id,
        day_date: d.day_date,
        start_hour: d.start_hour,
        end_hour: d.end_hour,
        status: d.status,
        real_start: d.real_start || undefined,
        real_end: d.real_end || undefined,
      })),
      hasOpenIncident,
    };
  });
}

/**
 * Fetches contract details for a specific hiring.
 */
export async function fetchContractDetail(serviceId: number): Promise<ContratoDetalle> {
  // 1. Get core service row
  const { data: service, error: serviceErr } = await supabase
    .from("services")
    .select(`
      id,
      client_id,
      nurse_id,
      patient_id,
      status,
      payment_status,
      service_type,
      total_hours,
      total_amount,
      hourly_rate,
      notes,
      contract_code,
      service_code,
      pin_code,
      patient_name,
      patient_age,
      address,
      district,
      created_at,
      updated_at,
      profiles:client_id (
        nombres,
        apellidos_pa,
        apellidos_ma,
        dni
      )
    `)
    .eq("id", serviceId)
    .single();

  if (serviceErr || !service) {
    throw serviceErr || new Error("Service not found");
  }

  const svc = service as any;

  // 2. Fetch client's subscription plan name
  let clientPlan = "Básico";
  const { data: sub } = await supabase
    .from("subscriptions")
    .select(`
      plans (
        nombre
      )
    `)
    .eq("client_id", svc.client_id)
    .eq("activo", true)
    .maybeSingle();

  const subData = sub as any;
  if (subData?.plans?.nombre) {
    const rawName = subData.plans.nombre;
    clientPlan = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  }

  // 3. Fetch nurse profiles details
  const { data: nurse } = await supabase
    .from("profiles")
    .select(`
      nombres,
      apellidos_pa,
      apellidos_ma,
      foto_url,
      distrito,
      nurse_profiles (
        nivel,
        especialidad
      )
    `)
    .eq("id", svc.nurse_id)
    .single();

  const nurseData = nurse as any;
  const nProfile = nurseData?.nurse_profiles?.[0] || {};
  const prefix = nProfile.nivel === "Técnico en Enfermería" ? "Tec. " : "Lic. ";
  const nurseName = `${prefix}${nurseData?.nombres || ""} ${nurseData?.apellidos_pa || ""}`.trim();
  const ini = [
    (nurseData?.nombres || "").charAt(0),
    (nurseData?.apellidos_pa || "").charAt(0),
  ].filter(Boolean).join("").toUpperCase() || "EN";

  // 4. Fetch service days (sorted by date and hour)
  const { data: days } = await supabase
    .from("service_days")
    .select("day_date, start_hour, end_hour, status")
    .eq("service_id", serviceId)
    .order("day_date", { ascending: true })
    .order("start_hour", { ascending: true });

  const serviceDays = days || [];
  let minDate = "";
  let maxDate = "";
  if (serviceDays.length > 0) {
    minDate = serviceDays[0].day_date;
    maxDate = serviceDays[serviceDays.length - 1].day_date;
  }

  // Formato de fechas amigables
  const formatFriendlyDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const cleanStr = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const d = new Date(cleanStr + "T12:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatShortDay = (dateStr?: string) => {
    if (!dateStr) return "";
    const cleanStr = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const d = new Date(cleanStr + "T12:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" });
  };

  const formatFriendlyTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const datePart = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const timeStr = d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    return `${formatFriendlyDate(datePart)}${timeStr ? ` · ${timeStr}` : ""}`;
  };

  // Convert service days to JornadaProgramada
  const jornadas: JornadaProgramada[] = serviceDays.map((d: any) => {
    let est: any = "pendiente";
    if (svc.status === "completed" || d.status === "completed") {
      est = "completada";
    } else if (d.status === "active") {
      est = "activa";
    } else if (d.status === "cancelled") {
      est = "cancelada";
    }
    return {
      fecha: formatShortDay(d.day_date),
      horario: `${formatHour(d.start_hour)} - ${formatHour(d.end_hour)}`,
      estado: est,
    };
  });

  // Define general terms
  const terminos = [
    "El profesional se compromete a brindar atención de calidad según su nivel de certificación.",
    "El cliente se compromete a proporcionar un ambiente seguro y adecuado para la atención.",
    "El pago permanece en custodia hasta la confirmación satisfactoria del servicio.",
    "Cualquier cancelación con menos de 24 horas de anticipación genera un cargo del 20%.",
    "La plataforma actúa como intermediario y no es responsable de actos fuera del contrato.",
    "Ambas partes aceptan el sistema de resolución de disputas de Cuidame.",
    "El contrato entra en vigor en el momento de la firma y activación por parte del cliente."
  ];

  // Fetch signature details first to use in history timeline
  let firma: any = null;
  const { data: sigData } = await supabase
    .from("contract_signatures")
    .select("signature_url, signed_at, dni, ip_address")
    .eq("service_id", serviceId)
    .maybeSingle();
  if (sigData) {
    firma = sigData;
  }

  // Define history timeline sequentially based on status progress
  const emitidoElStr = formatFriendlyDate(svc.created_at);
  const historial = [
    { titulo: "Pendiente de Confirmacion del Enfermero", fecha: formatFriendlyTime(svc.created_at) },
    { titulo: "Contrato generado", fecha: formatFriendlyTime(svc.created_at) }
  ];

  if (svc.status !== "pending") {
    historial.push({
      titulo: "Enfermero Acepto Solicitud(Servicios Activo)",
      fecha: formatFriendlyTime(svc.updated_at)
    });
  }

  if (svc.status === "active" || svc.status === "in_progress" || svc.status === "completed") {
    const cursoFecha = sigData?.signed_at ? formatFriendlyTime(sigData.signed_at) : formatFriendlyTime(svc.updated_at);
    historial.push({
      titulo: "Servicio en curso",
      fecha: cursoFecha
    });
  }

  if (svc.status === "completed") {
    historial.push({
      titulo: "Servicio Completado",
      fecha: formatFriendlyTime(svc.updated_at)
    });
  }

  const clientName = `${svc.profiles?.nombres || ""} ${svc.profiles?.apellidos_pa || ""}`.trim();

  const allDaysCompletedDetail = (svc.service_days || []).length > 0 &&
    (svc.service_days || []).every((d: any) => d.status === "completed");

  // Map to Contratacion fields
  let estado: any = "pendiente";
  if (svc.status === "completed" || allDaysCompletedDetail) estado = "completado";
  else if (svc.status === "confirmed") estado = "firma_requerida";
  else if (svc.status === "active") estado = "confirmado";
  else if (svc.status === "in_progress") estado = "en_curso";

  const hasOpenIncidentDetail = (svc.incident_reports || []).some(
    (inc: any) => inc.status === "abierto"
  );
  let lastCompletionTimeDetail = svc.updated_at ? new Date(svc.updated_at).getTime() : (svc.created_at ? new Date(svc.created_at).getTime() : new Date().getTime());
  if (allDaysCompletedDetail && svc.service_days && svc.service_days.length > 0) {
    const maxDateDetail = Math.max(...svc.service_days.map((d: any) => new Date(d.updated_at || d.created_at || lastCompletionTimeDetail).getTime()));
    lastCompletionTimeDetail = maxDateDetail;
  }
  const hoursPassedDetail = (new Date().getTime() - lastCompletionTimeDetail) / (1000 * 60 * 60);
  const isAutoReleaseEligibleDetail = (svc.status === "completed" || allDaysCompletedDetail) && hoursPassedDetail >= 48 && !hasOpenIncidentDetail;

  let pagoEstado: any = "pendiente";
  if (svc.payment_status === "released" || isAutoReleaseEligibleDetail) {
    if (isAutoReleaseEligibleDetail && svc.payment_status !== "released") {
      releasePayment(svc.client_id, svc.id).catch(console.error);
    }
    pagoEstado = "liberado";
  } else if (svc.payment_status === "in_custody") {
    pagoEstado = "preautorizado";
  }

  const total = Number(svc.total_amount || 0);
  const comisionPorcentaje = 10;
  
  

  return {
    id: String(svc.id),
    codigo: svc.contract_code || svc.service_code || `CON-${svc.id}`,
    codigoServicio: svc.service_code,
    codigoContrato: svc.contract_code,
    estado,
    pagoEstado,
    pagoContrato: svc.payment_status === "in_custody" ? "custodia" : "pendiente",
    profesionalNombre: nurseName,
    profesionalTitulo: nProfile.nivel || "Profesional de Salud",
    especialidad: nProfile.especialidad || "General",
    profesionalIniciales: ini,
    profesionalFotoUrl: nurseData?.foto_url || undefined,
    paciente: svc.patient_name || "Paciente",
    periodoInicio: minDate,
    periodoFin: maxDate,
    duracionDias: serviceDays.length,
    duracionHoras: svc.total_hours || 0,
    montoTotal: total,
    // Contract specific
    emitidoEl: emitidoElStr,
    tipoServicio: svc.service_type || "General",
    fechaInicio: formatFriendlyDate(minDate),
    fechaFin: formatFriendlyDate(maxDate),
    horario: jornadas.length > 0 ? jornadas[0].horario : "Horario variable",
    profesionalRol: nProfile.nivel || "Enfermero",
    profesionalUbicacion: nurseData?.distrito || "Lima",
    pacienteEdad: `${svc.patient_age || 0} años`,
    pacienteDireccion: svc.address,
    jornadas,
    terminos,
    historial,
    horasTarifa: svc.total_hours || 0,
    tarifaHora: Number(svc.hourly_rate || 0),
    comisionPorcentaje,
    clienteNombre: clientName,
    clientePlan: clientPlan,
    clienteDni: svc.profiles?.dni || "",
    pinServicio: svc.pin_code || "000000",
    firma,
  };
}

/**
 * Uploads a visual signature image to `contract_signatures` bucket,
 * creates the contract_signatures DB row and updates the service status.
 * Solo funciona si el servicio está en estado 'confirmed' (enfermero aceptó).
 */
function base64ToBlob(base64DataUrl: string, mimeType: string): Blob {
  const base64 = base64DataUrl.split(",")[1]!;
  const byteChars = atob(base64);
  const byteNums = new Array<number>(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNums[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNums);
  return new Blob([byteArray], { type: mimeType });
}

export async function signContract(
  serviceId: number,
  clientDni: string,
  signatureBase64: string,
  clientIp: string
): Promise<void> {
  const blob = base64ToBlob(signatureBase64, "image/png");
  const fileName = `sig_${serviceId}_${Date.now()}.png`;
  const filePath = `firmas/${serviceId}/${fileName}`;

  // 1. Upload PNG to the dedicated `contract_signatures` bucket
  const { error: uploadError } = await supabase.storage
    .from("contract_signatures")
    .upload(filePath, blob, { contentType: "image/png", upsert: true });

  if (uploadError) throw uploadError;

  // 2. Get public URL
  const { data } = supabase.storage
    .from("contract_signatures")
    .getPublicUrl(filePath);

  const publicUrl = data.publicUrl;

  // 3. Create row in contract_signatures table
  const { error: signatureErr } = await supabase
    .from("contract_signatures")
    .insert({
      service_id: serviceId,
      dni: clientDni,
      signature_url: publicUrl,
      ip_address: clientIp,
    });

  if (signatureErr) throw signatureErr;

  // 4. Update service status: confirmed → active (cliente firmó, contrato activo)
  // El enfermero verá su card pasar de "pendiente" (confirmed) → "confirmado" (active)
  const { error: serviceErr } = await supabase
    .from("services")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId);

  if (serviceErr) throw serviceErr;
}

/**
 * Fetches dynamic nurse availability slots and exceptions from Supabase.
 */
export async function fetchNurseAvailabilityData(nurseId: string) {
  // Fetch recurrent slots
  const { data: slots, error: slotsErr } = await supabase
    .from("nurse_schedule_slots")
    .select("day_of_week, start_hour, end_hour, enabled")
    .eq("nurse_id", nurseId);

  if (slotsErr) throw slotsErr;

  // Fetch exceptions starting from today
  const todayStr = new Date().toISOString().split("T")[0];
  const { data: exceptions, error: excErr } = await supabase
    .from("nurse_schedule_exceptions")
    .select("id, fecha, tipo, start_hour, end_hour")
    .eq("nurse_id", nurseId)
    .gte("fecha", todayStr);

  if (excErr) throw excErr;

  // Fetch booked days/hours
  const { data: bookings, error: bookingsErr } = await supabase
    .from("service_days")
    .select(`
      day_date,
      start_hour,
      end_hour,
      services!inner (
        status,
        nurse_id
      )
    `)
    .eq("services.nurse_id", nurseId)
    .in("services.status", ["pending", "confirmed", "active", "completed"])
    .gte("day_date", todayStr);

  if (bookingsErr) throw bookingsErr;

  // Convertir start_hour/end_hour (enteros) a strings de hora ("8:00 am")
  // porque BookingCalendar usa parseHour() que espera formato string
  const mappedBookings = (bookings || []).map((b: any) => ({
    fecha: b.day_date,
    start: formatHour(Number(b.start_hour)),
    end:   formatHour(Number(b.end_hour)),
  }));

  return {
    slots: slots || [],
    exceptions: exceptions || [],
    bookings: mappedBookings,
  };
}

/**
 * Cancels a pending or confirmed service request.
 */
export async function cancelHiring(clientId: string, serviceId: number, reason: string = "Cancelado por el cliente"): Promise<void> {
  const { error } = await supabase
    .from("services")
    .update({
      status: "cancelled",
      cancel_reason: reason,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId)
    .eq("client_id", clientId);

  if (error) throw error;
}

export async function fetchHiringDays(
  serviceId: number
): Promise<{
  fecha: string;
  horario: string;
  estado: string;
  realStart?: string;
  realEnd?: string;
  reporte?: string;
  binnacle?: {
    id: number;
    activities: string[];
    observations: string;
    recommendations: string;
    photos: string[];
  };
}[]> {
  const { data, error } = await supabase
    .from("service_days")
    .select(`
      day_date,
      start_hour,
      end_hour,
      status,
      real_start,
      real_end,
      report,
      service_binnacles (
        id,
        activities,
        observations,
        recommendations,
        photos
      )
    `)
    .eq("service_id", serviceId)
    .order("day_date", { ascending: true });

  if (error) throw error;

  const formatShortDay = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" });
  };

  return (data || []).map((d: any) => {
    const b = Array.isArray(d.service_binnacles) ? d.service_binnacles[0] : d.service_binnacles;
    return {
      fecha: formatShortDay(d.day_date),
      horario: `${formatHour(Number(d.start_hour))} - ${formatHour(Number(d.end_hour))}`,
      estado: d.status === "completed" ? "completada" : d.status === "cancelled" ? "cancelada" : d.status === "active" ? "activa" : "pendiente",
      realStart: d.real_start || undefined,
      realEnd: d.real_end || undefined,
      reporte: d.report || undefined,
      binnacle: b ? {
        id: b.id,
        activities: b.activities || [],
        observations: b.observations || "",
        recommendations: b.recommendations || "",
        photos: b.photos || [],
      } : undefined,
    };
  });
}

/**
 * Libera el pago para una contratación en Supabase.
 */
export async function releasePayment(clientId: string, serviceId: number): Promise<void> {
  const { error } = await supabase
    .from("services")
    .update({
      payment_status: "released",
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId)
    .eq("client_id", clientId);

  if (error) throw error;
}
