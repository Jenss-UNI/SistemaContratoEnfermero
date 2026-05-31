import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminPanelSidebar from "./AdminPanelSidebar";
import { ADMIN_NAV_ITEMS, ADMIN_PANEL_BASE } from "../adminNav";
import { Menu, X, RefreshCw, ShieldCheck } from "lucide-react";

export default function AdminPanelLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const cleanPath = location.pathname.replace(/\/$/, "");
    const active = ADMIN_NAV_ITEMS.find((item) => item.path === cleanPath);
    if (active) return active.label;
    if (cleanPath === ADMIN_PANEL_BASE || cleanPath === `${ADMIN_PANEL_BASE}/`) return "Resumen";
    return "Panel administrativo";
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800">
      
      {/* --- CABECERA PRINCIPAL --- */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="flex h-[72px] w-full items-center justify-between px-4 sm:px-6 lg:px-0">
          
          {/* ZONA IZQUIERDA: Menú y Logo */}
          <div className="flex h-full items-center gap-3 lg:w-[260px] lg:flex-shrink-0 lg:border-r lg:border-slate-200 lg:px-6">
            
            {/* Botón Hamburguesa (Solo visible en Móvil) */}
            <button
              type="button"
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
              onClick={() => setSidebarOpen((current) => !current)}
              aria-label="Mostrar navegación"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="text-base font-bold text-[#0f766e]">
              Cuídame
            </div>
          </div>

          {/* ZONA CENTRAL: Título de la página */}
          <div className="flex min-w-0 flex-1 justify-center px-2">
            <h2 className="w-full truncate text-center text-base font-semibold text-slate-900 sm:text-lg md:text-xl">
              {pageTitle}
            </h2>
          </div>

          {/* ZONA DERECHA: Controles */}
          <div className="flex items-center gap-2 pr-0 sm:gap-3 lg:pr-8">
            
            {/* Etiqueta de Fecha */}
            <div className="hidden h-10 items-center justify-center rounded-2xl bg-slate-50 px-4 text-[13px] font-medium text-slate-500 sm:flex">
              31 de mayo de 2026
            </div>

            {/* Botón Refrescar */}
            <button className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
              <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
            </button>

            {/* Badge Administrador */}
            <div className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#f0fdfa] px-4 text-[13px] font-bold text-[#0f766e]">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Administrador</span>
            </div>
          </div>
          
        </div>
      </header>

      {/* --- CUERPO DE LA APLICACIÓN --- */}
      <div className="relative flex min-h-[calc(100vh-72px)] overflow-hidden">
        
        <div
          className={`fixed inset-0 z-20 bg-slate-900/40 transition-opacity duration-300 lg:hidden ${
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Barra Lateral Izquierda (Sidebar) */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-[260px] transform border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:hidden">
              <span className="text-sm font-semibold text-slate-900">Menú</span>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <AdminPanelSidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>
        </aside>

        {/* Área de Contenido Dinámico */}
        <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}