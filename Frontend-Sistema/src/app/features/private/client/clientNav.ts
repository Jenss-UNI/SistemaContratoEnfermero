import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  FileText,
  Flag,
  LayoutGrid,
  Star,
  User,
  UserRound,
} from "lucide-react";

export const CLIENT_PANEL_BASE = "/panel-cliente";

export type ClientNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const CLIENT_NAV_ITEMS: ClientNavItem[] = [
  { label: "Resumen", path: `${CLIENT_PANEL_BASE}/resumen`, icon: LayoutGrid },
  { label: "Mi Perfil", path: `${CLIENT_PANEL_BASE}/mi-perfil`, icon: User },
  { label: "Mis Pacientes", path: `${CLIENT_PANEL_BASE}/mis-pacientes`, icon: UserRound },
  { label: "Mis Contrataciones", path: `${CLIENT_PANEL_BASE}/mis-contrataciones`, icon: FileText },
  { label: "Pagos", path: `${CLIENT_PANEL_BASE}/pagos`, icon: CreditCard },
  { label: "Calificaciones", path: `${CLIENT_PANEL_BASE}/calificaciones`, icon: Star },
  { label: "Reportes", path: `${CLIENT_PANEL_BASE}/reportes`, icon: Flag },
];
