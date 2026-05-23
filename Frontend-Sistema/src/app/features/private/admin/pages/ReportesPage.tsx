export default function ReportesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Reportes</p>
        <h1 className="text-2xl font-semibold text-slate-900">Visor de reportes</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Aquí se muestra el diseño de panel de reportes. Los números se completarán cuando el backend proporcione las métricas.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          "Balance mensual",
          "Contratos por mes",
          "Tasa de verificación",
        ].map((label) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <div className="mt-6 h-24 rounded-3xl bg-white p-4 shadow-inner">
              <div className="h-3 w-24 rounded-full bg-slate-200" />
              <div className="mt-4 h-3 w-3/4 rounded-full bg-slate-200" />
              <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Panel de reportes</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Esta sección está preparada con el diseño y la posición de los elementos, pero aún no hay datos para mostrar.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Sin reportes disponibles.
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Los gráficos aparecerán aquí cuando el backend entregue datos.
          </div>
        </div>
      </section>
    </div>
  );
}
