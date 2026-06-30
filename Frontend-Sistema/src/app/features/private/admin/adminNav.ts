import type { LucideIcon } from "lucide-react";
import { BarChart2, BarChart3, FileText, LayoutGrid, ShieldCheck, UserCheck, Users } from "lucide-react";

export const ADMIN_PANEL_BASE = "/admin";

export type AdminNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Resumen", path: `${ADMIN_PANEL_BASE}/resumen`, icon: LayoutGrid },
  { label: "Métricas", path: `${ADMIN_PANEL_BASE}/metricas`, icon: BarChart3 },
  { label: "Verificaciones", path: `${ADMIN_PANEL_BASE}/verificaciones`, icon: ShieldCheck },
  { label: "Enfermeros", path: `${ADMIN_PANEL_BASE}/gestion-enfermeros`, icon: UserCheck, badge: 2 },
  { label: "Clientes", path: `${ADMIN_PANEL_BASE}/gestion-clientes`, icon: Users, badge: 3 },
  { label: "Contratos", path: `${ADMIN_PANEL_BASE}/contratos`, icon: FileText, badge: 1 },
  { label: "Reportes", path: `${ADMIN_PANEL_BASE}/reportes`, icon: BarChart2 },
];
