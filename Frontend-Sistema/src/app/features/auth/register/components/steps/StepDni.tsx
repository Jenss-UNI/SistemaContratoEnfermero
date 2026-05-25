import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { StepDniProps } from "../register-ui.types";

type LoadingStep = 0 | 1 | 2 | 3;

export default function StepDni({ dni, nombres, apellidos, onNext, onBack }: StepDniProps) {
    const [isValidating, setIsValidating] = useState(false);
    const [isDniVerified, setIsDniVerified] = useState(false);
    
   
    const [loadingStep, setLoadingStep] = useState<LoadingStep>(0);

    const handleVerifyDni = () => {
        setIsValidating(true);
        setLoadingStep(1); 

        
        setTimeout(() => {
            setLoadingStep(2); 

            setTimeout(() => {
                setLoadingStep(3); 
                
                // Finaliza
                setTimeout(() => {
                    setIsValidating(false);
                    setIsDniVerified(true);
                }, 800);
            }, 800);
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
  
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-pretty">
                <div className="text-amber-500 h-fit">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-sm">Verificación de Identidad</h4>
                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                        Para garantizar la seguridad de nuestra comunidad, verificamos tu identidad con RENIEC. Este proceso es rápido y seguro.
                    </p>
                </div>
            </div>

            <div className="border border-slate-200 p-5 rounded-2xl shadow-sm bg-white">
                
     
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                            <line x1="7" y1="8" x2="11" y2="8"></line>
                            <line x1="7" y1="12" x2="17" y2="12"></line>
                            <line x1="7" y1="16" x2="17" y2="16"></line>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">DNI a verificar</p>
                        <p className="text-xs text-slate-500">Ingresado en el paso anterior</p>
                    </div>
                </div>

           
                <div className="relative mb-6">
                    <div className="w-full bg-slate-50 border border-slate-100 text-slate-800 font-mono font-bold text-lg tracking-[0.2em] rounded-xl px-4 py-4 flex justify-between items-center">
                        <span>{dni || "43324234"}</span>
                        {isDniVerified && (
                            <span className="text-xs font-bold text-teal-600 tracking-normal flex items-center gap-1">
                                <CheckCircle2 size={14} /> Verificado
                            </span>
                        )}
                    </div>
                </div>

          
                {!isValidating && !isDniVerified && (
                    <button
                        onClick={handleVerifyDni}
                        className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl hover:bg-teal-600 transition-all flex justify-center items-center gap-2"
                    >
                        <ShieldCheck size={18} />
                        Verificar mi DNI
                    </button>
                )}

          
                {isValidating && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <button
                            disabled
                            className="w-full bg-teal-400 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 cursor-wait"
                        >
                            <RefreshCw size={18} className="animate-spin" />
                            Consultando RENIEC...
                        </button>

                        <div className="pt-2">
                            <p className="text-xs text-slate-500 mb-2">Consultando base de datos RENIEC...</p>
                           
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                <div 
                                    className="h-full bg-teal-400 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${(loadingStep / 3) * 100}%` }}
                                ></div>
                            </div>

                            <div className="space-y-2.5">
                                <div className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${loadingStep >= 1 ? 'text-teal-600 font-medium' : 'text-slate-300'}`}>
                                    <RefreshCw size={12} className={loadingStep === 1 ? "animate-spin" : ""} />
                                    Conectando con RENIEC
                                </div>
                                <div className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${loadingStep >= 2 ? 'text-teal-600 font-medium' : 'text-slate-300'}`}>
                                    <RefreshCw size={12} className={loadingStep === 2 ? "animate-spin" : ""} />
                                    Validando número de DNI
                                </div>
                                <div className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${loadingStep >= 3 ? 'text-teal-600 font-medium' : 'text-slate-300'}`}>
                                    <RefreshCw size={12} className={loadingStep === 3 ? "animate-spin" : ""} />
                                    Cruzando datos biométricos
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                
                {isDniVerified && (
                    <div className="bg-teal-50/50 border border-teal-200 rounded-xl p-4 animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-teal-500 text-white rounded-full p-1.5 shadow-sm shadow-teal-200">
                                <CheckCircle2 size={16} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="font-bold text-teal-800 text-sm">Identidad Verificada</h4>
                                <p className="text-xs text-teal-600 font-medium">Datos coinciden con RENIEC</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="bg-white p-3 rounded-lg border border-teal-100 flex-1">
                                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Nombre completo</p>
                                <p className="text-sm font-bold text-slate-700 capitalize">{nombres || "paola"} {apellidos || "tereza"}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-teal-100 flex-1">
                                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">DNI</p>
                                <p className="text-sm font-bold text-slate-700">{dni || "43324234"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

           
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
                >
                    <ArrowLeft size={16} /> Volver
                </button>
                <button
                    onClick={onNext}
                    disabled={!isDniVerified}
                    className={`py-3.5 rounded-xl font-bold transition-all text-sm ${
                        isDniVerified
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-100 hover:bg-teal-600'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    }`}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}