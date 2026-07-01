import {
  CalendarDays,
  ShieldCheck,
  Clock
} from "lucide-react";

import type { Nurse } from "../../../../core/models/nurse.model";

import { useEffect, useState } from "react";

interface Props {
  nurse: Nurse;
  onBook: () => void;
}

export default function NursePriceCard({
  nurse,
  onBook
}: Props) {

  const [activeService, setActiveService] =
    useState(0);

  // autoplay
  useEffect(() => {

    if (nurse.serviceType.length <= 1) return;

    const interval = setInterval(() => {

      setActiveService((prev) =>
        prev === nurse.serviceType.length - 1
          ? 0
          : prev + 1
      );

    }, 2500);

    return () => clearInterval(interval);

  }, [nurse.serviceType]);

  const currentService =
    nurse.serviceType[activeService];

  const getBadgeStyle = (serviceName: string) => {

    switch (serviceName) {

      case "Especializado":
        return {
          bg: "bg-teal-100",
          text: "text-teal-700"
        };

      case "Técnico":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700"
        };

      case "Acompañamiento":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700"
        };

      case "Asistencial":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700"
        };

      default:
        return {
          bg: "bg-slate-100",
          text: "text-slate-700"
        };
    }
  };

  const badgeStyle =
    getBadgeStyle(currentService.name);

  return (

    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-28">

      {/* SERVICE HEADER */}
      <div className="flex items-center justify-between mb-4">

        {nurse.serviceType.length > 1 ? (

          <button
            onClick={() =>
              setActiveService((prev) =>
                prev === 0
                  ? nurse.serviceType.length - 1
                  : prev - 1
              )
            }
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
          >
            ‹
          </button>

        ) : (
          <div className="w-10" />
        )}

        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold
          ${badgeStyle.bg}
          ${badgeStyle.text}`}
        >
          {currentService.name}
        </span>

        {nurse.serviceType.length > 1 ? (

          <button
            onClick={() =>
              setActiveService((prev) =>
                prev === nurse.serviceType.length - 1
                  ? 0
                  : prev + 1
              )
            }
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
          >
            ›
          </button>

        ) : (
          <div className="w-10" />
        )}

      </div>

      {/* PRECIO */}
      <div className="pb-6 border-b border-slate-100 text-center">

        <div className="flex items-end justify-center gap-2">

          <span className="text-5xl font-bold text-slate-900">
            S/ {currentService.price}
          </span>

          <span className="text-slate-400 mb-1">
            /hora
          </span>

        </div>

        <p className="text-sm text-slate-500 mt-2">
          Precio promedio por atención domiciliaria
        </p>

        {/* DOTS */}
        {nurse.serviceType.length > 1 && (

          <div className="flex justify-center gap-2 mt-4">

            {nurse.serviceType.map((_, index) => (

              <button
                key={index}
                onClick={() =>
                  setActiveService(index)
                }
                className={`h-2 rounded-full transition-all duration-300

                ${
                  activeService === index
                    ? "bg-teal-500 w-6"
                    : "bg-slate-300 w-2"
                }
                `}
              />

            ))}

          </div>

        )}

      </div>

      {/* FEATURES */}
      <div className="py-6 space-y-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
          </div>

          <div>
            <p className="font-medium text-slate-800">
              Profesional verificado
            </p>

            <p className="text-sm text-slate-500">
              Identidad y experiencia comprobadas
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-cyan-600" />
          </div>

          <div>
            <p className="font-medium text-slate-800">
              Respuesta rápida
            </p>

            <p className="text-sm text-slate-500">
              Confirmación en pocos minutos
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
          </div>

          <div>
            <p className="font-medium text-slate-800">
              Disponibilidad flexible
            </p>

            <p className="text-sm text-slate-500">
              Agenda personalizada según necesidad
            </p>
          </div>

        </div>

      </div>

      {/* BOTÓN */}
      <button
        onClick={onBook}
        className="
          w-full
          py-4
          rounded-2xl
          bg-teal-500
          hover:bg-teal-600
          active:scale-[0.98]
          transition-all
          text-white
          font-semibold
          shadow-lg
          shadow-teal-500/20
        "
      >
        Contratar Ahora
      </button>

      {/* EXTRA */}
      <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Experiencia
          </span>

          <span className="font-semibold text-slate-800">
            {nurse.experience} años
          </span>

        </div>

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Servicios realizados
          </span>

          <span className="font-semibold text-slate-800">
            {nurse.completedServices}
          </span>

        </div>

        <div className="flex items-center justify-between text-sm">

          <span className="text-slate-500">
            Calificación
          </span>

          <span className="font-semibold text-yellow-500">
            ⭐ {(nurse.rating || 0).toFixed(1)}
          </span>

        </div>

      </div>

    </div>
  );
}