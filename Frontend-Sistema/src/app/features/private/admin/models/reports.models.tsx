export interface ReporteStats {
    abiertos: number;
    enRevision: number;
    resueltos: number;
}

export interface ReporteAdmin {
    id: number;
    reporter_id: string;
    reporter_role: string;
    service_id: number | null;
    title: string;
    description: string;
    category: string;
    severity: string;
    status: string;
    response: string | null;
    created_at: string;
    updated_at: string;
}