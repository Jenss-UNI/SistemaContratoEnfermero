import { useMemo, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminPanelSidebar from "./AdminPanelSidebar";
import { ADMIN_NAV_ITEMS, ADMIN_PANEL_BASE } from "../adminNav";
import { Menu, RefreshCw, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../../../../core/contexts/AuthContext";

export default function AdminPanelLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSpinning, setIsSpinning] = useState(true);

  const pageTitle = useMemo(() => {
    const cleanPath = location.pathname.replace(/\/$/, "");
    const active = ADMIN_NAV_ITEMS.find((item) => item.path === cleanPath);
    if (active) return active.label;
    if (cleanPath === ADMIN_PANEL_BASE || cleanPath === `${ADMIN_PANEL_BASE}/`) return "Resumen";
    return "Panel administrativo";
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setIsSpinning(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      setShowLogoutConfirm(false);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 relative overflow-hidden">
      <div
        className={`fixed inset-0 z-20 bg-slate-900/40 transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-[260px] flex-shrink-0 transform border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <AdminPanelSidebar
          closeSidebar={() => setSidebarOpen(false)}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-[72px] flex-shrink-0 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="truncate text-lg font-bold text-slate-900 md:text-xl">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden h-10 items-center justify-center rounded-xl bg-slate-50 px-4 text-[13px] font-medium text-slate-500 sm:flex">
              {new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <button className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
              <RefreshCw className={`h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} strokeWidth={2.5} />
            </button>
            <div className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#f0fdfa] px-4 text-[13px] font-bold text-[#0f766e]">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Administrador</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
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