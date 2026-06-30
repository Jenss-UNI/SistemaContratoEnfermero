import type { PaymentMethod } from "../../../../core/models/payment.model";

export function formatWalletPhone(phone: string): string {
  const d = phone.replace(/\D/g, "").slice(-9);
  if (d.length !== 9) return phone;
  return `+51 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function maskCardNumber(last4: string): string {
  return `**** **** **** ${last4}`;
}

export function getMethodTitle(method: PaymentMethod): string {
  if (method.tipo === "tarjeta") {
    return `${method.marca ?? "Tarjeta"} terminada en ${method.terminacion ?? "****"}`;
  }
  if (method.tipo === "yape") return "Yape";
  return "Plin";
}

export function getMethodSubtitle(method: PaymentMethod): string {
  if (method.tipo === "tarjeta" && method.terminacion) {
    return maskCardNumber(method.terminacion);
  }
  if (method.telefono) return formatWalletPhone(method.telefono);
  return "—";
}

export function formatCardNumberInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiryInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
