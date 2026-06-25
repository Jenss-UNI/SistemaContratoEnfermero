import {
    Hourglass,
    User,
    PlayCircle,
    CheckCircle2,
    DollarSign,
    Percent,
    MonitorSmartphone,
    Calendar
} from "lucide-react";

const TOP_METRICS = [
    { label: "Enfermeros verificados", value: "0", detail: "2 registrados", icon: Hourglass, color: "text-[#0db39e]", bg: "bg-[#e5f9f4]" },
    { label: "Clientes registrados", value: "2", detail: "Clientes registrados", icon: User, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Servicios activos", value: "1", detail: "1 confirmados", icon: PlayCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Servicios completados", value: "2", detail: "De 5 totales", icon: CheckCircle2, color: "text-slate-500", bg: "bg-slate-100" },
    { label: "Ingresos totales", value: "S/ 1,500", detail: "Ingresos totales", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Comisión plataforma (10%)", value: "S/ 150", detail: "Comisión plataforma (10%)", icon: Percent, color: "text-[#0db39e]", bg: "bg-[#e5f9f4]" },
    { label: "En custodia", value: "S/ 1,865", detail: "Activos + confirmados", icon: MonitorSmartphone, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Ingresos este mes", value: "S/ 0", detail: "S/ 0 esta semana", icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
];

const CHART_MONTHS = [
    { month: "ene. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "feb. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "mar. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "abr. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
    { month: "may. 26", svc: "2", amount: "S/2k", height: "h-32", bg: "bg-[#14b8a6]" }, 
    { month: "jun. 26", svc: "0", amount: null, height: "h-1", bg: "bg-slate-200" },
];

const SERVICES_TYPE = [
    { label: "Especializado", svc: "2", amount: "S/ 1,300", progress: "100%", color: "bg-[#14b8a6]" }, 
    { label: "Acompañamiento", svc: "2", amount: "S/ 200", progress: "100%", color: "bg-[#10b981]" }, 
    { label: "Asistencial", svc: "1", amount: "S/ 0", progress: "65%", color: "bg-[#f59e0b]" },
];

const BOTTOM_METRICS = [
    { label: "Verificación pendiente", value: "0", detail: "Esperando aprobación", valColor: "text-[#d97706]" },
    { label: "Conversión servicios", value: "40%", detail: "Servicios completados vs total", valColor: "text-[#0f766e]" },
    { label: "Ticket promedio", value: "S/ 750", detail: "Por servicio completado", valColor: "text-[#10b981]" },
];

export default function MetricasPage() {
    return (
        <div className="w-full space-y-6">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TOP_METRICS.map((item, index) => (
                    <div key={index} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                        <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ${item.bg}`}>
                            <item.icon className={`h-3.5 w-3.5 ${item.color}`} strokeWidth={2.5} />
                        </div>
                        <p className="text-lg font-bold text-slate-900">{item.value}</p>
                        <p className="mt-0.5 text-[11px] font-medium text-slate-500">{item.label}</p>
                        <p className="mt-0.5 min-h-[14px] text-[10px] font-medium text-slate-400">
                            {item.detail !== item.label ? item.detail : ""}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col">
                    <h3 className="mb-4 text-[13px] font-bold text-slate-900">Ingresos por Mes (últimos 6 meses)</h3>

                    <div className="flex flex-1 items-end justify-between gap-1 border-b border-slate-100 pb-2">
                        {CHART_MONTHS.map((col, index) => (
                            <div key={index} className="flex flex-1 flex-col items-center justify-end group">
                                {col.amount && (
                                    <span className="mb-1 text-[9px] font-bold text-slate-500">
                                        {col.amount}
                                    </span>
                                )}
                                <div className={`w-full max-w-[40px] rounded-t-sm ${col.bg} ${col.height} transition-all duration-500`} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 flex justify-between text-center">
                        {CHART_MONTHS.map((col, index) => (
                            <div key={index} className="flex flex-1 flex-col">
                                <span className="text-[10px] font-medium text-slate-400">{col.month}</span>
                                <span className="mt-1 text-[11px] font-bold text-slate-700">{col.svc}</span>
                                <span className="text-[8px] font-medium uppercase tracking-wider text-slate-400">svc</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-[13px] font-bold text-slate-900">Servicios por Tipo</h3>

                    <div className="space-y-4 mt-2">
                        {SERVICES_TYPE.map((svc, index) => (
                            <div key={index}>
                                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                                    <span className="font-medium text-slate-700">{svc.label}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-slate-500">{svc.svc} svc</span>
                                        <span className="font-bold text-slate-900">{svc.amount}</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <h3 className="text-[13px] font-bold text-slate-900">Top Enfermeros por Servicios Completados</h3>
                <div className="flex min-h-[120px] items-center justify-center">
                    <p className="text-[12px] font-medium text-slate-400">No hay servicios completados aún</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {BOTTOM_METRICS.map((item, index) => (
                    <div key={index} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-medium text-slate-400">{item.label}</p>
                        <p className={`mt-1.5 text-2xl font-bold ${item.valColor}`}>{item.value}</p>
                        <p className="mt-0.5 text-[10px] font-medium text-slate-400">{item.detail}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}