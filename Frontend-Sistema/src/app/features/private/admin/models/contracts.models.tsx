export interface ContratoStats {
    totalContratos: number;
    enCustodia: number;
    totalLiberado: number;
}

export interface ContratoAdmin {
    id: number;
    contract_code: string | null;
    patient_name: string | null;
    nurse_name: string | null;
    status: string | null;
    total_amount: number | null;
    payment_status: string | null;
    created_at: string | null;
}