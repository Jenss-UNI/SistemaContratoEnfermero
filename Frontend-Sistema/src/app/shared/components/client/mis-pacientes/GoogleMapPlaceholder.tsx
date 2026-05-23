import { Info, MapPin } from "lucide-react";

export default function GoogleMapPlaceholder() {
  return (
    <div className="space-y-2">
      <div className="flex min-h-[200px] items-center justify-center rounded-xl bg-slate-900 px-4 py-8 text-center sm:min-h-[240px]">
        <div className="max-w-sm space-y-2">
          <MapPin className="mx-auto h-8 w-8 text-slate-500" />
          <p className="text-sm font-medium text-slate-300">
            Mapa de Google (integración pendiente)
          </p>
          <p className="text-xs text-slate-500">
            Aquí se mostrará la ubicación del paciente cuando se configure la API de Maps.
          </p>
        </div>
      </div>
      <p className="flex items-start gap-1.5 text-xs text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
        El enfermero usará esta dirección para llegar al domicilio del paciente.
      </p>
    </div>
  );
}
