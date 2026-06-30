import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContratoStats, getContratos, liberarPago, cancelarContrato } from '../services/contracts.service';

export function useContratoStats() {
    return useQuery({
        queryKey: ['admin', 'contratos', 'stats'],
        queryFn: getContratoStats,
        staleTime: 1000 * 60 * 5,
    });
}

export function useContratos(searchTerm: string, statusFilter: string) {
    return useQuery({
        queryKey: ['admin', 'contratos', 'list', searchTerm, statusFilter],
        queryFn: () => getContratos(searchTerm, statusFilter),
        staleTime: 1000 * 60 * 5,
    });
}

export function useLiberarPago() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (serviceId: number) => liberarPago(serviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contratos'] });
        },
    });
}

export function useCancelarContrato() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (serviceId: number) => cancelarContrato(serviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contratos'] });
        },
    });
}