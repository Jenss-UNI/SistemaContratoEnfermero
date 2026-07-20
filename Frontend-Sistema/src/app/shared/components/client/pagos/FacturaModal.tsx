import { X, User, Stethoscope, CheckCircle2, Download } from "lucide-react";
import type { FacturaDetalle } from "../../../../core/models/payment.model";
import { generateInvoicePdf } from "./generateInvoicePdf";

type FacturaModalProps = {
  factura: FacturaDetalle;
  onClose: () => void;
};

export default function FacturaModal({ factura, onClose }: FacturaModalProps) {
  const handlePrint = () => {
    generateInvoicePdf(factura);
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
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER FACTURA */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-5 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Factura de Contratación
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Nº Factura: {factura.numFactura}
            </p>
            <p className="text-xs text-slate-400 font-semibold">
              Fecha de Emisión: {factura.fechaEmision}
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Estado: Pagado
            </span>
          </div>
        </div>

        {/* GRID INFORMACIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Columna Izquierda: Datos del Paciente + Servicio */}
          <div className="space-y-5">
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <User className="h-4 w-4 text-teal-600" />
                Datos del Paciente
              </h3>
              <p className="text-sm font-bold text-slate-900">{factura.pacienteNombre}</p>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Dirección:</span> {factura.direccion}, {factura.distrito}
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Stethoscope className="h-4 w-4 text-teal-600" />
                Detalle del Servicio Realizado
              </h3>
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Enfermero:</span> {factura.enfermeroNombre}
              </p>
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Servicio:</span> {factura.tipoServicio} ({factura.horas}h por S/ {factura.tarifaHora.toFixed(2)}/h)
              </p>
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Fecha del Servicio:</span> {factura.fechaServicio}
              </p>
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Total Horas:</span> {factura.horas}h
              </p>
            </div>
          </div>

          {/* Columna Derecha: Detalle del Pago Confirmado (Caja Verde) */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-4 space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Detalle del Pago Confirmado
            </h3>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                ✓ Pagado
              </span>
            </div>
            <ul className="text-xs text-emerald-900 space-y-1 font-medium">
              <li>• {factura.metodoPago}</li>
              <li>• Titular: {factura.clienteNombre}</li>
              <li>• Monto Pagado: S/ {factura.montoTotal.toFixed(2)}</li>
            </ul>
          </div>
        </div>

        {/* TABLA DE DESGLOSE */}
        <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-emerald-100/60 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Tipo de servicio</th>
                <th className="p-3 text-center">Unidades</th>
                <th className="p-3 text-right">Tasa</th>
                <th className="p-3 text-center">Cantidad</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="p-3">Cuidado {factura.tipoServicio}</td>
                <td className="p-3 text-center">Hora</td>
                <td className="p-3 text-right">S/ {factura.tarifaHora.toFixed(2)}</td>
                <td className="p-3 text-center">{factura.horas}</td>
                <td className="p-3 text-right font-bold text-slate-900">S/ {factura.montoTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RESUMEN DE CARGOS */}
        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Resumen de Cargos</h4>
          <div className="flex justify-between text-xs text-slate-600 border-b border-slate-100 pb-2">
            <span>Subtotal (Servicio Realizado):</span>
            <span className="font-semibold text-slate-900">S/ {factura.montoTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
            <span>Total a Pagar</span>
            <span className="text-emerald-700">S/ {factura.montoTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* CAJA DE SALDOS */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5 text-xs text-slate-600 mb-6">
          <div className="flex justify-between">
            <span>Subtotal del Servicio:</span>
            <span>S/ {factura.montoTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Monto del Pago Recibido:</span>
            <span>S/ {factura.montoTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
            <span>Saldo Restante:</span>
            <span>S/ 0.00</span>
          </div>
        </div>

        {/* PAGO TOTAL DE CARGOS */}
        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pago total de cargos</h4>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-emerald-100/60 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Fecha de Pago</th>
                  <th className="p-2.5">Método</th>
                  <th className="p-2.5 text-right">Monto</th>
                  <th className="p-2.5">Estado</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-800">
                <tr>
                  <td className="p-2.5">{factura.fechaEmision}</td>
                  <td className="p-2.5">{factura.metodoPago}</td>
                  <td className="p-2.5 text-right font-bold">S/ {factura.montoTotal.toFixed(2)}</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">Procesado con éxito</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-2 border-t border-slate-100 space-y-4">
          <p className="text-[11px] text-slate-400 italic">
            Nota: El servicio ha finalizado satisfactoriamente y el pago ha sido procesado.<br />
            Gracias por confiar en nuestros servicios de enfermería
          </p>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Descargar Factura PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
