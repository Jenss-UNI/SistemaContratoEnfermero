import {
    Hourglass,
    User,
    PlayCircle,
    CheckCircle2,
    DollarSign,
    Percent,
    Shield,
    Calendar
} from "lucide-react";

const TOP_METRICS = [
    { label: "Enfermeros verificados", value: "2", detail: "6 registrados", icon: Hourglass, color: "text-[#0db39e]", bg: "bg-[#e5f9f4]" },
    { label: "Clientes registrados", value: "8", detail: "", icon: User, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Servicios activos", value: "0", detail: "9 confirmados", icon: PlayCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Servicios completados", value: "2", detail: "De 11 totales", icon: CheckCircle2, color: "text-slate-500", bg: "bg-slate-100" },
    { label: "Ingresos totales", value: "S/ 206", detail: "Ingresos totales", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Comisión plataforma (10%)", value: "S/ 21", detail: "Comisión plataforma (10%)", icon: Percent, color: "text-[#0db39e]", bg: "bg-[#e5f9f4]" },
    { label: "En custodia", value: "S/ 1,936", detail: "Activos + confirmados", icon: Shield, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Ingresos este mes", value: "S/ 206", detail: "S/ 0 esta semana", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
];

const CHART_MONTHS = [
    { month: "dic. 25", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "ene. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "feb. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "mar. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "abr. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "may. 26", svc: "2", amount: "S/ 206", height: "h-28", bg: "bg-[#14b8a6]" }, 
];

const SERVICES_TYPE = [
    { label: "Especializado", svc: "4", amount: "S/ 106", progress: "100%", color: "bg-[#14b8a6]" }, 
    { label: "Asistencial", svc: "4", amount: "S/ 100", progress: "100%", color: "bg-[#10b981]" }, 
    { label: "Acompañamiento", svc: "3", amount: "S/ 0", progress: "75%", color: "bg-[#f59e0b]" },
];

const TOP_NURSES = [
    { rank: "#1", name: "Carlos Sanchez Martinez", svc: "2", amount: "S/ 206", rating: "Sin calif." },
];

const BOTTOM_METRICS = [
    { label: "Verificación pendiente", value: "0", detail: "Esperando aprobación", valColor: "text-[#f59e0b]" },
    { label: "Conversión servicios", value: "18%", detail: "Servicios completados vs total", valColor: "text-[#0db39e]" },
    { label: "Ticket promedio", value: "S/ 103", detail: "Por servicio completado", valColor: "text-[#10b981]" },
];

export default function MetricasPage() {
    return (
        <div className="w-full space-y-6">

            {/* 1. SECCIÓN SUPERIOR: 8 Tarjetas de Métricas Rápidas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {TOP_METRICS.map((item, index) => (
                    <div key={index} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
                        <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl ${item.bg}`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} strokeWidth={2.5} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                        <p className="mt-1 text-[13px] font-bold text-slate-500">{item.label}</p>
                        {item.detail && <p className="mt-0.5 text-[11px] font-medium text-slate-400">{item.detail}</p>}
                    </div>
                ))}
            </div>

            {/* 2. SECCIÓN CENTRAL: Gráficos (Columnas 50/50) */}
            <div className="grid gap-4 lg:grid-cols-2">

                {/* Gráfico 1: Ingresos por Mes (Barras Verticales) */}
                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-[15px] font-bold text-slate-900">Ingresos por Mes (últimos 6 meses)</h3>

                    <div className="flex h-48 items-end justify-between gap-2 border-b border-slate-100 pb-2">
                        {CHART_MONTHS.map((col, index) => (
                            <div key={index} className="flex flex-1 flex-col items-center justify-end group">
                                {col.amount && (
                                    <span className="mb-2 text-[10px] font-bold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                                        {col.amount}
                                    </span>
                                )}
                                <div className={`w-full max-w-[40px] rounded-t-sm ${col.bg} ${col.height} transition-all duration-500`} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex justify-between text-center">
                        {CHART_MONTHS.map((col, index) => (
                            <div key={index} className="flex flex-1 flex-col">
                                <span className="text-[11px] font-medium text-slate-400">{col.month}</span>
                                <span className="mt-2 text-[13px] font-bold text-slate-700">{col.svc}</span>
                                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">svc</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gráfico 2: Servicios por Tipo (Barras Horizontales) */}
                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-[15px] font-bold text-slate-900">Servicios por Tipo</h3>

                    <div className="space-y-6 mt-4">
                        {SERVICES_TYPE.map((svc, index) => (
                            <div key={index}>
                                <div className="mb-2 flex items-center justify-between text-[13px]">
                                    <span className="font-bold text-slate-700">{svc.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-500">{svc.svc} svc</span>
                                        <span className="font-bold text-slate-900">{svc.amount}</span>
                                    </div>
                                </div>
                                {/* Fondo de la barra de progreso */}
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    {/* Relleno de la barra de progreso */}
                                    <div
                                        className={`h-full rounded-full ${svc.color}`}
                                        style={{ width: svc.progress }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 3. SECCIÓN TABLA: Top Enfermeros */}
            <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-[15px] font-bold text-slate-900">Top Enfermeros por Servicios Completados</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-[720px] table-auto w-full text-left text-sm whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-50 text-[13px] text-slate-500">
                                <th className="pb-4 font-medium">#</th>
                                <th className="pb-4 font-medium">Enfermero</th>
                                <th className="pb-4 font-medium">Servicios</th>
                                <th className="pb-4 font-medium">Ingresos</th>
                                <th className="pb-4 font-medium">Calificación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {TOP_NURSES.map((nurse, index) => (
                                <tr key={index} className="transition-colors hover:bg-slate-50/50">
                                    <td className="py-4 text-[13px] font-medium text-slate-500">{nurse.rank}</td>
                                    <td className="py-4 text-[13px] font-bold text-slate-800">{nurse.name}</td>
                                    <td className="py-4 text-[13px] font-bold text-[#0db39e]">{nurse.svc}</td>
                                    <td className="py-4 text-[13px] font-medium text-slate-500">{nurse.amount}</td>
                                    <td className="py-4 text-[13px] font-medium text-slate-400">{nurse.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. SECCIÓN INFERIOR: 3 Tarjetas Finales */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {BOTTOM_METRICS.map((item, index) => (
                    <div key={index} className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
                        <p className="text-[12px] font-medium text-slate-400">{item.label}</p>
                        <p className={`mt-2 text-3xl font-bold ${item.valColor}`}>{item.value}</p>
                        <p className="mt-1 text-[12px] font-medium text-slate-400">{item.detail}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}