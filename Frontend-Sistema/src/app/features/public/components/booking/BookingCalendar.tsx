import { useMemo, useState, useEffect } from "react";
import { Trash2, Info, Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { es } from "react-day-picker/locale/es";
import { fetchNurseAvailabilityData, formatHour } from "../../../private/client/services/hiring.service";

interface Props {
  selectedDays: SelectedDay[];
  setSelectedDays: React.Dispatch<React.SetStateAction<SelectedDay[]>>;
  pricePerHour: number;
  nurseId?: string;
  onContinue: () => void;
  onBack: () => void;
}

interface SelectedDay {
  date: Date;
  start: string;
  end: string;
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

export default function BookingCalendar({
  selectedDays,
  setSelectedDays,
  pricePerHour,
  nurseId,
  onContinue,
  onBack
}: Props) {
  const [slots, setSlots] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error loading availability calendar:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nurseId]);

  const activeSlots = slots.length > 0 ? slots : defaultSlots;
  const enabledDays = activeSlots.filter((s) => s.enabled).map((s) => s.day_of_week);
  const unavailableWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((d) => !enabledDays.includes(d));

  const schedules = activeSlots.reduce((acc: any, s: any) => {
    if (s.enabled) {
      acc[s.day_of_week] = {
        start: formatHour(s.start_hour),
        end: formatHour(s.end_hour),
      };
    }
    return acc;
  }, {});

  /**
   * Devuelve el horario disponible para una fecha dada.
   * Retorna null si el día no tiene disponibilidad (bloqueado o fuera de agenda).
   * Las excepciones siempre sobrescriben la agenda recurrente.
   */
  const getDaySchedule = (date: Date): { start: string; end: string } | null => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateStr = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${dateStr}`;

    const matchExc = exceptions.find(e => e.fecha === formattedDate);
    if (matchExc) {
      // Vacaciones → día completo bloqueado
      if (matchExc.tipo === "vacation") return null;

      // Bloqueo total (sin horas) → día completo bloqueado
      if (matchExc.tipo === "block" &&
          (matchExc.start_hour === null || matchExc.start_hour === undefined)) {
        return null;
      }

      // Bloqueo parcial (con horas) → el horario de la excepción ES el horario disponible
      // (la excepción restringe, pero no elimina el día)
      if (matchExc.tipo === "block" &&
          matchExc.start_hour !== null && matchExc.start_hour !== undefined) {
        return {
          start: formatHour(matchExc.start_hour),
          end:   formatHour(matchExc.end_hour),
        };
      }

      // Horario extra (día normalmente libre pero con disponibilidad especial)
      if (matchExc.tipo === "extra") {
        return {
          start: formatHour(matchExc.start_hour ?? 8),
          end:   formatHour(matchExc.end_hour ?? 18),
        };
      }
    }

    // Sin excepción: usar agenda recurrente; null si el día de semana no está habilitado
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

  // Convierte "8:00 am" / "2:00 pm" a entero de hora (0-23)
  const parseHour = (value: string): number => {
    const [hourStr] = value.split(":");
    let hour = parseInt(hourStr);
    const isPM = value.includes("pm");
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour;
  };

  const getDayFreeSlots = (date: Date): number[] => {
    const daySchedule = getDaySchedule(date);
    if (!daySchedule) return [];

    const startH = parseHour(daySchedule.start);
    const endH = parseHour(daySchedule.end);

    const blockedRanges = getDateBlockedRanges(date);

    const slots: number[] = [];
    for (let h = startH; h < endH; h++) {
      slots.push(h);
    }

    return slots.filter((hour) => {
      return !blockedRanges.some((range) => {
        const rStart = parseHour(range.start);
        const rEnd = parseHour(range.end);
        return hour >= rStart && hour < rEnd;
      });
    });
  };

  const getValidExitHours = (date: Date, startHourStr: string): string[] => {
    const daySchedule = getDaySchedule(date);
    if (!daySchedule) return [];

    const startH = parseHour(startHourStr);
    const endH = parseHour(daySchedule.end);

    const blockedRanges = getDateBlockedRanges(date);

    // Encuentra el límite superior del segmento continuo
    let maxHour = endH;
    for (const range of blockedRanges) {
      const rStart = parseHour(range.start);
      // Si la reserva empieza después de nuestra hora de entrada,
      // el cliente no puede pasar de ahí.
      if (rStart > startH && rStart < maxHour) {
        maxHour = rStart;
      }
    }

    const validExits: string[] = [];
    for (let h = startH + 1; h <= maxHour; h++) {
      validExits.push(formatHour(h));
    }

    return validExits;
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

    // Excepciones tienen prioridad sobre la agenda recurrente
    const matchExc = exceptions.find(e => e.fecha === formattedDate);
    if (matchExc) {
      if (matchExc.tipo === "vacation") return true;
      if (matchExc.tipo === "block" && (matchExc.start_hour === null || matchExc.start_hour === undefined)) {
        return true;
      }
      // Si es extra, se evalúa disponibilidad abajo usando extra como schedule base
    }

    // Si no es extra y el día de semana no está en la agenda recurrente → deshabilitado
    const isExtra = matchExc && matchExc.tipo === "extra";
    if (!isExtra && unavailableWeekDays.includes(date.getDay())) return true;

    const freeSlots = getDayFreeSlots(date);
    return freeSlots.length === 0;
  };

  const getFirstAvailableSegment = (date: Date): { start: string; end: string } | null => {
    const freeSlots = getDayFreeSlots(date);
    if (freeSlots.length === 0) return null;

    // Buscar primer segmento contiguo de al menos 1 hora
    const segStart = freeSlots[0];
    let segEnd = segStart + 1;
    for (let i = 1; i < freeSlots.length; i++) {
      if (freeSlots[i] === freeSlots[i - 1] + 1) {
        segEnd = freeSlots[i] + 1;
      } else {
        break;
      }
    }

    return {
      start: formatHour(segStart),
      end: formatHour(segEnd),
    };
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hours = [
    "6:00 am",
    "7:00 am",
    "8:00 am",
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
    "6:00 pm",
    "7:00 pm",
    "8:00 pm"
  ];

  {/* agregar día */ }

  const [month, setMonth] = useState(new Date());

  {/* actualizar horarios */ }
  const updateTime = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const copy = [...selectedDays];
    copy[index][field] = value;

    if (field === "start") {
      const validExits = getValidExitHours(copy[index].date, value);
      if (validExits.length > 0 && !validExits.includes(copy[index].end)) {
        copy[index].end = validExits[0];
      }
    }

    setSelectedDays(copy);
  };

  {/* eliminar día */ }
  const removeDay = (date: Date) => {
    const key = date.toDateString();

    setSelectedDays((prev) =>
      prev.filter((d) => d.date.toDateString() !== key)
    );
  };

  const calculateHours = (

    start: string,
    end: string

  ) => {

    const startHour =
      parseHour(start);

    const endHour =
      parseHour(end);

    return Math.max(
      endHour - startHour,
      0
    );
  };

  {/* validar horarios */ }
  const validateRange = (
    start: string,
    end: string,
    date: Date
  ) => {
    const startHour = parseHour(start);
    const endHour = parseHour(end);

    if (endHour <= startHour) {
      return {
        valid: false,
        message: "La hora de salida debe ser mayor a la entrada"
      };
    }

    if (endHour - startHour < 1) {
      return {
        valid: false,
        message: "El servicio debe durar mínimo 1 hora"
      };
    }

    // Check collision with blocked intervals (bookings & partial blocks)
    const blockedRanges = getDateBlockedRanges(date);
    for (const range of blockedRanges) {
      const rStart = parseHour(range.start);
      const rEnd = parseHour(range.end);
      if (Math.max(startHour, rStart) < Math.min(endHour, rEnd)) {
        return {
          valid: false,
          message: `El horario choca con un bloque ocupado/reservado (${range.start} - ${range.end})`
        };
      }
    }

    return {
      valid: true,
      message: ""
    };
  };

  const hasErrors = selectedDays.some((item) => {
    return !validateRange(item.start, item.end, item.date).valid;
  });

  const totalHours = useMemo(() => {
    return selectedDays.reduce(
      (acc, item) => {

        return (
          acc +
          calculateHours(
            item.start,
            item.end
          )
        );

      },

      0

    );

  }, [selectedDays]);

  const totalPrice =
    totalHours *
    pricePerHour;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Cargando disponibilidad...</p>
      </div>
    );
  }

  return (

    <div>

      {/* CALENDARIO */}
      <div className="custom-calendar w-full max-w-6xl mx-auto rounded-3xl border border-slate-100 bg-white p-10 shadow-md">

        <div className="mb-5 flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-700">
          <Info className="w-4 h-4" />

          <span>
            Selecciona uno o más días disponibles. Puedes asignar horarios diferentes para cada día.
          </span>
        </div>

        <div className="w-full flex justify-center">
  <div className="w-full max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl overflow-x-auto">

            <DayPicker
  mode="multiple"
  locale={es}
  month={month}
  onMonthChange={setMonth}
  selected={selectedDays.map((d) => d.date)}

  onSelect={(days) => {
    const validDays = days ?? [];

    setSelectedDays((prev) => {
      const map = new Map(prev.map(d => [d.date.toDateString(), d]));

      const newDates = validDays.map(date => date.toDateString());

      // eliminar los quitados
      const filtered = Array.from(map.values()).filter(
        d => newDates.includes(d.date.toDateString())
      );

      // agregar nuevos
      validDays.forEach(date => {
        const key = date.toDateString();

        if (!map.has(key)) {
          const schedule = getFirstAvailableSegment(date);

          if (schedule) {
            filtered.push({
              date,
              start: schedule.start,
              end: schedule.end
            });
          }
        }
      });

      return filtered;
    });
  }}

  disabled={isDisabledDate}

  modifiers={{
    selected: selectedDays.map(d => d.date),
    unavailable: (date) => isDisabledDate(date)
  }}

  classNames={{
    months: "w-full flex justify-center",
    month: "w-full",

    caption_label:
      "text-lg sm:text-xl md:text-2xl font-bold text-slate-900",

    weekdays:
      "grid grid-cols-7 text-center text-xs sm:text-sm font-semibold text-slate-500 mb-2",

    week:
      "grid grid-cols-7 gap-1 sm:gap-2",

    day: "flex justify-center",

    day_button: `
      w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
      rounded-xl flex items-center justify-center
      transition text-sm sm:text-base font-medium
    `,

    // 🔵 seleccionado
    selected: `
      bg-teal-500 text-white rounded-xl shadow-md
      scale-95
    `,

    // 🔴 hoy
    today: `
      border border-teal-500 text-teal-700 bg-teal-50 rounded-xl
    `,

    // ⚫ deshabilitado
    disabled: `
      text-slate-300 bg-slate-100 opacity-60 cursor-not-allowed
    `,

    button_previous:
      "h-10 w-10 rounded-full border flex items-center justify-center hover:bg-teal-50",

    button_next:
      "h-10 w-10 rounded-full border flex items-center justify-center hover:bg-teal-50",
  }}

            />

          </div>
        </div>

      </div>

      {/* HORARIOS */}
      {selectedDays.length > 0 && (

        <div className="mt-8">

          <h3 className="font-bold text-slate-900 mb-5 text-lg">

            {selectedDays.length}
            {" "}
            día seleccionado — Asigna horarios:

          </h3>

          <div className="space-y-5">

            {selectedDays.map((item, index) => {
              const validation = validateRange(item.start, item.end, item.date);
              const blockedRanges = getDateBlockedRanges(item.date);
              const hoursCount = calculateHours(item.start, item.end);
              // getDaySchedule puede retornar null si el día quedó bloqueado,
              // usamos el fallback mínimo para evitar crash en el selector
              const daySchedule = getDaySchedule(item.date) ?? { start: "6:00 am", end: "8:00 pm" };

              return (
                <div
                  key={item.date.toISOString()}
                  className={`
                    rounded-2xl
                    border
                    border-teal-200
                    bg-teal-50/40
                    p-5
                    shadow-sm
                    transition-all
                    ${validation.valid
                      ? `
                          bg-slate-50
                          border-slate-200
                        `
                      : `
                          bg-red-50
                          border-red-200
                        `
                    }
                  `}
                >
                  {/* TOP */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-slate-800">
                        {item.date.toLocaleDateString(
                          "es-PE",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </h4>
                      <div
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${validation.valid
                            ? `
                                bg-teal-100
                                text-teal-700
                              `
                            : `
                                bg-red-100
                                text-red-700
                              `
                          }
                        `}
                      >
                        {hoursCount}h
                      </div>
                    </div>
                    <button
                      onClick={() => removeDay(item.date)}
                      className="
                        w-8
                        h-8
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        hover:bg-red-100
                        hover:text-red-500
                        transition
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {blockedRanges.length > 0 && (
                    <div className="mb-4 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 font-medium">
                      ⚠️ Horarios ocupados este día: {blockedRanges.map(r => `${r.start} - ${r.end} (${r.label})`).join(", ")}
                    </div>
                  )}

                  {/* HORARIOS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* ENTRADA */}
                    <div>

                      <label className="text-sm text-slate-500 mb-2 block">
                        Entrada
                      </label>

                      <select

                        value={item.start}

                        onChange={(e) =>
                          updateTime(
                            index,
                            "start",
                            e.target.value
                          )
                        }

                        className="
                          w-full
                          h-12
                          rounded-xl
                          border
                          border-slate-200
                          px-4
                          bg-white
                          focus:outline-none
                          focus:ring-2
                          focus:ring-teal-500
                        "
                      >

                        {getDayFreeSlots(item.date)
                          .map((h) => formatHour(h))
                          .map((hour) => (
                            <option
                              key={hour}
                              value={hour}
                            >
                              {hour}
                            </option>
                          ))}

                      </select>

                    </div>

                    {/* SALIDA */}
                    <div>

                      <label className="text-sm text-slate-500 mb-2 block">
                        Salida
                      </label>

                      <select

                        value={item.end}

                        onChange={(e) =>
                          updateTime(
                            index,
                            "end",
                            e.target.value
                          )
                        }

                        className={`

                          w-full
                          h-12
                          rounded-xl
                          border
                          px-4
                          bg-white
                          focus:outline-none
                          focus:ring-2

                          ${validation.valid

                            ? `
                                border-slate-200
                                focus:ring-teal-500
                              `

                            : `
                                border-red-300
                                focus:ring-red-400
                              `
                          }
                        `}
                      >

                        {getValidExitHours(item.date, item.start)
                          .map((hour) => (
                            <option
                              key={hour}
                              value={hour}
                            >
                              {hour}
                            </option>
                          ))}

                      </select>

                    </div>

                  </div>

                  {/* ERROR */}
                  {!validation.valid && (

                    <div className="
                      mt-4
                      bg-red-100
                      border
                      border-red-200
                      rounded-2xl
                      px-4
                      py-3
                    ">

                      <p className="
                        text-sm
                        text-red-700
                        font-medium
                      ">

                        ⚠️ {validation.message}

                      </p>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

          {/* RESUMEN */}
          <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5">

            <div className="space-y-3">

              <div className="flex justify-between text-slate-700">

                <span>
                  Total de días:
                </span>

                <span className="font-semibold">

                  {selectedDays.length}
                  {" "}
                  días

                </span>

              </div>

              <div className="flex justify-between text-slate-700">

                <span>
                  Total de horas:
                </span>

                <span className="font-semibold">

                  {totalHours}
                  {" "}
                  horas

                </span>

              </div>

              <div className="flex justify-between text-lg font-bold text-teal-700">

                <span>
                  Estimado:
                </span>

                <span>

                  S/
                  {" "}
                  {totalPrice.toFixed(2)}

                </span>

              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">

            {/* BACK */}
            <button
              onClick={onBack}
              className="
      flex-1
      h-12
      rounded-xl
      border
      border-slate-200
      font-semibold
      hover:bg-slate-50
      transition
      text-sm
    "
            >
              Atrás
            </button>

            {/* CONTINUE */}
            <button

              onClick={onContinue}

              disabled={
                selectedDays.length === 0 ||
                hasErrors
              }

              className={`

      flex-1
      h-12
      rounded-xl
      transition
      text-lg
      font-bold
      text-sm

      ${selectedDays.length > 0 &&
                  !hasErrors

                  ? `
            bg-teal-500
            hover:bg-teal-600
            text-white
          `

                  : `
            bg-slate-200
            text-slate-400
            cursor-not-allowed
          `
                }
    `}
            >

              {hasErrors

                ? "Corrige los horarios"

                : `Continuar (${selectedDays.length} día)`

              }

            </button>

          </div>

        </div>

      )}

    </div>
  );
}