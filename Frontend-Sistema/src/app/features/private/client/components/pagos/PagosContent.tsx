import { DollarSign, Plus, Shield } from "lucide-react";
import { useState } from "react";
import type {
  CardFormData,
  PaymentMethod,
  PaymentMethodType,
  WalletFormData,
} from "../../../../../core/models/payment.model";
import {
  AddPaymentMethodModal,
  PaymentHistoryTable,
  PaymentMethodCard,
  SecurityBanner,
} from "../../../../../shared/components/client/pagos";
import { MOCK_PAYMENT_HISTORY, MOCK_PAYMENT_METHODS } from "../../data/mockPayments";

function createId(): string {
  return `pm-${Date.now()}`;
}

export default function PagosContent() {
  const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [showAddModal, setShowAddModal] = useState(false);

  const setPrincipal = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, esPrincipal: m.id === id }))
    );
  };

  const deleteMethod = (id: string) => {
    const target = methods.find((m) => m.id === id);
    if (!target) return;
    if (!window.confirm("¿Eliminar este método de pago?")) return;
    setMethods((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (target.esPrincipal && next.length > 0) {
        next[0] = { ...next[0], esPrincipal: true };
      }
      return next;
    });
  };

  const handleAdd = (tipo: PaymentMethodType, data: CardFormData | WalletFormData) => {
    const isFirst = methods.length === 0;
    let nuevo: PaymentMethod;

    if (tipo === "tarjeta") {
      const card = data as CardFormData;
      const last4 = card.numeroTarjeta.slice(-4);
      nuevo = {
        id: createId(),
        tipo: "tarjeta",
        esPrincipal: isFirst,
        terminacion: last4,
        marca: "Visa",
      };
    } else {
      const wallet = data as WalletFormData;
      nuevo = {
        id: createId(),
        tipo,
        esPrincipal: isFirst,
        telefono: wallet.telefono,
      };
    }

    setMethods((prev) => [
      ...(isFirst ? prev.map((m) => ({ ...m, esPrincipal: false })) : prev),
      nuevo,
    ]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Métodos de Pago</h2>
            <p className="mt-1 text-sm text-slate-500">
              Gestiona tus tarjetas y billeteras digitales
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>

        <div className="max-w-lg space-y-5">
          {methods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetPrincipal={() => setPrincipal(method.id)}
              onDelete={() => deleteMethod(method.id)}
            />
          ))}
        </div>

        <SecurityBanner />
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total pagado</p>
              <p className="text-xl font-bold text-slate-900">S/ 100</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">
              <Shield className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">En custodia</p>
              <p className="text-xl font-bold text-slate-900">S/ 318</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Historial de Pagos</h2>
        <PaymentHistoryTable items={MOCK_PAYMENT_HISTORY} />
      </section>

      {showAddModal && (
        <AddPaymentMethodModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
