import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientes, suspenderCliente, activarCliente } from '../services/clients.service';

export function useClientes(searchTerm: string) {
    return useQuery({
        queryKey: ['admin', 'clientes', 'list', searchTerm],
        queryFn: () => getClientes(searchTerm),
        staleTime: 1000 * 60 * 5,
    });
}

export function useSuspenderCliente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, motivo }: { userId: string; motivo: string }) =>
            suspenderCliente(userId, motivo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'clientes'] });
        },
    });
}

export function useActivarCliente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => activarCliente(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'clientes'] });
        },
    });
}