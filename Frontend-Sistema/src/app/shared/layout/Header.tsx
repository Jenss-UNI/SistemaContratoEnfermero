import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutGrid, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../core/contexts/AuthContext";
import logoImg from "../../../assets/logo/logo.png";

type HeaderProps = {
  transparentOnTop?: boolean;
  variant?: "default" | "admin";
};

const PANEL_MAP: Record<string, { path: string; label: string }> = {
  cliente:   { path: "/panel-cliente",   label: "Panel Cliente" },
  enfermero: { path: "/panel-enfermero", label: "Panel Enfermero" },
  admin:     { path: "/admin",           label: "Panel Admin" },
};

function Header({ transparentOnTop = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scroll, setScroll]         = useState<boolean>(false);
  const [dropOpen, setDropOpen]     = useState<boolean>(false);
  const dropRef                     = useRef<HTMLDivElement>(null);

  const { user, role, signOut, displayName, initials, fotoUrl } = useAuth();
  const navigate = useNavigate();

  const isSolid = !transparentOnTop || scroll;

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    setDropOpen(false);
    setMobileOpen(false);
    await signOut();
    navigate("/login");
  };

  const panel = PANEL_MAP[role ?? "cliente"] ?? PANEL_MAP["cliente"];
  const name  = displayName || (user?.email?.split("@")[0] ?? "Usuario");
  const initial = initials || name.charAt(0).toUpperCase();

  const navLinkClass = `text-[14px] font-medium transition-colors hover:text-[#14b8a6] ${
    isSolid ? "text-slate-700" : "text-white/90"
  }`;
  const mobileLink = "block pt-3 hover:text-[#14b8a6] text-slate-700 font-medium text-[14px]";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isSolid ? "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.05)] py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5">
          <img src={logoImg} alt="Cuidame Logo" className="w-14 h-14 object-contain" />
          <span className={`text-[18px] font-bold tracking-tight ${isSolid ? "text-[#0f172a]" : "text-white"}`}>
            Cuidame
          </span>
        </Link>

        {/* Links públicos */}
        <nav className="hidden md:flex items-center gap-7">
          <Link to="/" onClick={scrollToTop} className={navLinkClass}>
            Inicio
          </Link>
          <Link to="/directorio" onClick={scrollToTop} className={navLinkClass}>
            Directorio
          </Link>
          <Link to="/planes" onClick={scrollToTop} className={navLinkClass}>
            Planes
          </Link>
        </nav>

     
        <div className="hidden md:flex items-center gap-5">
          {user ? (
           
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                className={`flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-all hover:bg-black/5 ${
                  isSolid ? "text-slate-700" : "text-white"
                }`}
              >
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt={name}
                    className="w-8 h-8 rounded-full object-cover border border-[#14b8a6]/20 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {initial}
                  </div>
                )}
                <span className="text-[14px] font-semibold">{name}</span>
                <ChevronDown
                  className={`w-4 h-4 opacity-70 transition-transform duration-200 ${
                    dropOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    to={panel.path}
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <LayoutGrid className="h-4 w-4 text-teal-500 shrink-0" />
                    {panel.label}
                  </Link>

                  <div className="mx-4 my-1 h-px bg-slate-100" />

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
    
            <div className="flex items-center gap-3 border-l border-white/20 pl-4 ml-1">
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-lg text-[14px] font-medium border transition-all duration-300 ${
                  isSolid 
                    ? "border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6] hover:text-white" 
                    : "border-white/40 text-white hover:bg-white hover:text-[#14b8a6] hover:border-white shadow-sm"
                }`}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-300 shadow-sm ${
                  isSolid
                    ? "bg-[#14b8a6] hover:bg-[#0d9488] text-white"
                    : "bg-[#14b8a6] hover:bg-[#11ccb7] text-white border border-[#14b8a6]"
                }`}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        <button 
          type="button" 
          className={`md:hidden p-2 rounded-lg transition ${isSolid ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/20"}`} 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

    
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 px-6 py-5 space-y-4">
          <Link to="/" className={mobileLink} onClick={() => setMobileOpen(false)}>Inicio</Link>
          <Link to="/directorio" className={mobileLink} onClick={() => setMobileOpen(false)}>Directorio</Link>
          <Link to="/planes" className={mobileLink} onClick={() => setMobileOpen(false)}>Planes</Link>
          
          <div className="h-px bg-slate-100 w-full my-2"></div>
          
          {user ? (
        
            <>
              <div className="flex items-center gap-3 pt-2 pb-1">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt={name}
                    className="w-9 h-9 rounded-full object-cover border border-[#14b8a6]/20 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center text-white font-bold text-sm">
                    {initial}
                  </div>
                )}
                <span className="text-slate-700 font-semibold text-[14px]">{name}</span>
              </div>
              <Link
                to={panel.path}
                className="flex items-center gap-2 pt-3 text-teal-600 font-medium text-[14px] hover:text-teal-700"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutGrid className="h-4 w-4" />
                {panel.label}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 pt-3 text-red-500 font-medium text-[14px] hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-[#14b8a6] font-medium text-[14px]" onClick={() => setMobileOpen(false)}>
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="block bg-[#14b8a6] text-white text-center font-medium text-[14px] px-4 py-2.5 rounded-lg mt-3"
                onClick={() => setMobileOpen(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;