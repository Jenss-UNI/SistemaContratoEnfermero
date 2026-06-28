export interface ResumenStats {
    enfermerosActivos: number;
    clientesRegistrados: number;
    contratosActivos: number;
    totalCustodia: number;
    verificacionesPendientes: number;
    ingresosMes: number;
    comision: number;
}

/*SE MANEJA LA TABLA DE CONTRATOS RECIENTES*/
export interface ContratoReciente {
    id: number;
    contract_code: string | null;
    patient_name: string | null;
    service_type: string | null;
    status: string | null;
    total_amount: number | null;
    created_at: string | null;
}
