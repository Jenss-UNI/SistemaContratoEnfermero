import { FileText, ShieldCheck, UserCheck, Users, Wallet } from "lucide-react";

export default function ResumenPage() {
  const stats = [
    { label: "Enfermeros activos", value: "2", icon: Users, accent: "text-sky-600 bg-sky-50" },
    { label: "Clientes registrados", value: "3", icon: UserCheck, accent: "text-rose-600 bg-rose-50" },
    { label: "Contratos activos", value: "1", icon: FileText, accent: "text-amber-600 bg-amber-50" },
    { label: "En custodia", value: "S/ 1,577", icon: Wallet, accent: "text-emerald-600 bg-emerald-50" },
    { label: "Verificaciones pendientes", value: "0", icon: ShieldCheck, accent: "text-orange-600 bg-orange-50" },
    { label: "Ingresos del mes", value: "S/ 100", icon: Wallet, accent: "text-teal-600 bg-teal-50" },
  ];

  const summaryDetails = [
    { title: "Total en custodia", value: "S/ 1,577", detail: "Servicios activos y pendientes" },
    { title: "Ingresos del mes", value: "S/ 100", detail: "Servicios completados" },
    { title: "Comisión estimada (10%)", value: "S/ 10", detail: "Del mes actual" },
  ];

  const contracts = [
    { code: "CON-000039", patient: "Elena Rodriguez", type: "Asistencial", status: "Pendiente", amount: "S/ 120", date: "23/5/2026" },
    { code: "CON-000038", patient: "Elena Rodriguez", type: "Acompañamiento", status: "Pendiente", amount: "S/ 75", date: "23/5/2026" },
    { code: "CON-000037", patient: "Elena Rodriguez", type: "Acompañamiento", status: "Pendiente", amount: "S/ 180", date: "23/5/2026" },
    { code: "CON-000036", patient: "Elena Rodriguez", type: "Asistencial", status: "Pendiente", amount: "S/ 120", date: "22/5/2026" },
    { code: "CON-000035", patient: "Elena Rodriguez", type: "Especializado", status: "Pendiente", amount: "S/ 318", date: "22/5/2026" },
    { code: "CON-000034", patient: "Elena Rodriguez", type: "Especializado", status: "Activo", amount: "S/ 106", date: "22/5/2026" },
  ];

  const statusStyle = {
    Pendiente: "bg-amber-100 text-amber-800",
    Activo: "bg-emerald-100 text-emerald-800",
    Confirmado: "bg-sky-100 text-sky-700",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Resumen</p>
          <h1 className="text-3xl font-semibold text-slate-900">Panel administrativo</h1>
        </div>
        <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
          <span>23 de mayo de 2026</span>
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Administrador
          </span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-6">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${item.accent}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </span>
            </div>
            <p className="mt-6 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {summaryDetails.map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-400">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{card.detail}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Contratos recientes</h2>
            <p className="text-sm text-slate-500">Aquí se muestran los contratos recientes cargados en el panel.</p>
          </div>
          <div className="text-sm font-medium text-slate-500">Últimos 7 registros</div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Código</th>
                <th className="px-6 py-4 font-semibold">Paciente</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Monto</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {contracts.map((contract) => (
                <tr key={contract.code} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">{contract.code}</td>
                  <td className="px-6 py-4">{contract.patient}</td>
                  <td className="px-6 py-4 text-slate-500">{contract.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyle[contract.status as keyof typeof statusStyle] ?? "bg-slate-100 text-slate-700"}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{contract.amount}</td>
                  <td className="px-6 py-4 text-slate-500">{contract.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
