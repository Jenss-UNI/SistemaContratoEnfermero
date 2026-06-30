import { Bell, LogOut, Search } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../core/contexts/AuthContext";

export default function ClientPanelHeader() {
  const { user, signOut, displayName, initials, fotoUrl } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Fallback por si el perfil aún no cargó
  const name    = displayName || (user?.email?.split("@")[0] ?? "Cliente");
  const initial = initials    || name.slice(0, 2).toUpperCase();

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm">

      {/* Barra superior: logo + nav + usuario */}
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

          {/* Nav pública (solo lectura, sin acciones privadas) */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { to: "/",           label: "Inicio"     },
              { to: "/directorio", label: "Directorio" },
              { to: "/planes",     label: "Planes"     },
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

          {/* Info de usuario */}
          <div className="flex items-center gap-2">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={name}
                className="h-8 w-8 rounded-full object-cover border border-teal-200 shadow-sm"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-sky-500 text-xs font-bold text-white shadow-sm">
                {initial}
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-slate-700">
              {name}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de bienvenida */}
      <div className="border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt={name}
                  className="h-14 w-14 shrink-0 rounded-full object-cover border-2 border-teal-200 shadow-md"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-sky-500 text-xl font-bold text-white shadow-md">
                  {initial}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Panel Cliente
                </p>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  Bienvenido/a, {name}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Gestiona tus servicios y contrataciones
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

              {/* ✅ Cerrar sesión llama a signOut() de Supabase correctamente */}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}