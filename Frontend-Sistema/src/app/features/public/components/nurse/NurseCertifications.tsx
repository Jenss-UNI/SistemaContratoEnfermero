import { BadgeCheck, Medal } from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";

interface Props {
  nurse: Nurse;
}

export default function NurseCertifications({
  nurse
}: Props) {

  if (!nurse.certifications?.length) return null;

  return (

    <div className="bg-white rounded-3xl p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <BadgeCheck className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Certificaciones
        </h2>

      </div>

      <div className="space-y-6">

        {nurse.certifications.map((item) => (

          <div
            key={item.title}
            className="flex gap-4"
          >

            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Medal className="w-5 h-5 text-amber-500" />
            </div>

            <div>

              <h3 className="font-semibold text-slate-800 text-lg">
                {item.title}
              </h3>

              <p className="text-slate-500">
                {item.institution} · {item.year}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}