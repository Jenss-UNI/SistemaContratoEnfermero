import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

type HeaderProps = {
  transparentOnTop?: boolean;
};

function Header({ transparentOnTop = false }: HeaderProps) {
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

  const navLink =
  "hover:text-teal-500 relative after:block after:h-[2px] after:bg-teal-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center transition";

  const mobileLink = "block pt-3 hover:text-teal-500";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isSolid ? "bg-white/90 backdrop-blur-md shadow-lg py-3 text-gray-800" : "bg-transparent py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" onClick={scrollToTop} className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
          CuidadoSalud
        </Link>

        <nav className="hidden md:flex flex-1 justify-center gap-10 items-center">
          <Link to="/" onClick={scrollToTop} className={navLink}>
            Inicio
          </Link>
          <Link to="/directorio"  onClick={scrollToTop} className={navLink}>
            Directorio
          </Link>
          <Link to="/planes" onClick={scrollToTop} className={navLink}>
            Planes
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className={navLink}>
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2 rounded-full hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:scale-105"
          >
            Registrarse
          </Link>
        </div>

        <button type="button" className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-2xl rounded-b-2xl text-gray-800 px-6 py-5 space-y-3 divide-y divide-gray-100">
          <Link to="/" className={mobileLink} onClick={() => setOpen(false)}>
            Inicio
          </Link>
          <Link to="/directorio" className={mobileLink} onClick={() => setOpen(false)}>
            Directorio
          </Link>
          <Link to="/planes" className={mobileLink} onClick={() => setOpen(false)}>
            Planes
          </Link>

          <Link to="/login" className={mobileLink} onClick={() => setOpen(false)}>
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="block bg-gradient-to-r from-teal-500 to-cyan-500
            hover:from-teal-600 hover:to-cyan-600 text-white text-center px-4 py-2 rounded-full"
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
