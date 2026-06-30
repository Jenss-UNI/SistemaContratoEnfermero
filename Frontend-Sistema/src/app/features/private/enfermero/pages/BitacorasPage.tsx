import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import {
  fetchNursePatientsAndServices,
  fetchServiceDaysForBinnacle,
  createServiceBinnacle,
  updateServiceBinnacle,
  fetchNurseBinnaclesList,
  uploadBinnaclePhoto,
} from "../services/enfermeroProfile.service";
import {
  FileText,
  Send,
  UserRound,
  ClipboardCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Lock,
  Plus,
  Edit2,
  Image as ImageIcon,
} from "lucide-react";

interface DBBitacora {
  id: number;
  paciente: string;
  servicio: string;
  fecha: string;
  fecha_raw: string;
  estado: string;
  resumen: string;
  actividades: string[];
  observaciones: string;
  recomendaciones: string;
  photos: string[];
  serviceId: number;
  serviceDayId: number;
}

interface PatientGroup {
  nombre: string;
  iniciales: string;
  serviciosCount: number;
  services: any[];
}

export default function BitacorasPage() {
  const { user } = useAuth();
  
  // Navigation states
  const [view, setView] = useState<"lista" | "patients" | "services" | "days" | "form">("lista");
  const [selectedBitacora, setSelectedBitacora] = useState<DBBitacora | null>(null);
  
  // Edit mode state
  const [editingBinnacleId, setEditingBinnacleId] = useState<number | null>(null);
  
  // Data loading states
  const [binnacles, setBinnacles] = useState<DBBitacora[]>([]);
  const [patients, setPatients] = useState<PatientGroup[]>([]);
  const [selectedPatientObj, setSelectedPatientObj] = useState<PatientGroup | null>(null);
  const [selectedServiceObj, setSelectedServiceObj] = useState<any | null>(null);
  const [serviceDays, setServiceDays] = useState<any[]>([]);
  const [selectedDayObj, setSelectedDayObj] = useState<any | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDays, setIsLoadingDays] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Form states
  const [activities, setActivities] = useState<{ id: number; text: string }[]>([{ id: 1, text: "" }]);
  const [observations, setObservations] = useState("");
  const [recommendations, setRecommendations] = useState("");
  
  // Photo states
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [photosToUpload, setPhotosToUpload] = useState<File[]>([]);
  const [newPhotosPreview, setNewPhotosPreview] = useState<string[]>([]);

  const formatShortDay = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" });
  };

  const formatHour = (h: number) => {
    const suffix = h >= 12 ? "pm" : "am";
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}:00 ${suffix}`;
  };

  // Load binnacles on mount
  const loadBinnacles = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await fetchNurseBinnaclesList(user.id);
      const mapped = data.map((b: any) => {
        const patientName = b.services?.patient_name || "Paciente";
        const serviceType = b.services?.service_type || "Servicio";
        const dateFormatted = b.service_days?.day_date ? formatShortDay(b.service_days.day_date) : "—";
        const acts = Array.isArray(b.activities) ? b.activities : [];
        return {
          id: b.id,
          paciente: patientName,
          servicio: serviceType,
          fecha: dateFormatted,
          fecha_raw: b.service_days?.day_date || "",
          estado: b.status === "sent" ? "Enviada" : "Borrador",
          resumen: acts.slice(0, 3).join(" · "),
          actividades: acts,
          observaciones: b.observations || "",
          recomendaciones: b.recommendations || "",
          photos: b.photos || [],
          serviceId: b.services?.id || 0,
          serviceDayId: b.service_day_id || 0,
        };
      });
      setBinnacles(mapped);
    } catch (err) {
      console.error("Error loading nurse binnacles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBinnacles();
  }, [user?.id]);

  // Load patients and services when clicking "Nueva bitácora"
  const startNewBinnacle = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const services = await fetchNursePatientsAndServices(user.id);
      
      // Group by patient name
      const groups: Record<string, any[]> = {};
      services.forEach((s: any) => {
        if (!groups[s.patient_name]) {
          groups[s.patient_name] = [];
        }
        groups[s.patient_name].push(s);
      });

      const mappedGroups = Object.keys(groups).map((name) => {
        const ini = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "PA";
        return {
          nombre: name,
          iniciales: ini,
          serviciosCount: groups[name].length,
          services: groups[name]
        };
      });

      setPatients(mappedGroups);
      setEditingBinnacleId(null);
      setExistingPhotos([]);
      setPhotosToUpload([]);
      setNewPhotosPreview([]);
      setView("patients");
    } catch (err) {
      console.error("Error loading patients and services:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load service days when selecting a service
  const handleSelectService = async (service: any) => {
    setSelectedServiceObj(service);
    setIsLoadingDays(true);
    setView("days");
    try {
      const days = await fetchServiceDaysForBinnacle(service.id);
      setServiceDays(days);
    } catch (err) {
      console.error("Error loading service days:", err);
    } finally {
      setIsLoadingDays(false);
    }
  };

  const handleSelectDay = (day: any) => {
    setEditingBinnacleId(null);
    setSelectedDayObj(day);
    setActivities([{ id: Date.now(), text: "" }]);
    setObservations("");
    setRecommendations("");
    setExistingPhotos([]);
    setPhotosToUpload([]);
    setNewPhotosPreview([]);
    setView("form");
  };

  const handleSelectDayForEdit = (day: any) => {
    const b = Array.isArray(day.service_binnacles) ? day.service_binnacles[0] : day.service_binnacles;
    if (!b) return;
    setEditingBinnacleId(b.id);
    setSelectedDayObj(day);
    
    // Populate form
    const acts = Array.isArray(b.activities) ? b.activities.map((a: string, index: number) => ({ id: index, text: a })) : [];
    setActivities(acts.length > 0 ? acts : [{ id: Date.now(), text: "" }]);
    setObservations(b.observations || "");
    setRecommendations(b.recommendations || "");
    setExistingPhotos(b.photos || []);
    setPhotosToUpload([]);
    setNewPhotosPreview([]);
    setView("form");
  };

  const handleStartEditFromList = (b: DBBitacora) => {
    setEditingBinnacleId(b.id);
    setSelectedPatientObj({
      nombre: b.paciente,
      iniciales: b.paciente.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "PA",
      serviciosCount: 1,
      services: []
    });
    setSelectedServiceObj({
      id: b.serviceId,
      service_type: b.servicio
    });
    setSelectedDayObj({
      id: b.serviceDayId,
      day_date: b.fecha_raw
    });
    
    const acts = b.actividades.map((act, idx) => ({ id: idx, text: act }));
    setActivities(acts.length > 0 ? acts : [{ id: Date.now(), text: "" }]);
    setObservations(b.observaciones || "");
    setRecommendations(b.recomendaciones || "");
    setExistingPhotos(b.photos || []);
    setPhotosToUpload([]);
    setNewPhotosPreview([]);
    setView("form");
  };

  const addActivity = () => {
    setActivities([...activities, { id: Date.now(), text: "" }]);
  };

  const removeActivity = (id: number) => {
    if (activities.length === 1) return;
    setActivities(activities.filter((act) => act.id !== id));
  };

  const updateActivity = (id: number, value: string) => {
    setActivities(activities.map((act) => act.id === id ? { ...act, text: value } : act));
  };

  // Photo handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setPhotosToUpload([...photosToUpload, ...filesArray]);
    
    const newPreviews = filesArray.map(file => URL.createObjectURL(file));
    setNewPhotosPreview([...newPhotosPreview, ...newPreviews]);
  };

  const removePhotoToUpload = (index: number) => {
    URL.revokeObjectURL(newPhotosPreview[index]);
    setPhotosToUpload(photosToUpload.filter((_, idx) => idx !== index));
    setNewPhotosPreview(newPhotosPreview.filter((_, idx) => idx !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(existingPhotos.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    if (!selectedServiceObj || !selectedDayObj || !user?.id) return;
    const filterActivities = activities.map((a) => a.text.trim()).filter(Boolean);
    if (filterActivities.length === 0) {
      alert("Por favor ingresa al menos una actividad realizada.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Upload new photos
      const uploadedUrls = await Promise.all(
        photosToUpload.map(file => uploadBinnaclePhoto(user.id, file))
      );
      
      const finalPhotos = [...existingPhotos, ...uploadedUrls];

      // 2. Perform save/update
      if (editingBinnacleId) {
        await updateServiceBinnacle(editingBinnacleId, {
          activities: filterActivities,
          observations: (observations || "").trim(),
          recommendations: (recommendations || "").trim(),
          photos: finalPhotos
        });
      } else {
        await createServiceBinnacle({
          service_id: Number(selectedServiceObj.id),
          service_day_id: Number(selectedDayObj.id),
          activities: filterActivities,
          observations: (observations || "").trim(),
          recommendations: (recommendations || "").trim(),
          photos: finalPhotos,
          status: "sent"
        });
      }

      // Cleanup previews
      newPhotosPreview.forEach(url => URL.revokeObjectURL(url));

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setView("lista");
        setSelectedPatientObj(null);
        setSelectedServiceObj(null);
        setSelectedDayObj(null);
        setEditingBinnacleId(null);
        loadBinnacles();
      }, 2000);
    } catch (err: any) {
      console.error("Error saving clinical binnacle:", err);
      alert(`Error al guardar la bitácora: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(binnacles.length / itemsPerPage);
  const paginatedBitacoras = useMemo(() => {
    return binnacles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [binnacles, currentPage]);

  // Stats computation
  const stats = useMemo(() => {
    const total = binnacles.length;
    const sent = binnacles.filter((b) => b.estado === "Enviada").length;
    const uniquePatientsCount = new Set(binnacles.map((b) => b.paciente)).size;
    const activeServs = patients.reduce((acc, p) => acc + p.services.filter(s => s.status === "active").length, 0);

    return {
      total,
      sent,
      patientsCount: uniquePatientsCount,
      activeServices: activeServs || 1
    };
  }, [binnacles, patients]);

  if (isLoading && view === "lista") {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-semibold">Cargando bitácoras...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        {view === "lista" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={<FileText size={18} />} value={String(stats.total)} label="Total bitácoras" />
            <StatCard icon={<Send size={18} />} value={String(stats.sent)} label="Enviadas" />
            <StatCard icon={<UserRound size={18} />} value={String(stats.patientsCount)} label="Pacientes" />
            <StatCard icon={<ClipboardCheck size={18} />} value={String(stats.activeServices)} label="Servicios activos" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Bitácoras Clínicas</h2>
            <p className="text-xs text-slate-400">Registra y comparte las bitácoras de cuidados con los clientes</p>
          </div>

          {view === "lista" && (
            <button
              onClick={startNewBinnacle}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Nueva bitácora
            </button>
          )}
        </div>

        {/* Views */}
        <div className="space-y-3">
          {/* LIST VIEW */}
          {view === "lista" && (
            <div className="space-y-3">
              {binnacles.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-655">No hay bitácoras redactadas todavía</p>
                  <p className="text-xs text-slate-400 mt-1">Crea tu primera bitácora haciendo clic en "Nueva bitácora"</p>
                </div>
              ) : (
                paginatedBitacoras.map((b) => (
                  <div key={b.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-sm font-black shrink-0">
                          {b.paciente.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{b.paciente}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {b.servicio} · {b.fecha}
                          </p>
                          {b.resumen && (
                            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed bg-slate-50/50 border border-slate-100 px-3 py-2 rounded-xl italic">
                              "{b.resumen}"
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg tracking-wide uppercase ${
                        b.estado === "Enviada" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {b.estado}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setSelectedBitacora(b)}
                        className="flex-1 rounded-xl bg-slate-50 hover:bg-slate-100/85 py-2.5 text-xs font-bold text-slate-655 transition cursor-pointer"
                      >
                        Ver detalle completo
                      </button>
                      <button
                        onClick={() => handleStartEditFromList(b)}
                        className="px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-100/50 transition cursor-pointer flex items-center justify-center"
                        title="Editar bitácora"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SELECT PATIENT VIEW */}
          {view === "patients" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs">
                <button onClick={() => setView("lista")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Bitácoras
                </button>
                <span className="text-slate-300">›</span>
                <span className="font-bold text-teal-600">Pacientes</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">Selecciona un Paciente</h3>
                <p className="text-xs text-slate-400 mt-0.5">Elige el paciente del cual vas a redactar la bitácora diaria</p>
              </div>

              {patients.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  No tienes servicios activos registrados para redactar bitácoras.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {patients.map((p) => (
                    <div key={p.nombre} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between">
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center font-bold text-teal-700 shrink-0">
                          {p.iniciales}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{p.nombre}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {p.serviciosCount} {p.serviciosCount === 1 ? "servicio" : "servicios"} contratado(s)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPatientObj(p);
                          if (p.services.length === 1) {
                            handleSelectService(p.services[0]);
                          } else {
                            setView("services");
                          }
                        }}
                        className="w-full mt-4 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                      >
                        Ver servicios
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SELECT SERVICE VIEW */}
          {view === "services" && selectedPatientObj && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs">
                <button onClick={() => setView("lista")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Bitácoras
                </button>
                <span className="text-slate-300">›</span>
                <button onClick={() => setView("patients")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Pacientes
                </button>
                <span className="text-slate-300">›</span>
                <span className="font-bold text-teal-600">Servicios</span>
              </div>

              <h3 className="text-base font-bold text-slate-800">Servicios de {selectedPatientObj.nombre}</h3>

              <div className="grid gap-4">
                {selectedPatientObj.services.map((s) => (
                  <div key={s.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {s.contract_code || s.service_code || `SRV-${s.id}`}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">{s.service_type}</h4>
                    </div>

                    <button
                      onClick={() => handleSelectService(s)}
                      className="bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      Ver jornadas
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SELECT DAY VIEW */}
          {view === "days" && selectedPatientObj && selectedServiceObj && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs">
                <button onClick={() => setView("lista")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Bitácoras
                </button>
                <span className="text-slate-300">›</span>
                <button onClick={() => setView("patients")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Pacientes
                </button>
                <span className="text-slate-300">›</span>
                {selectedPatientObj.services.length > 1 && (
                  <>
                    <button onClick={() => setView("services")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                      Servicios
                    </button>
                    <span className="text-slate-300">›</span>
                  </>
                )}
                <span className="font-bold text-teal-600">Jornadas</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">Jornadas: {selectedPatientObj.nombre}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Selecciona la jornada completada que deseas reportar u optimizar</p>
              </div>

              {isLoadingDays ? (
                <div className="flex flex-col justify-center items-center py-10 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  <p className="text-xs text-slate-400 font-medium">Cargando jornadas...</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {serviceDays.map((d, index) => {
                    const binnacleObj = d.service_binnacles?.[0] || d.service_binnacles || null;
                    const hasBinnacle = !!binnacleObj;
                    const isCompleted = d.status === "completed";
                    const isSelectable = isCompleted && !hasBinnacle;

                    return (
                      <div key={d.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">
                              Jornada {index + 1}: {formatShortDay(d.day_date)}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Horario: {formatHour(d.start_hour)} - {formatHour(d.end_hour)}
                            </p>
                          </div>

                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide shrink-0 ${
                            hasBinnacle ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            isCompleted ? "bg-teal-50 text-teal-700 border border-teal-100" :
                            "bg-slate-100 text-slate-500 border border-slate-100"
                          }`}>
                            {hasBinnacle ? "Ya redactada" : isCompleted ? "Completada" : "No finalizada"}
                          </span>
                        </div>

                        {isSelectable ? (
                          <button
                            onClick={() => handleSelectDay(d)}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition cursor-pointer"
                          >
                            Redactar bitácora
                          </button>
                        ) : hasBinnacle ? (
                          <button
                            onClick={() => handleSelectDayForEdit(d)}
                            className="w-full bg-amber-50 hover:bg-amber-100/80 text-amber-700 border border-amber-250 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-sm"
                          >
                            <Edit2 size={13} />
                            Editar bitácora
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-slate-50 border border-slate-100 text-slate-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Jornada no finalizada
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CREATE/EDIT BINNACLE FORM VIEW */}
          {view === "form" && selectedPatientObj && selectedServiceObj && selectedDayObj && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs">
                <button onClick={() => setView("lista")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Bitácoras
                </button>
                <span className="text-slate-300">›</span>
                <button onClick={() => setView("patients")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Pacientes
                </button>
                <span className="text-slate-300">›</span>
                <button onClick={() => setView("days")} className="text-slate-400 hover:text-teal-600 transition font-medium">
                  Jornadas
                </button>
                <span className="text-slate-300">›</span>
                <span className="font-bold text-teal-600">{editingBinnacleId ? "Editar" : "Redactar"}</span>
              </div>

              <div className="flex items-start gap-3">
                <button onClick={() => setView("days")} className="mt-0.5 text-slate-400 hover:text-teal-600 font-bold text-base transition">
                  ←
                </button>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {editingBinnacleId ? "Editar Bitácora Clínica" : "Nueva Bitácora Clínica"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Paciente: {selectedPatientObj.nombre} · Jornada: {formatShortDay(selectedDayObj.day_date)}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                {/* Resumen box */}
                <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Servicio</span>
                    <strong className="text-slate-700 font-bold block mt-0.5">{selectedServiceObj.service_type}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Código</span>
                    <strong className="text-slate-700 font-bold block mt-0.5">{selectedServiceObj.contract_code || selectedServiceObj.service_code || `SRV-${selectedServiceObj.id}`}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Fecha</span>
                    <strong className="text-slate-700 font-bold block mt-0.5">{formatShortDay(selectedDayObj.day_date)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Horario Programado</span>
                    <strong className="text-slate-700 font-bold block mt-0.5">
                      {formatHour(selectedDayObj.start_hour)} - {formatHour(selectedDayObj.end_hour)}
                    </strong>
                  </div>
                </div>

                {/* Actividades */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Actividades Realizadas
                  </h4>

                  <div className="space-y-2">
                    {activities.map((act, index) => (
                      <div key={act.id} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-black flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={act.text}
                          onChange={(e) => updateActivity(act.id, e.target.value)}
                          placeholder="Ej: Control de presión arterial, toma de Donepezilo, etc."
                          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeActivity(act.id)}
                          disabled={activities.length === 1}
                          className="text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer p-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addActivity}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50/40 border border-teal-200/30 px-2.5 py-1.5 rounded-lg cursor-pointer transition"
                  >
                    <Plus size={14} />
                    Agregar otra actividad
                  </button>
                </div>

                {/* Observaciones */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Observaciones Clínicas / Novedades
                  </h4>
                  <textarea
                    rows={4}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Describe el estado del paciente, estado de ánimo, alimentación, sueño, etc."
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/20 resize-none"
                  />
                </div>

                {/* Recomendaciones */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Recomendaciones para el Cliente o Familia
                  </h4>
                  <textarea
                    rows={3}
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="Sugerencias de cuidado, medicamentos por comprar o citas médicas sugeridas."
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/20 resize-none"
                  />
                </div>

                {/* Fotos / Evidencia */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Fotos / Evidencia de la bitácora (Opcional)
                  </h4>

                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Botón para subir fotos */}
                    <label className="flex flex-col items-center justify-center w-20 h-20 border border-dashed border-slate-300 hover:border-teal-400 rounded-2xl cursor-pointer hover:bg-slate-50 transition shrink-0">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                      <span className="text-[9px] text-slate-400 font-bold mt-1">Agregar</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Fotos ya guardadas en la BD */}
                    {existingPhotos.map((url, index) => (
                      <div key={`existing-${index}`} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0 group">
                        <img src={url} alt="Guardada" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(index)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow transition cursor-pointer scale-90"
                          title="Eliminar foto guardada"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}

                    {/* Previsualización de fotos nuevas a subir */}
                    {newPhotosPreview.map((previewUrl, index) => (
                      <div key={`new-${index}`} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-150 shadow-sm shrink-0 group">
                        <img src={previewUrl} alt="Nueva" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-teal-500 text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase">
                          Nueva
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhotoToUpload(index)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow transition cursor-pointer scale-90"
                          title="Eliminar foto elegida"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-5">
                  <button
                    type="button"
                    onClick={() => setView("days")}
                    disabled={isSaving}
                    className="border border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl cursor-pointer text-xs shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <span>{editingBinnacleId ? "Actualizar Bitácora" : "Enviar Bitácora"}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paginación */}
        {view === "lista" && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-50 hover:bg-slate-50 transition cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === i + 1 ? "bg-teal-500 text-white shadow" : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-50 hover:bg-slate-50 transition cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedBitacora && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 w-full max-w-md relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBitacora(null)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4 mt-2">
              <div className="h-11 w-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black">
                {selectedBitacora.paciente.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">{selectedBitacora.paciente}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedBitacora.servicio} · {selectedBitacora.fecha}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Actividades */}
              {selectedBitacora.actividades.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    Actividades Realizadas
                  </h4>
                  <ul className="list-none space-y-1.5 pl-0.5">
                    {selectedBitacora.actividades.map((act, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <span className="text-emerald-500 font-bold select-none">✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Observaciones */}
              {selectedBitacora.observaciones && (
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Observaciones
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed italic">
                    "{selectedBitacora.observaciones}"
                  </p>
                </div>
              )}

              {/* Recomendaciones */}
              {selectedBitacora.recomendaciones && (
                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                    Recomendaciones
                  </h4>
                  <p className="text-xs text-slate-655 leading-relaxed font-semibold">
                    "{selectedBitacora.recomendaciones}"
                  </p>
                </div>
              )}

              {/* Fotos */}
              {selectedBitacora.photos && selectedBitacora.photos.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    Evidencia Fotográfica
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedBitacora.photos.map((photoUrl, pIdx) => (
                      <a
                        key={pIdx}
                        href={photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:scale-105 transition block shrink-0"
                      >
                        <img
                          src={photoUrl}
                          alt={`Evidencia ${pIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  const b = selectedBitacora;
                  setSelectedBitacora(null);
                  handleStartEditFromList(b);
                }}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl cursor-pointer text-xs transition shadow-sm"
              >
                Editar Bitácora
              </button>
              <button
                onClick={() => setSelectedBitacora(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-slate-655 font-bold py-3 rounded-xl cursor-pointer text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success banner */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-[120] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-6 duration-300">
          <span className="font-bold text-xs">✅ Bitácora guardada correctamente</span>
        </div>
      )}
    </>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 mb-3 border border-slate-100/50">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-800">{value}</h3>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}