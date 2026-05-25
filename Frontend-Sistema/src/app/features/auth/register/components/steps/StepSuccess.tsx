import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StepSuccess({ formData, userType = "cliente" }: { formData: any, userType?: "cliente" | "profesional" }) {
    const navigate = useNavigate();
    const [redirectDots, setRedirectDots] = useState("");
    const codigoGenerado = `CS-${Math.floor(100000 + Math.random() * 900000)}`;

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setRedirectDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 500);

        const redirectTimer = setTimeout(() => {
            navigate(userType === "profesional" ? "/profesional/dashboard" : "/cliente/dashboard");
        }, 5000);

        return () => {
            clearInterval(dotInterval);
            clearTimeout(redirectTimer);
        };
    }, [navigate, userType]);

    return (
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 max-w-md mx-auto py-4">
            <div className="flex justify-center mb-4">
                <div className="bg-teal-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-teal-200">
                    <Check size={40} strokeWidth={3} />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">¡Registro Completado!</h2>
                <p className="text-sm text-slate-500 leading-relaxed px-4">
                    Tu cuenta ha sido creada exitosamente.
                </p>
            </div>

            <div className="text-left mt-6 w-full">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">RESUMEN</p>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Nombre</span>
                            <span className="font-semibold text-slate-800 capitalize">{formData.nombres} {formData.apellidos}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Correo</span>
                            <span className="font-semibold text-slate-800">{formData.correo}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">DNI</span>
                            <span className="font-semibold text-slate-800">{formData.dni}</span>
                        </div>
                        
                       
                        {userType === "profesional" && (
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Tipo</span>
                                <span className="font-semibold text-slate-800">{formData.nivel}</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-slate-500">Código</span>
                            <span className="font-mono font-semibold text-slate-800">{codigoGenerado}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <p className="text-xs font-medium text-teal-600 animate-pulse">
                    Redirigiendo al panel{redirectDots}
                </p>
            </div>
        </div>
    );
}