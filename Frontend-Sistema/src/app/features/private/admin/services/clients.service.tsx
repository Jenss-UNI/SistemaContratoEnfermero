import { supabase } from "../../../../core/services/supabase";
import type { ClienteAdmin } from '../models/clients.models';

export async function getClientes(searchTerm: string = ''): Promise<ClienteAdmin[]> {
    if (searchTerm === '') {
        const { data, error } = await supabase
            .from('admin_clientes')
            .select('*');

        if (error) throw new Error(error.message);
        return data ?? [];
    }

    const { data, error } = await supabase.rpc('buscar_clientes', {
        search_term: searchTerm,
    });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function suspenderCliente(userId: string, motivo: string): Promise<void> {
    const { error } = await supabase.rpc('suspender_cliente', {
        user_id: userId,
        motivo: motivo,
    });

    if (error) throw new Error(error.message);
}

export async function activarCliente(userId: string): Promise<void> {
    const { error } = await supabase.rpc('activar_cliente', {
        user_id: userId,
    });

    if (error) throw new Error(error.message);
}