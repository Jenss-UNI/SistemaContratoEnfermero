import { supabase } from "../../../core/services/supabase";
import type { Nurse, Review, Education, Certification } from "../../../core/models/nurse.model";

// Mapea un registro de la base de datos a la interfaz Nurse del frontend
function mapRowToNurse(row: any): Nurse {
  const p = row.profiles || {};
  
  // Prefijo del nombre según nivel
  let prefix = "Lic. ";
  if (row.nivel === "Técnico en Enfermería") {
    prefix = "Tec. ";
  }
  const fullName = `${prefix}${p.nombres || ""} ${p.apellidos_pa || ""}`.trim();

  // Mapear tipos de servicio activos
  const serviceTypes = (row.nurse_service_types || [])
    .filter((s: any) => s.activo)
    .map((s: any) => ({
      name: s.tipo,
      price: Number(s.tarifa_hora || 0),
    }));

  // Mapear distritos de cobertura
  const districts = (row.nurse_zones || []).map((z: any) => z.distrito);

  // Mapear idiomas
  const languages = (row.nurse_languages || []).map((l: any) => l.idioma);

  // Mapear formación académica
  const educationList: Education[] = (row.nurse_education || []).map((e: any) => ({
    degree: e.titulo,
    institution: e.institucion,
    year: Number(e.anio),
  }));

  // Mapear certificaciones
  const certificationsList: Certification[] = (row.nurse_certifications || []).map((c: any) => ({
    title: c.nombre,
    institution: c.emisor,
    year: Number(c.anio),
  }));

  // Mapear reseñas de calificaciones
  const reviewList: Review[] = (p.ratings || []).map((r: any) => {
    const clientNombres = r.profiles?.nombres || "";
    const clientApellidos = r.profiles?.apellidos_pa || "";
    const author = `${clientNombres} ${clientApellidos}`.trim() || "Cliente";
    const authorPhoto = r.profiles?.foto_url || undefined;

    // Formato de fecha relativo amigable
    const createdDate = new Date(r.created_at);
    const diffMs = new Date().getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let dateStr = "Hace poco";
    if (diffDays === 1) {
      dateStr = "Ayer";
    } else if (diffDays > 1) {
      dateStr = `Hace ${diffDays} días`;
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours >= 1) {
        dateStr = `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
      } else {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins >= 1) {
          dateStr = `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
        }
      }
    }

    return {
      id: String(r.id),
      author,
      date: dateStr,
      comment: r.comment || "",
      rating: Number(r.rating || 0),
      punctuality: Number(r.punctuality || 0),
      treatment: Number(r.treatment || 0),
      technical: Number(r.knowledge || 0),
      authorPhoto,
    };
  });

  const reviewsCount = reviewList.length;
  const avgRating = reviewsCount > 0 
    ? reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewsCount 
    : Number(row.rating || 0);

  const avgPunctuality = reviewsCount > 0 
    ? reviewList.reduce((acc, r) => acc + r.punctuality, 0) / reviewsCount 
    : Number(row.puntualidad_avg || 0);

  const avgTreatment = reviewsCount > 0 
    ? reviewList.reduce((acc, r) => acc + r.treatment, 0) / reviewsCount 
    : Number(row.trato_avg || 0);

  const avgTechnical = reviewsCount > 0 
    ? reviewList.reduce((acc, r) => acc + r.technical, 0) / reviewsCount 
    : Number(row.tecnica_avg || 0);

  return {
    id: row.id,
    name: fullName,
    photo: p.foto_url || undefined,
    title: row.especialidad || row.nivel || "Profesional de la Salud",
    especialidad: row.especialidad || undefined,
    nivel: row.nivel || undefined,
    about: row.bio || "",
    isTopRated: !!row.is_top_rated,
    serviceType: serviceTypes,
    rating: avgRating,
    reviews: reviewsCount || Number(row.total_reviews || 0),
    punctuality: avgPunctuality,
    treatment: avgTreatment,
    technical: avgTechnical,
    district: p.distrito || districts[0] || "Lima",
    districts,
    experience: Number(row.anios_experiencia || 0),
    completedServices: Array.isArray(p.services)
      ? p.services.filter((s: any) => s.status === "completed").length
      : Number(row.servicios_completados || 0),
    education: educationList,
    certifications: certificationsList,
    languages,
    reviewList,
  };
}

/**
 * Obtiene todos los enfermeros con visibilidad publicada.
 */
export async function fetchPublicNurses(): Promise<Nurse[]> {
  const { data, error } = await supabase
    .from("nurse_profiles")
    .select(`
      id,
      nivel,
      especialidad,
      bio,
      rating,
      total_reviews,
      puntualidad_avg,
      trato_avg,
      tecnica_avg,
      servicios_completados,
      anios_experiencia,
      is_top_rated,
      visibilidad,
      profiles:profiles!nurse_profiles_id_fkey!inner (
        id,
        nombres,
        apellidos_pa,
        apellidos_ma,
        foto_url,
        distrito,
        role,
        services:services!services_nurse_id_fkey (
          status
        ),
        ratings:ratings!ratings_nurse_id_fkey (
          id,
          comment,
          rating,
          punctuality,
          treatment,
          knowledge,
          created_at,
          profiles:client_id (
            nombres,
            apellidos_pa,
            foto_url
          )
        )
      ),
      nurse_service_types (
        tipo,
        tarifa_hora,
        activo
      ),
      nurse_zones (
        distrito
      ),
      nurse_languages (
        idioma
      ),
      nurse_education (
        titulo,
        institucion,
        anio
      ),
      nurse_certifications (
        nombre,
        emisor,
        anio
      )
    `)
    .eq("visibilidad", "publicado")
    .eq("profiles.role", "enfermero");

  if (error) throw error;
  return (data || []).map(mapRowToNurse);
}

/**
 * Obtiene la información pública detallada de un enfermero individual.
 */
export async function fetchPublicNurseProfile(id: string): Promise<Nurse | null> {
  const { data, error } = await supabase
    .from("nurse_profiles")
    .select(`
      id,
      nivel,
      especialidad,
      bio,
      rating,
      total_reviews,
      puntualidad_avg,
      trato_avg,
      tecnica_avg,
      servicios_completados,
      anios_experiencia,
      is_top_rated,
      visibilidad,
      profiles:profiles!nurse_profiles_id_fkey!inner (
        id,
        nombres,
        apellidos_pa,
        apellidos_ma,
        foto_url,
        distrito,
        role,
        services:services!services_nurse_id_fkey (
          status
        ),
        ratings:ratings!ratings_nurse_id_fkey (
          id,
          comment,
          rating,
          punctuality,
          treatment,
          knowledge,
          created_at,
          profiles:client_id (
            nombres,
            apellidos_pa,
            foto_url
          )
        )
      ),
      nurse_service_types (
        tipo,
        tarifa_hora,
        activo
      ),
      nurse_zones (
        distrito
      ),
      nurse_languages (
        idioma
      ),
      nurse_education (
        titulo,
        institucion,
        anio
      ),
      nurse_certifications (
        nombre,
        emisor,
        anio
      )
    `)
    .eq("id", id)
    .eq("profiles.role", "enfermero")
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToNurse(data) : null;
}
