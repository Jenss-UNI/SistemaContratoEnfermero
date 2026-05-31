import { KeyRound, Lock } from "lucide-react";

export default function PinCodeCard() {
  return (
    <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 lg:p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 transition-all">
          <KeyRound className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Código PIN de Servicio
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Se activará automáticamente 10 min antes del servicio
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center rounded-xl bg-slate-50/50 py-6 px-4 sm:py-8 sm:px-6 lg:py-10 transition-all duration-300">
        <div className="flex gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div
              key={i}
              className="flex h-10 w-8 sm:h-12 sm:w-10 lg:h-14 lg:w-12 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all"
            >
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs sm:text-sm text-slate-500">
          Tu código PIN y QR de asistencia se activarán 10 minutos antes de tu
          servicio
        </p>

        <p className="mt-1 text-center text-xs sm:text-sm font-semibold text-teal-600">
          Activación: 11:50 p. m. · Carlos Sanchez Martinez
        </p>
      </div>
    </div>
  );
}