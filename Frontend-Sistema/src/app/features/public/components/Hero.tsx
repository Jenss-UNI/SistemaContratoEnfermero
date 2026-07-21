import { Search, Star, MapPin, Clock, ShieldCheck, ChevronDown, Stethoscope } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from "../../../../assets/inicio/hero-image.jpg";

const DISTRITOS = [
  "Miraflores",
  "San Isidro",
  "Santiago de Surco",
  "San Borja",
  "La Molina",
  "Magdalena del Mar",
  "Jesús María",
  "Lince",
  "Pueblo Libre",
  "San Miguel"
];

const TIPOS_CUIDADO = [
  { id: 'acompanamiento', label: 'Acompañamiento' },
  { id: 'asistencial', label: 'Asistencial' },
  { id: 'especializado', label: 'Especializado' }
];

export default function Hero() {
  const navigate = useNavigate();
  
  const [distrito, setDistrito] = useState('');
  const [tipoCuidado, setTipoCuidado] = useState('');
  
  const [isDistritoOpen, setIsDistritoOpen] = useState(false);
  const [isCuidadoOpen, setIsCuidadoOpen] = useState(false);

  const distritoRef = useRef<HTMLDivElement>(null);
  const cuidadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (distritoRef.current && !distritoRef.current.contains(event.target as Node)) {
        setIsDistritoOpen(false);
      }
      if (cuidadoRef.current && !cuidadoRef.current.contains(event.target as Node)) {
        setIsCuidadoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (distrito && distrito !== "Todos los distritos") {
      params.append('distrito', distrito);
    }
    if (tipoCuidado) {
      params.append('cuidado', tipoCuidado);
    }
    navigate(`/directorio?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-screen pt-24 flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-2">
                <img className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-slate-800 object-cover" src="src/assets/inicio/avatar-Defecto.jpg" alt="Familia 1" />
                <img className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-slate-800 object-cover" src="src/assets/inicio/avatar-Defecto.jpg" alt="Familia 2" />
                <img className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-slate-800 object-cover" src="src/assets/inicio/avatar-Defecto.jpg" alt="Familia 3" />
              </div>
              <span className="text-white text-sm lg:text-base font-medium">
                +2,500 familias peruanas confían en nosotros
              </span>
            </div>

            <h1 className="text-white text-5xl md:text-6xl lg:text-[70px] font-light mb-6 leading-[1.05] tracking-tight">
              Cuidamos a quienes<br />
              <span className="font-extrabold text-[#14b8a6]">MÁS AMAS</span>
            </h1>

            <p className="text-gray-300 text-base md:text-[18px] lg:text-[20px] mb-10 leading-relaxed font-light max-w-[600px]">
              Profesionales verificados por SUNEDU y MINEDU. Contratación segura.<br />
              Pago protegido en custodia.
            </p>

            <div className="bg-[#3a3532]/40 border border-white/20 backdrop-blur-md rounded-3xl p-6 lg:p-8 mb-10 max-w-[680px] shadow-2xl">
              <h3 className="text-white text-sm lg:text-base font-bold mb-5 uppercase tracking-widest opacity-90">
                Busca tu enfermero ideal
              </h3>

              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
               
                  <div className="relative" ref={distritoRef}>
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#14b8a6] pointer-events-none z-10" />
                    
                    <div 
                      onClick={() => {
                        setIsDistritoOpen(!isDistritoOpen);
                        setIsCuidadoOpen(false);
                      }}
                      className={`w-full pl-12 pr-10 py-4 bg-[#2a2a2a]/60 backdrop-blur-sm text-white rounded-2xl text-[15px] lg:text-base border ${isDistritoOpen ? 'border-[#14b8a6]' : 'border-white/20 hover:border-white/40'} cursor-pointer flex items-center justify-between transition-all`}
                    >
                      <span className={distrito ? 'text-white' : 'text-gray-400'}>
                        {distrito || 'Selecciona Distrito'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-white/60 transition-transform duration-300 ${isDistritoOpen ? 'rotate-180 text-[#14b8a6]' : ''}`} />
                    </div>

                    {isDistritoOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-[#222222] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {DISTRITOS.map((d) => (
                          <div
                            key={d}
                            onClick={() => {
                              setDistrito(d);
                              setIsDistritoOpen(false);
                            }}
                            className={`pl-12 pr-4 py-3.5 cursor-pointer transition-colors text-[15px] border-l-2 ${
                              distrito === d 
                                ? 'bg-[#14b8a6]/10 text-[#14b8a6] font-medium border-[#14b8a6]' 
                                : 'text-gray-300 border-transparent hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

             
                  <div className="relative" ref={cuidadoRef}>
                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#14b8a6] pointer-events-none z-10" />
                    
                    <div 
                      onClick={() => {
                        setIsCuidadoOpen(!isCuidadoOpen);
                        setIsDistritoOpen(false);
                      }}
                      className={`w-full pl-12 pr-10 py-4 bg-[#2a2a2a]/60 backdrop-blur-sm text-white rounded-2xl text-[15px] lg:text-base border ${isCuidadoOpen ? 'border-[#14b8a6]' : 'border-white/20 hover:border-white/40'} cursor-pointer flex items-center justify-between transition-all`}
                    >
                      <span className={tipoCuidado ? 'text-white' : 'text-gray-400'}>
                        {TIPOS_CUIDADO.find(t => t.id === tipoCuidado)?.label || 'Tipo de cuidado'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-white/60 transition-transform duration-300 ${isCuidadoOpen ? 'rotate-180 text-[#14b8a6]' : ''}`} />
                    </div>

                    {isCuidadoOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-[#222222] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        {TIPOS_CUIDADO.map((tipo) => (
                          <div
                            key={tipo.id}
                            onClick={() => {
                              setTipoCuidado(tipo.id);
                              setIsCuidadoOpen(false);
                            }}
                            className={`pl-12 pr-4 py-3.5 cursor-pointer transition-colors text-[15px] border-l-2 ${
                              tipoCuidado === tipo.id 
                                ? 'bg-[#14b8a6]/10 text-[#14b8a6] font-medium border-[#14b8a6]' 
                                : 'text-gray-300 border-transparent hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {tipo.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-[16px] lg:text-[18px] shadow-lg mt-2"
                >
                  <Search className="w-5 h-5" />
                  Buscar Enfermero Ahora
                </button>
              </form>
            </div>

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