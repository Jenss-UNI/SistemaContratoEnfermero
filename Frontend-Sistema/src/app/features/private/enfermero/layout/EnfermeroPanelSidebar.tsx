import { NavLink } from "react-router-dom";
import { ENFERMERO_NAV_ITEMS } from "../enfermeroNav";
import { LogOut, ShieldCheck } from "lucide-react";

type EnfermeroPanelSidebarProps = {
  onLogoutClick: () => void;
  onItemClick?: () => void;
};

export default function EnfermeroPanelSidebar({ onLogoutClick, onItemClick }: EnfermeroPanelSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Perfil del Enfermero (Alineado y sin truncar) */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-start gap-3">
          {/* Avatar con Iniciales "CM" en gradiente */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-500 text-base font-bold text-white shadow-sm mt-0.5">
            CM
          </div>
          <div className="min-w-0 flex-1">
            {/* Nombre Completo sin truncar */}
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              Carlos Sanchez
            </h3>
            <p className="text-xs font-medium text-teal-700 mt-1">
              Enfermero Especializado
            </p>
            {/* Badge de Verificación centrado/alineado con el nombre */}
            <div className="mt-2.5 flex">
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-teal-700">
                <ShieldCheck className="h-3 w-3" />
                Verificado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        {ENFERMERO_NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-teal-50/70 text-teal-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Botón de Cerrar Sesión */}
      <div className="border-t border-slate-100 p-4">
        <button
          onClick={onLogoutClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-2.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
