import { CreditCard, Shield, Smartphone } from "lucide-react";
import { useState } from "react";
import type { CardFormData, PaymentMethodType, WalletFormData } from "../../../../core/models/payment.model";
import { FormField } from "../mi-perfil";
import Modal from "../mis-pacientes/Modal";
import {
  allowDigitsOnly,
  blockNonDigitKey,
  validateCardExpiry,
  validateCardHolder,
  validateCardNumber,
  validateCvv,
  validatePhone,
} from "../../../utils/validation";
import { formatCardNumberInput, formatExpiryInput } from "./paymentUtils";

type AddPaymentMethodModalProps = {
  onClose: () => void;
  onAdd: (tipo: PaymentMethodType, data: CardFormData | WalletFormData) => void;
};

const TABS: { id: PaymentMethodType; label: string; icon: typeof CreditCard }[] = [
  { id: "tarjeta", label: "Tarjeta", icon: CreditCard },
  { id: "yape", label: "Yape", icon: Smartphone },
  { id: "plin", label: "Plin", icon: Smartphone },
];

const EMPTY_CARD: CardFormData = {
  numeroTarjeta: "",
  nombreTarjeta: "",
  vencimiento: "",
  cvv: "",
};

const EMPTY_WALLET: WalletFormData = { telefono: "" };

export default function AddPaymentMethodModal({ onClose, onAdd }: AddPaymentMethodModalProps) {
  const [tab, setTab] = useState<PaymentMethodType>("tarjeta");
  const [card, setCard] = useState<CardFormData>(EMPTY_CARD);
  const [wallet, setWallet] = useState<WalletFormData>(EMPTY_WALLET);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const validateCard = (): CardFormData | null => {
    const next: Record<string, string> = {};
    const numErr = validateCardNumber(card.numeroTarjeta);
    const nameErr = validateCardHolder(card.nombreTarjeta);
    const expErr = validateCardExpiry(card.vencimiento);
    const cvvErr = validateCvv(card.cvv);
    if (numErr) next.numeroTarjeta = numErr;
    if (nameErr) next.nombreTarjeta = nameErr;
    if (expErr) next.vencimiento = expErr;
    if (cvvErr) next.cvv = cvvErr;
    setErrors(next);
    if (Object.keys(next).length > 0) return null;
    return {
      numeroTarjeta: card.numeroTarjeta.replace(/\D/g, ""),
      nombreTarjeta: card.nombreTarjeta.trim().toUpperCase(),
      vencimiento: card.vencimiento.trim(),
      cvv: card.cvv.replace(/\D/g, ""),
    };
  };

  const validateWallet = (): WalletFormData | null => {
    const telErr = validatePhone(wallet.telefono);
    if (telErr) {
      setErrors({ telefono: telErr });
      return null;
    }
    setErrors({});
    return { telefono: wallet.telefono.replace(/\D/g, "") };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "tarjeta") {
      const data = validateCard();
      if (!data) return;
      onAdd("tarjeta", data);
    } else {
      const data = validateWallet();
      if (!data) return;
      onAdd(tab, data);
    }
  };

  const walletLabel = tab === "yape" ? "Yape" : "Plin";

  return (
    <Modal title="Agregar Método de Pago" onClose={onClose} maxWidthClass="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setErrors({});
              }}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-4 transition ${
                tab === id
                  ? "border-teal-500 bg-teal-50/50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {tab === "tarjeta" ? (
          <div className="space-y-4">
            <FormField
              label="Número de tarjeta"
              name="numeroTarjeta"
              inputMode="numeric"
              value={card.numeroTarjeta}
              onChange={(e) => {
                setCard((p) => ({
                  ...p,
                  numeroTarjeta: formatCardNumberInput(e.target.value),
                }));
                clearError("numeroTarjeta");
              }}
              error={errors.numeroTarjeta}
              placeholder="1234 5678 9012 3456"
              required
              maxLength={23}
            />
            <FormField
              label="Nombre en la tarjeta"
              name="nombreTarjeta"
              value={card.nombreTarjeta}
              onChange={(e) => {
                setCard((p) => ({
                  ...p,
                  nombreTarjeta: e.target.value
                    .toUpperCase()
                    .replace(/[^A-ZÁÉÍÓÚÑ\s]/g, "")
                    .slice(0, 60),
                }));
                clearError("nombreTarjeta");
              }}
              error={errors.nombreTarjeta}
              placeholder="CARMEN RODRIGUEZ"
              required
              maxLength={60}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Vencimiento"
                name="vencimiento"
                inputMode="numeric"
                value={card.vencimiento}
                onChange={(e) => {
                  setCard((p) => ({
                    ...p,
                    vencimiento: formatExpiryInput(e.target.value),
                  }));
                  clearError("vencimiento");
                }}
                error={errors.vencimiento}
                placeholder="MM/AA"
                required
                maxLength={5}
              />
              <FormField
                label="CVV"
                name="cvv"
                inputMode="numeric"
                value={card.cvv}
                onChange={(e) => {
                  setCard((p) => ({ ...p, cvv: allowDigitsOnly(e.target.value, 4) }));
                  clearError("cvv");
                }}
                onKeyDown={blockNonDigitKey}
                error={errors.cvv}
                placeholder="123"
                required
                maxLength={4}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <FormField
              label="Número de celular vinculado"
              name="telefono"
              inputMode="numeric"
              value={wallet.telefono}
              onChange={(e) => {
                setWallet({ telefono: allowDigitsOnly(e.target.value, 9) });
                clearError("telefono");
              }}
              onKeyDown={blockNonDigitKey}
              error={errors.telefono}
              placeholder="987654321"
              required
              maxLength={9}
            />
            <p className="text-xs text-slate-500">
              Debe ser el número registrado en {walletLabel}
            </p>
          </div>
        )}

        <div className="flex gap-2 rounded-xl border border-teal-100 bg-teal-50/80 px-3 py-3">
          <Shield className="h-4 w-4 shrink-0 text-teal-600" />
          <p className="text-xs text-teal-800">
            Tus datos de pago están protegidos con encriptación SSL de 256 bits.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          Agregar Método de Pago
        </button>
      </form>
    </Modal>
  );
}
