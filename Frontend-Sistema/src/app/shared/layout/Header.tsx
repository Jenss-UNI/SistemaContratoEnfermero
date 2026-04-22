import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

type HeaderProps = {
  transparentOnTop?: boolean;
};

function Header({ transparentOnTop = false }: HeaderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const [panelesOpen, setPanelesOpen] = useState<boolean>(false);
  const isSolid = !transparentOnTop || scroll;

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
};

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isSolid ? "bg-white shadow-md py-3 text-gray-800" : "bg-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" onClick={scrollToTop} className="text-2xl font-bold text-teal-500">
          CuidadoSalud
        </Link>

        <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
          <Link to="/" onClick={scrollToTop} className="hover:text-teal-400 transition">
            Inicio
          </Link>
          <Link to="/directorio"  onClick={scrollToTop} className="hover:text-teal-400 transition">
            Directorio
          </Link>
          <Link to="/planes" onClick={scrollToTop} className="hover:text-teal-400 transition">
            Planes
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPanelesOpen(!panelesOpen)}
              className="flex items-center gap-1 hover:text-teal-400 transition"
            >
              Paneles <ChevronDown size={16} className={`transition-transform ${panelesOpen ? "rotate-180" : ""}`} />
            </button>

            {panelesOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                <Link
                  to="/panel-familiar"
                  className="block px-4 py-2 hover:bg-teal-50 hover:text-teal-600 transition"
                >
                  Panel Familiar
                </Link>
                <Link
                  to="/mi-perfil-cliente"
                  className="block px-4 py-2 hover:bg-teal-50 hover:text-teal-600 transition"
                >
                  Mi Perfil Cliente
                </Link>
                <Link
                  to="/panel-enfermero"
                  className="block px-4 py-2 hover:bg-teal-50 hover:text-teal-600 transition"
                >
                  Panel Enfermero
                </Link>
                <Link
                  to="/admin"
                  className="block px-4 py-2 hover:bg-teal-50 hover:text-teal-600 transition"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>

          <Link to="/login" className="hover:text-teal-400 transition">
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="bg-teal-500 text-white px-5 py-2 rounded-full hover:bg-teal-600 transition shadow-md"
          >
            Registrarse
          </Link>
        </div>

        <button type="button" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white text-gray-800 px-6 py-5 space-y-4 shadow-lg">
          <Link to="/" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
            Inicio
          </Link>
          <Link to="/directorio" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
            Directorio
          </Link>
          <Link to="/planes" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
            Planes
          </Link>

          <div>
            <p className="font-semibold text-teal-600 mb-2">Paneles</p>
            <div className="pl-4 space-y-2 border-l-2 border-teal-200">
              <Link to="/panel-familiar" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
                Panel Familiar
              </Link>
              <Link to="/mi-perfil-cliente" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
                Mi Perfil Cliente
              </Link>
              <Link to="/panel-enfermero" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
                Panel Enfermero
              </Link>
              <Link to="/admin" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
                Admin
              </Link>
            </div>
          </div>

          <Link to="/login" className="block hover:text-teal-500" onClick={() => setOpen(false)}>
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="block bg-teal-500 text-white text-center px-4 py-2 rounded-full"
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
