import { NavLink } from "react-router-dom";
import { ADMIN_NAV_ITEMS } from "../adminNav"; 
import { User, ShieldCheck, LogOut, X } from "lucide-react";

type AdminPanelSidebarProps = {
  closeSidebar?: () => void;
  onLogoutClick?: () => void;
};

export default function AdminPanelSidebar({ closeSidebar, onLogoutClick }: AdminPanelSidebarProps) {
  
  // Función auxiliar simulada para el ejemplo visual.
  // Lo ideal es que añadas la propiedad "badge" a tu arreglo ADMIN_NAV_ITEMS.
  const getBadgeValue = (label: string) => {
    if (['Verificaciones', 'Enfermeros', 'Contratos'].includes(label)) return 1;
    if (label === 'Clientes') return 2;
    return null;
  };

  return (
    <div className="flex h-full flex-col bg-white">
      
      {/* --- CABECERA DEL SIDEBAR (Logo alineado con el header principal) --- */}
      <div className="flex h-[72px] flex-shrink-0 items-center justify-between border-b border-slate-200 px-6">
        <div className="text-xl font-bold text-[#0f766e]">
          Cuidame
        </div>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
          onClick={closeSidebar}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Perfil de Usuario */}
      <div className="px-6 pb-6 pt-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-white">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Administrador</h2>
            <p className="text-[12px] font-medium text-[#0f766e]">Panel de control</p>
          </div>
        </div>
        <div className="mt-3 flex">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fdfa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0f766e]">
            <ShieldCheck className="h-3 w-3" />
            Super Admin
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pt-6">
        {ADMIN_NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const badgeCount = getBadgeValue(label);
          
          return (
            <NavLink
              key={path}
              to={path}
              onClick={() => closeSidebar?.()}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#f0fdfa] text-[#0f766e]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                {label}
              </div>
              
              {badgeCount && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
                  {badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Botón Cerrar Sesión */}
      <div className="mt-auto px-4 pb-6 pt-4 border-t border-slate-100">
        <button 
          onClick={onLogoutClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-white py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
      
    </div>
  );
}