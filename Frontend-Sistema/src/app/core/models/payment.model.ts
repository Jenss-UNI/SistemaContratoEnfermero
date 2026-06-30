export type PaymentMethodType = "tarjeta" | "yape" | "plin";

export type PaymentMethod = {
  id: string;
  tipo: PaymentMethodType;
  esPrincipal: boolean;
  /** Últimos 4 dígitos (tarjeta) */
  terminacion?: string;
  /** 9 dígitos sin prefijo (yape/plin) */
  telefono?: string;
  /** Visa, etc. */
  marca?: string;
};

export type PaymentHistoryStatus = "pagado" | "custodia" | "pendiente";

export type PaymentHistoryItem = {
  id: string;
  fecha: string;
  enfermero: string;
  tipo: string;
  monto: number;
  estado: PaymentHistoryStatus;
  factura: string;
};

export type CardFormData = {
  numeroTarjeta: string;
  nombreTarjeta: string;
  vencimiento: string;
  cvv: string;
};

export type WalletFormData = {
  telefono: string;
};
