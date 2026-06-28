import { supabase } from "../../../../core/services/supabase";
import type { EnfermeroAdmin } from '../models/nurses.models';

export async function getEnfermeros(
    searchTerm: string = '',
    statusFilter: string = 'Todos'
): Promise<EnfermeroAdmin[]> {
    if (searchTerm === '' && statusFilter === 'Todos') {
        const { data, error } = await supabase
            .from('admin_enfermeros')
            .select('*');

        if (error) throw new Error(error.message);
        return data ?? [];
    }

    const { data, error } = await supabase.rpc('buscar_enfermeros', {
        search_term: searchTerm,
        status_filter: statusFilter,
    });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function publicarEnfermero(nurseId: string): Promise<void> {
    const { error } = await supabase.rpc('publicar_enfermero', {
        nurse_id: nurseId,
    });

    if (error) throw new Error(error.message);
}

export async function despublicarEnfermero(nurseId: string): Promise<void> {
    const { error } = await supabase.rpc('despublicar_enfermero', {
        nurse_id: nurseId,
    });

    if (error) throw new Error(error.message);
}

export async function suspenderEnfermero(userId: string, motivo: string): Promise<void> {
    const { error } = await supabase.rpc('suspender_enfermero', {
        user_id: userId,
        motivo: motivo,
    });

    if (error) throw new Error(error.message);
}

export async function activarEnfermero(userId: string): Promise<void> {
    const { error } = await supabase.rpc('activar_enfermero', {
        user_id: userId,
    });

    if (error) throw new Error(error.message);
}