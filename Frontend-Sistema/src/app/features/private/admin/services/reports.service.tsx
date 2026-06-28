import { supabase } from "../../../../core/services/supabase";
import type { ReporteStats, ReporteAdmin } from '../models/reports.models';

export async function getReportesStats(): Promise<ReporteStats> {
    const { data, error } = await supabase.rpc('get_admin_reportes_stats');

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No se recibieron datos de estadísticas');

    return data as ReporteStats;
}

export async function getReportes(statusFilter: string = 'Todos'): Promise<ReporteAdmin[]> {
    if (statusFilter === 'Todos') {
        const { data, error } = await supabase
            .from('admin_reportes')
            .select('*');

        if (error) throw new Error(error.message);
        return data ?? [];
    }

    const { data, error } = await supabase.rpc('buscar_reportes', {
        status_filter: statusFilter,
    });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function actualizarReporte(
    reportId: number,
    newStatus: string,
    respuesta: string | null
): Promise<void> {
    const { error } = await supabase.rpc('actualizar_reporte', {
        report_id: reportId,
        new_status: newStatus,
        respuesta: respuesta,
    });

    if (error) throw new Error(error.message);
}