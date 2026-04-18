function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Columna 1: Newsletter */}
          <div>
            <h2 className="text-2xl font-bold text-teal-400">Mantente</h2>
            <h3 className="text-2xl font-bold mb-4">Informado</h3>
            <p className="text-slate-400 mb-4">
              Recibe consejos de cuidado, actualizaciones de profesionales y ofertas exclusivas para familias peruanas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="bg-slate-800 text-white px-4 py-2 rounded-lg flex-1 border border-slate-700 focus:outline-none focus:border-teal-400"
              />
              <button className="bg-teal-500 hover:bg-teal-600 px-5 py-2 rounded-lg transition font-semibold whitespace-nowrap">
                Suscribirme →
              </button>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="font-bold text-lg mb-4">NAVEGACIÓN</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition">Buscar Enfermeros</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Cómo Funciona</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Registrarse</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Términos de Servicio</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">CONTACTO</h3>
            <div className="space-y-3 text-slate-400">
              <p className="hover:text-teal-400 transition">+51 999 888 777</p>
              <p className="hover:text-teal-400 transition">soporte@cuidadosalud.pe</p>
              <p>
                OFICINA PRINCIPAL<br />
                Av. Javier Prado Este 5268<br />
                La Molina, Lima - Perú
              </p>
              {/* Redes sociales sin íconos */}
              <div className="flex gap-4 pt-2">
                <a href="#" className="hover:text-teal-400 transition">Facebook</a>
                <a href="#" className="hover:text-teal-400 transition">LinkedIn</a>
                <a href="#" className="hover:text-teal-400 transition">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-slate-500 text-sm">
          <p>© 2026 CuidadoSalud. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-2">
            <a href="#" className="hover:text-teal-400 transition">Política de Privacidad</a>
            <a href="#" className="hover:text-teal-400 transition">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;