import { useState } from "react";
import { CalendarDays, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function NurseAvailability() {

  const unavailableWeekDays = [0, 1, 2, 3]; // Domingo a Miercoles no disponible
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

    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Disponibilidad
        </h2>
      </div>

      <div className="custom-calendar">

        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}

          modifiersClassNames={{
            available: "available-day",
            selected: "selected-day"
          }}

          disabled={[
            {
              dayOfWeek: unavailableWeekDays
            },
            {
              before: new Date()
            }
          ]}

          components={{
            Chevron: ({ orientation }) =>
              orientation === "left"
                ? <ChevronLeft className="w-5 h-5"/>
                : <ChevronRight className="w-5 h-5"/>
          }}
        />

      </div>

      {selected && (

        <div className="mt-6 bg-teal-50 rounded-2xl p-5">

          <h3 className="font-bold text-teal-900 text-lg mb-2">

            {selected.toLocaleDateString("es-PE", {
              weekday: "long",
              day: "numeric",
              month: "long"
            })}

          </h3>

          <div className="flex items-center gap-2">

            <Clock className="w-4 h-4"/>

            {isSelectedAvailable && selectedSchedule ? (
              <span className="text-emerald-600">
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