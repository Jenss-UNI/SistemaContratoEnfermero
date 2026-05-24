import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Loader2,
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

  selectedDays: SelectedDay[];
}

export default function BookingSuccessStep({
  nurse,
  selectedService,
  selectedDays
}: Props) {

  const [loadingStep, setLoadingStep] =
    useState(0);

  const [completed, setCompleted] =
    useState(false);

  const loadingTexts = [

    "Validando disponibilidad del profesional...",

    "Procesando preautorización segura...",

    "Confirmando la reserva..."

  ];

  useEffect(() => {

    if (loadingStep < loadingTexts.length) {

      const timer = setTimeout(() => {

        setLoadingStep((prev) => prev + 1);

      }, 1800);

      return () => clearTimeout(timer);

    }

    if (loadingStep === loadingTexts.length) {

      const timer = setTimeout(() => {

        setCompleted(true);

      }, 1200);

      return () => clearTimeout(timer);

    }

  }, [loadingStep]);

  return (

    <div className="py-10">

      {/* LOADING */}
      {!completed && (

        <div className="flex flex-col items-center justify-center text-center">

          {/* SPINNER */}
          <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center">

            <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />

          </div>

          <h2 className="mt-8 text-2xl font-bold text-slate-900">

            Procesando reserva

          </h2>

          <p className="mt-3 text-slate-500 max-w-md leading-7">

            Estamos verificando toda la información
            para asegurar tu contratación.

          </p>

          {/* STEPS */}
          <div className="mt-10 w-full max-w-md space-y-4">

            {loadingTexts.map((text, index) => {

              const active =
                index === loadingStep;

              const done =
                index < loadingStep;

              return (

                <div
                  key={index}
                  className={`
                    flex items-center gap-3
                    rounded-2xl
                    border
                    px-4
                    py-4
                    transition-all

                    ${
                      done
                        ? `
                          border-emerald-200
                          bg-emerald-50
                        `
                        : active
                        ? `
                          border-teal-200
                          bg-teal-50
                        `
                        : `
                          border-slate-200
                          bg-white
                        `
                    }
                  `}
                >

                  {done ? (

                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />

                  ) : active ? (

                    <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />

                  ) : (

                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />

                  )}

                  <span
                    className={`
                      text-sm font-medium

                      ${
                        done
                          ? "text-emerald-700"
                          : active
                          ? "text-teal-700"
                          : "text-slate-400"
                      }
                    `}
                  >

                    {text}

                  </span>

                </div>

              );

            })}

          </div>

        </div>

      )}

      {/* SUCCESS */}
      {completed && (

        <div className="text-center animate-in fade-in zoom-in duration-500">

          {/* ICON */}
          <div className="mx-auto w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/20">

            <CheckCircle2 className="w-16 h-16 text-emerald-500" />

          </div>

          {/* TITLE */}
          <h2 className="mt-8 text-4xl font-bold text-slate-900">

            ¡Reserva Confirmada!

          </h2>

          <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-8">

            Tu solicitud fue enviada correctamente.
            El profesional recibirá la información
            y podrá contactarte pronto.

          </p>

          {/* CARD */}
          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-left max-w-2xl mx-auto">

            <div className="flex items-center gap-4">

              <img
                src={nurse.photo}
                alt={nurse.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />

              <div>

                <h3 className="font-bold text-slate-900 text-lg">

                  {nurse.name}

                </h3>

                <p className="text-slate-500">

                  {selectedService.name}

                </p>

              </div>

            </div>

            {/* DETAILS */}
            <div className="mt-6 space-y-4">

              <div className="flex items-center gap-3 text-slate-600">

                <CalendarDays className="w-5 h-5 text-teal-500" />

                <span>

                  {selectedDays.length} días reservados

                </span>

              </div>

              <div className="flex items-center gap-3 text-slate-600">

                <ShieldCheck className="w-5 h-5 text-emerald-500" />

                <span>

                  Pago protegido en custodia segura

                </span>

              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex gap-4 justify-center">

            <button
              className="
                px-8
                h-14
                rounded-2xl
                bg-teal-500
                hover:bg-teal-600
                text-white
                font-semibold
                transition
              "
            >
              Ver mis reservas
            </button>

            <button
              className="
                px-8
                h-14
                rounded-2xl
                border
                border-slate-200
                hover:bg-slate-50
                font-medium
                transition
              "
            >
              Volver al inicio
            </button>

          </div>

        </div>

      )}

    </div>
  );
}