import { useState } from "react";
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { es } from "date-fns/locale";

export default function NurseAvailability() {

  const unavailableWeekDays = [0, 1, 2, 3]; // Domingo a Miercoles no disponible
  const weekDays = [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
  ];
  const schedules = {
    4: { start: "8:00 am", end: "8:00 pm" }, // Jueves
    5: { start: "8:00 am", end: "6:00 pm" }, // Viernes
    6: { start: "12:00 pm", end: "9:00 pm" } // Sábado
  };

  const [selected, setSelected] =
    useState<Date>();

  const selectedSchedule =
    selected
      ? schedules[selected.getDay() as keyof typeof schedules]
      : null;

  const isSelectedAvailable =
    selected &&
    selectedSchedule;

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
          disabled={[
            {
              dayOfWeek: unavailableWeekDays,
            },
            {
              before: new Date(),
            },
          ]}
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

            <Clock className="w-4 h-4" />

            {isSelectedAvailable && selectedSchedule ? (
              <span className="font-medium text-teal-700">
                Disponible de {selectedSchedule.start}
                {" "}a{" "}
                {selectedSchedule.end}
              </span>
            ) : (
              <span className="text-red-500">
                No disponible
              </span>
            )}

          </div>

        </div>

      )}

    </div>
  );
}