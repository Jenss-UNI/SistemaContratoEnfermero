import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import EnfermeroPanelSidebar from "./EnfermeroPanelSidebar";
import { ENFERMERO_NAV_ITEMS } from "../enfermeroNav";
import { Bell, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../../../core/contexts/AuthContext";

export default function EnfermeroPanelLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Obtener el título dinámico según la ruta activa
  const activeNavItem = ENFERMERO_NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.path)
  );
  const currentTitle = activeNavItem ? activeNavItem.label : "Panel Enfermero";

  // Fecha de hoy en formato "24 de mayo de 2026"
  const formattedDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      setShowLogoutConfirm(false);
      // Redirigir al landing page
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
      
      {/* ─── MOBILE HEADER (Visible sólo en móviles) ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="text-slate-600 h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-teal-700">Cuídame</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 cursor-pointer relative"
            aria-label="Notificaciones"
          >
            <Bell className="text-slate-600 h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full"></span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
            CM
          </div>
        </div>
      </div>

      {/* ─── DESKTOP HEADER (Visible sólo en pantallas grandes) ─── */}
      <header className="hidden md:flex h-[72px] flex-shrink-0 items-center border-b border-slate-200 bg-white">
        {/* Zona del Logo */}
        <div className="flex h-full w-[260px] flex-shrink-0 items-center border-r border-slate-200 px-6">
          <h1 className="text-xl font-bold text-teal-700">Cuídame</h1>
        </div>

        {/* Zona del Título y Controles */}
        <div className="flex flex-1 items-center justify-between px-8">
          <h2 className="text-xl font-bold text-slate-900">{currentTitle}</h2>

          {/* Información y Notificaciones a la Derecha */}
          <div className="flex items-center gap-6">
            {/* Fecha */}
            <span className="text-sm font-medium text-slate-400 capitalize">
              {formattedDate}
            </span>

            {/* Icono de Campana */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
              </button>

              {/* Notificaciones Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">Notificaciones</p>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-teal-600 font-medium hover:text-teal-700 cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-slate-400">Sin notificaciones nuevas</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cuerpo de la aplicación (Sidebar + Contenido) */}
      <div className="flex flex-1 overflow-hidden pt-14 md:pt-0">
        
        {/* Barra Lateral Izquierda (Escritorio) */}
        <aside className="w-[260px] flex-shrink-0 border-r border-slate-200 bg-white hidden md:block">
          <EnfermeroPanelSidebar onLogoutClick={() => setShowLogoutConfirm(true)} />
        </aside>

        {/* Área de Contenido Principal (en blanco) */}
        <main className="flex-1 overflow-auto bg-slate-50/30 p-4 md:p-8">
          <Outlet />
        </main>

      </div>

      {/* ─── MOBILE SIDEBAR DRAWER & OVERLAY ─── */}
      {sidebarOpen && (
        <>
          {/* Overlay oscuro */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/40 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Sidebar lateral deslizable */}
          <aside className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col shadow-xl animate-in slide-in-from-left duration-300">
            <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
              <span className="text-base font-bold text-teal-700">Cuídame</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="text-slate-500 h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <EnfermeroPanelSidebar
                onLogoutClick={() => {
                  setShowLogoutConfirm(true);
                  setSidebarOpen(false);
                }}
                onItemClick={() => setSidebarOpen(false)}
              />
            </div>
          </aside>
        </>
      )}

      {/* ─── MODAL DE CONFIRMACIÓN DE CERRAR SESIÓN ─── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Fondo oscuro traslúcido */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          {/* Tarjeta de diálogo */}
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-5">
              <div className="w-12 h-12 flex items-center justify-center bg-rose-50 rounded-full mx-auto mb-3">
                <LogOut className="text-rose-500 h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">¿Cerrar sesión?</h3>
              <p className="text-sm text-slate-500 mt-1">
                Tu sesión actual se cerrará y deberás volver a iniciar sesión.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-semibold py-2.5 rounded-xl disabled:cursor-not-allowed cursor-pointer text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Cerrando...
                  </>
                ) : (
                  "Cerrar sesión"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


