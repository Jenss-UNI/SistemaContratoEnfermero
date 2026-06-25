import { useState } from 'react';

interface EarningRow {
  id: number;
  date: string;
  patientName: string;
  serviceType: string;
  hours: number;
  amount: number;
  netAmount: number;
  status: 'available' | 'pending';
}

const MOCK_EARNINGS: EarningRow[] = [
  {
    id: 1,
    date: '2026-05-15T12:00:00',
    patientName: 'Roberto Pasco',
    serviceType: 'Especializado',
    hours: 20,
    amount: 1300,
    netAmount: 1170,
    status: 'pending',
  },
];

export default function NurseWallet() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [earnings] = useState<EarningRow[]>(MOCK_EARNINGS);

  const available = earnings.filter((e) => e.status === 'available').reduce((acc, e) => acc + e.netAmount, 0);
  const pending = earnings.filter((e) => e.status === 'pending').reduce((acc, e) => acc + e.netAmount, 0);
  const totalEarned = earnings.reduce((acc, e) => acc + e.netAmount, 0);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    }, 2500);
  };

  const fillMaxWithdraw = () => {
    if (available > 0) {
      setWithdrawAmount(String(available));
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    available: { label: 'Disponible', color: 'text-emerald-600 bg-emerald-50' },
    pending: { label: 'En custodia', color: 'text-orange-500 bg-orange-50/70' },
    withdrawn: { label: 'Retirado', color: 'text-gray-500 bg-gray-100' },
  };

  return (
    <div className="space-y-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#14b8a6] rounded-xl p-4 text-white shadow-sm flex flex-col justify-center min-h-[110px]">
          <p className="text-xs font-medium text-teal-50 mb-1.5">Saldo Disponible</p>
          <p className="text-3xl font-bold leading-tight mb-1.5">S/ {available.toLocaleString()}</p>
          <p className="text-xs text-teal-100">Listo para retirar</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-center min-h-[110px]">
          <p className="text-xs font-medium text-gray-500 mb-1.5">En Custodia</p>
          <p className="text-3xl font-bold leading-tight text-[#c2533c] mb-1.5">S/ {pending.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Liberado al completar servicio</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-center min-h-[110px]">
          <p className="text-xs font-medium text-gray-500 mb-1.5">Total Ganado</p>
          <p className="text-3xl font-bold leading-tight text-gray-900 mb-1.5">S/ {totalEarned.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Neto después de comisión 10%</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#14b8a6] text-white text-xs font-semibold rounded-lg hover:bg-[#0d9488] transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <i className="ri-layout-top-line text-base"></i>Solicitar Retiro
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="text-base font-bold text-gray-900">Historial de Ganancias</h3>
        </div>

        {earnings.length === 0 ? (
          <div className="text-center py-10 border-t border-gray-50">
            <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-full mx-auto mb-4">
              <i className="ri-money-dollar-circle-line text-gray-400 text-2xl"></i>
            </div>
            <p className="text-base text-gray-600 font-medium">Aún no tienes ganancias registradas</p>
            <p className="text-sm text-gray-400 mt-1">Completar servicios para ver tus ingresos aquí</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#fafafa] border-y border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Fecha</th>
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Paciente</th>
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap hidden sm:table-cell">Tipo</th>
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap hidden md:table-cell">Horas</th>
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Bruto</th>
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Neto</th>
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((e) => {
                    const s = statusConfig[e.status];
                    return (
                      <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(e.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }).replace('.', '.-')}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{e.patientName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap hidden sm:table-cell">{e.serviceType}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap hidden md:table-cell">{e.hours}h</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">S/ {e.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">S/ {e.netAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3 px-4 pb-4">
              {earnings.map((e) => {
                const s = statusConfig[e.status];
                return (
                  <div key={e.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{e.patientName}</p>
                        <p className="text-[11px] text-gray-500">{new Date(e.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }).replace('.', '.-')}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-600">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">Neto</p>
                        <p>S/ {e.netAmount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">Bruto</p>
                        <p>S/ {e.amount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">Horas</p>
                        <p>{e.hours}h</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">Tipo</p>
                        <p>{e.serviceType}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-6">Retiros Anteriores</h3>
        <div className="text-center py-10">
          <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-full mx-auto mb-4">
            <i className="ri-bank-line text-gray-400 text-2xl"></i>
          </div>
          <p className="text-base text-gray-600 font-medium">No hay retiros registrados</p>
          <p className="text-sm text-gray-400 mt-1">Los retiros que solicites aparecerán aquí</p>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {withdrawSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 flex items-center justify-center bg-teal-50 rounded-full mx-auto mb-5">
                  <i className="ri-checkbox-circle-fill text-[#14b8a6] text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h3>
                <p className="text-sm text-gray-500">Tu retiro de <strong>S/ {withdrawAmount}</strong> será procesado en 1-2 días hábiles.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Solicitar Retiro</h2>
                  <button type="button" onClick={() => setShowWithdrawModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <i className="ri-close-line text-gray-500 text-lg"></i>
                  </button>
                </div>

                <div className="bg-teal-50 rounded-xl p-5 mb-6 border border-teal-100/50">
                  <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-1">Saldo disponible</p>
                  <p className="text-3xl font-bold text-teal-800">S/ {available.toLocaleString()}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 gap-3">
                    <label className="text-sm font-semibold text-gray-700">Monto a retirar (S/)</label>
                    <button
                      type="button"
                      onClick={fillMaxWithdraw}
                      disabled={available === 0}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 disabled:text-gray-300 transition-colors"
                    >
                      Usar todo
                    </button>
                  </div>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={available > 0 ? available : 1}
                    min={50}
                    placeholder="Ej: 500"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 bg-white placeholder:text-gray-400"
                  />
                  <p className="text-[11px] text-gray-500 mt-2 font-medium">
                    {available > 0
                      ? `Mínimo S/ 50 · Máximo S/ ${available.toLocaleString()}`
                      : 'No hay saldo disponible para retirar'}
                  </p>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cuenta bancaria</label>
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-bank-line text-gray-500 text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">BCP ···4521</p>
                      <p className="text-xs text-gray-500 font-medium">Cuenta de ahorros</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={available === 0 || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > available}
                  className="w-full py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Confirmar Retiro
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}