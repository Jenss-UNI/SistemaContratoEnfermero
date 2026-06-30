import { Zap, Clock, CheckCircle, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import forProfImg from "../../../../assets/inicio/forProfessional-image.jpg";

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
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-white font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">

       
        <div className="relative rounded-[2rem] overflow-hidden mb-12 md:mb-16 shadow-lg group">
          
      
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${forProfImg})` }}
          ></div>

      
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d4745] via-[#0d4745]/90 to-transparent md:via-[#0d4745]/80 md:to-transparent"></div>

       
          <div className="relative z-10 px-6 py-14 sm:px-12 md:px-16 md:py-20 max-w-full md:max-w-2xl lg:max-w-3xl">
            <p className="text-[#5eead4] uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold mb-4">
              PARA PROFESIONALES
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-white mb-4 md:mb-6 leading-[1.15]">
              ¿Eres Profesional de <br className="hidden sm:block" />Enfermería?
            </h2>

            <p className="text-[14px] md:text-[16px] text-teal-50/90 mb-8 md:mb-10 leading-relaxed max-w-xl font-light">
              Únete a nuestra red y conecta con familias que necesitan tu experiencia.
              Gestiona tu agenda, cobra de forma segura y construye tu reputación profesional.
            </p>

     
            <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
              
      
              <button 
                type="button" 
                onClick={() => navigate('/register')}
                className="bg-white text-[#0d4745] border-2 border-white hover:bg-[#0d9488] hover:text-white hover:border-[#0d9488] font-bold py-3.5 px-7 rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2.5 text-[14px] md:text-[15px] shadow-sm"
              >
                Registrarme como Profesional
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>

        
              <button 
                type="button" 
                className="bg-transparent text-white border-2 border-white/80 hover:bg-white hover:text-[#0d4745] hover:border-white font-bold py-3.5 px-7 rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2 text-[14px] md:text-[15px]"
              >
                Ver el Directorio
              </button>
            </div>
          </div>
        </div>

    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index} 
                className="bg-[#f8fafc] rounded-2xl p-6 md:p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-sm"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#ccfbf1]/60 mb-5 md:mb-6">
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-[#0d9488]" strokeWidth={2} />
                </div>

                <h3 className="text-[15px] md:text-[16px] font-bold text-slate-900 mb-2 leading-tight">
                  {benefit.title}
                </h3>

                <p className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}