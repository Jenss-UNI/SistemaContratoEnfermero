export default function GestionClientesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Gestión de clientes</p>
        <h1 className="text-2xl font-semibold text-slate-900">Lista de clientes</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          En esta sección se mostrará el panel para administrar clientes. Ahora mismo se muestra solo la estructura del diseño.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="h-4 w-28 rounded-full bg-slate-200" />
              <div className="mt-3 h-4 w-36 rounded-full bg-slate-200" />
              <div className="mt-4 h-10 rounded-2xl bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
