import { Check } from "lucide-react";

interface ProgressTrackerProps {
  currentStep: number;
  isPro?: boolean; 
}

const CLIENT_STEPS = [
  { id: 1, label: "Datos Personales" },
  { id: 2, label: "Verificar Correo" },
  { id: 3, label: "Verificación DNI" },
  { id: 4, label: "Seleccionar Plan" },
  { id: 5, label: "Pago y Activación" },
];

const PRO_STEPS = [
  { id: 1, label: "Datos Personales" },
  { id: 2, label: "Verificar Correo" },
  { id: 3, label: "Verificación DNI" },
  { id: 4, label: "Confirmación" },
];

export default function ProgressTracker({ currentStep, isPro = false }: ProgressTrackerProps) {
  const stepsToUse = isPro ? PRO_STEPS : CLIENT_STEPS;

  return (
    <div className="flex items-start w-full">
      {stepsToUse.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive    = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={[
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0",
                  isCompleted
                    ? "bg-teal-500 text-white"
                    : isActive
                    ? "bg-teal-500 text-white ring-4 ring-teal-100"
                    : "bg-white border-2 border-slate-200 text-slate-400",
                ].join(" ")}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={[
                  "text-[10px] font-semibold mt-1.5 text-center leading-tight w-[64px]",
                  isActive ? "text-teal-600" : isCompleted ? "text-teal-500" : "text-slate-400",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {index < stepsToUse.length - 1 && (
              <div className="flex-1 flex items-center justify-center mt-4 mx-0.5">
                <span className="text-slate-300 text-sm tracking-widest select-none">–</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}