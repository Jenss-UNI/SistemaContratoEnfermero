import { Outlet } from "react-router-dom";
import AdminPanelSidebar from "./AdminPanelSidebar";
import { RefreshCw, ShieldCheck } from "lucide-react";

export default function AdminPanelLayout() {
  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* Cabecera Global (Ocupa el 100% del ancho) */}
      <header className="flex h-[72px] flex-shrink-0 items-center border-b border-slate-200 bg-white">
        {/* Zona del Logo (Mismo ancho exacto que el Sidebar: 260px) */}
        <div className="flex h-full w-[260px] flex-shrink-0 items-center border-r border-slate-200 px-6">
          <h1 className="text-xl font-bold text-teal-700">Cuídame</h1>
        </div>

        {/* Zona del Título y Controles (Resto del ancho) */}
        <div className="flex flex-1 items-center justify-between px-8">
          <h2 className="text-xl font-bold text-slate-900">Resumen</h2>

          {/* Controles de la derecha */}
          <div className="flex items-center gap-5">
            <span className="text-sm font-medium text-slate-400">23 de mayo de 2026</span>
            <button className="text-slate-400 transition-colors hover:text-slate-600">
              <RefreshCw className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
              <ShieldCheck className="h-4 w-4" />
              Administrador
            </div>
          </div>
        </div>
      </header>

      {/* Cuerpo de la aplicación (Sidebar + Contenido) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Barra Lateral Izquierda */}
        <aside className="w-[260px] flex-shrink-0 border-r border-slate-200 bg-white">
          <AdminPanelSidebar />
        </aside>

        {/* Área de Contenido Principal donde cargarán tus otras vistas */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}