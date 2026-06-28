import { useEffect, useState } from "react";
import { CreditCard, Smartphone, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import {
  fetchUserPaymentMethod,
  savePaymentMethod,
  updateSubscription,
} from "../../../../features/private/client/services/subscription.service";
import type { PaymentMethod } from "../../../../core/models/payment.model";
import Modal from "../mis-pacientes/Modal";
import { FormField } from "../mi-perfil";
import {
  allowDigitsOnly,
  blockNonDigitKey,
  validateCardExpiry,
  validateCardHolder,
  validateCardNumber,
  validateCvv,
  validatePhone,
} from "../../../utils/validation";
import {
  formatCardNumberInput,
  formatExpiryInput,
  getMethodTitle,
  getMethodSubtitle,
} from "./paymentUtils";

type ConfirmSubscriptionModalProps = {
  planId: number;
  planNombre: string;
  precio: number;
  ciclo: "mensual" | "anual";
  onClose: () => void;
  onConfirm: () => void;
};

type PaymentMethodType = "tarjeta" | "yape" | "plin";

type CardFormData = {
  numeroTarjeta: string;
  nombreTarjeta: string;
  vencimiento: string;
  cvv: string;
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

function getCardBrand(number: string): string {
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  return "Tarjeta";
}

export default function ConfirmSubscriptionModal({
  planId,
  planNombre,
  precio,
  ciclo,
  onClose,
  onConfirm,
}: ConfirmSubscriptionModalProps) {
  const { user } = useAuth();
  
  // ── Estados de Carga y Métodos Existentes ──────────────────────────────────
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [existingMethod, setExistingMethod] = useState<PaymentMethod | null>(null);
  const [useNewMethod, setUseNewMethod] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Estados para nuevo método de pago ──────────────────────────────────────
  const [tab, setTab] = useState<PaymentMethodType>("tarjeta");
  const [card, setCard] = useState<CardFormData>(EMPTY_CARD);
  const [walletPhone, setWalletPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar método de pago guardado
  useEffect(() => {
    async function loadPayment() {
      if (!user?.id) return;
      try {
        const pm = await fetchUserPaymentMethod(user.id);
        if (pm) {
          // Adaptar formato a lo que getMethodTitle y getMethodSubtitle esperan
          setExistingMethod({
            id: pm.id || "",
            tipo: pm.tipo as any,
            esPrincipal: pm.es_principal,
            terminacion: pm.terminacion,
            telefono: pm.telefono,
            marca: pm.marca,
          });
        }
      } catch (err) {
        console.error("Error loading payment method:", err);
      } finally {
        setLoadingPayment(false);
      }
    }
    loadPayment();
  }, [user?.id]);

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

  const validateWallet = (): string | null => {
    const telErr = validatePhone(walletPhone);
    if (telErr) {
      setErrors({ telefono: telErr });
      return null;
    }
    setErrors({});
    return walletPhone.replace(/\D/g, "");
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Si no tiene método o decidió usar uno nuevo, validarlo y guardarlo
      if (!existingMethod || useNewMethod) {
        if (tab === "tarjeta") {
          const validatedCard = validateCard();
          if (!validatedCard) {
            setIsSubmitting(false);
            return;
          }
          await savePaymentMethod(user.id, {
            tipo: "tarjeta",
            es_principal: true,
            terminacion: validatedCard.numeroTarjeta.slice(-4),
            marca: getCardBrand(card.numeroTarjeta),
            nombre_tarjeta: validatedCard.nombreTarjeta,
          });
        } else {
          const validatedPhone = validateWallet();
          if (!validatedPhone) {
            setIsSubmitting(false);
            return;
          }
          await savePaymentMethod(user.id, {
            tipo: tab,
            es_principal: true,
            telefono: validatedPhone,
          });
        }
      }

      // 2. Realizar la suscripción
      await updateSubscription(user.id, planId, ciclo);
      
      // 3. Callback de éxito
      onConfirm();
    } catch (err: any) {
      console.error("Error al procesar la suscripción:", err);
      setSubmitError(err.message || "Ocurrió un error inesperado al procesar tu pago. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnnual = ciclo === "anual";
  const durationText = isAnnual ? "14 meses (incluye 2 meses gratis)" : "1 mes";

  return (
    <Modal title="Confirmar Suscripción" onClose={onClose} maxWidthClass="max-w-lg">
      <form onSubmit={handleConfirm} autoComplete="off" className="space-y-6">
        
        {/* ── Resumen del Plan Elegido ── */}
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-sky-50/30 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">Plan Seleccionado</h3>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Plan {planNombre}</h4>
              <p className="text-xs text-slate-500 mt-1">Facturación: {isAnnual ? "Anual" : "Mensual"}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900">S/ {precio.toFixed(2)}</span>
              <p className="text-xs text-slate-500 mt-0.5">/{isAnnual ? "año" : "mes"}</p>
            </div>
          </div>
          
          <div className="mt-4 border-t border-teal-100/70 pt-3 flex justify-between items-center text-sm text-slate-700">
            <span>Periodo de acceso:</span>
            <span className="font-semibold text-teal-900">{durationText}</span>
          </div>
        </div>

        {/* ── Sección de Pago ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Método de Pago</h3>

          {loadingPayment ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              <span className="ml-2 text-sm text-slate-500">Cargando método de pago...</span>
            </div>
          ) : existingMethod && !useNewMethod ? (
            /* Mostrar método de pago existente */
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100/80 text-teal-700 font-bold">
                    {existingMethod.tipo === "tarjeta" ? (
                      <CreditCard className="h-5 w-5" />
                    ) : (
                      <Smartphone className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {getMethodTitle(existingMethod)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {getMethodSubtitle(existingMethod)}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setUseNewMethod(true)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                >
                  Cambiar
                </button>
              </div>
            </div>
          ) : (
            /* Formulario para nuevo método de pago */
            <div className="space-y-4">
              {existingMethod && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500">Introduce los nuevos datos de pago:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUseNewMethod(false);
                      setErrors({});
                    }}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                  >
                    Usar tarjeta guardada
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-2">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTab(id);
                      setErrors({});
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 transition ${
                      tab === id
                        ? "border-teal-500 bg-teal-50/40 text-teal-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-semibold">{label}</span>
                  </button>
                ))}
              </div>

              {tab === "tarjeta" ? (
                <div className="space-y-3.5">
                  <FormField
                    label="Número de tarjeta"
                    name="num_t"
                    autoComplete="new-password"
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
                    name="nom_t"
                    autoComplete="new-password"
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
                    placeholder="Nombre y Apellido"
                    required
                    maxLength={60}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Vencimiento"
                      name="exp_t"
                      autoComplete="new-password"
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
                      placeholder="MM / AA"
                      required
                      maxLength={5}
                    />
                    <FormField
                      label="CVV"
                      name="cv_t"
                      autoComplete="new-password"
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
                <div className="space-y-1">
                  <FormField
                    label={`Número de celular vinculado a ${tab === "yape" ? "Yape" : "Plin"}`}
                    name="telefono"
                    inputMode="numeric"
                    value={walletPhone}
                    onChange={(e) => {
                      setWalletPhone(allowDigitsOnly(e.target.value, 9));
                      clearError("telefono");
                    }}
                    onKeyDown={blockNonDigitKey}
                    error={errors.telefono}
                    placeholder="987654321"
                    required
                    maxLength={9}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Debe ser el número registrado en tu cuenta móvil.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Mensajes de error al procesar ── */}
        {submitError && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
            {submitError}
          </p>
        )}

        {/* ── Acciones de Envío ── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || (loadingPayment && !existingMethod)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                Procesando...
              </>
            ) : (
              <>
                Confirmar Pago
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}
