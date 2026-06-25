import { User, FileText, ShieldCheck, DollarSign, Hourglass, MapPin } from "lucide-react";

type ContractType = "Asistencial" | "Acompañamiento" | "Especializado";
type StatusType = "Confirmado" | "Activo" | "Cancelado" | "Completado";

type Contract = {
  id: string;
  code: string;
  patient: string;
  type: ContractType;
  status: StatusType;
  amount: string;
  date: string;
};

const MOCK_CONTRACTS: Contract[] = [
  { id: "1", code: "#1", patient: "Luca Alvares", type: "Especializado", status: "Confirmado", amount: "S/ 65", date: "12/6/2026" },
  { id: "2", code: "CONT-2026-0004", patient: "Carmen Mendoza", type: "Asistencial", status: "Activo", amount: "S/ 1,800", date: "10/6/2026" },
  { id: "3", code: "CONT-2026-0005", patient: "Luca Alvares", type: "Acompañamiento", status: "Cancelado", amount: "S/ 100", date: "5/6/2026" },
  { id: "4", code: "CONT-2026-0003", patient: "Rosa Alvares", type: "Acompañamiento", status: "Completado", amount: "S/ 200", date: "20/5/2026" },
  { id: "5", code: "CONT-2026-0002", patient: "Roberto Pasco", type: "Especializado", status: "Completado", amount: "S/ 1,300", date: "15/5/2026" },
];

const MOCK_STATS = [
  { label: "Enfermeros activos", value: "1", icon: Hourglass, colorClass: "text-[#0f766e]", bgClass: "bg-[#f0fdfa]" },
  { label: "Clientes registrados", value: "2", icon: User, colorClass: "text-rose-500", bgClass: "bg-rose-50" },
  { label: "Contratos activos", value: "1", icon: FileText, colorClass: "text-[#d97706]", bgClass: "bg-[#fffbeb]" },
  { label: "En custodia", value: "S/ 1,865", icon: MapPin, colorClass: "text-[#0f766e]", bgClass: "bg-[#f0fdfa]" },
  { label: "Verificaciones pendientes", value: "1", icon: ShieldCheck, colorClass: "text-orange-500", bgClass: "bg-orange-50" },
  { label: "Ingresos del mes", value: "S/ 0", icon: DollarSign, colorClass: "text-[#0f766e]", bgClass: "bg-[#f0fdfa]" },
];

const MOCK_SUMMARY = [
  { title: "Total en custodia", value: "S/ 1,865", detail: "Servicios activos y pendientes", valueColor: "text-[#0f766e]" },
  { title: "Ingresos del mes", value: "S/ 0", detail: "Servicios completados", valueColor: "text-[#0f766e]" },
  { title: "Comisión estimada (10%)", value: "S/ 0", detail: "Del mes actual", valueColor: "text-[#d97706]" },
];

const statusStyle = {
  Confirmado: "bg-blue-100 text-blue-700",
  Activo: "bg-[#ccfbf1] text-[#0f766e]",
  Cancelado: "bg-rose-100 text-rose-600",
  Completado: "bg-[#d1fae5] text-[#059669]",
};

export default function ResumenPage() {
  return (
    <div className="w-full space-y-6">
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {MOCK_STATS.map((item, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className={`mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ${item.bgClass}`}>
              <item.icon className={`h-4 w-4 ${item.colorClass}`} strokeWidth={2} />
            </div>
            <p className={`text-lg font-bold ${item.colorClass}`}>{item.value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {MOCK_SUMMARY.map((card, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-[12px] font-medium text-slate-500">{card.title}</p>
            <p className={`mt-1.5 text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
            <p className="mt-1 text-[11px] font-medium text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-900">Contratos Recientes</h2>

        <div className="overflow-x-auto">
          <table className="min-w-[720px] table-auto w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-500">
                <th className="px-2 pb-3 font-medium">Código</th>
                <th className="px-2 pb-3 font-medium">Paciente</th>
                <th className="px-2 pb-3 font-medium">Tipo</th>
                <th className="px-2 pb-3 font-medium">Estado</th>
                <th className="px-2 pb-3 font-medium">Monto</th>
                <th className="px-2 pb-3 font-medium">Fecha</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {MOCK_CONTRACTS.map((contract) => (
                <tr key={contract.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-2 py-2.5 text-[11px] font-medium text-slate-700">{contract.code}</td>
                  <td className="px-2 py-2.5 text-[11px] font-medium text-slate-700">{contract.patient}</td>
                  <td className="px-2 py-2.5 text-[11px] font-medium text-slate-500">{contract.type}</td>
                  <td className="px-2 py-2.5">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyle[contract.status]}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-[11px] font-bold text-slate-900">{contract.amount}</td>
                  <td className="px-2 py-2.5 text-[11px] font-medium text-slate-500">{contract.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
    </div>
  );
}