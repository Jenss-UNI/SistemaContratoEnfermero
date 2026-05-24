import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Bell, LayoutGrid, ChevronDown,RefreshCcw } from "lucide-react";

type HeaderProps = {
  transparentOnTop?: boolean;
  variant?: "default" | "admin";
};

function Header({ transparentOnTop = false, variant = "default" }: HeaderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  
  const isSolid = !transparentOnTop || scroll;

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinkClass = `text-[14px] font-medium transition-colors hover:text-[#14b8a6] ${isSolid ? 'text-slate-700' : 'text-white/90'}`;
  const iconClass = `w-[18px] h-[18px] transition-colors ${isSolid ? 'text-slate-700 hover:text-[#14b8a6]' : 'text-white/90 hover:text-[#14b8a6]'}`;
  const mobileLink = "block pt-3 hover:text-[#14b8a6] text-slate-700 font-medium text-[14px]";

  // Admin topbar
  if (variant === "admin") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" onClick={scrollToTop} className="text-teal-600 font-bold">
              Cuídame
            </Link>
            <div className="text-lg font-medium text-slate-800">Resumen</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-slate-50 px-3 py-1 text-sm text-slate-600">23 de mayo de 2026</div>
            <button className="p-2 rounded-full text-slate-500 hover:bg-slate-50">
              <RefreshCcw className="h-4 w-4" />
            </button>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">Administrador</div>
          </div>
        </div>
      </header>
    );
  }

  // Default/public header
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isSolid ? "bg-white shadow-[0_2px_10px_rgb(0,0,0,0.05)] py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
    
        <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] flex items-center justify-center p-[2px]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
               <div className="w-2 h-2 bg-[#14b8a6] rounded-full"></div>
            </div>
          </div>
          <span className={`text-[18px] font-bold tracking-tight ${isSolid ? 'text-[#0f172a]' : 'text-white'}`}>
            Cuidame
          </span>
        </Link>

     
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
          
      
          <button className="relative p-1">
            <Bell className={iconClass} />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
              3
            </span>
          </button>

     
          <button className={`flex items-center gap-1.5 text-[14px] font-medium transition-colors ${isSolid ? 'text-slate-700 hover:text-[#14b8a6]' : 'text-white/90 hover:text-[#14b8a6]'}`}>
            <LayoutGrid className="w-4 h-4" />
            Paneles
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>
          <div className="flex items-center gap-3 border-l border-white/20 pl-4 ml-1">
            <Link 
              to="/login" 
              className={`px-4 py-2 rounded-lg text-[14px] font-medium border transition-all duration-300 ${
                isSolid 
                  ? 'border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6] hover:text-white' 
                  : 'border-white/40 text-white hover:bg-white hover:text-[#14b8a6] hover:border-white shadow-sm'
              }`}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-300 shadow-sm ${
                isSolid
                  ? 'bg-[#14b8a6] hover:bg-[#0d9488] text-white'
                  : 'bg-[#14b8a6] hover:bg-[#11ccb7] text-white border border-[#14b8a6]'
              }`}
            >
              Registrarse
            </Link>
          </div>
        </div>

  
        <button 
          type="button" 
          className={`md:hidden p-2 rounded-lg transition ${isSolid ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/20'}`} 
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 px-6 py-5 space-y-4">
          <Link to="/" className={mobileLink} onClick={() => setOpen(false)}>Inicio</Link>
          <Link to="/directorio" className={mobileLink} onClick={() => setOpen(false)}>Directorio</Link>
          <Link to="/planes" className={mobileLink} onClick={() => setOpen(false)}>Planes</Link>
          <div className="h-px bg-slate-100 w-full my-2"></div>
          <Link to="/login" className="block text-[#14b8a6] font-medium text-[14px]" onClick={() => setOpen(false)}>
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="block bg-[#14b8a6] text-white text-center font-medium text-[14px] px-4 py-2.5 rounded-lg mt-3"
            onClick={() => setOpen(false)}
          >
            Registrarse
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;