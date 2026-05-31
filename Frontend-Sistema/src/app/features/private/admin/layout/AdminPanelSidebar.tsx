import { NavLink } from "react-router-dom";
import { ADMIN_NAV_ITEMS } from "../adminNav"; 
import { User, ShieldCheck, LogOut } from "lucide-react";

type AdminPanelSidebarProps = {
  closeSidebar?: () => void;
};

export default function AdminPanelSidebar({ closeSidebar }: AdminPanelSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      
      {/* Perfil de Usuario */}
      <div className="px-6 pb-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-500 text-white">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Administrador</h2>
            <p className="text-[12px] font-medium text-teal-600">Panel de control</p>
          </div>
        </div>
        <div className="mt-3 flex">
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
            <ShieldCheck className="h-3 w-3" />
            Super Admin
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pt-2">
        {ADMIN_NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => closeSidebar?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Botón Cerrar Sesión */}
      <div className="mt-auto px-4 pb-6 pt-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50">
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
      
    </div>
  );
}