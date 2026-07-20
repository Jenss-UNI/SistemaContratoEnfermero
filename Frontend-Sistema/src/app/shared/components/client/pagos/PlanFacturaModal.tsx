import { X, Check, Smartphone, ShieldCheck, CheckCircle2, Printer, Download } from "lucide-react";
import type { PlanFacturaDetalle } from "../../../../core/models/payment.model";
import { generatePlanInvoicePdf } from "./generatePlanInvoicePdf";

type PlanFacturaModalProps = {
  factura: PlanFacturaDetalle;
  onClose: () => void;
};

export default function PlanFacturaModal({ factura, onClose }: PlanFacturaModalProps) {
  const handlePrint = () => {
    generatePlanInvoicePdf(factura);
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-slate-800">
        
        {/* BOTÓN CERRAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              Factura Nº: <span className="font-mono text-slate-900">{factura.numFactura}</span>
            </p>
            <p className="text-xs text-slate-500">
              Fecha de Emisión: <span className="font-semibold text-slate-700">{factura.fechaEmision}</span>
            </p>
            <p className="text-xs text-slate-500">
              Cliente: <span className="font-semibold text-slate-900">{factura.clienteNombre}</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estado de la Factura:</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-black text-emerald-700 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              PAGADO
            </span>
          </div>
        </div>

        {/* DETALLE DE FACTURA TABLA */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Detalle de Factura</h3>
          <div className="overflow-hidden rounded-xl border border-teal-500/20">
            <table className="w-full text-xs text-left">
              <thead className="bg-teal-600 text-white font-bold">
                <tr>
                  <th className="p-3">Ítem</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3 text-center">Cantidad</th>
                  <th className="p-3 text-center">Tipo</th>
                  <th className="p-3 text-right">Precio Unitario</th>
                  <th className="p-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="bg-white font-medium text-slate-800 divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold">{factura.planNombre}</td>
                  <td className="p-3 text-slate-600">Plan de Suscripción CUIDAME</td>
                  <td className="p-3 text-center">1 mes</td>
                  <td className="p-3 text-center uppercase font-bold text-teal-700">{factura.planTipo}</td>
                  <td className="p-3 text-right">S/ {factura.precioUnitario.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-slate-900">S/ {factura.montoTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RESUMEN DE PAGO */}
        <div className="flex flex-col items-end space-y-1 mb-6 text-xs border-b border-slate-100 pb-4">
          <div className="flex justify-between w-48 text-slate-500">
            <span>Subtotal:</span>
            <span>S/ {factura.montoTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-48 text-slate-500">
            <span>Impuestos:</span>
            <span>S/ 0.00</span>
          </div>
          <div className="flex justify-between w-56 text-sm font-black text-teal-700 pt-1">
            <span>TOTAL A PAGAR:</span>
            <span>S/ {factura.montoTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-56 text-sm font-black text-teal-700">
            <span>MONTO PAGADO:</span>
            <span>S/ {factura.montoTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* DETALLE DEL PAGO REALIZADO */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Detalle del Pago Realizado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Pago Seleccionado/Confirmado */}
            <div className="rounded-2xl bg-teal-50/60 border border-teal-200 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-teal-950">Método de Pago: {factura.metodoPago}</p>
                  <p className="text-[11px] text-teal-700">{factura.detallesPago}</p>
                </div>
              </div>
              <p className="text-[11px] text-teal-800 font-mono">
                <span className="font-semibold text-teal-900">Referencia / Operación ID:</span> {factura.operacionId}
              </p>
              <p className="text-[11px] text-teal-800 italic">
                Monto de S/ {factura.montoTotal.toFixed(2)} confirmado el {factura.fechaEmision}
              </p>
            </div>

            {/* Card 2: Garantía / Seguridad */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs flex items-center gap-3 text-slate-500">
              <ShieldCheck className="h-8 w-8 text-teal-600/50 shrink-0" />
              <p className="text-[11px] leading-relaxed font-medium">
                Pago verificado y seguro a través de la pasarela de pagos oficial de la plataforma Cuidame.
              </p>
            </div>
          </div>
        </div>

        {/* BANNER VERDE DESTACADO DE CONFIRMACIÓN */}
        <div className="rounded-2xl bg-teal-700 text-white p-4 text-center space-y-1 mb-6 shadow-md">
          <div className="flex items-center justify-center gap-2 font-black text-sm sm:text-base">
            <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
            ¡TU PAGO HA SIDO CONFIRMADO EXITOSAMENTE!
          </div>
          <p className="text-xs text-teal-100 font-medium">
            El servicio <span className="font-bold text-white uppercase">{factura.planNombre}</span> ha sido activado por un mes. Su acceso es válido hasta el <span className="font-bold text-white">{factura.fechaVencimiento}</span>.
          </p>
        </div>

        {/* ACCIONES Y BOTONES */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handlePrint}
              className="px-7 py-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Descargar Factura PDF
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              Volver al Historial de Pagos
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
