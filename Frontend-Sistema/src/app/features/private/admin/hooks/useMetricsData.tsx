import { useQuery } from '@tanstack/react-query';
import { getMetricsCards, getCharts, getTopNurses } from '../services/metrics.service';

export function useMetricsCards() {
    return useQuery({
        queryKey: ['admin', 'metrics', 'cards'],
        queryFn: getMetricsCards,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCharts() {
    return useQuery({
        queryKey: ['admin', 'metrics', 'charts'],
        queryFn: getCharts,
        staleTime: 1000 * 60 * 5,
    });
}

export function useTopNurses() {
    return useQuery({
        queryKey: ['admin', 'metrics', 'topNurses'],
        queryFn: getTopNurses,
        staleTime: 1000 * 60 * 5,
    });
}