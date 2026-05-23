import {
  Star,
  MapPin,
  Briefcase,
  CheckCircle
} from "lucide-react";

import type { Nurse } from "../../../../core/models/nurse.model";

interface Props {
  nurse: Nurse;
  onBook: () => void;
}

export default function NurseProfileHero({
  nurse,
  onBook
}: Props) {

  return (

    <div className="bg-white rounded-3xl overflow-hidden shadow-sm">

      {/* COVER */}
      <div className="h-44 bg-gradient-to-r from-teal-400 to-cyan-300" />

      <div className="px-8 pb-8 relative">

        {/* PHOTO */}
        <div className="absolute -top-16">

          <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white">

            {nurse.photo ? (
              <img
                src={nurse.photo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-100" />
            )}

          </div>

        </div>

        {/* CONTENT */}
        <div className="pt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              {nurse.name}
            </h1>

            <p className="text-teal-600 font-medium mt-1">
              {nurse.title}
            </p>

            <div className="flex flex-wrap gap-6 mt-5 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{nurse.rating}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{nurse.district}</span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{nurse.experience} años</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>
                  {nurse.completedServices} servicios
                </span>
              </div>

            </div>

            <div className="flex flex-wrap gap-2 mt-4">

              {nurse.serviceType.map((service, index) => {

                const styles = {
                  Especializado:
                    "bg-teal-50 text-teal-700 border-teal-200",

                  Técnico:
                    "bg-blue-50 text-blue-700 border-blue-200",

                  Acompañamiento:
                    "bg-amber-50 text-amber-700 border-amber-200",

                  Asistencial:
                    "bg-emerald-50 text-emerald-700 border-emerald-200"
                };

                return (
                  <span
                    key={index}
                    className={`
          px-4 py-2 rounded-full text-sm border font-medium
          ${styles[service.name as keyof typeof styles]}
        `}
                  >
                    {service.name}
                  </span>
                );
              })}

              <span
    className="
      px-4 py-2 rounded-full text-sm border
      bg-teal-50 text-teal-700 border-teal-200
      font-medium
    "
  >
    ✓ Verificado
  </span>

</div>

          </div>

          <button
            onClick={onBook}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-600 transition rounded-2xl text-white font-semibold"
          >
            Contratar Ahora
          </button>

        </div>

      </div>

    </div>
  );
}