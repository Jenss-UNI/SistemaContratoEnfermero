import { useState, useEffect } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import { Loader2, X } from "lucide-react";

interface EarningRow {
  id: number;
  date: string;
  patientName: string;
  serviceType: string;
  hours: number;
  amount: number;
  netAmount: number;
  status: "available" | "pending" | "withdrawn";
}

interface WithdrawHistory {
  id: string;
  date: string;
  amount: number;
  account: string;
  status: "completed" | "processing";
}

export default function NurseWallet() {
  const { user } = useAuth();
  
  const [earnings, setEarnings] = useState<EarningRow[]>([]);
  const [withdraws, setWithdraws] = useState<WithdrawHistory[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  
  // Simulated local withdrawals balance deduction
  const [withdrawnDeduction, setWithdrawnDeduction] = useState(0);

  const fetchWalletData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select(`
          id,
          created_at,
          patient_name,
          service_type,
          total_hours,
          total_amount,
          payment_status
        `)
        .eq("nurse_id", user.id)
        .neq("status", "cancelled");

      if (error) throw error;

      const mapped: EarningRow[] = (data || []).map((s: any) => {
        const gross = Number(s.total_amount) || 0;
        const net = gross * 0.9; // 10% commission fee
        
        let status: "available" | "pending" = "pending";
        if (s.payment_status === "released") {
          status = "available";
        }
        
        return {
          id: s.id,
          date: s.created_at,
          patientName: s.patient_name || "Paciente",
          serviceType: s.service_type || "General",
          hours: s.total_hours || 0,
          amount: gross,
          netAmount: net,
          status,
        };
      });

      setEarnings(mapped);
    } catch (err) {
      console.error("Error loading wallet details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [user?.id]);

  const rawAvailable = earnings
    .filter((e) => e.status === "available")
    .reduce((acc, e) => acc + e.netAmount, 0);

  const available = Math.max(0, rawAvailable - withdrawnDeduction);
  
  const pending = earnings
    .filter((e) => e.status === "pending")
    .reduce((acc, e) => acc + e.netAmount, 0);

  const totalEarned = earnings.reduce((acc, e) => acc + e.netAmount, 0);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (amount <= 0 || amount > available) return;

    setWithdrawSuccess(true);
    
    // Record simulated withdrawal
    const newWithdrawal: WithdrawHistory = {
      id: `WDR-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      amount,
      account: "BCP ···4521",
      status: "processing"
    };

    setTimeout(() => {
      setWithdrawnDeduction((prev) => prev + amount);
      setWithdraws((prev) => [newWithdrawal, ...prev]);
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
      setWithdrawAmount("");
    }, 2500);
  };

  const fillMaxWithdraw = () => {
    if (available > 0) {
      setWithdrawAmount(String(Math.floor(available)));
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    available: { label: "Disponible", color: "text-emerald-600 bg-emerald-50 border border-emerald-100" },
    pending: { label: "En custodia", color: "text-orange-500 bg-orange-50/70 border border-orange-100" },
    withdrawn: { label: "Retirado", color: "text-gray-500 bg-gray-100 border border-gray-250" },
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-semibold">Cargando billetera...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-[#14b8a6] rounded-2xl p-5 text-white shadow-sm flex flex-col justify-center min-h-[120px]">
          <p className="text-xs font-semibold text-teal-50 mb-1.5 uppercase tracking-wider">Saldo Disponible</p>
          <p className="text-3xl font-black leading-tight mb-1.5">
            S/ {available.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-teal-150">Listo para retirar a cuenta bancaria</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-center min-h-[120px]">
          <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">En Custodia (Escrow)</p>
          <p className="text-3xl font-black leading-tight text-[#c2533c] mb-1.5">
            S/ {pending.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium">Se libera al finalizar la jornada</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-center min-h-[120px]">
          <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Total Ganado Histórico</p>
          <p className="text-3xl font-black leading-tight text-slate-800 mb-1.5">
            S/ {totalEarned.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium">Neto después de comisión del 10%</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowWithdrawModal(true)}
          disabled={available < 50}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#14b8a6] hover:bg-[#0d9488] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          <i className="ri-layout-top-line text-base"></i>
          Solicitar Retiro
        </button>
      </div>

      {/* HISTORIAL */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50">
          <h3 className="text-base font-bold text-slate-900">Historial de Ganancias</h3>
        </div>

        {earnings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-full mx-auto mb-4 border border-slate-100">
              <i className="ri-money-dollar-circle-line text-slate-300 text-2xl"></i>
            </div>
            <p className="text-sm text-slate-655 font-semibold">Aún no tienes ganancias registradas</p>
            <p className="text-xs text-slate-400 mt-1">Completa jornadas de trabajo para empezar a recibir ingresos.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4">Fecha</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4">Paciente</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4 hidden sm:table-cell">Servicio</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Horas</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4">Monto Bruto</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4">Monto Neto</th>
                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((e) => {
                    const s = statusConfig[e.status];
                    return (
                      <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 text-xs text-slate-550 whitespace-nowrap font-medium">
                          {new Date(e.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" }).replace(".", "")}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-800 whitespace-nowrap">{e.patientName}</td>
                        <td className="px-6 py-4 text-xs text-slate-655 whitespace-nowrap hidden sm:table-cell">{e.serviceType}</td>
                        <td className="px-6 py-4 text-xs text-slate-655 whitespace-nowrap hidden md:table-cell font-semibold">{e.hours}h</td>
                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">S/ {e.amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-800 whitespace-nowrap">S/ {e.netAmount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${s.color}`}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3 p-4">
              {earnings.map((e) => {
                const s = statusConfig[e.status];
                return (
                  <div key={e.id} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{e.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {new Date(e.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" }).replace(".", "")}
                        </p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide ${s.color}`}>{s.label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-slate-600 border-t border-slate-100 pt-2 font-medium">
                      <div>
                        <span className="text-slate-400 block">Monto Neto</span>
                        <strong className="text-slate-800 font-bold">S/ {e.netAmount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Monto Bruto</span>
                        <strong className="text-slate-800 font-bold">S/ {e.amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Horas Realizadas</span>
                        <strong className="text-slate-800">{e.hours} horas</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Servicio</span>
                        <strong className="text-slate-800">{e.serviceType}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* RETIROS ANTERIORES */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-5">Retiros de Efectivo</h3>
        
        {withdraws.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-full mx-auto mb-4 border border-slate-100">
              <i className="ri-bank-line text-slate-300 text-2xl"></i>
            </div>
            <p className="text-sm text-slate-655 font-semibold">No hay retiros registrados</p>
            <p className="text-xs text-slate-400 mt-1">Los retiros que solicites aparecerán listados aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Código</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Fecha</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Destino</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Monto</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {withdraws.map((w) => (
                  <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{w.id}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                      {new Date(w.date).toLocaleDateString("es-PE")}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-655 font-semibold">{w.account}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">S/ {w.amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide ${
                        w.status === "completed" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                          : "bg-blue-50 text-blue-750 border border-blue-100 animate-pulse"
                      }`}>
                        {w.status === "completed" ? "Transferido" : "Procesando"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowWithdrawModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {withdrawSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 flex items-center justify-center bg-teal-50 border border-teal-100 rounded-full mx-auto mb-5 animate-bounce">
                  <i className="ri-checkbox-circle-fill text-[#14b8a6] text-4xl"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">¡Solicitud enviada!</h3>
                <p className="text-xs text-slate-550 max-w-xs mx-auto leading-relaxed">
                  Tu retiro de <strong className="text-slate-850">S/ {Number(withdrawAmount).toLocaleString()}</strong> ha sido registrado. Será depositado en tu cuenta en 1-2 días hábiles.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-slate-800">Solicitar Retiro de Fondos</h2>
                  <button type="button" onClick={() => setShowWithdrawModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-655 cursor-pointer transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-teal-50 border border-teal-150/40 rounded-2xl p-5 mb-5 text-center">
                  <p className="text-[10px] text-teal-655 font-bold uppercase tracking-wider mb-1">Saldo Neto Disponible</p>
                  <p className="text-3xl font-black text-teal-800">
                    S/ {available.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2 gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monto a retirar (S/)</label>
                    <button
                      type="button"
                      onClick={fillMaxWithdraw}
                      disabled={available < 50}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 disabled:text-slate-305 transition-colors cursor-pointer"
                    >
                      Retirar todo
                    </button>
                  </div>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={available > 0 ? available : 1}
                    min={50}
                    placeholder="Ej: 300"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {available >= 50
                      ? `Monto Mínimo: S/ 50.00 · Máximo: S/ ${Math.floor(available).toLocaleString()}`
                      : "Debes tener al menos S/ 50.00 de saldo disponible para solicitar retiros."}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cuenta bancaria de destino</label>
                  <div className="flex items-center gap-3.5 p-4 border border-slate-100 rounded-2xl bg-slate-50/70">
                    <div className="w-10 h-10 bg-white border border-slate-200/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-bank-line text-slate-500 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">BCP Ahorros Soles</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Cuenta: ····4521</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={available < 50 || !withdrawAmount || Number(withdrawAmount) < 50 || Number(withdrawAmount) > available}
                  className="w-full py-3 bg-[#14b8a6] hover:bg-[#0d9488] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer text-center"
                >
                  Confirmar y Retirar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}