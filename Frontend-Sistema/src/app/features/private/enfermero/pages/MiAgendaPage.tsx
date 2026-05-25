import { useState, useMemo } from "react";
import {
  Clock,
  Sun,
  X,
  Check,
  Trash2,
  CalendarDays,
  MapPin,
  Lock,
  Eye,
  RefreshCw,
  Plus,
  Loader2,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ─── Types ─── */
interface WeeklySlot {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  enabled: boolean;
}

interface Exception {
  id: string;
  date: string;
  type: "block" | "extra" | "vacation";
  startHour?: number;
  endHour?: number;
}

interface Booking {
  id: string;
  date: string;
  startHour: number;
  endHour: number;
  patientName: string;
  clientName: string;
  serviceId: string;
  status: "confirmed" | "pending";
}

/* ─── Predefined Data Constants ─── */
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d: Date, days: number) {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

function formatHour(h: number) {
  const suffix = h >= 12 ? "pm" : "am";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

function generateHourlySlots(start: number, end: number) {
  const slots: number[] = [];
  for (let h = start; h < end; h++) slots.push(h);
  return slots;
}

/* ─── Horario Semanal Recurrente por Defecto (Lun-Vie: 7am-3pm, Sáb: 8am-1pm, Dom: OFF) ─── */
const defaultWeekly: WeeklySlot[] = [
  { dayOfWeek: 0, startHour: 8, endHour: 14, enabled: false }, // Domingo cerrado
  { dayOfWeek: 1, startHour: 7, endHour: 15, enabled: true },  // Lunes 7am - 3pm
  { dayOfWeek: 2, startHour: 7, endHour: 15, enabled: true },  // Martes 7am - 3pm
  { dayOfWeek: 3, startHour: 7, endHour: 15, enabled: true },  // Miércoles 7am - 3pm
  { dayOfWeek: 4, startHour: 7, endHour: 15, enabled: true },  // Jueves 7am - 3pm
  { dayOfWeek: 5, startHour: 7, endHour: 15, enabled: true },  // Viernes 7am - 3pm
  { dayOfWeek: 6, startHour: 8, endHour: 13, enabled: true },  // Sábado 8am - 1pm
];

// Forzar la fecha inicial de la cuadrícula a ser exactamente el Domingo 24 de Mayo de 2026
// para calzar al 100% con los números e interacciones de tus imágenes de referencia.
const mockStartDate = new Date(2026, 4, 24); // 24 de Mayo 2026

export default function MiAgendaPage() {
  const [view, setView] = useState<"calendar" | "weekly">("calendar");
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySlot[]>(defaultWeekly);
  
  // Excepciones iniciales coincidiendo con la captura
  const [exceptions, setExceptions] = useState<Exception[]>([
    { id: "exc-1", date: "2026-05-23", type: "extra", startHour: 8, endHour: 19 }, // sábado, 23 de mayo
    { id: "exc-2", date: "2026-06-01", type: "vacation" },                       // lunes, 1 de junio
    { id: "exc-3", date: "2026-06-12", type: "block" },                          // viernes, 12 de junio
  ]);

  // Citas confirmadas iniciales coincidiendo con la captura y adicionando días marcados en rojo
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "svc-3",
      date: "2026-05-27", // Miércoles 27 de Mayo
      startHour: 7,
      endHour: 13,
      patientName: "Juana Lopez Casas",
      clientName: "Axel Perez",
      serviceId: "3",
      status: "confirmed",
    },
    {
      id: "svc-1",
      date: "2026-05-26", // Martes 26 de Mayo (Marca punto rojo)
      startHour: 8,
      endHour: 14,
      patientName: "Manuel Prado",
      clientName: "Maria Prado",
      serviceId: "1",
      status: "confirmed",
    },
    {
      id: "svc-4",
      date: "2026-05-28", // Jueves 28 de Mayo (Marca punto rojo)
      startHour: 9,
      endHour: 15,
      patientName: "Rosa Espinoza",
      clientName: "Sofia Espinoza",
      serviceId: "4",
      status: "confirmed",
    },
    {
      id: "svc-2",
      date: "2026-05-30", // Sábado 30 de Mayo (Marca punto rojo)
      startHour: 8,
      endHour: 12,
      patientName: "Alberto Fujimori",
      clientName: "Keiko Fujimori",
      serviceId: "2",
      status: "confirmed",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<string | null>("2026-05-27"); // miércoles 27 seleccionado por defecto
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionForm, setExceptionForm] = useState<{
    date: string;
    type: "block" | "extra" | "vacation";
    startHour: number;
    endHour: number;
  }>({ date: "2026-05-25", type: "block", startHour: 8, endHour: 18 });

  const [savingWeekly, setSavingWeekly] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  // Navegación de meses (inicializado en Mayo 2026 para calzar con las referencias)
  const [currentMonth, setCurrentMonth] = useState(4); // 4 = Mayo
  const [currentYear, setCurrentYear] = useState(2026);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Sistema de alertas flotantes
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Generar todos los días del mes seleccionado
  const calendarDays = useMemo(() => {
    const days: { date: string; dayOfWeek: number; label: string }[] = [];
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(currentYear, currentMonth, day);
      days.push({
        date: toDateStr(d),
        dayOfWeek: d.getDay(),
        label: `${day} de ${MONTH_NAMES[currentMonth]}`,
      });
    }
    return days;
  }, [currentMonth, currentYear]);

  // Lógica de cálculo de disponibilidad para un día específico
  const getDayAvailability = (dateStr: string) => {
    const exc = exceptions.find((e) => e.date === dateStr);
    if (exc) {
      if (exc.type === "vacation" || exc.type === "block") return null;
      if (exc.type === "extra") return { startHour: exc.startHour!, endHour: exc.endHour! };
    }
    const parsedDate = new Date(dateStr + "T12:00:00");
    const dow = parsedDate.getDay();
    const slot = weeklySchedule.find((s) => s.dayOfWeek === dow && s.enabled);
    return slot ? { startHour: slot.startHour, endHour: slot.endHour } : null;
  };

  // Obtener citas de un día
  const getDayBookings = (dateStr: string) => {
    return bookings.filter((b) => b.date === dateStr && b.status === "confirmed");
  };

  // Calcular horas disponibles en un día (excluyendo horas ocupadas por reservas)
  const getDaySlots = (dateStr: string) => {
    const avail = getDayAvailability(dateStr);
    if (!avail) return [];
    const dayBookings = getDayBookings(dateStr);
    const allSlots = generateHourlySlots(avail.startHour, avail.endHour);
    
    // Filtrar horas ocupadas por reservas
    return allSlots.filter((hour) => {
      return !dayBookings.some((b) => hour >= b.startHour && hour < b.endHour);
    });
  };

  // Obtener estado/categoría de un día para pintar los dots
  const getDayStatus = (dateStr: string): "available" | "booked" | "blocked" | "vacation" => {
    const exc = exceptions.find((e) => e.date === dateStr);
    if (exc?.type === "vacation") return "vacation";
    if (exc?.type === "block") return "blocked";
    
    const avail = getDayAvailability(dateStr);
    if (!avail) return "blocked";
    
    const dayBookings = getDayBookings(dateStr);
    if (dayBookings.length > 0) return "booked";
    
    return "available";
  };

  // Guardar disponibilidad recurrente semanal
  const handleSaveWeekly = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWeekly(true);
    setTimeout(() => {
      setSavingWeekly(false);
      showToast("Horario semanal guardado correctamente", "success");
    }, 1200);
  };

  // Añadir nueva excepción
  const handleAddException = () => {
    if (!exceptionForm.date) {
      showToast("Por favor selecciona una fecha válida.", "error");
      return;
    }

    // Comprobar si ya existe una excepción en esa fecha
    const duplicate = exceptions.some((e) => e.date === exceptionForm.date);
    if (duplicate) {
      showToast("Ya existe una excepción configurada para esta fecha.", "error");
      return;
    }

    const newExc: Exception = {
      id: `exc-${Date.now()}`,
      date: exceptionForm.date,
      type: exceptionForm.type,
      ...(exceptionForm.type === "extra"
        ? { startHour: exceptionForm.startHour, endHour: exceptionForm.endHour }
        : {}),
    };

    setExceptions((prev) => [...prev, newExc]);
    setShowExceptionModal(false);
    showToast("Excepción agregada correctamente", "success");
  };

  // Eliminar una excepción
  const handleRemoveException = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
    showToast("Excepción eliminada", "success");
  };

  // Cambiar habilitación de un día de la semana
  const toggleDayEnabled = (dow: number) => {
    setWeeklySchedule((prev) =>
      prev.map((s) => (s.dayOfWeek === dow ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Actualizar horas de inicio y fin semanal
  const updateWeeklyHours = (dow: number, field: "startHour" | "endHour", value: number) => {
    setWeeklySchedule((prev) =>
      prev.map((s) => {
        if (s.dayOfWeek === dow) {
          const updated = { ...s, [field]: value };
          // Validación lógica simple: inicio no mayor a fin
          if (field === "startHour" && value >= s.endHour) {
            updated.endHour = Math.min(value + 1, 23);
          }
          if (field === "endHour" && value <= s.startHour) {
            updated.startHour = Math.max(value - 1, 0);
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Atributos y etiquetas del día seleccionado para panel derecho
  const selectedBookings = selectedDate ? getDayBookings(selectedDate) : [];
  const selectedSlots = selectedDate ? getDaySlots(selectedDate) : [];
  const selectedAvail = selectedDate ? getDayAvailability(selectedDate) : null;
  const selectedDayLabel = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="relative w-full space-y-6">
      
      {/* Cabecera y selectores de vista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Mi Agenda</h2>
          <p className="text-xs text-slate-400">Configura tu disponibilidad semanal y gestiona excepciones</p>
        </div>
        <div className="flex bg-slate-100/70 border border-slate-200/50 rounded-xl p-1 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              view === "calendar" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Calendario
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              view === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Horario Semanal
          </button>
        </div>
      </div>

      {/* ─── VISTA HORARIO SEMANAL ─── */}
      {view === "weekly" && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Disponibilidad Recurrente</h3>
            <p className="text-xs text-slate-400">Estos horarios se repiten automáticamente cada semana</p>
          </div>

          <div className="flex flex-col gap-3">
            {weeklySchedule.map((slot) => (
              <div
                key={slot.dayOfWeek}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition duration-200 ${
                  slot.enabled ? "border-teal-200 bg-teal-50/10" : "border-slate-100 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Botón de activación del día */}
                  <button
                    type="button"
                    onClick={() => toggleDayEnabled(slot.dayOfWeek)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer flex-shrink-0 ${
                      slot.enabled ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {slot.enabled ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </button>
                  <div className="min-w-[80px]">
                    <p className={`text-sm font-bold ${slot.enabled ? "text-slate-800" : "text-slate-400"}`}>
                      {DAY_NAMES[slot.dayOfWeek] === "Dom" ? "Domingo" :
                       DAY_NAMES[slot.dayOfWeek] === "Lun" ? "Lunes" :
                       DAY_NAMES[slot.dayOfWeek] === "Mar" ? "Martes" :
                       DAY_NAMES[slot.dayOfWeek] === "Mié" ? "Miércoles" :
                       DAY_NAMES[slot.dayOfWeek] === "Jue" ? "Jueves" :
                       DAY_NAMES[slot.dayOfWeek] === "Vie" ? "Viernes" : "Sábado"}
                    </p>
                  </div>
                </div>

                {/* Selectores de Horas */}
                {slot.enabled ? (
                  <div className="flex items-center gap-2.5">
                    <select
                      value={slot.startHour}
                      onChange={(e) => updateWeeklyHours(slot.dayOfWeek, "startHour", Number(e.target.value))}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-400 cursor-pointer"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatHour(i)}
                        </option>
                      ))}
                    </select>
                    <span className="text-slate-400 text-xs font-medium">a</span>
                    <select
                      value={slot.endHour}
                      onChange={(e) => updateWeeklyHours(slot.dayOfWeek, "endHour", Number(e.target.value))}
                      className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-400 cursor-pointer"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatHour(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No disponible</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-50">
            <button
              onClick={handleSaveWeekly}
              disabled={savingWeekly}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-bold text-sm rounded-xl cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5"
            >
              {savingWeekly ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando horario...
                </>
              ) : (
                "Guardar horario semanal"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── VISTA CALENDARIO E INTERACCIONES ─── */}
      {view === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Columna Izquierda: Calendario de 30 días y Excepciones */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Grid del Calendario Mensual */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h3 className="text-sm font-extrabold text-slate-850 min-w-[120px] text-center capitalize">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </h3>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">Haz clic en un día para ver detalles</p>
              </div>

              {/* Encabezado Semanal */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Cuadrícula del Calendario */}
              <div className="grid grid-cols-7 gap-2.5">
                {calendarDays.length > 0 && Array.from({ length: calendarDays[0].dayOfWeek }).map((_, i) => (
                  <div key={`pad-${i}`}></div>
                ))}

                {calendarDays.map((day) => {
                  const status = getDayStatus(day.date);
                  const isSelected = selectedDate === day.date;
                  const isToday = day.date === "2026-05-25"; // Lunes 25 es el día actual en la captura
                  const dayNum = Number(day.date.split("-")[2]);

                  const statusClasses = {
                    available: "bg-white text-slate-700 hover:bg-teal-50/50 border-slate-200",
                    booked: "bg-rose-50/30 text-rose-700 border-rose-200",
                    blocked: "bg-slate-100 text-slate-400 border-slate-100",
                    vacation: "bg-amber-50/40 text-amber-700 border-amber-200 bg-[rgba(254,243,199,0.3)]",
                  };

                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedDate(day.date)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        statusClasses[status]
                      } ${isSelected ? "ring-2 ring-teal-500 ring-offset-2 scale-105" : ""} ${
                        isToday ? "border-teal-500 font-extrabold text-teal-700" : ""
                      }`}
                    >
                      <span>{dayNum}</span>
                      
                      {/* Círculo indicador de disponibilidad */}
                      {status === "booked" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1"></span>
                      )}
                      {status === "available" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1"></span>
                      )}
                      {status === "vacation" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Leyenda del Calendario */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0"></span>
                  Disponible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  Con reservas
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  Vacaciones
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span>
                  No disponible
                </span>
              </div>
            </div>

            {/* Excepciones Configuradas */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                <h3 className="text-sm font-bold text-slate-800">Excepciones Configuradas</h3>
                <button
                  type="button"
                  onClick={() => setShowExceptionModal(true)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer flex items-center gap-1 bg-teal-50 border border-teal-200/50 px-3 py-1.5 rounded-xl transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar excepción
                </button>
              </div>
              
              {exceptions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Sin excepciones configuradas</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {exceptions.map((exc) => {
                    const d = new Date(exc.date + "T12:00:00");
                    const typeLabels: Record<string, { text: string; color: string; icon: any }> = {
                      block: { text: "Bloqueado", color: "bg-slate-100 text-slate-600", icon: X },
                      extra: { text: "Horario extra", color: "bg-blue-50 text-blue-700", icon: Clock },
                      vacation: { text: "Vacaciones", color: "bg-amber-50 text-amber-700", icon: Sun },
                    };
                    const tl = typeLabels[exc.type];
                    const IconComp = tl.icon;

                    return (
                      <div
                        key={exc.id}
                        className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold ${tl.color}`}
                          >
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 capitalize">
                              {d.toLocaleDateString("es-PE", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {exc.type === "extra" && exc.startHour !== undefined
                                ? `${formatHour(exc.startHour)} - ${formatHour(exc.endHour!)}`
                                : tl.text}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveException(exc.id)}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 hover:text-rose-500 text-slate-400 flex items-center justify-center cursor-pointer transition flex-shrink-0"
                          aria-label="Eliminar excepción"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Panel de Detalle del Día Seleccionado y Guía */}
          <div className="space-y-5">
            {selectedDate && (
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block mb-1">
                    Detalles del día
                  </span>
                  <h3 className="text-base font-bold text-slate-800 capitalize leading-tight">
                    {selectedDayLabel}
                  </h3>
                </div>

                {!selectedAvail ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in">
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full mb-3 text-slate-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No disponible este día</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                      Configurado como bloqueado o vacaciones
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in fade-in">
                    {/* Citas del Día */}
                    {selectedBookings.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                          <Activity className="text-rose-500 h-3.5 w-3.5 shrink-0" />
                          Citas confirmadas ({selectedBookings.length})
                        </p>
                        <div className="flex flex-col gap-3">
                          {selectedBookings.map((b) => (
                            <div
                              key={b.id}
                              className="p-4 bg-white rounded-xl border border-rose-100/60 shadow-sm relative overflow-hidden"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-extrabold text-slate-850 truncate">
                                    {b.patientName}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                                    Cliente: {b.clientName}
                                  </p>
                                </div>
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                                  Confirmado
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                <Clock className="text-teal-500 h-3.5 w-3.5 shrink-0" />
                                <span className="font-semibold">
                                  {formatHour(b.startHour)} - {formatHour(b.endHour)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <MapPin className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                <span>Reserva #{b.serviceId}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Horarios Disponibles */}
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2.5">Horarios disponibles</p>
                      {selectedSlots.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Todos los horarios están reservados</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedSlots.map((h) => (
                            <span
                              key={h}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-100/30"
                            >
                              {formatHour(h)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tabla Resumen del Día */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-450 font-medium">Disponibilidad</span>
                        <span className="font-bold text-slate-700">
                          {formatHour(selectedAvail.startHour)} - {formatHour(selectedAvail.endHour)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs border-t border-slate-100/50 pt-2">
                        <span className="text-slate-450 font-medium">Horas libres</span>
                        <span className="font-bold text-slate-700">{selectedSlots.length}h</span>
                      </div>
                      <div className="flex justify-between text-xs border-t border-slate-100/50 pt-2">
                        <span className="text-slate-450 font-medium">Citas</span>
                        <span className="font-bold text-slate-700">{selectedBookings.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Caja Informativa: Cómo Funciona */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3.5">Cómo funciona</h3>
              <div className="flex flex-col gap-3 text-xs text-slate-400 leading-normal">
                <p className="flex items-start gap-2">
                  <RefreshCw className="text-teal-500 h-4 w-4 shrink-0 mt-0.5" />
                  <span>La disponibilidad semanal recurrente se repite de forma automática.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CalendarDays className="text-teal-500 h-4 w-4 shrink-0 mt-0.5" />
                  <span>Las excepciones (bloqueo/vacaciones) sobrescriben el horario semanal.</span>
                </p>
                <p className="flex items-start gap-2">
                  <Lock className="text-teal-500 h-4 w-4 shrink-0 mt-0.5" />
                  <span>Los horarios de citas confirmadas se bloquean de manera automática.</span>
                </p>
                <p className="flex items-start gap-2">
                  <Eye className="text-teal-500 h-4 w-4 shrink-0 mt-0.5" />
                  <span>Los clientes sólo pueden visualizar tu agenda en un rango de 30 días.</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── MODAL AGREGAR EXCEPCIÓN ─── */}
      {showExceptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowExceptionModal(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Agregar Excepción</h3>

            <div className="flex flex-col gap-4">
              {/* Selector de Fecha */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Fecha</label>
                <input
                  type="date"
                  value={exceptionForm.date}
                  onChange={(e) => setExceptionForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
                />
              </div>

              {/* Botones de Opción de Tipo */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Tipo</label>
                <div className="flex gap-2">
                  {(["block", "extra", "vacation"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setExceptionForm((prev) => ({ ...prev, type: t }))}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                        exceptionForm.type === t
                          ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                          : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"
                      }`}
                    >
                      {t === "block" ? "Bloquear" : t === "extra" ? "Horario extra" : "Vacaciones"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selección de horas Desde/Hasta si es Horario Extra */}
              {exceptionForm.type === "extra" && (
                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-3 duration-200">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Desde</label>
                    <select
                      value={exceptionForm.startHour}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({ ...prev, startHour: Number(e.target.value) }))
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-teal-400 cursor-pointer"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatHour(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Hasta</label>
                    <select
                      value={exceptionForm.endHour}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({ ...prev, endHour: Number(e.target.value) }))
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-teal-400 cursor-pointer"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatHour(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6 border-t border-slate-50 pt-4">
              <button
                type="button"
                onClick={() => setShowExceptionModal(false)}
                className="flex-1 border border-slate-200 text-slate-500 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddException}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs shadow-sm"
              >
                Guardar excepción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICACIONES FLOTANTES (LOCAL) ─── */}
      {toast && toast.show && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded-full shrink-0">
            <Check className="text-white h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold">Éxito</p>
            <p className="text-[11px] text-slate-300 leading-tight mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
