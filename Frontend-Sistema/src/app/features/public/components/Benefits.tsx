import { Search, UserCheck, CalendarCheck, ShieldCheck, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Busca y Filtra',
    description: 'Ingresa tu distrito y el tipo de cuidado que necesitas. Filtra por precio, especialidad y nivel profesional.',
  },
  {
    icon: UserCheck,
    number: '02',
    title: 'Elige tu Profesional',
    description: 'Revisa perfiles verificados, calificaciones reales y reseñas de otras familias antes de decidir.',
  },
  {
    icon: CalendarCheck,
    number: '03',
    title: 'Agenda el Servicio',
    description: 'Selecciona los días y horarios que necesitas. El sistema calcula el costo total automáticamente.',
  },
  {
    icon: ShieldCheck,
    number: '04',
    title: 'Pago Seguro',
    description: 'Tu pago queda en custodia. El enfermero lo recibe solo cuando confirmas que el servicio fue satisfactorio.',
  },
  {
    icon: Star,
    number: '05',
    title: 'Califica la Experiencia',
    description: 'Evalúa puntualidad, trato y conocimiento técnico. Tus reseñas ayudan a otras familias a elegir mejor.',
  }
];

export default function Benefits() {
  
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a] text-white font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
  
        <div className="text-center mb-20 flex flex-col items-center">
          <h3 className="text-gray-400 font-semibold tracking-[0.2em] uppercase mb-6 text-xs md:text-sm">
            PROCESO SIMPLE Y SEGURO
          </h3>
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-light mb-12 tracking-tight leading-[1.15] max-w-5xl">
            Conectamos familias con <br className="hidden md:block" />
            <span className="font-bold text-white">profesionales de salud</span> <br className="hidden md:block" />
            <span className="text-[#14b8a6] font-light">verificados en 5 pasos</span>
          </h2>

    
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
            
       
            <button 
              type="button" 
              className="bg-white text-black border-2 border-white hover:bg-[#14b8a6] hover:text-white hover:border-[#14b8a6] font-bold px-10 py-4 rounded-full text-[15px] transition-all duration-300 w-full sm:w-auto"
            >
              Buscar Enfermero
            </button>
            
           
            <button 
              type="button" 
              onClick={() => navigate('/register')} 
              className="bg-transparent text-white border-2 border-white/80 hover:bg-white hover:text-black font-bold px-10 py-4 rounded-full text-[15px] transition-all duration-300 w-full sm:w-auto"
            >
              Registrarme como Profesional
            </button>

          </div>
        </div>

     
        <div className="relative mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative flex items-start">
                  
                
                  <div className="bg-[#18181b] rounded-2xl p-8 flex flex-col h-full w-full relative overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                    
                  
                    <span className="absolute top-4 right-5 text-6xl md:text-[70px] font-black text-slate-800 tracking-tighter select-none">
                      {step.number}
                    </span>

                    
                    <div className="mb-10 relative z-10 mt-2">
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>

                    <h3 className="text-lg md:text-[19px] font-bold text-white mb-4 relative z-10 tracking-tight">
                      {step.title}
                    </h3>

                   
                    <p className="text-[14px] text-gray-400 leading-relaxed relative z-10 flex-grow font-light pr-2">
                      {step.description}
                    </p>
                  </div>

             
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 xl:-right-5 -translate-y-1/2 z-20 hidden xl:block">
                      <ChevronRight className="w-5 h-5 text-gray-600" strokeWidth={2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}