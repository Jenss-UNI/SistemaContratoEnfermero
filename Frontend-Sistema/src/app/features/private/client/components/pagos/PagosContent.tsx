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
  FacturaDetalle,
  PlanFacturaDetalle,
} from "../../../../../core/models/payment.model";
import {
  AddPaymentMethodModal,
  PaymentHistoryTable,
  PaymentMethodCard,
  SecurityBanner,
  FacturaModal,
  PlanFacturaModal,
  generateInvoicePdf,
  generatePlanInvoicePdf,
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

  const [contractHistory, setContractHistory] = useState<PaymentHistoryItem[]>([]);
  const [planHistory, setPlanHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  const [selectedFactura, setSelectedFactura] = useState<FacturaDetalle | null>(null);
  const [selectedPlanFactura, setSelectedPlanFactura] = useState<PlanFacturaDetalle | null>(null);

  const [activeTab, setActiveTab] = useState<"contrataciones" | "planes">("contrataciones");

  const saveMethods = (newMethods: PaymentMethod[]) => {
    setMethods(newMethods);
    localStorage.setItem("cuidame_payment_methods", JSON.stringify(newMethods));
  };

  const fetchPayments = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch payment methods from DB
      const { data: dbMethods } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: true });

      if (dbMethods && dbMethods.length > 0) {
        const mappedMethods: PaymentMethod[] = dbMethods.map((m: any) => ({
          id: m.id,
          tipo: m.tipo as PaymentMethodType,
          esPrincipal: m.es_principal,
          terminacion: m.terminacion || undefined,
          marca: m.marca || undefined,
          nombreTarjeta: m.nombre_tarjeta || undefined,
          telefono: m.telefono || undefined,
        }));
        setMethods(mappedMethods);
      }

      // 2. Fetch contract payments with full detail
      const { data, error } = await supabase
        .from("services")
        .select(`
          id,
          created_at,
          payment_status,
          total_amount,
          total_hours,
          hourly_rate,
          service_type,
          patient_name,
          address,
          district,
          client:client_id (
            nombres,
            apellidos_pa,
            apellidos_ma
          ),
          nurse:nurse_id (
            nombres,
            apellidos_pa,
            nurse_profiles (
              nivel
            )
          )
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      // 3. Fetch plan payments
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select(`
          id,
          created_at,
          status,
          ciclo,
          fecha_vence,
          plans:plan_id (
            nombre,
            precio_mensual
          )
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (subscriptionsError) throw subscriptionsError;

      const mapped: PaymentHistoryItem[] = (data || []).map((s: any) => {
        const nurseObj = s.nurse || {};
        const nLevel = nurseObj.nurse_profiles?.[0]?.nivel;
        const prefix = nLevel === "Técnico en Enfermería" ? "Tec. " : "Lic. ";
        const nurseName = nurseObj.nombres
          ? `${prefix}${nurseObj.nombres} ${nurseObj.apellidos_pa || ""}`.trim()
          : "Lic. JENS JEREMIES LUNA";

        let estado: "pagado" | "custodia" | "pendiente" = "pendiente";
        if (s.payment_status === "released") {
          estado = "pagado";
        } else if (s.payment_status === "in_custody") {
          estado = "custodia";
        }

        const clientObj = s.client || {};
        const clientName = clientObj.nombres
          ? `${clientObj.nombres} ${clientObj.apellidos_pa || ""}`.trim()
          : "SHIRLEY PARCCO";

        const horas = Number(s.total_hours) || 8;
        const montoTotal = Number(s.total_amount) || 424;
        const tarifaHora = Number(s.hourly_rate) || (horas > 0 ? Math.round(montoTotal / horas) : 53);

        const fechaStr = new Date(s.created_at).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
        const fechaFullStr = new Date(s.created_at).toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

        const facturaDetalle: FacturaDetalle = {
          numFactura: `F001-${String(s.id).padStart(6, "0")}`,
          fechaEmision: fechaStr,
          clienteNombre: clientName,
          pacienteNombre: s.patient_name || clientName,
          direccion: s.address || "Dirección registrada",
          distrito: s.district || "San Juan de Lurigancho",
          enfermeroNombre: nurseName,
          tipoServicio: s.service_type || "Especializado",
          horas,
          tarifaHora,
          fechaServicio: fechaFullStr,
          metodoPago: "Tarjeta Visa (...3872)",
          montoTotal,
        };

        return {
          id: String(s.id),
          fecha: fechaStr,
          enfermero: nurseName,
          tipo: s.service_type || "Especializado",
          monto: montoTotal,
          estado,
          factura: `FAC-${s.id}`,
          facturaDetalle,
        };
      });

      const subscriptionHistory: PaymentHistoryItem[] = (subscriptions || []).map((sub: any) => {
        const rawPlanName = sub.plans?.nombre || "Básico";
        const planTipo = rawPlanName.toUpperCase();
        const monto = Number(sub.plans?.precio_mensual ?? 24.9);
        const fechaStr = new Date(sub.created_at).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
        const clientName = `${user?.user_metadata?.nombres || "Shirley"} ${user?.user_metadata?.apellidos_pa || ""}`.trim();

        const fechaVenceDate = sub.fecha_vence ? new Date(sub.fecha_vence) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const fechaVencimientoStr = fechaVenceDate.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
        const fechaEmisionStr = new Date(sub.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });

        const planFacturaDetalle: PlanFacturaDetalle = {
          numFactura: `PLAN-${new Date(sub.created_at).getFullYear()}-${String(sub.id).slice(0, 6).toUpperCase()}`,
          fechaEmision: fechaEmisionStr,
          clienteNombre: clientName,
          planNombre: `Plan ${rawPlanName}`,
          planTipo,
          precioUnitario: monto,
          montoTotal: monto,
          metodoPago: "Yape",
          operacionId: `YAP-CU-${String(sub.id).slice(0, 8).toUpperCase()}`,
          detallesPago: "Número asociado +51 937 032 735 (confirmado)",
          fechaVencimiento: fechaVencimientoStr,
        };

        return {
          id: `plan-${sub.id}`,
          fecha: fechaStr,
          enfermero: "Plan de Suscripción",
          tipo: planTipo,
          monto,
          estado: "pagado", // All subscriptions in history represent confirmed paid plans in DB
          factura: `PLAN-${sub.id}`,
          planFacturaDetalle,
        };
      });

      setContractHistory(mapped);
      setPlanHistory(subscriptionHistory);
    } catch (err) {
      console.error("Error loading payment history:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.user_metadata]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const setPrincipal = async (id: string) => {
    const updated = methods.map((m) => ({ ...m, esPrincipal: m.id === id }));
    saveMethods(updated);

    if (user?.id) {
      try {
        await supabase.from("payment_methods").update({ es_principal: false }).eq("client_id", user.id);
        await supabase.from("payment_methods").update({ es_principal: true }).eq("id", id);
      } catch (err) {
        console.error("Error setting principal payment method in DB:", err);
      }
    }
  };

  const deleteMethod = (id: string) => {
    setMethodToDelete(id);
  };

  const confirmDeleteMethod = async () => {
    if (!methodToDelete) return;
    const target = methods.find((m) => m.id === methodToDelete);
    if (!target) return;

    const next = methods.filter((m) => m.id !== methodToDelete);
    if (target.esPrincipal && next.length > 0) {
      next[0] = { ...next[0], esPrincipal: true };
    }
    saveMethods(next);

    if (user?.id) {
      try {
        await supabase.from("payment_methods").delete().eq("id", methodToDelete);
        if (target.esPrincipal && next.length > 0) {
          await supabase.from("payment_methods").update({ es_principal: true }).eq("id", next[0].id);
        }
      } catch (err) {
        console.error("Error deleting payment method from DB:", err);
      }
    }

    setMethodToDelete(null);
  };

  const handleAdd = async (tipo: PaymentMethodType, data: CardFormData | WalletFormData) => {
    const isFirst = methods.length === 0;
    let nuevo: PaymentMethod;
    const dbPayload: any = {
      client_id: user?.id,
      tipo,
      es_principal: isFirst,
    };

    if (tipo === "tarjeta") {
      const card = data as CardFormData;
      const last4 = card.numeroTarjeta.slice(-4);
      nuevo = {
        id: createId(),
        tipo: "tarjeta",
        esPrincipal: isFirst,
        terminacion: last4,
        marca: "Visa",
        nombreTarjeta: card.nombreTarjeta,
      };
      dbPayload.terminacion = last4;
      dbPayload.marca = "Visa";
      dbPayload.nombre_tarjeta = card.nombreTarjeta;
    } else {
      const wallet = data as WalletFormData;
      nuevo = {
        id: createId(),
        tipo,
        esPrincipal: isFirst,
        telefono: wallet.telefono,
      };
      dbPayload.telefono = wallet.telefono;
    }

    if (user?.id) {
      try {
        if (isFirst) {
          await supabase.from("payment_methods").update({ es_principal: false }).eq("client_id", user.id);
        }
        const { data: inserted, error } = await supabase.from("payment_methods").insert(dbPayload).select().single();
        if (!error && inserted) {
          nuevo.id = inserted.id;
        }
      } catch (err) {
        console.error("Error saving payment method to DB:", err);
      }
    }

    const updated = isFirst
      ? [...methods.map((m) => ({ ...m, esPrincipal: false })), nuevo]
      : [...methods, nuevo];

    saveMethods(updated);
    setShowAddModal(false);
  };

  const handleVerFactura = (item: PaymentHistoryItem) => {
    if (item.facturaDetalle) {
      setSelectedFactura(item.facturaDetalle);
    } else if (item.planFacturaDetalle) {
      setSelectedPlanFactura(item.planFacturaDetalle);
    }
  };

  const handleImprimirFactura = (item: PaymentHistoryItem) => {
    if (item.facturaDetalle) {
      generateInvoicePdf(item.facturaDetalle);
    } else if (item.planFacturaDetalle) {
      generatePlanInvoicePdf(item.planFacturaDetalle);
    }
  };

  const totalPaid =
  [...contractHistory, ...planHistory]
    .filter((h) => h.estado === "pagado")
    .reduce((acc, h) => acc + h.monto, 0);

  const totalInCustody =
  [...contractHistory, ...planHistory]
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

      <section className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Card Total Pagado */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
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
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
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

        <div className="space-y-4 pt-2">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Historial de Pagos
          </h2>

          {/* Pestañas de Navegación de Pagos */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("contrataciones")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition cursor-pointer ${
                activeTab === "contrataciones"
                  ? "bg-teal-500 text-white shadow-sm hover:bg-teal-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              Pagos por Contrataciones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("planes")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition cursor-pointer ${
                activeTab === "planes"
                  ? "bg-teal-500 text-white shadow-sm hover:bg-teal-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              Pagos por Planes
            </button>
          </div>
        </div>

        {/* Tabla según la Pestaña Seleccionada */}
        {activeTab === "contrataciones" ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            {contractHistory.length === 0 ? (
              <div className="p-12 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 font-medium">
                No tienes pagos por contrataciones registrados.
              </div>
            ) : (
              <PaymentHistoryTable
                items={contractHistory}
                onVerFactura={handleVerFactura}
                onImprimirFactura={handleImprimirFactura}
              />
            )}
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in duration-200">
            {planHistory.length === 0 ? (
              <div className="p-12 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 font-medium">
                No tienes pagos de planes registrados.
              </div>
            ) : (
              <PaymentHistoryTable
                items={planHistory}
                onVerFactura={handleVerFactura}
                onImprimirFactura={handleImprimirFactura}
              />
            )}
          </div>
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
      {selectedFactura && (
        <FacturaModal
          factura={selectedFactura}
          onClose={() => setSelectedFactura(null)}
        />
      )}
      {selectedPlanFactura && (
        <PlanFacturaModal
          factura={selectedPlanFactura}
          onClose={() => setSelectedPlanFactura(null)}
        />
      )}
    </div>
  );
}
