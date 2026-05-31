import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react";

interface StepPlanProps {
    onNext: () => void;
    onBack: () => void;
}

export default function StepPlan({ onNext, onBack }: StepPlanProps) {
    const [billingCycle, setBillingCycle] = useState<"mensual" | "anual">("mensual");
    const [selectedPlan, setSelectedPlan] = useState<string>("premium");

    const plans = [
        {
            id: "basico",
            name: "Básico",
            priceMonthly: "24.90",
            priceAnnual: "249.00",
            features: ["Búsqueda de enfermeros", "Sin prioridad", "Pago seguro con retención", "Contratar cualquier tipo de profesional"],
            limit: "1 paciente registrado",
            colorClass: "teal",
            borderActive: "border-teal-500 ring-teal-500",
            badge: null
        },
        {
            id: "premium",
            name: "Premium",
            priceMonthly: "49.90",
            priceAnnual: "499.00",
            features: ["Búsqueda de enfermeros", "Pago seguro con retención", "Prioridad en solicitudes", "Acceso a perfiles TOP", "Contratar cualquier tipo de profesional"],
            limit: "4 pacientes registrados",
            colorClass: "teal",
            borderActive: "border-teal-500 ring-teal-500",
            badge: "Más Popular"
        },
        {
            id: "familiar",
            name: "Familiar",
            priceMonthly: "89.90",
            priceAnnual: "899.00",
            features: ["Búsqueda de enfermeros", "Pago seguro con retención", "Prioridad máxima", "Acceso a perfiles TOP", "Contratar cualquier tipo de profesional"],
            limit: "Pacientes ilimitados",
            colorClass: "amber",
            borderActive: "border-amber-400 ring-amber-400",
            badge: "Familiar"
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Encabezado del Paso */}
            <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-teal-900 text-sm">Elige tu Plan de Suscripción</h4>
                    <p className="text-xs text-teal-700">Selecciona el plan que mejor se adapte a las necesidades de tu familia.</p>
                </div>
            </div>

            {/* Toggle Mensual / Anual */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center justify-between max-w-sm mx-auto relative">
                <button
                    onClick={() => setBillingCycle("mensual")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all z-10 ${
                        billingCycle === "mensual" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Mensual
                </button>
                <button
                    onClick={() => setBillingCycle("anual")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all z-10 flex items-center justify-center gap-1 ${
                        billingCycle === "anual" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Anual <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">+2 meses gratis</span>
                </button>
            </div>

            {/* Lista de Planes */}
            <div className="space-y-4">
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const isFamiliar = plan.id === "familiar";

                    return (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 bg-white
                                ${isSelected ? `${plan.borderActive} shadow-md ring-1` : "border-slate-200 hover:border-slate-300 hover:shadow-sm"}
                            `}
                        >
                         
                            {isSelected && (
                                <div className={`absolute top-5 right-5 ${isFamiliar ? 'text-amber-500' : 'text-teal-500'}`}>
                                    <CheckCircle2 size={24} className="fill-current text-white" />
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-3">
                                {plan.badge ? (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isFamiliar ? 'bg-amber-500' : 'bg-teal-500'}`}>
                                        {plan.badge}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                        {plan.name}
                                    </span>
                                )}
                                {plan.id === "premium" && <span className="text-teal-600 font-bold text-xs">Más Popular</span>}
                            </div>

                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-extrabold text-slate-800">
                                    S/ {billingCycle === "mensual" ? plan.priceMonthly : plan.priceAnnual}
                                </span>
                                <span className="text-slate-500 text-sm font-medium">
                                    /{billingCycle === "mensual" ? "mes" : "año"}
                                </span>
                            </div>

          
                            <div className="flex flex-wrap gap-2 mb-4">
                                {plan.features.map((feature, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                                        <Check size={12} className="text-teal-500" />
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <p className="text-sm text-slate-500 font-medium">
                                {plan.limit}
                            </p>
                        </div>
                    );
                })}
            </div>

        
            <div className="flex gap-4 pt-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                >
                    <ArrowLeft size={18} /> Volver
                </button>
                <button
                    onClick={onNext}
                    className="flex-[2] py-3 rounded-xl font-bold transition-all bg-teal-500 text-white shadow-lg shadow-teal-100 hover:bg-teal-600"
                >
                    Continuar al Pago →
                </button>
            </div>
        </div>
    );
}