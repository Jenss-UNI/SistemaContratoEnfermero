export interface EnfermeroAdmin {
    id: string;
    nombres: string;
    apellidos_pa: string;
    apellidos_ma: string;
    full_name: string;
    nivel: string | null;
    distrito: string | null;
    telefono: string | null;
    foto_url: string | null;
    created_at: string;
    verificacion_status: string | null;
    account_status: string;
    suspension_reason: string | null;
}