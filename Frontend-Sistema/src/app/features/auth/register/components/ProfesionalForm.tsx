import { Stethoscope } from "lucide-react";

export default function ProfesionalForm() {
  return (
    <div className="py-14 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex justify-center mb-4">
        <div className="bg-teal-100 p-4 rounded-full text-teal-600">
          <Stethoscope size={32} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800">Registro de Profesionales</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
      </p>
    </div>
  );
}