type ServiceCardProps = {
  profesionalNombre?: string;
  profesionalTitulo?: string;
  estado?: string;
  especialidad?: string;
  paciente?: string;
  periodo?: string;
  horario?: string;
  tarifa?: string;
  proximoPago?: string;
  fechaPago?: string;
};

export default function ServiceCard({
  profesionalNombre = "—",
  profesionalTitulo = "—",
  estado = "—",
  especialidad = "—",
  paciente = "—",
  periodo = "—",
  horario = "—",
  tarifa = "—",
  proximoPago = "—",
  fechaPago = "—",
}: ServiceCardProps) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
            ?
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">{profesionalNombre}</h3>
              {estado !== "—" && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {estado}
                </span>
              )}
              {especialidad !== "—" && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {especialidad}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">{profesionalTitulo}</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{paciente}</p>
            <p className="text-xs text-slate-500">{periodo}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:gap-8">
          <div className="text-sm text-slate-600">
            <p>{horario}</p>
            <p className="font-semibold text-slate-800">{tarifa}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Próximo pago</p>
            <p className="font-bold text-slate-900">{proximoPago}</p>
            <p className="text-xs text-slate-500">{fechaPago}</p>
            <button
              type="button"
              className="mt-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Ver perfil
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
