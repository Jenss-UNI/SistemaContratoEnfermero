import { Search, Star, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const [distrito, setDistrito] = useState('');
  const [tiposCuidado, setTiposCuidado] = useState('');

  return (
    <div
      className="relative min-h-screen pt-24 overflow-hidden 
      bg-[url('https://readdy.ai/api/search-image?query=warm%20and%20caring%20nurse%20helping%20elderly%20patient%20at%20home%20in%20Peru%2C%20cozy%20living%20room%20setting%2C%20soft%20natural%20light%20coming%20through%20window%2C%20professional%20healthcare%20worker%20in%20white%20uniform%2C%20emotional%20and%20trustworthy%20atmosphere%2C%20high%20quality%20photography%2C%20warm%20tones&width=1440&height=900&seq=hero-bg&orientation=landscape')] 
      bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              </div>
              <span className="text-white text-sm font-medium">
                +2,500 familias peruanas confían en nosotros
              </span>
            </div>

            <h1 className="text-white text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Cuidamos a quienes<br />
              <span className="text-teal-400">MÁS AMAS</span>
            </h1>

            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Profesionales verificados por SUNEDU. Contratación segura.<br />
              Pago protegido en custodia.
            </p>

            <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 mb-8 max-w-2xl">
              <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-widest">
                Busca tu enfermero ideal
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                  <input
                    type="text"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    placeholder="Distrito"
                    className="w-full pl-9 pr-3 py-3 bg-white/10 text-white rounded-2xl text-sm border border-white/20 focus:outline-none focus:border-teal-300 placeholder-gray-300"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400">
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                  </div>
                  <select
                    value={tiposCuidado}
                    onChange={(e) => setTiposCuidado(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-white/10 text-white rounded-2xl text-sm border border-white/20 focus:outline-none focus:border-teal-300 appearance-none"
                  >
                    <option value="">Tipo de cuidado</option>
                    <option value="acompanamiento">Acompañamiento</option>
                    <option value="asistencial">Asistencial</option>
                    <option value="especializado">Especializado</option>
                  </select>
                </div>
              </div>

              <button type="button" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm">
                <Search className="w-4 h-4" />
                Buscar Enfermero Ahora
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-sm mb-12 mt-6">

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                <div>
                  <p className="text-white text-lg font-bold">100%</p>
                  <p className="text-gray-400 text-xs">Verificación SUNEDU</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-bold">4.8</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <p className="text-gray-400 text-xs">Calificación</p>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                <div>
                  <p className="text-white text-lg font-bold">24/7</p>
                  <p className="text-gray-400 text-xs">Disponibilidad</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-0 w-80 h-80 bg-teal-500 opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -left-40 w-80 h-80 bg-teal-400 opacity-5 rounded-full blur-3xl"></div>
    </div>
  );
}
