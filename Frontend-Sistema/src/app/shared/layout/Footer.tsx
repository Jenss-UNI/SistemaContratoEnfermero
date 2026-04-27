function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20 border border-slate-800 rounded-t-3xl overflow-hidden shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-20">

          <div>
            <h2 className="text-2xl font-bold text-teal-400">Mantente</h2>
            <h3 className="text-2xl font-bold mb-5">Informado</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Recibe consejos de cuidado, actualizaciones de profesionales y ofertas exclusivas para familias peruanas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="bg-slate-800 text-white px-4 py-3 rounded-xl flex-1 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button type="button" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-5 py-3 rounded-xl transition font-semibold whitespace-nowrap shadow-lg">
                Suscribirme →
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-1 tracking-wide text-white">NAVEGACIÓN</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Buscar Enfermeros</a></li>
              <li><a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Cómo Funciona</a></li>
              <li><a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Registrarse</a></li>
              <li><a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Términos de Servicio</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-1 tracking-wide text-white">CONTACTO</h3>
            <div className="space-y-2 text-slate-400">
              <p className="block hover:text-teal-400 transition hover:translate-x-1 cursor-pointer">+51 999 888 777</p>
              <p className="block hover:text-teal-400 transition hover:translate-x-1 cursor-pointer">soporte@cuidadosalud.pe</p>
              <p>
                OFICINA PRINCIPAL<br />
                Av. Javier Prado Este 5268<br />
                La Molina, Lima - Perú
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Facebook</a>
                <a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">LinkedIn</a>
                <a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-slate-500 text-sm">
          <p>© 2026 CuidadoSalud. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-2">
            <a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Política de Privacidad</a>
            <a href="#" className="hover:text-teal-400 transition hover:translate-x-1 inline-block">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
