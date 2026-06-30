export interface MetricsCards {
    enfermerosVerificados: number;
    serviciosActivos: number;
    serviciosCompletados: number;
    verificacionPendiente: number;
    conversion: number;
    ticketPromedio: number;
}

export interface RevenueByMonth {
    month: string;
    revenue: number;
    services: number;
}

export interface ServicesByType {
    type: string;
    count: number;
    revenue: number;
}

export interface TopNurse {
    name: string;
    completedServices: number;
    revenue: number;
    rating: number;
}

export interface DashboardCharts {
    revenueByMonth: RevenueByMonth[];
    servicesByType: ServicesByType[];
}

export interface DashboardData {
    cards: MetricsCards;
    charts: DashboardCharts;
    topNurses: TopNurse[];
}