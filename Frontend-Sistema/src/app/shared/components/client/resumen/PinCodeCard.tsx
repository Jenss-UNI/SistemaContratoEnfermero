import { KeyRound, Lock, Clock, CheckCircle } from "lucide-react";

interface Props {
  pinCode?: string;
  activationTime?: Date;
  startTime?: Date;
  endTime?: Date;
  nurseName?: string;
  isActive?: boolean;
}

export default function PinCodeCard({
  pinCode,
  activationTime,
  startTime,
  endTime,
  nurseName,
  isActive = false
}: Props) {
  const formatTimeHM = (date: Date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 lg:p-6 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all ${isActive ? "bg-teal-500 text-white" : "bg-teal-100 text-teal-600"}`}>
          <KeyRound className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Código PIN de Servicio
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {isActive ? "Asistencia lista para registrar" : "Se activará automáticamente 10 min antes del servicio"}
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center rounded-xl bg-slate-50/50 py-6 px-4 sm:py-8 sm:px-6 lg:py-10 transition-all duration-300 border border-slate-100/50">
        {isActive && pinCode ? (
          <>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
              {pinCode.split("").map((char, i) => (
                <div
                  key={i}
                  className="flex h-10 w-8 sm:h-12 sm:w-10 lg:h-14 lg:w-12 items-center justify-center rounded-xl border-2 border-teal-500 bg-teal-50/80 text-teal-900 font-black text-lg sm:text-xl md:text-2xl shadow-md scale-105 transition-all"
                >
                  {char}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs sm:text-sm text-teal-600 font-semibold bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>PIN de ingreso ACTIVO</span>
            </div>

            <p className="mt-3 text-center text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
              Muestra este código a tu enfermero <strong>{nurseName}</strong> para que registre su ingreso de asistencia.
            </p>
          </>
        ) : (
          <>
            <div className="flex gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 w-8 sm:h-12 sm:w-10 lg:h-14 lg:w-12 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all shadow-sm"
                >
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
              Tu código PIN y QR de asistencia se activarán 10 minutos antes del inicio del servicio.
            </p>

            {activationTime && startTime && nurseName ? (
              <p className="mt-2 text-center text-xs sm:text-sm font-semibold text-teal-600 flex items-center justify-center gap-1 bg-teal-50/50 px-3.5 py-1.5 rounded-full border border-teal-100/50">
                <Clock className="w-3.5 h-3.5 text-teal-500" />
                <span>
                  Activación: {formatDateShort(startTime)} a las {formatTimeHM(activationTime)} · {nurseName}
                </span>
              </p>
            ) : (
              <p className="mt-2 text-center text-xs sm:text-sm font-medium text-slate-400 italic">
                Sin servicios próximos programados para hoy
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}