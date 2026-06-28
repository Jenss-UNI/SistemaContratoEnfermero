import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnfermeros, publicarEnfermero, despublicarEnfermero, suspenderEnfermero, activarEnfermero } from '../services/nurses.service';

export function useEnfermeros(searchTerm: string, statusFilter: string) {
    return useQuery({
        queryKey: ['admin', 'enfermeros', 'list', searchTerm, statusFilter],
        queryFn: () => getEnfermeros(searchTerm, statusFilter),
        staleTime: 1000 * 60 * 5,
    });
}

export function usePublicarEnfermero() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (nurseId: string) => publicarEnfermero(nurseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'enfermeros'] });
        },
    });
}

export function useDespublicarEnfermero() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (nurseId: string) => despublicarEnfermero(nurseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'enfermeros'] });
        },
    });
}

export function useSuspenderEnfermero() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, motivo }: { userId: string; motivo: string }) =>
            suspenderEnfermero(userId, motivo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'enfermeros'] });
        },
    });
}

export function useActivarEnfermero() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => activarEnfermero(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'enfermeros'] });
        },
    });
}