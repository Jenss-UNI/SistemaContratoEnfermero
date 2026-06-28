export interface ClienteAdmin {
    id: string;
    nombres: string;
    apellidos_pa: string;
    apellidos_ma: string;
    full_name: string;
    distrito: string | null;
    telefono: string | null;
    foto_url: string | null;
    created_at: string;
    account_status: string;
    suspension_reason: string | null;
}