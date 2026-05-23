import { MapPin } from "lucide-react";

type PatientSummaryCardProps = {
  nombre?: string;
  detalle?: string;
  etiquetas?: string[];
  distrito?: string;
};

export default function PatientSummaryCard({
  nombre = "—",
  detalle = "—",
  etiquetas = [],
  distrito = "—",
}: PatientSummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
          ?
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">{nombre}</h3>
          <p className="text-sm text-slate-500">{detalle}</p>
          {etiquetas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {etiquetas.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3" />
            {distrito}
          </p>
        </div>
      </div>
    </article>
  );
}
