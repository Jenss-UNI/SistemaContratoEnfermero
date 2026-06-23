import {
  ShieldCheck,
  CalendarDays
} from "lucide-react";

import type { Nurse } from "../../../../core/models/nurse.model";

interface SelectedDay {
  date: Date;
  start: string;
  end: string;
}

interface Props {

  nurse: Nurse;

  selectedService: {
    name: string;
    price: number;
  };

  selectedPatient: string;

  selectedDays: SelectedDay[];

  onBack: () => void;

  onNext: () => void;
}

export default function BookingSummaryStep({
  nurse,
  selectedService,
  selectedDays,
  selectedPatient,
  onBack,
  onNext
}: Props) {

  const patients = [
    {
      id: "1",
      name: "Elena Rodríguez",
      age: 78,
      relation: "Madre",
      address: "Av. Larco 1234, Dpto 502, Miraflores"
    },
    {
      id: "2",
      name: "Mateo Rodríguez",
      age: 6,
      relation: "Hijo",
      address: "Av. Larco 1234, Dpto 502, Miraflores"
    }
  ];

  const patient = patients.find(p => p.id === selectedPatient);



  const parseHour = (value: string) => {

    const [hourStr] = value.split(":");

    let hour = parseInt(hourStr);

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

  const totalHours =
    selectedDays.reduce((acc, item) => {

      return (
        acc +
        (
          parseHour(item.end) -
          parseHour(item.start)
        )
      );

    }, 0);

  const subtotal =
    totalHours *
    selectedService.price;

  return (

    <div>

      {/* CARD */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">

        <h3 className="text-2xl font-bold text-slate-900 mb-8">

          Resumen del Servicio

        </h3>

        {/* INFO */}
        <div className="space-y-5">

          {/* ENFERMERO */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Enfermero
            </span>

            <span className="font-semibold text-slate-900">
              {nurse.name}
            </span>
          </div>

          {/* PACIENTE */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Paciente</span>
            <span className="font-semibold text-slate-900">
              {patient?.name}
            </span>
          </div>

          {/* DIRECCIÓN */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Dirección</span>
            <span className="font-semibold text-slate-900">
              {patient?.address}
            </span>
          </div>

          {/* SERVICIO */}
          <div className="flex items-center justify-between">

            <span className="text-slate-500">
              Servicio
            </span>

            <span className="font-semibold text-slate-900">

              {selectedService.name}

            </span>

          </div>

          {/* DÍAS */}
          <div className="flex items-center justify-between">

            <span className="text-slate-500">
              Días seleccionados
            </span>

            <span className="font-semibold text-slate-900">

              {selectedDays.length} días

            </span>

          </div>

          {/* HORAS */}
          <div className="flex items-center justify-between">

            <span className="text-slate-500">
              Total de horas
            </span>

            <span className="font-semibold text-slate-900">

              {totalHours}h

            </span>

          </div>

        </div>

        {/* DETAIL */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5">

          <div className="flex items-center gap-2 text-slate-700 font-medium mb-4">

            <CalendarDays className="w-5 h-5 text-teal-500" />

            <span>
              Detalle por día:
            </span>

          </div>

          <div className="space-y-4">

            {selectedDays.map((item, index) => {

              const hours =
                parseHour(item.end) -
                parseHour(item.start);

              return (

                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >

                  <div>

                    <p className="font-medium text-slate-800">

                      {item.date.toLocaleDateString(
                        "es-PE",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short"
                        }
                      )}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-medium text-slate-900">

                      {item.start}
                      {" - "}
                      {item.end}

                    </p>

                    <p className="text-slate-400">

                      ({hours}h)

                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        {/* TOTALS */}
        <div className="mt-8 border-t pt-6 space-y-4">

          <div className="flex items-center justify-between">

            <span className="text-slate-500">

              Subtotal
              {" "}
              ({totalHours}h × S/ {selectedService.price})

            </span>

            <span className="text-lg font-semibold text-slate-900">

              S/ {subtotal.toFixed(2)}

            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-xl font-bold text-slate-900">

              Total a pagar

            </span>

            <span className="text-3xl font-bold text-teal-600">

              S/ {subtotal.toFixed(2)}

            </span>

          </div>

        </div>

      </div>

      {/* SECURITY */}
      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5">

        <div className="flex items-start gap-3">

          <ShieldCheck className="w-5 h-5 text-amber-500 mt-0.5" />

          <p className="text-sm text-amber-700 leading-7">

            El pago queda en
            {" "}
            <span className="font-semibold">
              custodia segura
            </span>.
            {" "}
            El enfermero recibe el pago
            solo al completar el servicio.

          </p>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-8">

        <button
          onClick={onBack}
          className="
            flex-1
            py-4
            rounded-2xl
            border
            border-slate-200
            font-medium
            hover:bg-slate-50
            transition
          "
        >
          Atrás
        </button>

        <button
          onClick={onNext}
          className="
            flex-1
            py-4
            rounded-2xl
            bg-teal-500
            hover:bg-teal-600
            text-white
            font-semibold
            transition
          "
        >

          Continuar al pago

        </button>

      </div>

    </div>
  );
}