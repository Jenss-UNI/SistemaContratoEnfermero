import { jsPDF } from "jspdf";
import type { PlanFacturaDetalle } from "../../../../core/models/payment.model";

export function generatePlanInvoicePdf(factura: PlanFacturaDetalle) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 16;

  // Banner Superior
  doc.setFillColor(15, 118, 110); // Teal-700
  doc.rect(0, 0, w, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CUIDAME", 16, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Plataforma de suscripciones de salud y enfermería", 16, 18);
  doc.text("Comprobante de Suscripción Digital", 16, 23);

  // Datos principales de Factura
  y = 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`Factura Nº: ${factura.numFactura}`, 16, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha de Emisión: ${factura.fechaEmision}`, 16, y + 5);
  doc.text(`Cliente: ${factura.clienteNombre}`, 16, y + 10);

  // Badge Estado Pagado (Vector checkmark + limpio text)
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(w - 46, y - 2, 30, 7, 2, 2, "FD");

  doc.setFillColor(16, 185, 129);
  doc.circle(w - 40, y + 1.5, 1.8, "F");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.35);
  doc.line(w - 40.8, y + 1.5, w - 40.1, y + 2.2);
  doc.line(w - 40.1, y + 2.2, w - 39, y + 0.8);

  doc.setTextColor(4, 120, 87);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PAGADO", w - 26.5, y + 2.5, { align: "center" });

  y += 20;

  // Tabla Detalle de Factura
  doc.setFillColor(13, 148, 136); // Teal-600
  doc.roundedRect(16, y, w - 32, 9, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Ítem", 20, y + 6);
  doc.text("Descripción", 55, y + 6);
  doc.text("Cantidad", 112, y + 6, { align: "center" });
  doc.text("Tipo", 135, y + 6, { align: "center" });
  doc.text("Precio Unit.", 160, y + 6, { align: "right" });
  doc.text("Monto", w - 20, y + 6, { align: "right" });

  // Espaciado adecuado entre cabecera y datos
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(factura.planNombre, 20, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Plan de Suscripción CUIDAME", 55, y);
  doc.text("1 mes", 112, y, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 118, 110);
  doc.text(factura.planTipo.toUpperCase(), 135, y, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(`S/ ${factura.precioUnitario.toFixed(2)}`, 160, y, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 20, y, { align: "right" });

  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(16, y, w - 16, y);

  // Resumen de Pago
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal:", w - 65, y);
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 20, y, { align: "right" });

  y += 5;
  doc.text("Impuestos:", w - 65, y);
  doc.text("S/ 0.00", w - 20, y, { align: "right" });

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 118, 110);
  doc.text("TOTAL A PAGAR:", w - 65, y);
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 20, y, { align: "right" });

  y += 5;
  doc.text("MONTO PAGADO:", w - 65, y);
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 20, y, { align: "right" });

  y += 12;

  // Detalle del Pago Realizado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Detalle del Pago Realizado", 16, y);

  y += 5;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(16, y, w - 32, 22, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text(`Método de Pago: ${factura.metodoPago}`, 22, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Detalles: ${factura.detallesPago}`, 22, y + 11);
  doc.text(`Referencia / Operación ID: ${factura.operacionId}`, 22, y + 16);

  // Banner Verde de Confirmación Exitoso Centrado
  y += 28;
  doc.setFillColor(15, 118, 110);
  doc.roundedRect(16, y, w - 32, 18, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("¡TU PAGO HA SIDO CONFIRMADO EXITOSAMENTE!", w / 2, y + 7, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(204, 251, 241);
  doc.text(`El servicio ${factura.planNombre.toUpperCase()} ha sido activado por un mes. Su acceso es válido hasta el ${factura.fechaVencimiento}.`, w / 2, y + 13, { align: "center" });

  // Pie de Página
  doc.setDrawColor(226, 232, 240);
  doc.line(16, 275, w - 16, 275);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Gracias por confiar en nuestros servicios de suscripción de salud • CUIDAME", w / 2, 282, { align: "center" });

  doc.save(`Factura-Plan-${factura.numFactura}.pdf`);
}
