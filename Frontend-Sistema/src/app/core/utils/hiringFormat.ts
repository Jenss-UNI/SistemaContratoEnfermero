export function formatPeriodo(inicio: string, fin: string): string {
  const fmt = (iso: string) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
  };
  return `${fmt(inicio)} — ${fmt(fin)}`;
}

export function formatDuracion(dias: number, horas: number): string {
  return `${dias} ${dias === 1 ? "día" : "días"} · ${horas}h`;
}
