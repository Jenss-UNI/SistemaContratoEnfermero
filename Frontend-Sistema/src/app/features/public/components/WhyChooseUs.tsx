import { ShieldCheck, Lock, FileText, Star, IdCard } from 'lucide-react';

const topCards = [
  {
    icon: ShieldCheck,
    title: 'Profesionales verificados',
    description:
      'Cada enfermero que aparece en nuestra plataforma ha pasado por un riguroso proceso de verificación que incluye validación de DNI, título profesional ante SUNEDU o MINEDU según corresponda, colegiatura o RNE activo, y revisión de antecedentes.',
  },
  {
    icon: Lock,
    title: 'Pago Protegido en Custodia',
    description:
      'Tu dinero queda en custodia hasta que el servicio se complete satisfactoriamente. El enfermero recibe el pago solo cuando tú confirmas.',
  }
];

const bottomCards = [
  {
    icon: FileText,
    title: 'Contrato Digital',
    description:
      'PDF automático generado al confirmar cada servicio. Protección legal para ambas partes.',
  },
  {
    icon: Star,
    title: 'Reseñas Verificadas',
    description:
      'Calificaciones reales de familias que contrataron el servicio. Puntualidad, trato y conocimiento.',
  },
  {
    icon: IdCard,
    title: 'Verificación de DNI',
    description:
      'Validación de identidad de cada profesional para evitar perfiles falsos en la plataforma.',
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h3 className="text-[#14b8a6] font-medium tracking-[0.15em] uppercase mb-3 text-sm">
            ¿Por qué elegirnos?
          </h3>
          <h2 className="text-3xl md:text-[42px] leading-tight font-bold text-[#0f172a] tracking-tight mb-5">
            Tu tranquilidad y la salud de los tuyos son nuestra <span className="text-[#14b8a6]">PRIORIDAD</span>
          </h2>
          <p className="text-[15px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Cada profesional en nuestra plataforma pasa por un riguroso proceso de verificación. 
            Sabemos lo que significa dejar a un ser querido en manos de alguien más, por eso 
            garantizamos un cuidado seguro, ético y de primer nivel para tu familia.
          </p>
        </div>

   
        <div className="flex flex-col gap-6 lg:gap-8">
          
    
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
         
            <div className="relative rounded-3xl overflow-hidden h-[400px] lg:h-auto min-h-[400px]">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20nurse%20checking%20vital%20signs%20of%20elderly%20patient%20at%20home%2C%20warm%20caring%20atmosphere%2C%20medical%20equipment%2C%20soft%20natural%20lighting%2C%20high%20quality%20photography%2C%20warm%20tones%2C%20professional%20healthcare&width=600&height=700&seq=feat-main&orientation=portrait"
                alt="Enfermera atendiendo paciente"
                className="absolute inset-0 w-full h-full object-cover"
              />
          
              <div className="absolute bottom-6 left-6 rounded-full bg-[#1e293b]/90 px-5 py-2.5 text-[13px] md:text-sm font-medium text-white shadow-lg backdrop-blur-sm">
                Asistencia Profesional 24/7
              </div>
            </div>

            {/* TARJETAS SUPERIORES */}
            <div className="flex flex-col gap-6 lg:gap-8">
              {topCards.map((item, index) => {
                const Icon = item.icon;
                return (
                
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 border border-slate-100/60 shadow-[0_4px_24px_rgb(0,0,0,0.04)] flex flex-col justify-center flex-1"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#e6fcf8] text-[#14b8a6] mb-5">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[19px] font-bold text-[#0f172a] mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {bottomCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 border border-slate-100/60 shadow-[0_4px_24px_rgb(0,0,0,0.04)] flex flex-col"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#e6fcf8] text-[#14b8a6] mb-5">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#0f172a] mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}