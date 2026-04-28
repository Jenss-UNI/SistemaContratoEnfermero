import { CheckCircle2, Search, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { StepSuccessProps } from "../../../../../core/models/StepSuccessProps";

export default function StepSuccess({ formData }: StepSuccessProps) {
    const primerNombre = formData.nombres.split(" ")[0];
    const primerApellido = formData.apellidos.split(" ")[0];
    const esProfesional = "tarifa" in formData && formData.tarifa !== "";

    return (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-sm mx-auto">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-25"></div>
                    <div className="relative bg-teal-500 text-white p-6 rounded-full shadow-2xl shadow-teal-200">
                        <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    ¡Todo listo, {primerNombre}!
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed px-4">
                    Tu perfil ha sido creado correctamente.
                </p>
            </div>


            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left space-y-4 shadow-inner">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60">
                    <div className="bg-white p-2 rounded-lg text-teal-600 shadow-sm">
                        <UserCheck size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado de Perfil</p>
                        <p className="text-xs font-bold text-teal-600 uppercase">Usuario Verificado</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Usuario</span>
                        <span className="text-xs font-bold text-slate-700 uppercase">
                            {primerNombre} {primerApellido}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">ID de Registro</span>
                        <span className="font-mono font-bold text-teal-600 text-xs">
                            CS-{formData.dni.substring(4, 8)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-4 space-y-3">
                {esProfesional ? (
                    <button className="w-full bg-teal-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group">
                        Ir a mi Perfil
                    </button>
                ) : (
                    <button className="w-full bg-teal-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group">
                        <Search size={18} />
                        Buscar Profesionales
                    </button>
                )}

                <Link
                    to="/"
                    className="block w-full text-slate-400 font-bold py-2 text-sm hover:text-teal-600 transition-colors underline underline-offset-8 decoration-2 decoration-slate-200 hover:decoration-teal-200"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}