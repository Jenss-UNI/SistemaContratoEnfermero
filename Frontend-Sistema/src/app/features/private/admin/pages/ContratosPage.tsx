export default function ContratosPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contratos</p>
        <h1 className="text-2xl font-semibold text-slate-900">Gestión de contratos</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Esta sección muestra el diseño de contratos. La información real se cargará desde el backend más adelante.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Nuevos contratos", value: "—" },
          { label: "Pendientes", value: "—" },
          { label: "Finalizados", value: "—" },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Lista de contratos</h2>
            <p className="mt-1 text-sm text-slate-500">
              El contenido se mostrará cuando la integración con backend esté disponible.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Sin datos
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Contrato #{index + 1}</p>
                  <p className="mt-2 text-sm text-slate-500">Información pendiente</p>
                </div>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Esperando datos
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="h-10 rounded-2xl bg-slate-200" />
                <div className="h-10 rounded-2xl bg-slate-200" />
                <div className="h-10 rounded-2xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
