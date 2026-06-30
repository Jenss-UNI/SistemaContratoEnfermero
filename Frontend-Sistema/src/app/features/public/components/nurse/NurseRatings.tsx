import {BarChart3, Clock3, Heart, Brain } from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";


interface Props {
  nurse: Nurse;
}

export default function NurseDetailedRatings({
  nurse
}: Props) {

  const ratings = [
    {
      label: "Puntualidad",
      value: nurse.punctuality,
      icon: Clock3
    },
    {
      label: "Trato al Paciente",
      value: nurse.treatment,
      icon: Heart
    },
    {
      label: "Conocimiento Técnico",
      value: nurse.technical,
      icon: Brain
    }
  ];

  return (

    <div className="bg-white rounded-3xl p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Calificaciones Detalladas
        </h2>

      </div>

      <div className="space-y-6">

        {ratings.map((rating) => {

          const Icon = rating.icon;

          return (

            <div
              key={rating.label}
              className="flex items-center gap-5"
            >

              <div className="w-44 flex items-center gap-3 text-slate-600">

                <Icon className="w-4 h-4 text-teal-500" />

                <span className="text-sm">
                  {rating.label}
                </span>

              </div>

              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">

                <div
                  className="h-full rounded-full bg-teal-500"
                  style={{
                    width: `${(rating.value / 5) * 100}%`
                  }}
                />

              </div>

              <span className="font-bold text-slate-900">
                {rating.value.toFixed(1)}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}