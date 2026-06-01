import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { StepDniProps } from "../register-ui.types";
import { consultarDni } from "../../../../../core/services/reniec";

type LoadingStep = 0 | 1 | 2 | 3;

export default function StepDni({ dni, nombres, apellidos_pa, apellidos_ma, onNext, onBack, onVerified }: StepDniProps) {
    const [isValidating, setIsValidating] = useState(false);
    const [isDniVerified, setIsDniVerified] = useState(false);
    const [verifiedData, setVerifiedData] = useState({
        nombres: nombres,
        apellidos_pa: apellidos_pa,
        apellidos_ma: apellidos_ma
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [loadingStep, setLoadingStep] = useState<LoadingStep>(0);

    // Función de normalización de cadenas para una comparación robusta
    const normalizeText = (text: string) => {
        return (text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remueve tildes
            .replace(/\s+/g, " ") // Remueve espacios dobles
            .trim();
    };

    const handleVerifyDni = async () => {
        setIsValidating(true);
        setLoadingStep(1); 
        setErrorMsg("");

        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            setLoadingStep(2); 

            const result = await consultarDni(dni);
            await new Promise((resolve) => setTimeout(resolve, 600));
            setLoadingStep(3); 

            await new Promise((resolve) => setTimeout(resolve, 600));

            // Guardar temporalmente en el estado los datos de RENIEC
            setVerifiedData({
                nombres: result.nombres,
                apellidos_pa: result.apellidos_pa,
                apellidos_ma: result.apellidos_ma
            });

            // Normalización para comparación
            const officialNombres = normalizeText(result.nombres);
            const officialPa = normalizeText(result.apellidos_pa);
            const officialMa = normalizeText(result.apellidos_ma);

            const inputNombres = normalizeText(nombres);
            const inputPa = normalizeText(apellidos_pa);
            const inputMa = normalizeText(apellidos_ma);

            if (officialNombres !== inputNombres || officialPa !== inputPa || officialMa !== inputMa) {
                setErrorMsg("Los datos oficiales de la RENIEC no coinciden con los nombres y apellidos ingresados en el formulario de registro. Por favor, regresa al primer paso y corrígelos.");
                setIsDniVerified(false);
                return;
            }

            setIsDniVerified(true);
            setErrorMsg("");

            if (onVerified) {
                onVerified(result.nombres, result.apellidos_pa, result.apellidos_ma);
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Error al conectar con el servicio de consulta de DNI. Inténtalo de nuevo.");
        } finally {
            setIsValidating(false);
        }
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

                {errorMsg && (
                    <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex gap-3 text-pretty animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="text-rose-500 h-fit shrink-0 mt-0.5">
                            <ShieldCheck size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-rose-900 text-sm">Discrepancia de datos</h4>
                            <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                                {errorMsg}
                            </p>
                            <div className="mt-3 bg-white/70 p-2.5 rounded-lg border border-rose-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                                <div>
                                    <span className="font-bold text-rose-900">Ingresado en Formulario:</span>
                                    <ul className="list-disc pl-4 mt-1 text-rose-800 space-y-0.5">
                                        <li>Nombres: <span className="font-semibold">{nombres}</span></li>
                                        <li>Ape. Paterno: <span className="font-semibold">{apellidos_pa}</span></li>
                                        <li>Ape. Materno: <span className="font-semibold">{apellidos_ma}</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <span className="font-bold text-rose-900">Registrado en RENIEC:</span>
                                    <ul className="list-disc pl-4 mt-1 text-rose-800 space-y-0.5">
                                        <li>Nombres: <span className="font-semibold">{verifiedData.nombres || "—"}</span></li>
                                        <li>Ape. Paterno: <span className="font-semibold">{verifiedData.apellidos_pa || "—"}</span></li>
                                        <li>Ape. Materno: <span className="font-semibold">{verifiedData.apellidos_ma || "No registra"}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

          
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-white p-3 rounded-lg border border-teal-100">
                                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Nombres</p>
                                <p className="text-sm font-bold text-slate-700 capitalize">{verifiedData.nombres || "paola"}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-teal-100">
                                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Apellido Paterno</p>
                                <p className="text-sm font-bold text-slate-700 capitalize">{verifiedData.apellidos_pa || "tereza"}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-teal-100">
                                <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase">Apellido Materno</p>
                                <p className="text-sm font-bold text-slate-700 capitalize">{verifiedData.apellidos_ma || ""}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-teal-100">
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