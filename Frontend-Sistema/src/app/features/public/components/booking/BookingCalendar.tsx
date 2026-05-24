import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface Props {
  selectedDays: SelectedDay[];
  setSelectedDays: React.Dispatch<React.SetStateAction<SelectedDay[]>>;
  pricePerHour: number;
  onContinue: () => void;
  onBack: () => void;
}

interface SelectedDay {
  date: Date;
  start: string;
  end: string;
}

export default function BookingCalendar({
  selectedDays,
  setSelectedDays,
  pricePerHour,
  onContinue,
  onBack
}: Props) {

  const unavailableWeekDays = [0, 1, 2, 3];

  const schedules = {
    4: {
      start: "8:00 am",
      end: "8:00 pm"
    },

    5: {
      start: "8:00 am",
      end: "6:00 pm"
    },

    6: {
      start: "12:00 pm",
      end: "9:00 pm"
    }

  };

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const parseHour = (
    value: string
  ) => {

    const [hourStr] =
      value.split(":");

    let hour =
      parseInt(hourStr);

    const isPM =
      value.includes("pm");

    if (
      isPM &&
      hour !== 12
    ) {
      hour += 12;
    }

    if (
      !isPM &&
      hour === 12
    ) {
      hour = 0;
    }

    return hour;
  };

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

  {/* agregar día */}
  const handleSelect = (
    date?: Date
  ) => {

    if (!date) return;

    const exists =
      selectedDays.find(
        (d) =>
          d.date.toDateString() ===
          date.toDateString()
      );

    if (exists) return;

    const daySchedule =
      schedules[
        date.getDay() as keyof typeof schedules
      ];

    if (!daySchedule) return;

    setSelectedDays([

      ...selectedDays,

      {
        date,
        start: daySchedule.start,
        end: daySchedule.end
      }

    ]);
  };

  {/* actualizar horarios */}
  const updateTime = (

    index: number,

    field: "start" | "end",

    value: string

  ) => {

    const copy = [...selectedDays];

    copy[index][field] =
      value;

    setSelectedDays(copy);
  };

  {/* eliminar día */}
  const removeDay = (
    index: number
  ) => {

    setSelectedDays(

      selectedDays.filter(
        (_, i) => i !== index
      )

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

  {/* validar horarios */}
  const validateRange = (

    start: string,
    end: string

  ) => {

    const startHour =
      parseHour(start);

    const endHour =
      parseHour(end);

    if (
      endHour <= startHour
    ) {

      return {
        valid: false,
        message:
          "La hora de salida debe ser mayor a la entrada"

      };
    }

    if (
      endHour - startHour < 1
    ) {

      return {
        valid: false,
        message:
          "El servicio debe durar mínimo 1 hora"

      };
    }

    return {
      valid: true,
      message: ""

    };
  };

  const hasErrors =
    selectedDays.some((item) => {

      return !validateRange(
        item.start,
        item.end
      ).valid;

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

  return (

    <div>

      {/* CALENDARIO */}
      <div className="custom-calendar border border-slate-100 rounded-3xl p-6">

        <div className="flex justify-center">

          <DayPicker

            mode="multiple"

            selected={
              selectedDays.map(
                d => d.date
              )
            }

            modifiers={{

              available: {
                dayOfWeek: [4, 5, 6]
              }

            }}

            modifiersClassNames={{

              available:
                "available-day",

              selected:
                "selected-day"

            }}

            onSelect={(dates) => {

              if (!dates) return;

              const last =
                dates[dates.length - 1];

              handleSelect(last);

            }}

            disabled={[

              {
                dayOfWeek:
                  unavailableWeekDays
              },

              {
                before: today
              }

            ]}
          />

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

              const validation =
                validateRange(
                  item.start,
                  item.end
                );

              const hoursCount =
                calculateHours(
                  item.start,
                  item.end
                );

              const daySchedule =
                schedules[
                  item.date.getDay() as keyof typeof schedules
                ];

              return (

                <div

                  key={index}

                  className={`

                    rounded-3xl
                    p-5
                    border

                    ${
                      validation.valid

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

                          ${
                            validation.valid

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

                      onClick={() =>
                        removeDay(index)
                      }

                      className="
                        text-slate-400
                        hover:text-red-500
                        transition
                      "
                    >

                      <Trash2 className="w-4 h-4" />

                    </button>

                  </div>

                  {/* HORARIOS */}
                  <div className="grid grid-cols-2 gap-4">

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
                          h-14
                          rounded-2xl
                          border
                          border-slate-200
                          px-4
                          bg-white
                          focus:outline-none
                          focus:ring-2
                          focus:ring-teal-500
                        "
                      >

                        {hours

                          .filter((hour) => {

                            return (

                              parseHour(hour) >=
                                parseHour(daySchedule.start)

                              &&

                              parseHour(hour) <
                                parseHour(daySchedule.end)

                            );

                          })

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
                          h-14
                          rounded-2xl
                          border
                          px-4
                          bg-white
                          focus:outline-none
                          focus:ring-2

                          ${
                            validation.valid

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

                        {hours

                          .filter((hour) => {

                            return (

                              parseHour(hour) >
                                parseHour(item.start)

                              &&

                              parseHour(hour) <=
                                parseHour(daySchedule.end)

                            );

                          })

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
          <div className="mt-6 bg-teal-50 rounded-3xl p-6">

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
          <div className="flex gap-4 mt-6">

            {/* BACK */}
            <button
              onClick={onBack}
              className="
      flex-1
      h-14
      rounded-2xl
      border
      border-slate-200
      font-semibold
      hover:bg-slate-50
      transition
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
      h-14
      rounded-2xl
      transition
      text-lg
      font-bold

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