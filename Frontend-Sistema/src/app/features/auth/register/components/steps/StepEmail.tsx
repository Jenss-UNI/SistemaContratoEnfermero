import { Mail, Send, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import type { StepEmailProps } from "../../../../../core/models/StepEmailProps";

export default function StepEmail({ email, onNext, onBack }: StepEmailProps) {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendCode = () => {
        setIsSending(true);
        setTimeout(() => {
            setIsEmailSent(true);
            setIsSending(false);
        }, 500);
    };

    const handleVerifyCode = () => {
        if (verificationCode.length !== 6) {
            setCodeError("El código debe tener 6 dígitos");
            return;
        }
        setCodeError("");
        setIsEmailVerified(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            <div className="bg-teal-50 border border-teal-100 p-4 rounded-2xl flex gap-4 text-pretty">
                <div className="bg-white p-2 rounded-lg text-teal-600 h-fit shadow-sm">
                    <Mail size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-teal-900 text-sm">Verificación de Correo</h4>
                    <p className="text-xs text-teal-700 mt-1">
                        Enviaremos un código a <span className="font-bold text-teal-800 underline">{email || "tu correo"}</span>
                    </p>
                </div>
            </div>

            <div className="border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm bg-slate-50/50 text-center">
                {!isEmailSent ? (
                    <button
                        onClick={handleSendCode}
                        disabled={isSending}
                        className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-100 hover:bg-teal-600 transition-all disabled:opacity-70"
                    >
                        {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {isSending ? "Enviando..." : "Enviar código de seguridad"}
                    </button>
                ) : !isEmailVerified ? (
                    <div className="space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-green-100 italic">
                            <CheckCircle2 size={14} /> Revisa tu bandeja de entrada
                        </div>

                        <div className="space-y-2">
                            <input
                                type="text"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value.replace(/\D/g, ''));
                                    if (codeError) setCodeError("");
                                }}
                                placeholder="345612"
                                className={`w-full p-4 text-center text-2xl tracking-[0.5em] font-bold border rounded-xl outline-none focus:ring-2 bg-white ${codeError ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'
                                    }`}
                            />
                            {codeError && <p className="text-[10px] text-red-500 font-bold">{codeError}</p>}
                        </div>

                        <button
                            onClick={handleVerifyCode}
                            className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl hover:bg-teal-600 transition-all"
                        >
                            Verificar Código
                        </button>

                        <button
                            onClick={() => setIsEmailSent(false)}
                            className="text-xs text-slate-400 font-bold hover:text-teal-600 transition-colors"
                        >
                            ¿No recibiste el código? Reintentar
                        </button>
                    </div>
                ) : (
                    <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 flex flex-col items-center gap-2 text-teal-600 font-bold animate-in zoom-in duration-300">
                        <CheckCircle2 size={32} className="text-teal-500" />
                        <span className="text-sm">¡Correo Verificado con éxito!</span>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-2">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all"
                >
                    <ArrowLeft size={18} /> Volver
                </button>
                <button
                    onClick={onNext}
                    disabled={!isEmailVerified}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${isEmailVerified
                            ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}