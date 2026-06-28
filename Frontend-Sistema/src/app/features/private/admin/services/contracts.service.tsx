import { supabase } from "../../../../core/services/supabase";
import type { ContratoStats, ContratoAdmin } from '../models/contracts.models';

export async function getContratoStats(): Promise<ContratoStats> {
    const { data, error } = await supabase.rpc('get_admin_contratos_cards');

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No se recibieron datos de métricas');

    return data as ContratoStats;
}

export async function getContratos(
    searchTerm: string = '',
    statusFilter: string = 'Todos'
): Promise<ContratoAdmin[]> {
    if (searchTerm === '' && statusFilter === 'Todos') {
        const { data, error } = await supabase
            .from('admin_contratos')
            .select('*');

        if (error) throw new Error(error.message);
        return data ?? [];
    }

    const { data, error } = await supabase.rpc('buscar_contratos', {
        search_term: searchTerm,
        status_filter: statusFilter,
    });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function liberarPago(serviceId: number): Promise<void> {
    const { error } = await supabase.rpc('liberar_pago', {
        service_id: serviceId,
    });

    if (error) throw new Error(error.message);
}

export async function cancelarContrato(serviceId: number): Promise<void> {
    const { error } = await supabase.rpc('cancelar_contrato', {
        service_id: serviceId,
    });

    if (error) throw new Error(error.message);
}