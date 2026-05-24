import { GraduationCap, BookOpen } from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";


interface Props {
  nurse: Nurse;
}

export default function NurseEducation({
  nurse
}: Props) {

  if (!nurse.education?.length) return null;

  return (

    <div className="bg-white rounded-3xl p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Formación Académica
        </h2>

      </div>

      <div className="space-y-6">

        {nurse.education.map((item) => (

          <div
            key={item.degree}
            className="flex gap-4"
          >

            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-teal-500" />
            </div>

            <div>

              <h3 className="font-semibold text-slate-800 text-lg">
                {item.degree}
              </h3>

              <p className="text-slate-500">
                {item.institution}
              </p>

              <p className="text-teal-500 font-semibold mt-1">
                {item.year}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}