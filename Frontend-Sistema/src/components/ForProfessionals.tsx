import { Zap, Clock, CheckCircle, Wallet } from 'lucide-react';

const benefits = [
  {
    icon: Wallet,
    title: 'Ganancias Flexibles',
    description: 'Tú decides tus tarifas y horarios'
  },
  {
    icon: CheckCircle,
    title: 'Perfil Verificado',
    description: 'Badge SUNEDU aumenta tu credibilidad'
  },
  {
    icon: Clock,
    title: 'Agenda Propia',
    description: 'Control total de tu disponibilidad'
  },
  {
    icon: Zap,
    title: 'Cobro Seguro',
    description: 'Retiro de ganancias cuando quieras'
  }
];

export default function ForProfessionals() {
  return (
    <div className="py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CARD PRINCIPAL */}
        <div className="relative rounded-3xl overflow-hidden mb-16">

          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 
            bg-[url('https://readdy.ai/api/search-image?query=team%20of%20professional%20nurses%20and%20healthcare%20workers%20in%20uniforms%20smiling%20together%2C%20modern%20hospital%20corridor%20background%2C%20diverse%20group%2C%20professional%20and%20trustworthy%20atmosphere%2C%20warm%20lighting%2C%20high%20quality%20photography&width=1200&height=400&seq=cta-nurses&orientation=landscape')] 
            bg-cover bg-center bg-no-repeat"
          ></div>

          {/* Degradado lado izquierdo */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent"></div>

          {/* Contenido */}
          <div className="relative z-10 px-12 py-20 max-w-full">
            <div className="text-white max-w-2xl">
              <p className="text-teal-100 uppercase tracking-widest text-xs font-bold mb-3">
                PARA PROFESIONALES
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                ¿Eres Profesional de Enfermería?
              </h2>

              <p className="text-base text-teal-50 mb-6 leading-relaxed">
                Únete a nuestra red y conecta con familias que necesitan tu experiencia. 
                Gestiona tu agenda, cobra de forma segura y construye tu reputación profesional.
              </p>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-white text-teal-600 font-bold py-2.5 px-6 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 text-sm">
                  Registrarme como Profesional
                </button>

                <button className="border-2 border-white text-white font-bold py-2.5 px-6 rounded-full hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 text-sm">
                  Ver el Directorio
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
                  <Icon className="h-8 w-8 text-teal-600" />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}