import { Bell, LogOut, Search } from "lucide-react";
import { Link } from "react-router-dom";

/** Cabecera del panel cliente (plantilla; datos vendrán del backend). */
export default function ClientPanelHeader() {
  return (
    <div className="border-b border-slate-100 bg-white px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-xl font-bold text-white sm:h-16 sm:w-16"
            aria-hidden
          >
            C
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Panel Cliente</p>
            <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
              Bienvenida, Carmen
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Tienes 1 servicio activo y 1 próximo
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to="/directorio"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 sm:flex-none sm:px-5"
          >
            <Search className="h-4 w-4 shrink-0" />
            Buscar Enfermero
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:text-teal-600"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
