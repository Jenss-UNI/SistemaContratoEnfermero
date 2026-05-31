import { Bell, LogOut, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function ClientPanelHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm">

    
      <div className="border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-sky-400 flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Cuidame</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { to: "/", label: "Inicio" },
              { to: "/directorio", label: "Directorio" },
              { to: "/planes", label: "Planes" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors hover:text-teal-500 ${
                    isActive ? "text-teal-500" : "text-slate-700"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
              C
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700">
             Carmen López
            </span>
          </div>
        </div>
      </div>

     
      <div className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xl font-bold text-white">
                CL
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Panel Cliente
                </p>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  Bienvenida, Carmen López
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Tienes 0 servicios activos y 10 pendientes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/directorio"
                className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
              >
                <Search className="h-4 w-4" />
                Buscar Enfermero
              </Link>
              <button
                type="button"
                aria-label="Notificaciones"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-colors"
              >
                <Bell className="h-5 w-5" />
              </button>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}