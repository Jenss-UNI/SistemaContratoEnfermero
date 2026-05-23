import { ShieldCheck, Search, CheckCircle2, ArrowLeft, Loader2} from "lucide-react";
import { useState } from "react";
import type { StepDniProps } from "../register-ui.types";


export default function StepDni({ dni, nombres, apellidos, onNext, onBack }: StepDniProps) {
    const [isValidating, setIsValidating] = useState(false);
    const [isDniVerified, setIsDniVerified] = useState(false);

    const handleVerifyDni = () => {
        setIsValidating(true);
        setTimeout(() => {
            setIsValidating(false);
            setIsDniVerified(true);
        }, 500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Banner de Seguridad */}
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-4 text-pretty">
                <div className="bg-white p-2 rounded-lg text-amber-600 h-fit shadow-sm">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-sm">Verificación RENIEC</h4>
                    <p className="text-xs text-amber-700 mt-1">
                        Tu identidad se valida en tiempo real para máxima seguridad.
                    </p>
                </div>
            </div>

            {/* Tarjeta de Validación */}
            <div className="border border-slate-100 p-6 rounded-2xl shadow-sm bg-slate-50/50">
                {!isDniVerified ? (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documento Nacional</p>
                                <p className="text-lg font-mono font-bold text-slate-700">{dni || "XXXXXXXX"}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold uppercase">Pendiente</span>
                            </div>
                        </div>

                        <button
                            onClick={handleVerifyDni}
                            disabled={isValidating}
                            className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-all shadow-lg shadow-teal-100 disabled:opacity-70"
                        >
                            {isValidating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Consultando RENIEC...
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    Verificar Identidad
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    /* Datos Encontrados */
                    <div className="space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl space-y-4">
                            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                                <CheckCircle2 size={18} className="text-teal-500" />
                                Datos validados correctamente
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                                <div className="bg-white/80 p-3 rounded-lg border border-teal-100">
                                    <p className="text-slate-400 font-bold mb-1">NOMBRES</p>
                                    <p className="font-bold text-slate-700 uppercase">{nombres || "---"}</p>
                                </div>
                                <div className="bg-white/80 p-3 rounded-lg border border-teal-100">
                                    <p className="text-slate-400 font-bold mb-1">APELLIDOS</p>
                                    <p className="font-bold text-slate-700 uppercase">{apellidos || "---"}</p>
                                </div>
                                <div className="bg-white/80 p-3 rounded-lg border border-teal-100">
                                    <p className="text-slate-400 font-bold mb-1">ESTADO</p>
                                    <p className="font-bold text-green-600">Activo</p>
                                </div>
                                <div className="bg-white/80 p-3 rounded-lg border border-teal-100">
                                    <p className="text-slate-400 font-bold mb-1">ANTECEDENTES</p>
                                    <p className="font-bold text-teal-600">Sin registros</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Botones de Navegación */}
            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                >
                    <ArrowLeft size={18} /> Volver
                </button>
                <button
                    onClick={onNext}
                    disabled={!isDniVerified}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${isDniVerified
                            ? 'bg-teal-500 text-white shadow-lg hover:bg-teal-600'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                >
                    Finalizar Registro
                </button>
            </div>
        </div>
    );
}