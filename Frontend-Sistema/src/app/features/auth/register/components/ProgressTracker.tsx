import { CheckCircle2 } from "lucide-react";
import type { ProgressTrackerProps } from "./register-ui.types";

const STEPS_CONFIG = [
    { id: 1, label: 'Datos' },
    { id: 2, label: 'Correo' },
    { id: 3, label: 'DNI' },
    { id: 4, label: 'Final' }
];

export default function ProgressTracker({ currentStep }: ProgressTrackerProps) {
    return (
        <div className="flex justify-between items-center px-2 max-w-md mx-auto mb-10">
            {STEPS_CONFIG.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-2">

                    <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all 
            ${currentStep >= step.id
                                ? 'bg-teal-500 text-white shadow-md shadow-teal-100'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                    >
                        {currentStep > step.id ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            step.id
                        )}
                    </div>

                    <span
                        className={`text-[10px] font-bold uppercase tracking-tighter transition-colors
            ${currentStep >= step.id ? 'text-teal-600' : 'text-slate-400'}`}
                    >
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
    );
}