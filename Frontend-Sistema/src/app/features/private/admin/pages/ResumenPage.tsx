import { Users, User, FileText, Wallet, ShieldCheck, DollarSign } from "lucide-react";

type ContractType = "Asistencial" | "Acompañamiento" | "Especializado";
type StatusType = "Pendiente" | "Activo" | "Confirmado";

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
  { id: "1", code: "CON-000039", patient: "Elena Rodriguez", type: "Asistencial", status: "Pendiente", amount: "S/ 120", date: "23/5/2026" },
  { id: "2", code: "CON-000038", patient: "Elena Rodriguez", type: "Acompañamiento", status: "Pendiente", amount: "S/ 75", date: "23/5/2026" },
  { id: "3", code: "CON-000037", patient: "Elena Rodriguez", type: "Acompañamiento", status: "Pendiente", amount: "S/ 180", date: "23/5/2026" },
  { id: "4", code: "CON-000036", patient: "Elena Rodriguez", type: "Asistencial", status: "Pendiente", amount: "S/ 120", date: "22/5/2026" },
  { id: "5", code: "CON-000035", patient: "Elena Rodriguez", type: "Especializado", status: "Pendiente", amount: "S/ 318", date: "22/5/2026" },
  { id: "6", code: "CON-000034", patient: "Elena Rodriguez", type: "Especializado", status: "Activo", amount: "S/ 106", date: "22/5/2026" },
  { id: "7", code: "CS-89634", patient: "Juana Lopez Casas", type: "Asistencial", status: "Confirmado", amount: "S/ 340", date: "21/5/2026" },
];

const MOCK_STATS = [
  { label: "Enfermeros activos", value: "2", icon: Users, colorClass: "text-[#0db39e]", bgClass: "bg-[#e5f9f4]" },
  { label: "Clientes registrados", value: "3", icon: User, colorClass: "text-rose-500", bgClass: "bg-rose-50" },
  { label: "Contratos activos", value: "1", icon: FileText, colorClass: "text-amber-500", bgClass: "bg-amber-50" },
  { label: "En custodia", value: "S/ 1,577", icon: Wallet, colorClass: "text-emerald-500", bgClass: "bg-emerald-50" },
  { label: "Verificaciones pendientes", value: "0", icon: ShieldCheck, colorClass: "text-orange-500", bgClass: "bg-orange-50" },
  { label: "Ingresos del mes", value: "S/ 100", icon: DollarSign, colorClass: "text-[#0db39e]", bgClass: "bg-[#e5f9f4]" },
];

const MOCK_SUMMARY = [
  { title: "Total en custodia", value: "S/ 1,577", detail: "Servicios activos y pendientes", valueColor: "text-[#0db39e]" },
  { title: "Ingresos del mes", value: "S/ 100", detail: "Servicios completados", valueColor: "text-[#0db39e]" },
  { title: "Comisión estimada (10%)", value: "S/ 10", detail: "Del mes actual", valueColor: "text-amber-500" },
];

const statusStyle = {
  Pendiente: "bg-[#fef3c7] text-[#b45309]", 
  Activo: "bg-[#ccfbf1] text-[#0f766e]",    
  Confirmado: "bg-[#dbeafe] text-[#1d4ed8]", 
};

export default function ResumenPage() {
  return (
    <div className="w-full space-y-6">
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {MOCK_STATS.map((item, index) => (
          <div key={index} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl ${item.bgClass}`}>
              <item.icon className={`h-4 w-4 ${item.colorClass}`} strokeWidth={2.5} />
            </div>
            <p className={`text-2xl font-bold ${item.colorClass}`}>{item.value}</p>
            <p className="mt-1 text-[13px] font-medium text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {MOCK_SUMMARY.map((card, index) => (
          <div key={index} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-[13px] font-medium text-slate-400">{card.title}</p>
            <p className={`mt-2 text-3xl font-bold ${card.valueColor}`}>{card.value}</p>
            <p className="mt-2 text-[12px] font-medium text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-[15px] font-bold text-slate-900">Contratos Recientes</h2>

        <div className="overflow-x-auto">
          <table className="min-w-[720px] table-auto w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-50 text-[13px] text-slate-500">
                <th className="px-3 pb-4 font-medium">Código</th>
                <th className="px-3 pb-4 font-medium">Paciente</th>
                <th className="px-3 pb-4 font-medium">Tipo</th>
                <th className="px-3 pb-4 font-medium">Estado</th>
                <th className="px-3 pb-4 font-medium">Monto</th>
                <th className="px-3 pb-4 font-medium">Fecha</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
              {MOCK_CONTRACTS.map((contract) => (
                <tr key={contract.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-3 py-4 text-[13px] font-medium text-slate-600">{contract.code}</td>
                  <td className="px-3 py-4 text-[13px] font-medium text-slate-600">{contract.patient}</td>
                  <td className="px-3 py-4 text-[13px] font-medium text-slate-600">{contract.type}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${statusStyle[contract.status]}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-[13px] font-bold text-slate-800">{contract.amount}</td>
                  <td className="px-3 py-4 text-[13px] font-medium text-slate-500">{contract.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
    </div>
  );
}