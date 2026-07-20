import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="bg-[#021311] text-white mt-16 rounded-t-[28px] overflow-hidden border-t border-[#12312d]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-14">

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

        
          <div className="max-w-sm">
            <h2 className="text-3xl md:text-4xl leading-tight font-light text-white">
              Mantente
            </h2>

            <h3 className="text-4xl md:text-5xl leading-tight font-bold text-white mb-6">
              Informado
            </h3>

            <p className="text-[#9cb3ad] text-sm md:text-base leading-7 mb-8">
              Recibe consejos de cuidado, actualizaciones de profesionales y
              ofertas exclusivas para familias peruanas.
            </p>

            {/* INPUT */}
            <div className="w-full">
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full bg-transparent border-b border-[#314542] pb-3 text-white placeholder:text-[#71807d] outline-none text-sm"
              />

              <button className="mt-5 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 text-sm">
                Suscribirme →
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[12px] tracking-[3px] uppercase text-[#b9c5c2] mb-6">
              Navegación
            </h4>

            <ul className="space-y-4 text-[#c4d0cd] text-sm">

              <li>
                <Link
                  to="/directorio"
                  className="hover:text-white transition underline underline-offset-4"
                >
                  Buscar Enfermeros
                </Link>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition underline underline-offset-4"
                >
                  Cómo Funciona
                </a>
              </li>

              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition underline underline-offset-4"
                >
                  Registrarse
                </Link>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition underline underline-offset-4"
                >
                  Preguntas Frecuentes
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-white transition underline underline-offset-4"
                >
                  Términos de Servicio
                </a>
              </li>

            </ul>
          </div>

          <div>
            <h4 className="text-[12px] tracking-[3px] uppercase text-[#b9c5c2] mb-6">
              Contacto
            </h4>

            <div className="space-y-5 text-[#d9e3e1]">

              <div>
                <p className="text-xl md:text-2xl font-semibold text-white">
                  +51 999 888 777
                </p>

                <p className="mt-2 text-sm text-[#b8c3c0]">
                  soporte@cuidadosalud.pe
                </p>
              </div>

              <div>
                <p className="uppercase tracking-[2px] text-xs text-[#b9c5c2] mb-2">
                  Oficina Principal
                </p>

                <p className="leading-7 text-sm text-[#d0d9d7]">
                  Av. Javier Prado Este 5268
                  <br />
                  La Molina, Lima - Perú
                </p>
              </div>

             
              <div className="flex gap-3 pt-1">

                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[#415451] flex items-center justify-center hover:border-white hover:text-white transition-all duration-300 text-sm"
                >
                  f
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[#415451] flex items-center justify-center hover:border-white hover:text-white transition-all duration-300 text-sm"
                >
                  ◎
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[#415451] flex items-center justify-center hover:border-white hover:text-white transition-all duration-300 text-sm"
                >
                  in
                </a>

              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1b302d] mt-14 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-[#8c9b98] text-xs md:text-sm text-center md:text-left">
            © 2025 CuidadoSalud. Todos los derechos reservados.
          </p>

          <div className="flex gap-6 text-xs md:text-sm">
            <a
              href="#"
              className="text-[#9eb0ac] hover:text-white transition"
            >
              Política de Privacidad
            </a>

            <a
              href="#"
              className="text-[#9eb0ac] hover:text-white transition"
            >
              Términos de Servicio
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;