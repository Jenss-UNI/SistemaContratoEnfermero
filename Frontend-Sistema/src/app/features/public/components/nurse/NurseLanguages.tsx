import { Languages } from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";

interface Props {
  nurse: Nurse;
}

export default function NurseLanguages({
  nurse
}: Props) {

  if (!nurse.languages?.length) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">

      <div className="flex items-center gap-3 mb-6">

        <Languages className="w-5 h-5 text-teal-500" />

        <h2 className="text-2xl font-bold">
          Idiomas
        </h2>

      </div>

      <div className="flex flex-wrap gap-3">

        {nurse.languages.map((lang) => (

          <div
            key={lang}
            className="
              px-4 py-2
              rounded-2xl
              bg-slate-100
              text-slate-700
              text-sm
              font-medium
            "
          >
            {lang}
          </div>

        ))}

      </div>

    </div>
  );
}