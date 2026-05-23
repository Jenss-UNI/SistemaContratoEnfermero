import { User } from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";

interface Props {
  nurse: Nurse;
}

export default function NurseAbout({
  nurse
}: Props) {

  return (

    <div className="bg-white rounded-3xl p-8 shadow-sm">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
          <User className="w-5 h-5 text-teal-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Sobre mí
        </h2>

      </div>

      <p className="text-slate-600 leading-8">
        {nurse.about}
      </p>

    </div>
  );
}