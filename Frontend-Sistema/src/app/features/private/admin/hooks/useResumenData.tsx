import { useQuery } from '@tanstack/react-query';
import { getResumenStats, getContratosRecientes } from '../services/resumen.service';

export function useResumenCards() {
    return useQuery({
        queryKey: ['admin', 'resumen', 'stats'],
        queryFn: getResumenStats,
        staleTime: 1000 * 60 * 5,
    });
}

export function useContratosRecientes() {
    return useQuery({
        queryKey: ['admin', 'contratos', 'recientes'],
        queryFn: getContratosRecientes,
        staleTime: 1000 * 60 * 5,
    });
}