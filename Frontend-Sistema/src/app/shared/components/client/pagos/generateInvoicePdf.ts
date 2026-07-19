import { jsPDF } from "jspdf";
import type { FacturaDetalle } from "../../../../core/models/payment.model";

export function generateInvoicePdf(factura: FacturaDetalle) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header Banner
  doc.setFillColor(15, 118, 110); // Teal-700
  doc.rect(0, 0, w, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CUIDAME", 16, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Plataforma de contratación de profesionales de salud", 16, 18);
  doc.text("Comprobante de Pago Digital", 16, 23);

  // Title section
  y = 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("Factura de Contratación", 16, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Nº Factura: ${factura.numFactura}`, w - 16, y - 4, { align: "right" });
  doc.text(`Fecha de Emisión: ${factura.fechaEmision}`, w - 16, y + 1, { align: "right" });

  // Status Badge
  doc.setFillColor(236, 253, 245); // Emerald-50
  doc.setDrawColor(167, 243, 208); // Emerald-200
  doc.roundedRect(w - 45, y + 4, 29, 6, 2, 2, "FD");
  doc.setTextColor(4, 120, 87); // Emerald-700
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Estado: Pagado", w - 30.5, y + 8, { align: "center" });

  y += 16;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(16, y, w - 16, y);
  y += 8;

  // Patient & Service Info Card (Left)
  const leftX = 16;
  const cardWidth = 84;
  const rightX = 110;

  // Patient data
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 118, 110);
  doc.text("Datos del Paciente", leftX, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(factura.pacienteNombre, leftX, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Dirección: ${factura.direccion}`, leftX, y + 11);
  doc.text(`Distrito: ${factura.distrito}`, leftX, y + 16);

  // Service data
  const serviceY = y + 26;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 118, 110);
  doc.text("Detalle del Servicio Realizado", leftX, serviceY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Enfermero: ${factura.enfermeroNombre}`, leftX, serviceY + 6);
  doc.text(`Servicio: ${factura.tipoServicio} (${factura.horas}h por S/ ${factura.tarifaHora.toFixed(2)}/h)`, leftX, serviceY + 11);
  doc.text(`Fecha del Servicio: ${factura.fechaServicio}`, leftX, serviceY + 16);
  doc.text(`Total Horas: ${factura.horas}h`, leftX, serviceY + 21);

  // Payment Confirmation Box (Right Column)
  doc.setFillColor(240, 253, 244); // Emerald-50
  doc.setDrawColor(187, 247, 208); // Emerald-200
  doc.roundedRect(rightX, y - 2, 84, 46, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70); // Emerald-800
  doc.text("Detalle del Pago Confirmado", rightX + 6, y + 5);

  doc.setFillColor(209, 250, 229);
  doc.roundedRect(rightX + 6, y + 9, 20, 5, 1.5, 1.5, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70);
  doc.text("✓ Pagado", rightX + 16, y + 12.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text(`• ${factura.metodoPago}`, rightX + 6, y + 20);
  doc.text(`• Titular: ${factura.clienteNombre}`, rightX + 6, y + 26);
  doc.text(`• Monto Pagado: S/ ${factura.montoTotal.toFixed(2)}`, rightX + 6, y + 32);

  y += 54;

  // Breakdown Table Header
  doc.setFillColor(209, 250, 229); // Emerald-100
  doc.roundedRect(16, y, w - 32, 8, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Tipo de servicio", 20, y + 5.5);
  doc.text("Unidades", 85, y + 5.5, { align: "center" });
  doc.text("Tasa", 115, y + 5.5, { align: "right" });
  doc.text("Cantidad", 145, y + 5.5, { align: "center" });
  doc.text("Total", w - 20, y + 5.5, { align: "right" });

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Cuidado ${factura.tipoServicio}`, 20, y);
  doc.text("Hora", 85, y, { align: "center" });
  doc.text(`S/ ${factura.tarifaHora.toFixed(2)}`, 115, y, { align: "right" });
  doc.text(`${factura.horas}`, 145, y, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 20, y, { align: "right" });

  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(16, y, w - 16, y);

  // Resumen de Cargos
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 118, 110);
  doc.text("Resumen de Cargos", 16, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Subtotal (Servicio Realizado):", 16, y);
  doc.setFont("helvetica", "bold");
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 16, y, { align: "right" });

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Total a Pagar", 16, y);
  doc.setTextColor(4, 120, 87);
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 16, y, { align: "right" });

  // Balance Card
  y += 8;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, w - 32, 22, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Subtotal del Servicio:", 20, y + 6);
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 20, y + 6, { align: "right" });

  doc.text("Monto del Pago Recibido:", 20, y + 11);
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, w - 20, y + 11, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Saldo Restante:", 20, y + 17);
  doc.text("S/ 0.00", w - 20, y + 17, { align: "right" });

  // Payment Table Header
  y += 28;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 118, 110);
  doc.text("Pago total de cargos", 16, y);

  y += 5;
  doc.setFillColor(209, 250, 229);
  doc.roundedRect(16, y, w - 32, 7, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text("Fecha de Pago", 20, y + 5);
  doc.text("Método", 65, y + 5);
  doc.text("Monto", 135, y + 5, { align: "right" });
  doc.text("Estado", w - 20, y + 5, { align: "right" });

  y += 11;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(factura.fechaEmision, 20, y);
  doc.text(factura.metodoPago, 65, y);
  doc.setFont("helvetica", "bold");
  doc.text(`S/ ${factura.montoTotal.toFixed(2)}`, 135, y, { align: "right" });
  doc.setTextColor(4, 120, 87);
  doc.text("Procesado con éxito", w - 20, y, { align: "right" });

  // Footer note
  doc.setDrawColor(226, 232, 240);
  doc.line(16, 275, w - 16, 275);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Nota: El servicio ha finalizado satisfactoriamente y el pago ha sido procesado.", w / 2, 280, { align: "center" });
  doc.text("Gracias por confiar en nuestros servicios de enfermería • CUIDAME", w / 2, 284, { align: "center" });

  doc.save(`Factura-${factura.numFactura}.pdf`);
}
