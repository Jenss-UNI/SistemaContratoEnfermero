import {
    Hourglass,
    PlayCircle,
    CheckCircle2,
    Star
} from "lucide-react";
import { useMetricsCards, useCharts, useTopNurses } from "../hooks/useMetricsData";

function formatAmount(amount: number): string {
    return `S/ ${amount.toLocaleString('es-PE')}`;
}

export default function MetricasPage() {
    const { data: cards, isLoading: loadingCards } = useMetricsCards();
    const { data: charts, isLoading: loadingCharts } = useCharts();
    const { data: topNurses, isLoading: loadingNurses } = useTopNurses();

    const isLoading = loadingCards || loadingCharts || loadingNurses;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-sm text-slate-400">Cargando métricas...</p>
            </div>
        );
    }

    const maxRevenue = Math.max(...(charts?.revenueByMonth?.map((m) => m.revenue) ?? []), 1);
    const maxServicesType = Math.max(...(charts?.servicesByType?.map((t) => t.count) ?? []), 1);
    const colors = ['bg-[#14b8a6]', 'bg-[#10b981]', 'bg-[#f59e0b]', 'bg-[#f43f5e]', 'bg-[#6366f1]'];

    return (
        <div className="w-full space-y-6">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CardItem label="Enfermeros verificados" value={cards?.enfermerosVerificados ?? 0} icon={Hourglass} color="text-[#0db39e]" bg="bg-[#e5f9f4]" />
                <CardItem label="Servicios activos" value={cards?.serviciosActivos ?? 0} icon={PlayCircle} color="text-emerald-500" bg="bg-emerald-50" />
                <CardItem label="Servicios completados" value={cards?.serviciosCompletados ?? 0} icon={CheckCircle2} color="text-slate-500" bg="bg-slate-100" />
            </div>

            {/* Fila 2: Bottom metrics */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <BottomCard label="Verificación pendiente" value={cards?.verificacionPendiente ?? 0} detail="Esperando aprobación" color="text-[#d97706]" />
                <BottomCard label="Conversión servicios" value={`${cards?.conversion ?? 0}%`} detail="Servicios completados vs total" color="text-[#0f766e]" />
                <BottomCard label="Ticket promedio" value={formatAmount(cards?.ticketPromedio ?? 0)} detail="Por servicio completado" color="text-[#10b981]" />
            </div>

            {/* Fila 3: Gráficos */}
            <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col">
                    <h3 className="mb-4 text-[13px] font-bold text-slate-900">Ingresos por Mes (últimos 6 meses)</h3>

                    {(charts?.revenueByMonth ?? []).length === 0 ? (
                        <div className="flex min-h-[120px] items-center justify-center">
                            <p className="text-[12px] font-medium text-slate-400">Sin resultados</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-1 items-end justify-between gap-1 border-b border-slate-100 pb-2">
                                {(charts?.revenueByMonth ?? []).map((col, index) => {
                                    const pct = maxRevenue > 0 ? (col.revenue / maxRevenue) * 100 : 0;
                                    return (
                                        <div key={index} className="flex flex-1 flex-col items-center justify-end group">
                                            {col.revenue > 0 && (
                                                <span className="mb-1 text-[9px] font-bold text-slate-500">
                                                    S/{Math.round(col.revenue / 1000) > 0 ? `${Math.round(col.revenue / 1000)}k` : col.revenue}
                                                </span>
                                            )}
                                            <div
                                                className={`w-full max-w-[40px] rounded-t-sm ${col.revenue > 0 ? 'bg-[#14b8a6]' : 'bg-slate-200'} transition-all duration-500`}
                                                style={{ height: `${Math.max(pct, 2)}%`, maxHeight: '128px', minHeight: '4px' }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-2 flex justify-between text-center">
                                {(charts?.revenueByMonth ?? []).map((col, index) => (
                                    <div key={index} className="flex flex-1 flex-col">
                                        <span className="text-[10px] font-medium text-slate-400">{col.month}</span>
                                        <span className="mt-1 text-[11px] font-bold text-slate-700">{col.services}</span>
                                        <span className="text-[8px] font-medium uppercase tracking-wider text-slate-400">svc</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-[13px] font-bold text-slate-900">Servicios por Tipo</h3>

                    {(charts?.servicesByType ?? []).length === 0 ? (
                        <div className="flex min-h-[120px] items-center justify-center">
                            <p className="text-[12px] font-medium text-slate-400">Sin resultados</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mt-2">
                            {(charts?.servicesByType ?? []).map((svc, index) => (
                                <div key={index}>
                                    <div className="mb-1.5 flex items-center justify-between text-[11px]">
                                        <span className="font-medium text-slate-700">{svc.type}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-slate-500">{svc.count} svc</span>
                                            <span className="font-bold text-slate-900">{formatAmount(svc.revenue)}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full ${colors[index % colors.length]}`}
                                            style={{ width: `${(svc.count / maxServicesType) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Fila 4: Top Enfermeros */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <h3 className="text-[13px] font-bold text-slate-900 mb-4">Top Enfermeros por Servicios Completados</h3>
                {(topNurses ?? []).length === 0 ? (
                    <div className="flex min-h-[120px] items-center justify-center">
                        <p className="text-[12px] font-medium text-slate-400">Sin resultados</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-[600px] w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-2.5 px-3 text-[11px] font-bold text-slate-500">#</th>
                                    <th className="pb-2.5 px-3 text-[11px] font-bold text-slate-500">Enfermero</th>
                                    <th className="pb-2.5 px-3 text-[11px] font-bold text-slate-500">Servicios</th>
                                    <th className="pb-2.5 px-3 text-[11px] font-bold text-slate-500">Ingresos</th>
                                    <th className="pb-2.5 px-3 text-[11px] font-bold text-slate-500">Calificación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {topNurses!.map((nurse, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="py-2.5 px-3 text-[11px] font-bold text-slate-400">#{i + 1}</td>
                                        <td className="py-2.5 px-3 text-[12px] font-semibold text-slate-800">{nurse.name}</td>
                                        <td className="py-2.5 px-3">
                                            <span className="text-[12px] font-bold text-[#0db39e]">{nurse.completedServices}</span>
                                        </td>
                                        <td className="py-2.5 px-3 text-[11px] text-slate-700">{formatAmount(nurse.revenue)}</td>
                                        <td className="py-2.5 px-3">
                                            {nurse.rating > 0 ? (
                                                <span className="inline-flex items-center gap-1 text-[11px]">
                                                    <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
                                                    <span className="font-semibold">{nurse.rating.toFixed(1)}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-slate-400">Sin calif.</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}

function CardItem({ label, value, icon: Icon, color, bg }: {
    label: string;
    value: string | number;
    icon: any;
    color: string;
    bg: string;
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-3.5 w-3.5 ${color}`} strokeWidth={2.5} />
            </div>
            <p className="text-lg font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
        </div>
    );
}

function BottomCard({ label, value, detail, color }: {
    label: string;
    value: string | number;
    detail: string;
    color: string;
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-medium text-slate-400">{label}</p>
            <p className={`mt-1.5 text-2xl font-bold ${color}`}>{value}</p>
            <p className="mt-0.5 text-[10px] font-medium text-slate-400">{detail}</p>
        </div>
    );
}