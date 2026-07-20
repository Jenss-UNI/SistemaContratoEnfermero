import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { ContratoDetalle } from "../../../../core/models/hiring.model";

async function imageUrlToBase64(url: string) {
  const r = await fetch(url); const b = await r.blob();
  return await new Promise<string>(res => { const fr = new FileReader(); fr.onloadend = () => res(fr.result as string); fr.readAsDataURL(b); });
}

export async function generateContractPdf(contrato: ContratoDetalle) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 18;
  const title = (t: string) => { doc.setFillColor(15, 118, 110); doc.roundedRect(15, y, w - 30, 8, 2, 2, "F"); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text(t, 18, y + 5); doc.setTextColor(0, 0, 0); y += 14; }

  //Encabezado
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, w, 30, "F");

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("CUIDAME", 18, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Plataforma de contratación de profesionales de salud",
    18,
    18
  );

  // Tipo de documento
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    "Contrato Digital",
    18,
    24
  );

  // Línea decorativa
  doc.setDrawColor(255);
  doc.setLineWidth(0.3);
  doc.line(18, 26, w - 38, 26);

  // QR
  const verificationUrl =
    "https://sistema-contrato-enfermero.vercel.app/";

  const qr = await QRCode.toDataURL(verificationUrl);

  doc.addImage(qr, "PNG", w - 30, 4, 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text(
    "Verificar",
    w - 20,
    27,
    { align: "center" }
  );
  doc.setTextColor(0);


  //Titulo del contrato
  y = 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30);
  doc.text(
    "CONTRATO DE PRESTACIÓN DE SERVICIOS",
    w / 2,
    y,
    { align: "center" }
  );

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Documento generado automáticamente por CUIDAME",
    w / 2,
    y,
    { align: "center" }
  );

  y += 5;
  doc.setDrawColor(220);
  doc.setLineWidth(0.3);
  doc.line(20, y, w - 20, y);
  doc.setTextColor(0);
  y += 8;

  //Funcion

  const card = (
    title: string,
    data: { label: string; value: string }[]
  ) => {
    const rowHeight = 8;
    const headerHeight = 10;
    const padding = 8;

    const height = headerHeight + data.length * rowHeight + padding;

    // Margen inferior de seguridad
    const pageBottom = 260;

    if (y + height > pageBottom) {
      doc.addPage();
      y = 20;
    }

    const startY = y;

    // Sombra de la tarjeta
    doc.setFillColor(235, 235, 235);
    doc.roundedRect(
      16,
      startY + 1,
      w - 30,
      height,
      3,
      3,
      "F"
    );

    // Tarjeta principal
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(
      15,
      startY,
      w - 30,
      height,
      3,
      3,
      "FD"
    );

    // Encabezado
    doc.setFillColor(15, 118, 110);
    doc.roundedRect(
      15,
      startY,
      w - 30,
      9,
      3,
      3,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 20, startY + 6);

    // Contenido
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);

    let rowY = startY + 16;

    data.forEach((item) => {
      if (item.label === "TOTAL") {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 118, 110);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(40);
      }
      doc.text(item.label, 22, rowY);
      doc.setFont("helvetica", "normal");
      if (title === "HISTORIAL DEL CONTRATO" || title === "JORNADAS PROGRAMADAS") {
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);
        doc.text(item.value, w - 22, rowY, { align: "right" });
      } else {
        doc.text(item.value, 58, rowY);
      }
      rowY += 8;
    });

    y = startY + height + 8;
  };

  //filas por tarjetas

  card("DATOS GENERALES", [
    { label: "Código", value: contrato.codigo },
    { label: "Estado", value: contrato.estado },
    { label: "Emitido", value: contrato.emitidoEl },
  ]);

  card("PROFESIONAL DE SALUD", [
    { label: "Nombre", value: contrato.profesionalNombre },
    { label: "Especialidad", value: contrato.especialidad },
    { label: "Rol", value: contrato.profesionalRol },
    { label: "Ubicación", value: contrato.profesionalUbicacion },
  ]);

  card("CLIENTE Y PACIENTE", [
    { label: "Cliente", value: contrato.clienteNombre },
    { label: "Paciente", value: contrato.paciente },
    { label: "Dirección", value: contrato.pacienteDireccion },
    { label: "Plan", value: contrato.clientePlan },
  ]);

  card("DETALLE DEL SERVICIO", [
    { label: "Tipo", value: contrato.tipoServicio },
    { label: "Inicio", value: contrato.fechaInicio },
    { label: "Fin", value: contrato.fechaFin },
    { label: "Horario", value: contrato.horario },
    { label: "Duración", value: `${contrato.duracionDias} días` },
    { label: "Horas", value: `${contrato.duracionHoras} horas` },
  ]);

  card("JORNADAS PROGRAMADAS", contrato.jornadas.map(j => ({
    label: j.fecha,
    value: `${j.horario} — [${j.estado.charAt(0).toUpperCase() + j.estado.slice(1)}]`
  })));

  //Pagos
  const com = Math.round(
    (contrato.montoTotal * contrato.comisionPorcentaje) / 100
  );

  const sub = contrato.montoTotal - com;

  card("RESUMEN DE PAGO", [
    {
      label: "Subtotal",
      value: `S/ ${sub.toLocaleString("es-PE")}`,
    },
    {
      label: `Comisión (${contrato.comisionPorcentaje}%)`,
      value: `S/ ${com.toLocaleString("es-PE")}`,
    },
    {
      label: "TOTAL",
      value: `S/ ${contrato.montoTotal.toLocaleString("es-PE")}`,
    },
  ]);

  card("HISTORIAL DEL CONTRATO", contrato.historial.map(h => ({
    label: h.titulo,
    value: h.fecha
  })));

  //Terminos
  title("TÉRMINOS Y CONDICIONES");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  contrato.terminos.forEach((termino, index) => {
    const texto = doc.splitTextToSize(termino, 150);
    const boxHeight = texto.length * 5 + 8;

    if (y + boxHeight > 265) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(230);
    doc.setFillColor(248, 248, 248);

    doc.roundedRect(
      18,
      y - 4,
      w - 36,
      boxHeight,
      2,
      2,
      "FD"
    );

    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}.`, 22, y + 4);

    doc.setFont("helvetica", "normal");
    doc.text(texto, 30, y + 4);

    y += boxHeight + 4;
  });

  //Salto de pagina
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  //Firma
  const firmaHeight = 65;

  if (y + firmaHeight > 265) {
    doc.addPage();
    y = 20;
  }

  title("FIRMA DIGITAL");

  // Sombra
  doc.setFillColor(235, 235, 235);
  doc.roundedRect(
    16,
    y + 1,
    w - 30,
    55,
    3,
    3,
    "F"
  );

  // Tarjeta principal
  doc.setDrawColor(220);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(
    15,
    y,
    w - 30,
    55,
    3,
    3,
    "FD"
  );

  if (contrato.firma?.signature_url) {
    try {
      const firma = await imageUrlToBase64(
        contrato.firma.signature_url
      );
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Firma del Cliente", 22, y + 8);

      const firmaX = 22;
      const firmaWidth = 60;
      const firmaHeightImg = 20;
      const lineY = y + 40;
      const firmaY = lineY - firmaHeightImg - 2;

      doc.addImage(
        firma,
        "PNG",
        firmaX,
        firmaY,
        firmaWidth,
        firmaHeightImg
      );

      doc.line(
        firmaX,
        lineY,
        firmaX + firmaWidth,
        lineY
      );

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Firmante: ${contrato.clienteNombre}`,
        90,
        y + 18
      );

      doc.text(
        `DNI: ${contrato.firma.dni}`,
        90,
        y + 26
      );

      doc.text(
        `Fecha de firma: ${new Date(
          contrato.firma.signed_at
        ).toLocaleString("es-PE")}`,
        90,
        y + 34
      );

      doc.setFont("helvetica", "bold");
      doc.text("Estado:", 90, y + 42);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 118, 110);

      doc.text("Verificada", 106, y + 42);

      doc.setTextColor(0);

    } catch {
      doc.setTextColor(180, 0, 0);
      doc.text(
        "No fue posible cargar la firma digital.",
        20,
        y + 18
      );
      doc.setTextColor(0);
    }

  } else {

    doc.setTextColor(180, 0, 0);
    doc.text(
      "Contrato pendiente de firma.",
      22,
      y + 18
    );
    doc.setTextColor(0);

  }

  y += 65;


  doc.setDrawColor(220);

  doc.line(
    15,
    285,
    w - 15,
    285
  );

  doc.setFontSize(8);

  doc.setTextColor(120);

  doc.text(
    "CUIDAME • Documento generado automáticamente",
    15,
    290
  );

  doc.text(
    `Contrato ${contrato.codigo}`,
    w - 15,
    290,
    {
      align: "right"
    }
  );

  doc.save(`Contrato-${contrato.codigo}.pdf`);

}
