import { Check, CreditCard, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface StepSuccessProps {
    formData: any;
    userType?: "cliente" | "profesional";
    planInfo?: {
        name: string;
        billing: string;
        price: string;
        paymentTipo?: string;
    };
}

export default function StepSuccess({ formData, userType = "cliente", planInfo }: StepSuccessProps) {
    const navigate = useNavigate();
    const [redirectDots, setRedirectDots] = useState("");

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setRedirectDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 500);

        const redirectTimer = setTimeout(() => {
            navigate(userType === "profesional" ? "/panel-enfermero/resumen" : "/panel-cliente/resumen");
        }, 3500);

        return () => {
            clearInterval(dotInterval);
            clearTimeout(redirectTimer);
        };
    }, [navigate, userType]);

    const PaymentIcon = planInfo?.paymentTipo === "tarjeta"
        ? CreditCard
        : Smartphone;

    const paymentLabel: Record<string, string> = {
        tarjeta: "Tarjeta débito/crédito",
        yape: "Yape",
        plin: "Plin",
    };

    return (
        <div className="text-center space-y-5 animate-in fade-in zoom-in duration-500 max-w-md mx-auto py-4">
            {/* Success Icon */}
            <div className="relative flex justify-center mb-2">
                <div className="absolute w-24 h-24 bg-teal-100 rounded-full animate-ping opacity-20" />
                <div className="bg-teal-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-teal-200 relative z-10">
                    <Check size={40} strokeWidth={3} />
                </div>
            </div>

            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">
                    {userType === "cliente" ? "¡Cuenta Activada!" : "¡Registro Completado!"}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed px-4">
                    {userType === "cliente"
                        ? "Tu plan ha sido activado. Ya puedes buscar y contratar enfermeros verificados."
                        : "Tu cuenta ha sido creada exitosamente."}
                </p>
            </div>

            <div className="text-left w-full">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resumen</p>

                    <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Nombre</span>
                            <span className="font-semibold text-slate-800 capitalize text-right max-w-[55%]">
                                {formData.nombres} {formData.apellidos_pa} {formData.apellidos_ma}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Correo</span>
                            <span className="font-semibold text-slate-800 text-right max-w-[55%] truncate">{formData.correo}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">DNI</span>
                            <span className="font-semibold text-slate-800">{formData.dni}</span>
                        </div>

                        {/* Plan info (only for clients) */}
                        {userType === "cliente" && planInfo && (
                            <>
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">Plan</span>
                                    <span className="font-semibold text-teal-700">{planInfo.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">Facturación</span>
                                    <span className="font-semibold text-slate-800 capitalize">{planInfo.billing}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">Monto</span>
                                    <span className="font-bold text-teal-600">S/ {planInfo.price}</span>
                                </div>
                                {planInfo.paymentTipo && (
                                    <div className="flex justify-between pb-1">
                                        <span className="text-slate-500">Método de pago</span>
                                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                                            <PaymentIcon size={13} className="text-slate-400" />
                                            {paymentLabel[planInfo.paymentTipo] ?? planInfo.paymentTipo}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        {userType === "profesional" && (
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Tipo</span>
                                <span className="font-semibold text-slate-800">{formData.nivel}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <p className="text-xs font-medium text-teal-600 animate-pulse">
                    Redirigiendo al panel{redirectDots}
                </p>
            </div>
        </div>
    );
}