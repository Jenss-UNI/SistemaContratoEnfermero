import { MapPin } from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";


interface Props {
  nurse: Nurse;
}

export default function NurseZones({
  nurse
}: Props) {

  if (!nurse.districts?.length) return null;

  return (

    <div className="bg-white rounded-3xl p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Zonas de atención
        </h2>

      </div>

      <p className="text-slate-500 mb-5">
        Distritos donde este profesional brinda sus servicios:
      </p>

      <div className="flex flex-wrap gap-3">

        {nurse.districts.map((district) => (

          <div
            key={district}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700"
          >
            <MapPin className="w-4 h-4" />

            <span className="text-sm font-medium">
              {district}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}