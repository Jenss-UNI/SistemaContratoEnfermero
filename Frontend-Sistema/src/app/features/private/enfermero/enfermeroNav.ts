import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  ShieldCheck,
  User,
  ClipboardList,
  FileText,
  Calendar,
  Star,
  AlertTriangle,
  Wallet,
} from "lucide-react";

export const ENFERMERO_PANEL_BASE = "/panel-enfermero";

export type EnfermeroNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const ENFERMERO_NAV_ITEMS: EnfermeroNavItem[] = [
  { label: "Resumen", path: `${ENFERMERO_PANEL_BASE}/resumen`, icon: LayoutGrid },
  { label: "Verificación", path: `${ENFERMERO_PANEL_BASE}/verificacion`, icon: ShieldCheck },
  { label: "Mi Perfil", path: `${ENFERMERO_PANEL_BASE}/mi-perfil`, icon: User },
  { label: "Mis Servicios", path: `${ENFERMERO_PANEL_BASE}/mis-servicios`, icon: ClipboardList },
  { label: "Bitácoras", path: `${ENFERMERO_PANEL_BASE}/bitacoras`, icon: FileText },
  { label: "Mi Agenda", path: `${ENFERMERO_PANEL_BASE}/mi-agenda`, icon: Calendar },
  { label: "Calificaciones", path: `${ENFERMERO_PANEL_BASE}/calificaciones`, icon: Star },
  { label: "Reportes", path: `${ENFERMERO_PANEL_BASE}/reportes`, icon: AlertTriangle },
  { label: "Billetera", path: `${ENFERMERO_PANEL_BASE}/billetera`, icon: Wallet },
];
