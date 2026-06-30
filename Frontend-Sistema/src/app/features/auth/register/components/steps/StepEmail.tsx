import { useState } from "react";
import { Mail, Send, Check, RefreshCw, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../../../../../core/services/supabase";

interface StepEmailProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}


type Estado = "idle" | "enviando" | "enviado" | "verificado";

export default function StepEmail({ email, onNext, onBack }: StepEmailProps) {
  const [estado, setEstado]           = useState<Estado>("idle");
  const [inputCodigo, setInputCodigo]  = useState("");
  const [errorCodigo, setErrorCodigo]  = useState("");
  const [reenviando, setReenviando]    = useState(false);

 
  const enviarCodigo = async () => {
    setEstado("enviando");
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const { error: dbError } = await supabase.from("verification_codes").insert({
        email,
        code,
        purpose: "email_verification",
        expires_at: expiresAt
      });

      if (dbError) throw dbError;

      const { error: funcError } = await supabase.functions.invoke("resend-email", {
        body: { email, code, purpose: "email_verification" }
      });

      if (funcError) throw funcError;

      setEstado("enviado");
      setInputCodigo("");
      setErrorCodigo("");
    } catch (err: any) {
      console.error(err);
      setErrorCodigo("Error al enviar el código de verificación.");
      setEstado("idle");
    }
  };

  const reenviarCodigo = async () => {
    setReenviando(true);
    await enviarCodigo();
    setReenviando(false);
  };

  
  const verificar = async () => {
    setErrorCodigo("");
    try {
      const { data, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("email", email)
        .eq("code", inputCodigo.trim())
        .eq("purpose", "email_verification")
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setErrorCodigo("Código incorrecto o expirado.");
        return;
      }

      const { error: updateError } = await supabase
        .from("verification_codes")
        .update({ used: true })
        .eq("id", data.id);

      if (updateError) throw updateError;

      setEstado("verificado");
    } catch (err: any) {
      console.error(err);
      setErrorCodigo("Error al verificar el código.");
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">

      
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
            <Mail size={16} className="text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm mb-1">
              Verificación de Correo Electrónico
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enviaremos un código de 6 dígitos a{" "}
              <span className="text-teal-600 font-semibold">{email}</span>{" "}
              para confirmar que es tuyo.
            </p>
          </div>
        </div>
      </div>

   
      <div className="border border-slate-200 rounded-xl p-4">
    
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <Mail size={16} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Correo a verificar</p>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
        </div>

   
        {estado === "idle" && (
          <button
            type="button"
            onClick={enviarCodigo}
            className="w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={15} />
            Enviar código de verificación
          </button>
        )}


        {estado === "enviando" && (
          <button
            type="button"
            disabled
            className="w-full bg-teal-400 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors cursor-wait opacity-90"
          >
            <Loader2 size={15} className="animate-spin" />
            Enviando código...
          </button>
        )}

       
        {(estado === "enviado" || estado === "verificado") && (
          <div className="flex flex-col gap-3">

           
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
              <Check size={14} className="text-green-600 shrink-0" />
              <p className="text-xs text-green-700">
                Código enviado a <span className="font-semibold">{email}</span>. Revisa tu bandeja de entrada.
              </p>
            </div>

        
            {estado === "verificado" ? (
              <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                <Check size={16} className="text-teal-600 shrink-0" />
                <p className="text-sm text-teal-700 font-semibold">
                  Correo verificado correctamente ✓
                </p>
              </div>
            ) : (
             
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Ingresa el código de 6 dígitos
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={inputCodigo}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setInputCodigo(val);
                      setErrorCodigo("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && inputCodigo.length === 6 && verificar()}
                    placeholder="123456"
                    className={[
                      "flex-1 border rounded-lg px-4 py-2.5 text-sm text-center tracking-[0.3em] font-mono",
                      "outline-none transition-all focus:ring-2",
                      errorCodigo
                        ? "border-red-400 bg-red-50 focus:ring-red-300"
                        : "border-slate-200 focus:ring-teal-400 focus:border-teal-400",
                    ].join(" ")}
                  />
                  <button
                    type="button"
                    onClick={verificar}
                    disabled={inputCodigo.length !== 6}
                    className={[
                      "px-4 rounded-lg text-sm font-semibold transition-colors",
                      inputCodigo.length === 6
                        ? "bg-teal-500 text-white hover:bg-teal-600"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed",
                    ].join(" ")}
                  >
                    Verificar
                  </button>
                </div>

                {errorCodigo && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
                    ⚠ {errorCodigo}
                  </p>
                )}

                <button
                  type="button"
                  onClick={reenviarCodigo}
                  disabled={reenviando}
                  className="text-xs text-teal-600 hover:underline flex items-center gap-1 self-center mt-3 disabled:opacity-60"
                >
                  {reenviando ? (
                    <><RefreshCw size={11} className="animate-spin" /> Reenviando...</>
                  ) : (
                    "¿No recibiste el código? Reenviar"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    
      <div className="grid grid-cols-2 gap-3 mt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={estado !== "verificado"}
          className={[
            "flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-all",
            estado === "verificado"
              ? "bg-teal-500 text-white hover:bg-teal-600 shadow-md shadow-teal-200/50"
              : "bg-slate-100 text-slate-400 cursor-not-allowed",
          ].join(" ")}
        >
          Continuar
          {estado === "verificado" && <ArrowRight size={16} className="group-hover:translate-x-1" />}
        </button>
      </div>
    </div>
  );
}