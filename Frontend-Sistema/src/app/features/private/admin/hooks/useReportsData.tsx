import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReportesStats, getReportes, actualizarReporte } from '../services/reports.service';

export function useReportesStats() {
    return useQuery({
        queryKey: ['admin', 'reportes', 'stats'],
        queryFn: getReportesStats,
        staleTime: 1000 * 60 * 5,
    });
}

export function useReportes(statusFilter: string) {
    return useQuery({
        queryKey: ['admin', 'reportes', 'list', statusFilter],
        queryFn: () => getReportes(statusFilter),
        staleTime: 1000 * 60 * 5,
    });
}

export function useActualizarReporte() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reportId, newStatus, respuesta }: { reportId: number; newStatus: string; respuesta: string | null }) =>
            actualizarReporte(reportId, newStatus, respuesta),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reportes'] });
        },
    });
}