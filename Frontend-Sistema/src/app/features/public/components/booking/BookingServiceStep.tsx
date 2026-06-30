import {
  HeartPulse,
  Stethoscope,
  Users
} from "lucide-react";

import type { Nurse } from "../../../../core/models/nurse.model";

interface Props {
  nurse: Nurse;

  selectedService: {
    name: string;
    price: number;
  } | null;

  setSelectedService: React.Dispatch<
    React.SetStateAction<{
      name: string;
      price: number;
    } | null>
  >;

  onBack: () => void;
  onNext: () => void;
}

export default function BookingServiceStep({
  nurse,
  selectedService,
  setSelectedService,
  onBack,
  onNext
}: Props) {

  const isValid =
    selectedService !== null;

  const getIcon = (name: string) => {

    if (
      name.toLowerCase().includes("especializado")
    ) {
      return (
        <Stethoscope className="w-6 h-6 text-teal-600" />
      );
    }

    if (
      name.toLowerCase().includes("asistencial")
    ) {
      return (
        <HeartPulse className="w-6 h-6 text-emerald-600" />
      );
    }

    return (
      <Users className="w-6 h-6 text-amber-600" />
    );
  };

  const getDescription = (name: string) => {

    if (
      name.toLowerCase().includes("especializado")
    ) {
      return `
        Cuidados avanzados post-operatorios,
        manejo de equipos médicos,
        sondas, catéteres y atención clínica especializada.
      `;
    }

    if (
      name.toLowerCase().includes("asistencial")
    ) {
      return `
        Control de signos vitales,
        administración de medicamentos,
        curaciones y apoyo diario básico.
      `;
    }

    return `
      Compañía constante,
      apoyo emocional y asistencia
      en actividades diarias del paciente.
    `;
  };

  return (

    <div>

      {/* HEADER */}
      <div className="mb-8">

        <h3 className="text-xl md:text-2xl font-bold text-slate-900">
          Selecciona el tipo de servicio
        </h3>

        <p className="text-slate-500 mt-2 text-sm md:text-base">
          El precio varía según
          la complejidad del cuidado.
        </p>

      </div>

      {/* SERVICES */}
      <div className="space-y-4">

        {nurse.serviceType.map((service) => {

          const active =
            selectedService?.name === service.name;

          return (

            <button
              key={service.name}
              onClick={() =>
                setSelectedService(service)
              }
              className={`
                w-full
                text-left
                rounded-3xl
                border
                p-4 md:p-6
                transition-all

                ${
                  active
                    ? `
                      border-teal-500
                      bg-teal-50
                      shadow-lg
                      shadow-teal-500/10
                    `
                    : `
                      border-slate-200
                      hover:border-slate-300
                      bg-white
                    `
                }
              `}
            >

              <div className="flex flex-col lg:flex-row lg:justify-between gap-6">

                {/* LEFT */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1 min-w-0">

                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">

                    {getIcon(service.name)}

                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-3 flex-wrap">

                      <h4 className="text-base md:text-lg font-bold text-slate-900 break-words">
                        {service.name}
                      </h4>

                      <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        {service.name}
                      </div>

                    </div>

                    <p className="text-sm md:text-base text-slate-500 mt-3 leading-6 md:leading-7">
                      {getDescription(service.name)}
                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="text-center lg:text-right shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">

                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
                    S/ {service.price}
                  </p>

                  <p className="text-slate-400 mt-1 text-sm md:text-base">
                    por hora
                  </p>

                </div>

              </div>

            </button>
          );
        })}

      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">

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
          disabled={!isValid}
          className={`
            flex-1
            py-4
            rounded-2xl
            font-semibold
            transition-all

            ${
              isValid
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
          Continuar
        </button>

      </div>

    </div>
  );
}