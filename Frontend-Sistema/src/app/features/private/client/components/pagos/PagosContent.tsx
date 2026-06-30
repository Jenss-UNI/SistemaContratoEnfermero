import { DollarSign, Plus, Shield, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../../../core/contexts/AuthContext";
import { supabase } from "../../../../../core/services/supabase";
import type {
  CardFormData,
  PaymentMethod,
  PaymentMethodType,
  WalletFormData,
  PaymentHistoryItem,
} from "../../../../../core/models/payment.model";
import {
  AddPaymentMethodModal,
  PaymentHistoryTable,
  PaymentMethodCard,
  SecurityBanner,
} from "../../../../../shared/components/client/pagos";
import { MOCK_PAYMENT_METHODS } from "../../data/mockPayments";

function createId(): string {
  return `pm-${Date.now()}`;
}

export default function PagosContent() {
  const { user } = useAuth();
  
  const [methods, setMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem("cuidame_payment_methods");
    return saved ? JSON.parse(saved) : MOCK_PAYMENT_METHODS;
  });
  
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  const saveMethods = (newMethods: PaymentMethod[]) => {
    setMethods(newMethods);
    localStorage.setItem("cuidame_payment_methods", JSON.stringify(newMethods));
  };

  const fetchPayments = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select(`
          id,
          created_at,
          payment_status,
          total_amount,
          service_type,
          profiles:nurse_id (
            nombres,
            apellidos_pa
          )
        `)
        .eq("client_id", user.id);

      if (error) throw error;

      const mapped: PaymentHistoryItem[] = (data || []).map((s: any) => {
        const nurseName = s.profiles 
          ? `${s.profiles.nombres} ${s.profiles.apellidos_pa || ""}`.trim() 
          : "Enfermero por asignar";
        
        let estado: "pagado" | "custodia" | "pendiente" = "pendiente";
        if (s.payment_status === "released") {
          estado = "pagado";
        } else if (s.payment_status === "in_custody") {
          estado = "custodia";
        }

        return {
          id: String(s.id),
          fecha: new Date(s.created_at).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }),
          enfermero: nurseName,
          tipo: s.service_type || "Asistencia General",
          monto: Number(s.total_amount) || 0,
          estado,
          factura: `FAC-${s.id}`,
        };
      });

      setHistory(mapped);
    } catch (err) {
      console.error("Error loading payment history:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const setPrincipal = (id: string) => {
    const updated = methods.map((m) => ({ ...m, esPrincipal: m.id === id }));
    saveMethods(updated);
  };

  const deleteMethod = (id: string) => {
    setMethodToDelete(id);
  };

  const confirmDeleteMethod = () => {
    if (!methodToDelete) return;
    const target = methods.find((m) => m.id === methodToDelete);
    if (!target) return;
    
    const next = methods.filter((m) => m.id !== methodToDelete);
    if (target.esPrincipal && next.length > 0) {
      next[0] = { ...next[0], esPrincipal: true };
    }
    saveMethods(next);
    setMethodToDelete(null);
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

    const updated = isFirst 
      ? [...methods.map((m) => ({ ...m, esPrincipal: false })), nuevo]
      : [...methods, nuevo];
      
    saveMethods(updated);
    setShowAddModal(false);
  };

  const totalPaid = history
    .filter((h) => h.estado === "pagado")
    .reduce((acc, h) => acc + h.monto, 0);

  const totalInCustody = history
    .filter((h) => h.estado === "custodia")
    .reduce((acc, h) => acc + h.monto, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Cargando datos de pagos...</p>
      </div>
    );
  }

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
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>

        <div className="max-w-lg space-y-5">
          {methods.length === 0 ? (
            <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
              No tienes métodos de pago agregados.
            </div>
          ) : (
            methods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSetPrincipal={() => setPrincipal(method.id)}
                onDelete={() => deleteMethod(method.id)}
              />
            ))
          )}
        </div>

        <SecurityBanner />
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Card Total Pagado */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-105 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total pagado</p>
              <p className="text-2xl font-black text-slate-850">
                S/ {totalPaid.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          
          {/* Card En Custodia */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-105 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-100">
              <Shield className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">En custodia (Escrow)</p>
              <p className="text-2xl font-black text-slate-850">
                S/ {totalInCustody.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl pt-4">Historial de Pagos</h2>
        
        {history.length === 0 ? (
          <div className="p-12 border border-dashed border-slate-200 rounded-3xl text-center text-xs text-slate-400">
            Aún no posees transacciones en tu historial.
          </div>
        ) : (
          <PaymentHistoryTable items={history} />
        )}
      </section>

      {showAddModal && (
        <AddPaymentMethodModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}

      {/* CONFIRM DELETE MODAL */}
      {methodToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMethodToDelete(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-rose-50 border border-rose-100 rounded-full mx-auto mb-4 text-rose-500">
                <AlertTriangle className="h-6 w-6 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">¿Eliminar método de pago?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                Esta acción no se puede deshacer. Deberás volver a asociar tu tarjeta o billetera si deseas utilizarla nuevamente.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMethodToDelete(null)}
                  className="border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteMethod}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs shadow-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
