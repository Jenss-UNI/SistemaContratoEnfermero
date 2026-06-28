import { supabase } from "../../../../core/services/supabase";
import type { MetricsCards } from '../models/metrics.models';
import type { RevenueByMonth, ServicesByType, TopNurse } from '../models/metrics.models';

export async function getMetricsCards(): Promise<MetricsCards> {
    const { data, error } = await supabase.rpc('get_admin_metrics_cards');

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No se recibieron datos de métricas');

    return data as MetricsCards;
}

export async function getCharts(): Promise<{
    revenueByMonth: RevenueByMonth[];
    servicesByType: ServicesByType[];
}> {
    const { data, error } = await supabase.rpc('get_admin_charts');

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No se recibieron datos de gráficos');

    return data as { revenueByMonth: RevenueByMonth[]; servicesByType: ServicesByType[] };
}

export async function getTopNurses(): Promise<TopNurse[]> {
    const { data, error } = await supabase.rpc('get_admin_top_nurses');

    if (error) throw new Error(error.message);

    return data ?? [];
}