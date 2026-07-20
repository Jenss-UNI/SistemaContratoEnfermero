import { supabase } from "../../../../core/services/supabase";

export interface EnfermeroProfile {
  id: string;
  nombres: string;
  apellidos_pa: string;
  apellidos_ma: string;
  correo: string;
  telefono: string | null;
  dni: string | null;
  distrito: string | null;
  foto_url: string | null;
  role: string;
  dni_verified: boolean;
  email_verified: boolean;
  direccion: string | null;
  nurse_profile: {
    nivel: string;
    especialidad: string | null;
    bio: string | null;
    rating: number;
    verificacion_status: string;
    visibilidad: string;
    anios_experiencia: number | null;
  } | null;
  service_types: {
    id: string;
    tipo: string;
    tarifa_hora: number | null;
    activo: boolean;
    principal: boolean;
  }[];
  zones: string[];
  languages: string[];
  education: {
    id: string;
    titulo: string;
    institucion: string;
    anio: number;
    documento_url: string | null;
  }[];
  certifications: {
    id: string;
    nombre: string;
    emisor: string;
    anio: number;
    documento_url: string | null;
  }[];
}

export interface ServiceDay {
  day_date: string;
  start_hour: number;
  end_hour: number;
}

export interface UpcomingService {
  id: number;
  patient_name: string | null;
  service_type: string | null;
  status: string | null;
  dateStr: string;     // ej: "13 Jun"
  timeStr: string;     // ej: "12:00 PM - 1:00 PM"
  rawDate: Date;
}

export interface PendingServiceRequest {
  id: number;
  patient_name: string | null;
  service_type: string | null;
  notes: string | null;
  created_at: string;
}

export interface RecentActivity {
  id: number;
  title: string;
  description: string;
  timeStr: string;
}

export interface DashboardMetrics {
  activeServices: number;
  pendingServices: number;
  completedServices: number;
  inCustodyAmount: number;
  upcomingServices: UpcomingService[];
  pendingRequests: PendingServiceRequest[];
  recentActivity: RecentActivity[];
}

/**
 * Obtiene toda la información del perfil del enfermero.
 */
export async function fetchEnfermeroProfile(userId: string): Promise<EnfermeroProfile> {
  // 1. Obtener perfil básico
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, nombres, apellidos_pa, apellidos_ma, correo, telefono, dni, distrito, foto_url, role, dni_verified, email_verified, direccion")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;

  // 2. Obtener nurse_profile
  const { data: nurseProfile, error: nurseError } = await supabase
    .from("nurse_profiles")
    .select("nivel, especialidad, bio, rating, verificacion_status, visibilidad, anios_experiencia")
    .eq("id", userId)
    .maybeSingle();

  if (nurseError) throw nurseError;

  // 3. Obtener tipos de servicio
  const { data: serviceTypes, error: serviceError } = await supabase
    .from("nurse_service_types")
    .select("id, tipo, tarifa_hora, activo, principal")
    .eq("nurse_id", userId);

  if (serviceError) throw serviceError;

  // 4. Obtener zonas/distritos
  const { data: zones, error: zonesError } = await supabase
    .from("nurse_zones")
    .select("distrito")
    .eq("nurse_id", userId);

  if (zonesError) throw zonesError;

  // 5. Obtener idiomas
  const { data: languages, error: langError } = await supabase
    .from("nurse_languages")
    .select("idioma")
    .eq("nurse_id", userId);

  if (langError) throw langError;

  // 6. Obtener educación
  const { data: education, error: edError } = await supabase
    .from("nurse_education")
    .select("id, titulo, institucion, anio, documento_url")
    .eq("nurse_id", userId);

  if (edError) throw edError;

  // 7. Obtener certificaciones
  const { data: certifications, error: certError } = await supabase
    .from("nurse_certifications")
    .select("id, nombre, emisor, anio, documento_url")
    .eq("nurse_id", userId);

  if (certError) throw certError;

  return {
    ...profile,
    nurse_profile: nurseProfile || null,
    service_types: serviceTypes || [],
    zones: zones?.map((z) => z.distrito) || [],
    languages: languages?.map((l) => l.idioma) || [],
    education: education || [],
    certifications: certifications || [],
  } as EnfermeroProfile;
}

/**
 * Guarda los cambios del perfil (profiles y nurse_profiles).
 */
export async function updateEnfermeroProfile(
  userId: string,
  data: {
    nombres: string;
    apellidos_pa: string;
    apellidos_ma: string;
    district: string;
    specialty: string;
    bio: string;
    experience: number | null;
  }
): Promise<void> {
  // 1. Actualizar profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      nombres: data.nombres.trim(),
      apellidos_pa: data.apellidos_pa.trim(),
      apellidos_ma: data.apellidos_ma.trim(),
      distrito: data.district.trim(),
    })
    .eq("id", userId);

  if (profileError) throw profileError;

  // 2. Actualizar nurse_profiles (Asegurar que exista)
  const { error: nurseError } = await supabase
    .from("nurse_profiles")
    .update({
      especialidad: data.specialty.trim() || null,
      bio: data.bio.trim() || null,
      anios_experiencia: data.experience,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (nurseError) throw nurseError;
}

/**
 * Guarda y sincroniza los tipos de servicio y sus tarifas correspondientes.
 */
export async function saveEnfermeroServiceTypes(
  userId: string,
  services: { tipo: string; tarifa_hora: number; activo: boolean; principal: boolean }[]
): Promise<void> {
  // Obtener los actuales
  const { data: existing, error: fetchError } = await supabase
    .from("nurse_service_types")
    .select("id, tipo")
    .eq("nurse_id", userId);

  if (fetchError) throw fetchError;

  for (const s of services) {
    const matched = existing?.find((e) => e.tipo === s.tipo);
    if (matched) {
      const { error: updateError } = await supabase
        .from("nurse_service_types")
        .update({
          tarifa_hora: s.tarifa_hora,
          activo: s.activo,
          principal: s.principal,
          updated_at: new Date().toISOString(),
        })
        .eq("id", matched.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("nurse_service_types")
        .insert({
          nurse_id: userId,
          tipo: s.tipo,
          tarifa_hora: s.tarifa_hora,
          activo: s.activo,
          principal: s.principal,
        });
      if (insertError) throw insertError;
    }
  }
}

/**
 * Sincroniza distritos de atención (elimina antiguos e inserta nuevos).
 */
export async function saveEnfermeroZones(userId: string, zones: string[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from("nurse_zones")
    .delete()
    .eq("nurse_id", userId);

  if (deleteError) throw deleteError;

  if (zones.length > 0) {
    const insertData = zones.map((z) => ({
      nurse_id: userId,
      distrito: z,
    }));
    const { error: insertError } = await supabase
      .from("nurse_zones")
      .insert(insertData);

    if (insertError) throw insertError;
  }
}

/**
 * Sincroniza idiomas (elimina antiguos e inserta nuevos).
 */
export async function saveEnfermeroLanguages(userId: string, languages: string[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from("nurse_languages")
    .delete()
    .eq("nurse_id", userId);

  if (deleteError) throw deleteError;

  if (languages.length > 0) {
    const insertData = languages.map((l) => ({
      nurse_id: userId,
      idioma: l,
    }));
    const { error: insertError } = await supabase
      .from("nurse_languages")
      .insert(insertData);

    if (insertError) throw insertError;
  }
}

/**
 * Sincroniza formación académica.
 */
export async function saveEnfermeroEducation(
  userId: string,
  education: { degree: string; institution: string; year: string }[]
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("nurse_education")
    .delete()
    .eq("nurse_id", userId);

  if (deleteError) throw deleteError;

  if (education.length > 0) {
    const insertData = education.map((ed) => ({
      nurse_id: userId,
      titulo: ed.degree.trim(),
      institucion: ed.institution.trim(),
      anio: parseInt(ed.year, 10),
    }));
    const { error: insertError } = await supabase
      .from("nurse_education")
      .insert(insertData);

    if (insertError) throw insertError;
  }
}

/**
 * Sincroniza certificaciones de cursos.
 */
export async function saveEnfermeroCertifications(
  userId: string,
  certifications: { name: string; issuer: string; year: string }[]
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("nurse_certifications")
    .delete()
    .eq("nurse_id", userId);

  if (deleteError) throw deleteError;

  if (certifications.length > 0) {
    const insertData = certifications.map((c) => ({
      nurse_id: userId,
      nombre: c.name.trim(),
      emisor: c.issuer.trim(),
      anio: parseInt(c.year, 10),
    }));
    const { error: insertError } = await supabase
      .from("nurse_certifications")
      .insert(insertData);

    if (insertError) throw insertError;
  }
}

/**
 * Sube foto de perfil al bucket publico `foto_perfil`.
 */
export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `avatar_${Date.now()}.${fileExt}`;
  const filePath = `enfermeros/${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("foto_perfil")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("foto_perfil")
    .getPublicUrl(filePath);

  // Actualizar en profiles
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ foto_url: data.publicUrl })
    .eq("id", userId);

  if (updateError) throw updateError;

  return data.publicUrl;
}

/**
 * Consulta métricas, solicitudes pendientes y próximos servicios.
 */
export async function fetchDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  // 1. Contar servicios activos / confirmados
  const { count: activeCount, error: activeErr } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("nurse_id", userId)
    .in("status", ["active", "confirmed"]);

  if (activeErr) throw activeErr;

  // 2. Contar pendientes
  const { count: pendingCount, error: pendingErr } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("nurse_id", userId)
    .eq("status", "pending");

  if (pendingErr) throw pendingErr;

  // 3. Contar completados
  const { count: completedCount, error: completedErr } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("nurse_id", userId)
    .eq("status", "completed");

  if (completedErr) throw completedErr;

  // 4. Saldo en custodia (suma total_amount de in_custody)
  const { data: custodyData, error: custodyErr } = await supabase
    .from("services")
    .select("total_amount")
    .eq("nurse_id", userId)
    .eq("payment_status", "in_custody");

  if (custodyErr) throw custodyErr;

  const inCustodyAmount = custodyData?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0;

  // 5. Próximos servicios (confirmados / activos) con sus service_days
  const { data: services, error: servicesErr } = await supabase
    .from("services")
    .select(`
      id,
      patient_name,
      service_type,
      status,
      service_days (
        day_date,
        start_hour,
        end_hour
      )
    `)
    .eq("nurse_id", userId)
    .in("status", ["confirmed", "active"]);

  if (servicesErr) throw servicesErr;

  // Procesar próximos servicios por día individual
  const upcoming: UpcomingService[] = [];
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  if (services) {
    for (const s of services) {
      const days = (s.service_days || []) as unknown as ServiceDay[];
      for (const d of days) {
        // Analizar fecha y verificar si es futura o de hoy
        const dayDate = new Date(d.day_date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dayDate >= today) {
          // Formatear fecha
          const day = dayDate.getDate();
          const month = monthNames[dayDate.getMonth()];
          const dateStr = `${day} ${month}`;

          // Formatear hora (start_hour, end_hour)
          const formatHour = (h: number) => {
            const period = h >= 12 ? "PM" : "AM";
            const adjusted = h % 12 === 0 ? 12 : h % 12;
            return `${adjusted}:00 ${period}`;
          };
          const timeStr = `${formatHour(d.start_hour)} - ${formatHour(d.end_hour)}`;

          upcoming.push({
            id: s.id,
            patient_name: s.patient_name,
            service_type: s.service_type,
            status: s.status,
            dateStr,
            timeStr,
            rawDate: dayDate,
          });
        }
      }
    }
  }

  // Ordenar los próximos por fecha ascendente y tomar los 3 primeros
  upcoming.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  const nextServices = upcoming.slice(0, 3);

  // 6. Solicitudes Pendientes (status = pending)
  const { data: pendingRequests, error: pendingRequestsErr } = await supabase
    .from("services")
    .select("id, patient_name, service_type, notes, created_at")
    .eq("nurse_id", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (pendingRequestsErr) throw pendingRequestsErr;

  // 7. Actividad reciente: últimos 3 servicios modificados
  const { data: recentServices } = await supabase
    .from("services")
    .select("id, patient_name, service_type, status, updated_at")
    .eq("nurse_id", userId)
    .order("updated_at", { ascending: false })
    .limit(3);

  const recentActivity: RecentActivity[] = (recentServices || []).map((s) => {
    let title = "Actualización de servicio";
    let description = `Servicio de tipo ${s.service_type || "asistencia"} para ${s.patient_name || "paciente"}`;
    if (s.status === "completed") {
      title = "Servicio completado";
      description = `Atención de tipo ${s.service_type || "asistencia"} para ${s.patient_name || "paciente"} finalizada`;
    } else if (s.status === "confirmed") {
      title = "Servicio confirmado";
      description = `Contrato aceptado para el paciente ${s.patient_name || "paciente"}`;
    } else if (s.status === "cancelled") {
      title = "Servicio cancelado";
      description = `Contrato cancelado para el paciente ${s.patient_name || "paciente"}`;
    } else if (s.status === "active") {
      title = "Servicio iniciado";
      description = `Cuidado activo en el domicilio de ${s.patient_name || "paciente"}`;
    }

    // Formatear fecha de actualización de forma amigable
    const updatedDate = new Date(s.updated_at);
    const diffMs = new Date().getTime() - updatedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let timeStr = "Hace poco";
    if (diffDays === 1) {
      timeStr = "Ayer";
    } else if (diffDays > 1) {
      timeStr = `Hace ${diffDays} días`;
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours >= 1) {
        timeStr = `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
      } else {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins >= 1) {
          timeStr = `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
        }
      }
    }

    return {
      id: s.id,
      title,
      description,
      timeStr,
    };
  });

  return {
    activeServices: activeCount || 0,
    pendingServices: pendingCount || 0,
    completedServices: completedCount || 0,
    inCustodyAmount,
    upcomingServices: nextServices,
    pendingRequests: (pendingRequests || []).map((r) => ({
      id: r.id,
      patient_name: r.patient_name,
      service_type: r.service_type,
      notes: r.notes,
      created_at: r.created_at,
    })),
    recentActivity,
  };
}

/**
 * Responde a una solicitud pendiente de servicio (aceptar o rechazar).
 */
export async function respondToServiceRequest(
  serviceId: number,
  action: "confirm" | "cancel"
): Promise<void> {
  const status = action === "confirm" ? "confirmed" : "cancelled";
  const { error } = await supabase
    .from("services")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", serviceId);

  if (error) throw error;
}

/**
 * Obtiene los slots de horario semanal recurrente del enfermero.
 */
export async function fetchNurseScheduleSlots(userId: string): Promise<{
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  enabled: boolean;
}[]> {
  const { data, error } = await supabase
    .from("nurse_schedule_slots")
    .select("day_of_week, start_hour, end_hour, enabled")
    .eq("nurse_id", userId)
    .order("day_of_week", { ascending: true });

  if (error) throw error;

  if (!data || data.length === 0) {
    // Retorna valores por defecto
    return [
      { dayOfWeek: 0, startHour: 8, endHour: 14, enabled: false },
      { dayOfWeek: 1, startHour: 7, endHour: 15, enabled: true },
      { dayOfWeek: 2, startHour: 7, endHour: 15, enabled: true },
      { dayOfWeek: 3, startHour: 7, endHour: 15, enabled: true },
      { dayOfWeek: 4, startHour: 7, endHour: 15, enabled: true },
      { dayOfWeek: 5, startHour: 7, endHour: 15, enabled: true },
      { dayOfWeek: 6, startHour: 8, endHour: 13, enabled: true },
    ];
  }

  return data.map((d) => ({
    dayOfWeek: d.day_of_week,
    startHour: d.start_hour,
    endHour: d.end_hour,
    enabled: d.enabled,
  }));
}

/**
 * Guarda los slots de horario semanal recurrente del enfermero.
 */
export async function saveNurseScheduleSlots(
  userId: string,
  slots: { dayOfWeek: number; startHour: number; endHour: number; enabled: boolean }[]
): Promise<void> {
  // Primero eliminamos los existentes para este enfermero
  const { error: deleteError } = await supabase
    .from("nurse_schedule_slots")
    .delete()
    .eq("nurse_id", userId);

  if (deleteError) throw deleteError;

  // Insertamos los nuevos slots
  const insertData = slots.map((s) => ({
    nurse_id: userId,
    day_of_week: s.dayOfWeek,
    start_hour: s.startHour,
    end_hour: s.endHour,
    enabled: s.enabled,
  }));

  const { error: insertError } = await supabase
    .from("nurse_schedule_slots")
    .insert(insertData);

  if (insertError) throw insertError;
}

/**
 * Obtiene las excepciones de la agenda del enfermero.
 */
export async function fetchNurseScheduleExceptions(userId: string): Promise<{
  id: string;
  date: string;
  type: "block" | "extra" | "vacation";
  startHour?: number;
  endHour?: number;
}[]> {
  const { data, error } = await supabase
    .from("nurse_schedule_exceptions")
    .select("id, fecha, tipo, start_hour, end_hour")
    .eq("nurse_id", userId)
    .order("fecha", { ascending: true });

  if (error) throw error;

  return (data || []).map((e) => ({
    id: e.id,
    date: e.fecha,
    type: e.tipo as "block" | "extra" | "vacation",
    startHour: e.start_hour !== null ? e.start_hour : undefined,
    endHour: e.end_hour !== null ? e.end_hour : undefined,
  }));
}

/**
 * Agrega una excepción a la agenda.
 */
export async function addNurseScheduleException(
  userId: string,
  exception: {
    date: string;
    type: "block" | "extra" | "vacation";
    startHour?: number;
    endHour?: number;
  }
): Promise<{ id: string; date: string; type: "block" | "extra" | "vacation"; startHour?: number; endHour?: number }> {
  const { data, error } = await supabase
    .from("nurse_schedule_exceptions")
    .insert({
      nurse_id: userId,
      fecha: exception.date,
      tipo: exception.type,
      start_hour: exception.startHour ?? null,
      end_hour: exception.endHour ?? null,
    })
    .select("id, fecha, tipo, start_hour, end_hour")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    date: data.fecha,
    type: data.tipo as "block" | "extra" | "vacation",
    startHour: data.start_hour !== null ? data.start_hour : undefined,
    endHour: data.end_hour !== null ? data.end_hour : undefined,
  };
}

/**
 * Elimina una excepción de la agenda.
 */
export async function deleteNurseScheduleException(userId: string, exceptionId: string): Promise<void> {
  const { error } = await supabase
    .from("nurse_schedule_exceptions")
    .delete()
    .eq("id", exceptionId)
    .eq("nurse_id", userId);

  if (error) throw error;
}

/**
 * Obtiene las citas programadas (service_days) del enfermero.
 */
export async function fetchNurseBookings(userId: string): Promise<{
  id: string;
  date: string;
  startHour: number;
  endHour: number;
  patientName: string;
  clientName: string;
  serviceId: string;
  status: "pending" | "confirmed" | "active";
}[]> {
  const { data, error } = await supabase
    .from("service_days")
    .select(`
      id,
      day_date,
      start_hour,
      end_hour,
      status,
      services!inner (
        id,
        patient_name,
        status,
        client_id,
        profiles:client_id (
          nombres,
          apellidos_pa
        )
      )
    `)
    .eq("services.nurse_id", userId)
    .in("services.status", ["pending", "confirmed", "active"]);

  if (error) throw error;

  return (data || []).map((row: any) => {
    const s = row.services;
    const clientNombres = s.profiles?.nombres || "";
    const clientApellidos = s.profiles?.apellidos_pa || "";
    const clientName = `${clientNombres} ${clientApellidos}`.trim() || "Cliente";

    return {
      id: String(row.id),
      date: row.day_date,
      startHour: row.start_hour,
      endHour: row.end_hour,
      patientName: s.patient_name || "Paciente",
      clientName: clientName,
      serviceId: String(s.id),
      status: s.status,
    };
  });
}

/**
 * Obtiene todas las solicitudes de servicio asignadas al enfermero.
 */
export async function fetchNurseServices(nurseId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("services")
    .select(`
      id,
      client_id,
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
      profiles:client_id (
        nombres,
        apellidos_pa,
        apellidos_ma
      ),
      service_days (
        id,
        day_date,
        start_hour,
        end_hour,
        status,
        real_start,
        real_end,
        report
      )
    `)
    .eq("nurse_id", nurseId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row: any) => {
    const clientNombres = row.profiles?.nombres || "";
    const clientApellidos = [row.profiles?.apellidos_pa, row.profiles?.apellidos_ma].filter(Boolean).join(" ");
    const clientName = `${clientNombres} ${clientApellidos}`.trim() || "Cliente";

    return {
      id: row.id,
      client_id: row.client_id,
      status: row.status,
      payment_status: row.payment_status,
      service_type: row.service_type,
      total_hours: row.total_hours,
      total_amount: row.total_amount,
      hourly_rate: row.hourly_rate,
      notes: row.notes,
      contract_code: row.contract_code,
      service_code: row.service_code,
      pin_code: row.pin_code,
      patient_name: row.patient_name,
      patient_age: row.patient_age,
      address: row.address,
      district: row.district,
      created_at: row.created_at,
      clientName: clientName,
      clientPlan: "Básico",
      service_days: (row.service_days || []).map((d: any) => ({
        id: d.id,
        day_date: d.day_date,
        start_hour: d.start_hour,
        end_hour: d.end_hour,
        status: d.status,
        real_start: d.real_start || undefined,
        real_end: d.real_end || undefined,
        report: d.report || undefined,
      })),
    };
  });
}

/**
 * Actualiza el estado de una contratación.
 */
export async function updateServiceStatus(
  serviceId: number,
  status: "confirmed" | "rejected" | "cancelled" | "active" | "in_progress" | "completed"
): Promise<void> {
  const updatePayload: any = {
    status,
    updated_at: new Date().toISOString(),
  };



  const { error } = await supabase
    .from("services")
    .update(updatePayload)
    .eq("id", serviceId);

  if (error) throw error;
}

/**
 * Inicia una sesión diaria de servicio en Supabase.
 */
export async function updateServiceDayStart(
  dayId: number,
  realStart: string
): Promise<void> {
  const { error } = await supabase
    .from("service_days")
    .update({
      status: "active",
      real_start: realStart,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dayId);

  if (error) throw error;
}

/**
 * Finaliza una sesión diaria de servicio en Supabase.
 */
export async function updateServiceDayEnd(
  dayId: number,
  realEnd: string,
  report?: string
): Promise<void> {
  const { error } = await supabase
    .from("service_days")
    .update({
      status: "completed",
      real_end: realEnd,
      report: report || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dayId);

  if (error) throw error;
}

/**
 * Obtiene los pacientes y servicios asignados al enfermero.
 */
export async function fetchNursePatientsAndServices(nurseId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("services")
    .select(`
      id,
      patient_name,
      service_type,
      contract_code,
      service_code,
      status
    `)
    .eq("nurse_id", nurseId)
    .neq("status", "cancelled");

  if (error) throw error;
  return data || [];
}

/**
 * Obtiene las jornadas de un servicio para redactar bitácoras.
 */
export async function fetchServiceDaysForBinnacle(serviceId: number): Promise<any[]> {
  const { data, error } = await supabase
    .from("service_days")
    .select(`
      id,
      day_date,
      start_hour,
      end_hour,
      status,
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
  return data || [];
}

/**
 * Registra una nueva bitácora clínica en Supabase.
 */
export async function createServiceBinnacle(binnacle: {
  service_id: number;
  service_day_id: number;
  activities: string[];
  observations: string;
  recommendations: string;
  photos: string[];
  status?: string;
}): Promise<void> {
  const { error } = await supabase
    .from("service_binnacles")
    .insert([
      {
        service_id: binnacle.service_id,
        service_day_id: binnacle.service_day_id,
        activities: binnacle.activities,
        observations: binnacle.observations,
        recommendations: binnacle.recommendations,
        photos: binnacle.photos,
        status: binnacle.status || "sent",
        updated_at: new Date().toISOString(),
      },
    ]);

  if (error) throw error;
}

/**
 * Actualiza una bitácora clínica existente en Supabase.
 */
export async function updateServiceBinnacle(
  binnacleId: number,
  updates: {
    activities: string[];
    observations: string;
    recommendations: string;
    photos: string[];
  }
): Promise<void> {
  const { error } = await supabase
    .from("service_binnacles")
    .update({
      activities: updates.activities,
      observations: updates.observations,
      recommendations: updates.recommendations,
      photos: updates.photos,
      updated_at: new Date().toISOString(),
    })
    .eq("id", binnacleId);

  if (error) throw error;
}

/**
 * Obtiene las bitácoras redactadas por el enfermero.
 */
export async function fetchNurseBinnaclesList(nurseId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("service_binnacles")
    .select(`
      id,
      activities,
      observations,
      recommendations,
      photos,
      status,
      created_at,
      service_day_id,
      service_days (
        day_date
      ),
      services!inner (
        id,
        patient_name,
        service_type,
        nurse_id
      )
    `)
    .eq("services.nurse_id", nurseId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Sube una foto de bitácora al bucket imagens.
 */
export async function uploadBinnaclePhoto(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `binnacle_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = `binnacles/${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("imagens")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("imagens")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Obtiene todos los documentos subidos por el enfermero.
 */
export async function fetchNurseDocuments(nurseId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("nurse_documents")
    .select("id, doc_type, file_url, status, admin_notes, uploaded_at")
    .eq("nurse_id", nurseId);

  if (error) throw error;
  return data || [];
}

/**
 * Sube un documento al bucket nurse_documents y registra/actualiza en la BD.
 */
export async function uploadNurseDocument(
  nurseId: string,
  docType: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop() || "pdf";
  const fileName = `${docType}_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = `verificacion/${nurseId}/${fileName}`;

  // 1. Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("nurse_documents")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("nurse_documents")
    .getPublicUrl(filePath);

  const fileUrl = data.publicUrl;

  // 2. Upsert in nurse_documents table
  const { data: existing } = await supabase
    .from("nurse_documents")
    .select("id")
    .eq("nurse_id", nurseId)
    .eq("doc_type", docType)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from("nurse_documents")
      .update({
        file_url: fileUrl,
        status: "pending",
        admin_notes: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase
      .from("nurse_documents")
      .insert([
        {
          nurse_id: nurseId,
          doc_type: docType,
          file_url: fileUrl,
          status: "pending",
          admin_notes: null,
          uploaded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (insertError) throw insertError;
  }

  return fileUrl;
}

/**
 * Elimina un documento de la base de datos y de storage.
 */
export async function deleteNurseDocument(
  nurseId: string,
  docType: string,
  fileUrl: string
): Promise<void> {
  try {
    const pathParts = fileUrl.split("/nurse_documents/");
    if (pathParts.length > 1) {
      const storagePath = decodeURIComponent(pathParts[1]);
      await supabase.storage.from("nurse_documents").remove([storagePath]);
    }
  } catch (err) {
    console.error("Error removing file from storage:", err);
  }

  const { error } = await supabase
    .from("nurse_documents")
    .delete()
    .eq("nurse_id", nurseId)
    .eq("doc_type", docType);

  if (error) throw error;
}

/**
 * Envía la solicitud de verificación general cambiando verificacion_status a pending.
 */
export async function submitVerificationRequest(nurseId: string): Promise<void> {
  const { error } = await supabase
    .from("nurse_profiles")
    .update({
      verificacion_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", nurseId);

  if (error) throw error;
}

/**
 * Permite cambiar la visibilidad del perfil (pública / privada).
 */
export async function updateProfileVisibility(
  nurseId: string,
  visibilidad: "publicado" | "despublicado" | "borrador"
): Promise<void> {
  const { error } = await supabase
    .from("nurse_profiles")
    .update({
      visibilidad,
      updated_at: new Date().toISOString(),
    })
    .eq("id", nurseId);

  if (error) throw error;
}
