import { FileText } from "lucide-react";
import type { PaymentHistoryItem } from "../../../../core/models/payment.model";
import PaymentStatusBadge from "./PaymentStatusBadge";

type PaymentHistoryTableProps = {
  items: PaymentHistoryItem[];
};

export default function PaymentHistoryTable({ items }: PaymentHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-4 py-3 font-semibold text-slate-600">Fecha</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Enfermero</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Tipo</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Monto</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Estado</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Factura</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 last:border-0">
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">{row.fecha}</td>
                <td className="px-4 py-3.5 font-medium text-slate-900">{row.enfermero}</td>
                <td className="px-4 py-3.5 text-slate-600">{row.tipo}</td>
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-slate-900">
                  S/ {row.monto.toLocaleString("es-PE")}
                </td>
                <td className="px-4 py-3.5">
                  <PaymentStatusBadge status={row.estado} />
                </td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-teal-600 transition hover:text-teal-700"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{row.factura}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
