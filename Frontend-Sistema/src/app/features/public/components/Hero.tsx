import { Search, Star, MapPin, Clock, ShieldCheck, ChevronDown, Stethoscope } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const [distrito, setDistrito] = useState('');
  const [tiposCuidado, setTiposCuidado] = useState('');

  return (
    <section 
      className="relative min-h-screen pt-24 flex items-center overflow-hidden bg-[url('https://readdy.ai/api/search-image?query=warm%20and%20caring%20nurse%20helping%20elderly%20patient%20at%20home%20in%20Peru%2C%20cozy%20living%20room%20setting%2C%20soft%20natural%20light%20coming%20through%20window%2C%20professional%20healthcare%20worker%20in%20white%20uniform%2C%20emotional%20and%20trustworthy%20atmosphere%2C%20high%20quality%20photography%2C%20warm%20tones&width=1440&height=900&seq=hero-bg&orientation=landscape')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Contenedor principal ampliado a max-w-[1400px] */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-2">
                <img className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=1" alt="Familia 1" />
                <img className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=5" alt="Familia 2" />
                <img className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=9" alt="Familia 3" />
              </div>
              <span className="text-white text-sm lg:text-base font-medium">
                +2,500 familias peruanas confían en nosotros
              </span>
            </div>

            {/* Título mucho más grande en pantallas de PC */}
            <h1 className="text-white text-5xl md:text-6xl lg:text-[70px] font-light mb-6 leading-[1.05] tracking-tight">
              Cuidamos a quienes<br />
              <span className="font-extrabold text-[#14b8a6]">MÁS AMAS</span>
            </h1>

            {/* Párrafo con texto más grande */}
            <p className="text-gray-300 text-base md:text-[18px] lg:text-[20px] mb-10 leading-relaxed font-light max-w-[600px]">
              Profesionales verificados por SUNEDU y MINEDU. Contratación segura.<br />
              Pago protegido en custodia.
            </p>

            {/* Caja de cristal ampliada a max-w-[680px] y con más padding (p-8) */}
            <div className="bg-[#3a3532]/40 border border-white/20 backdrop-blur-md rounded-3xl p-6 lg:p-8 mb-10 max-w-[680px] shadow-2xl">
              <h3 className="text-white text-sm lg:text-base font-bold mb-5 uppercase tracking-widest opacity-90">
                Busca tu enfermero ideal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#14b8a6]" />
                  <input
                    type="text"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    placeholder="Distrito"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 text-white rounded-2xl text-[15px] lg:text-base border border-white/20 focus:outline-none focus:border-[#14b8a6] placeholder-gray-300 transition-all"
                  />
                </div>

                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#14b8a6]" />
                  <select
                    value={tiposCuidado}
                    onChange={(e) => setTiposCuidado(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-white/5 text-white rounded-2xl text-[15px] lg:text-base border border-white/20 focus:outline-none focus:border-[#14b8a6] appearance-none cursor-pointer"
                  >
                    <option value="" className="text-slate-900">Tipo de enfermero</option>
                    <option value="acompanamiento" className="text-slate-900">Acompañamiento</option>
                    <option value="asistencial" className="text-slate-900">Asistencial</option>
                    <option value="especializado" className="text-slate-900">Especializado</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
                </div>
              </div>

              {/* Botón principal más grande */}
              <button type="button" className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-[16px] lg:text-[18px] shadow-lg">
                <Search className="w-5 h-5" />
                Buscar Enfermero Ahora
              </button>
            </div>

            {/* Badges de confianza escalados */}
            <div className="flex flex-wrap items-center gap-8 md:gap-12 mb-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 lg:w-8 lg:h-8 text-[#14b8a6]" strokeWidth={2} />
                <div>
                  <p className="text-white text-[15px] lg:text-[17px] font-bold leading-tight">100%</p>
                  <p className="text-gray-400 text-[12px] lg:text-[13px] leading-tight">Verificados</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Star className="w-7 h-7 lg:w-8 lg:h-8 text-[#14b8a6] fill-[#14b8a6]" strokeWidth={2} />
                <div>
                  <p className="text-white text-[15px] lg:text-[17px] font-bold leading-tight">4.8★</p>
                  <p className="text-gray-400 text-[12px] lg:text-[13px] leading-tight">Calificación promedio</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-7 h-7 lg:w-8 lg:h-8 text-[#14b8a6]" strokeWidth={2} />
                <div>
                  <p className="text-white text-[15px] lg:text-[17px] font-bold leading-tight">24/7</p>
                  <p className="text-gray-400 text-[12px] lg:text-[13px] leading-tight">Disponibilidad</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-60 hidden lg:block">
        <ChevronDown className="w-8 h-8 text-white" />
      </div>
    </section>
  );
}