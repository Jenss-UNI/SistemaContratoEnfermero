import type { PaymentHistoryItem, PaymentMethod } from "../../../../core/models/payment.model";

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    tipo: "tarjeta",
    esPrincipal: true,
    terminacion: "4521",
    marca: "Visa",
  },
  {
    id: "pm-2",
    tipo: "yape",
    esPrincipal: false,
    telefono: "987654321",
  },
  {
    id: "pm-3",
    tipo: "plin",
    esPrincipal: false,
    telefono: "987654321",
  },
];

export const MOCK_PAYMENT_HISTORY: PaymentHistoryItem[] = [
  {
    id: "h-1",
    fecha: "14 mar. 26",
    enfermero: "Lic. María Fernández",
    tipo: "Especialista",
    monto: 2145,
    estado: "pagado",
    factura: "FAC-2026-0312",
  },
  {
    id: "h-2",
    fecha: "28 feb. 26",
    enfermero: "Lic. Carlos Mendoza",
    tipo: "Técnico",
    monto: 280,
    estado: "custodia",
    factura: "FAC-2026-0245",
  },
  {
    id: "h-3",
    fecha: "15 feb. 26",
    enfermero: "Lic. Ana Torres",
    tipo: "Técnico",
    monto: 1200,
    estado: "pendiente",
    factura: "FAC-2026-0189",
  },
  {
    id: "h-4",
    fecha: "01 feb. 26",
    enfermero: "Lic. María Fernández",
    tipo: "Especialista",
    monto: 620,
    estado: "pagado",
    factura: "FAC-2026-0102",
  },
  {
    id: "h-5",
    fecha: "15 ene. 26",
    enfermero: "Lic. Carlos Mendoza",
    tipo: "Técnico",
    monto: 840,
    estado: "pagado",
    factura: "FAC-2026-0015",
  },
];
