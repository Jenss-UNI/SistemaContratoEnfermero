import { supabase } from "../../../../core/services/supabase";
import type { ResumenStats, ContratoReciente } from '../models/resumen.models';

export async function getResumenStats(): Promise<ResumenStats> {
    const { data, error } = await supabase.rpc('get_admin_resumen_cards');

    if (error) throw new Error(error.message);

    return data as ResumenStats;
}

export async function getContratosRecientes(): Promise<ContratoReciente[]> {
    const { data, error } = await supabase
        .from('admin_resumen_contrato')
        .select('*');

    if (error) throw new Error(error.message);

    return data ?? [];
}