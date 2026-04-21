/**
 * Punto central para llamadas HTTP / API.
 * Cuando exista backend, configurar base URL (import.meta.env) y helpers aquí.
 */
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function getApiBase(): string {
  return API_BASE;
}
