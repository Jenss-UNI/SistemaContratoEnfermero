import { useEffect, useState } from "react";
import { CalendarDays, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { es } from "date-fns/locale";
import { fetchNurseAvailabilityData, formatHour, parseHour } from "../../../private/client/services/hiring.service";

interface Props {
  nurseId?: string;
}

const defaultSlots = [
  { day_of_week: 0, start_hour: 8, end_hour: 14, enabled: false },
  { day_of_week: 1, start_hour: 7, end_hour: 15, enabled: true },
  { day_of_week: 2, start_hour: 7, end_hour: 15, enabled: true },
  { day_of_week: 3, start_hour: 7, end_hour: 15, enabled: true },
  { day_of_week: 4, start_hour: 7, end_hour: 15, enabled: true },
  { day_of_week: 5, start_hour: 7, end_hour: 15, enabled: true },
  { day_of_week: 6, start_hour: 8, end_hour: 13, enabled: true },
];

export default function NurseAvailability({ nurseId }: Props) {
  const [slots, setSlots] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Date>();

  useEffect(() => {
    if (!nurseId) {
      setLoading(false);
      return;
    }
    fetchNurseAvailabilityData(nurseId)
      .then((data) => {
        setSlots(data.slots || []);
        setExceptions(data.exceptions || []);
        setBookings(data.bookings || []);
      })
      .catch((err) => {
        console.error("Error fetching availability:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nurseId]);

  const activeSlots = slots.length > 0 ? slots : defaultSlots;
  const enabledDays = activeSlots.filter(s => s.enabled).map(s => s.day_of_week);
  const unavailableWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(d => !enabledDays.includes(d));

  const weekDays = [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
  ];

  const schedules = activeSlots.reduce((acc: any, s: any) => {
    if (s.enabled) {
      acc[s.day_of_week] = {
        start: formatHour(s.start_hour),
        end: formatHour(s.end_hour)
      };
    }
    return acc;
  }, {});

  const getSelectedSchedule = () => {
    if (!selected) return null;
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, "0");
    const dateStr = String(selected.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dateStr}`;

    const matchExc = exceptions.find(e => e.fecha === formattedDate);
    if (matchExc) {
      if (matchExc.tipo === "vacation") {
        return null;
      }
      if (matchExc.tipo === "block") {
        if (matchExc.start_hour === null || matchExc.start_hour === undefined) {
          return null;
        }
        return {
          start: `Excepto: ${formatHour(matchExc.start_hour)}`,
          end: formatHour(matchExc.end_hour)
        };
      }
      if (matchExc.tipo === "extra") {
        return {
          start: formatHour(matchExc.start_hour ?? 8),
          end: formatHour(matchExc.end_hour ?? 18)
        };
      }
    }
    return schedules[selected.getDay()] || null;
  };

  const selectedSchedule = getSelectedSchedule();
  const isSelectedAvailable = selectedSchedule !== null;

  const getDateBookings = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateStr = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dateStr}`;
    return bookings.filter((b) => b.fecha === formattedDate);
  };

  const getDaySchedule = (date: Date): { start: string; end: string } | null => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateStr = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dateStr}`;

    const matchExc = exceptions.find(e => e.fecha === formattedDate);
    if (matchExc) {
      if (matchExc.tipo === "vacation") return null;

      if (matchExc.tipo === "block" && (matchExc.start_hour === null || matchExc.start_hour === undefined)) {
        return null;
      }

      if (matchExc.tipo === "block" && matchExc.start_hour !== null && matchExc.start_hour !== undefined) {
        return {
          start: formatHour(matchExc.start_hour),
          end: formatHour(matchExc.end_hour),
        };
      }

      if (matchExc.tipo === "extra") {
        return {
          start: formatHour(matchExc.start_hour ?? 8),
          end: formatHour(matchExc.end_hour ?? 18),
        };
      }
    }

    return schedules[date.getDay()] || null;
  };

  const getDateBlockedRanges = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateStr = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dateStr}`;

    const ranges: { start: string; end: string; label: string }[] = [];

    const dateBookings = bookings.filter((b) => b.fecha === formattedDate);
    dateBookings.forEach((b) => {
      ranges.push({ start: b.start, end: b.end, label: "Reserva" });
    });

    const matchExc = exceptions.find(e => e.fecha === formattedDate);
    if (matchExc && matchExc.tipo === "block" && matchExc.start_hour !== null && matchExc.start_hour !== undefined) {
      ranges.push({
        start: formatHour(matchExc.start_hour),
        end: formatHour(matchExc.end_hour),
        label: "Bloqueo agenda"
      });
    }

    return ranges;
  };

  const isDisabledDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Limit to next 30 days
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    maxDate.setHours(0, 0, 0, 0);
    if (date > maxDate) return true;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateStr = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dateStr}`;

    // Excepciones tienen prioridad sobre agenda recurrente
    const matchExc = exceptions.find(e => e.fecha === formattedDate);
    if (matchExc) {
      if (matchExc.tipo === "vacation") return true;
      if (matchExc.tipo === "block" && (matchExc.start_hour === null || matchExc.start_hour === undefined)) {
        return true;
      }
      // Si es extra, se evalúa disponibilidad abajo usando extra como schedule base
    }

    // Si no es extra y el día de semana no está habilitado en la agenda recurrente → deshabilitado
    const isExtra = matchExc && matchExc.tipo === "extra";
    if (!isExtra && unavailableWeekDays.includes(date.getDay())) return true;

    const daySchedule = getDaySchedule(date);
    if (!daySchedule) return true;

    const startH = parseHour(daySchedule.start);
    const endH = parseHour(daySchedule.end);
    if (endH - startH <= 0) return true;

    // Obtener reservas y bloqueos de agenda
    const blockedRanges = getDateBlockedRanges(date);

    // Generar horas de disponibilidad
    const slots: number[] = [];
    for (let h = startH; h < endH; h++) {
      slots.push(h);
    }

    const todayVal = new Date();
    const isToday =
      date.getDate() === todayVal.getDate() &&
      date.getMonth() === todayVal.getMonth() &&
      date.getFullYear() === todayVal.getFullYear();
    const currentHour = todayVal.getHours();

    // Filtrar slots ocupados y horas pasadas
    const freeSlots = slots.filter((hour) => {
      if (isToday && hour <= currentHour) {
        return false;
      }
      return !blockedRanges.some((range) => {
        const rStart = parseHour(range.start);
        const rEnd = parseHour(range.end);
        return hour >= rStart && hour < rEnd;
      });
    });

    return freeSlots.length === 0;
  };


  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (

    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm w-full overflow-hidden">

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-lg font-bold text-slate-900">
          Disponibilidad
        </h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {weekDays.map((day, index) => {
          const available = !unavailableWeekDays.includes(index);

          return (
            <span
              key={day}
              className={`px-3 py-1 rounded-full text-xs font-medium
        ${available
                  ? "bg-teal-50 text-teal-600"
                  : "bg-slate-100 text-slate-400"
                }`}
            >
              {day}
            </span>
          );
        })}
      </div>

      <div className="custom-calendar w-full overflow-x-auto">

        <DayPicker
          locale={es}
          mode="single"
          selected={selected}
          onSelect={setSelected}
          disabled={isDisabledDate}
          className="w-full"
          classNames={{
            months: "w-full",

            month: "w-full",

            month_grid: "w-full border-collapse",

            month_caption:
              "relative flex items-center justify-center mb-5",

            caption_label:
              "text-lg font-bold text-slate-900",

            nav:
              "flex justify-between items-center",

            button_previous:
              "h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50",

            button_next:
              "h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50",

            weekdays:
              "grid grid-cols-7 text-center mb-2",

            weekday:
              "py-2 text-xs sm:text-sm font-semibold text-slate-500",

            week:
              "grid grid-cols-7",

            day:
              "aspect-square w-full",

            day_button:
              "w-full h-full flex items-center justify-center rounded-xl text-xs sm:text-sm md:text-base hover:bg-teal-50 transition",

            selected:
              "bg-teal-500 text-white hover:bg-teal-600",

            today:
              "border-2 border-teal-500 text-teal-700",

            disabled:
              "text-slate-300 opacity-100",
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ),
          }}
        />

      </div>

      {selected && (

        <div className="mt-6 rounded-2xl bg-teal-50 p-4">

          <h3 className="font-bold text-teal-900 text-lg mb-2">

            {selected.toLocaleDateString("es-PE", {
              weekday: "long",
              day: "numeric",
              month: "long"
            })}

          </h3>

          <div className="flex items-center gap-2">

            <Clock className="w-4 h-4 text-teal-600" />

            {isSelectedAvailable && selectedSchedule ? (
              <span className="font-medium text-teal-700">
                Disponible de {selectedSchedule.start}
                {" "}a{" "}
                {selectedSchedule.end}
              </span>
            ) : (
              <span className="text-red-500 font-medium">
                No disponible
              </span>
            )}

          </div>

          {isSelectedAvailable && selectedSchedule && (() => {
            const dateBookings = getDateBookings(selected);
            return dateBookings.length > 0 ? (
              <div className="mt-3 border-t border-teal-100 pt-2">
                <p className="text-xs text-amber-700 font-semibold mb-1">Horarios ya reservados este día:</p>
                <div className="flex flex-wrap gap-1.5">
                  {dateBookings.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-medium">
                      {b.start} - {b.end}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

        </div>

      )}

    </div>
  );
}