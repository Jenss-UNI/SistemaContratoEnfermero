import { Copy, Eye, EyeOff, KeyRound, RefreshCw } from "lucide-react";
import { useState } from "react";

type PinCodeCardProps = {
  pin?: string;
  tiempoRestante?: string;
  onPinRegenerado?: () => void;
};

function generarPin(): string {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
}

export default function PinCodeCard({
  pin: pinProp,
  tiempoRestante = "8h 59m",
  onPinRegenerado,
}: PinCodeCardProps) {
  const [pin, setPin] = useState(pinProp ?? "");
  const [visible, setVisible] = useState(false);

  const digits = (pin || "------").padEnd(6, "•").slice(0, 6).split("");
  const tienePin = pin.length === 6 && /^\d{6}$/.test(pin);

  const handleCopy = async () => {
    if (!tienePin) return;
    await navigator.clipboard.writeText(pin);
  };

  const handleRegenerar = () => {
    setPin(generarPin());
    setVisible(false);
    onPinRegenerado?.();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50">
            <KeyRound className="h-5 w-5 text-teal-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900">Tu Código PIN de Servicio</h3>
            <p className="text-sm text-slate-500">
              Dicta este código al enfermero para validar su llegada
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
            {tiempoRestante} restantes
          </span>
          <button
            type="button"
            onClick={handleRegenerar}
            className="inline-flex items-center gap-2 rounded-lg border border-teal-500 bg-white px-4 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
          >
            <RefreshCw className="h-4 w-4" />
            Generar nuevo
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1.5 sm:gap-2">
            {digits.map((d, i) => (
              <span
                key={i}
                className="flex h-14 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-xl font-bold text-slate-900 sm:h-16 sm:w-10"
              >
                {visible && tienePin ? d : "•"}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-l border-slate-100 pl-4">
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              disabled={!tienePin}
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 disabled:opacity-40"
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {visible ? "Ocultar" : "Mostrar"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!tienePin}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-40"
            >
              <Copy className="h-4 w-4" />
              Copiar
            </button>
          </div>
        </div>

        <p className="text-right text-xs leading-relaxed text-slate-400 md:max-w-[200px]">
          Código temporal de 6 dígitos
          <br />
          Válido por 24 horas o hasta su uso
        </p>
      </div>
    </div>
  );
}
