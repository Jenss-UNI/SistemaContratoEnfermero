import { CheckCircle2, Building2, HeartPulse, BriefcaseMedical } from 'lucide-react';

// Diccionario de estilos para mantener los colores de cada servicio consistentes
const serviceStyles: Record<string, string> = {
  'Especializado': 'bg-blue-500 text-white',
  'Asistencial': 'bg-[#10b981] text-white',
  'Acompañamiento': 'bg-amber-500 text-white',
};

const levels = [
  {
    icon: Building2,
    title: 'Enfermero Especializado',  
    services: ['Especializado', 'Asistencial', 'Acompañamiento'],
    cardBorder: 'border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    badgeClass: 'bg-blue-50 text-blue-600',
    description: 'Profesionales con especialización postgrado. Capacitados para cuidados intensivos, post-operatorios, manejo de equipos médicos avanzados y pacientes críticos.',
    badges: ['Cuidados complejos', 'UCI / post operatorios', 'Oncología', 'Rehabilitación'],
    verification: 'Título verificado ante SUNEDU / MINEDU'
  },
  {
    icon: HeartPulse,
    title: 'Licenciado en Enfermería',
    services: ['Asistencial', 'Acompañamiento'],
    cardBorder: 'border-[#a7f3d0]', 
    iconBg: 'bg-[#ecfdf5]', 
    iconColor: 'text-[#10b981]', 
    badgeClass: 'bg-[#ecfdf5] text-[#059669]', 
    description: 'Licenciados en enfermería con formación general. Ideales para atención domiciliaria continua, administración de medicamentos, curaciones y seguimiento de pacientes.',
    badges: ['Atención general', 'Medicación y curaciones', 'Signos vitales', 'Acompañamiento'],
    verification: 'Título verificado ante SUNEDU / MINEDU'
  },
  {
    icon: BriefcaseMedical,
    title: 'Técnico en Enfermería',
    services: ['Acompañamiento'],
    cardBorder: 'border-amber-200',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    badgeClass: 'bg-amber-50 text-amber-600',
    description: 'Técnicos titulados especializados en cuidados básicos de enfermería. Perfectos para higiene personal, asistencia en alimentación, movilización y compañía al adulto mayor.',
    badges: ['Higiene y asistencia física', 'Alimentación', 'Movilización', 'Compañía'],
    verification: 'Título verificado ante SUNEDU / MINEDU'
  }
];

export default function ProfessionalLevels() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h3 className="text-[#14b8a6] font-bold tracking-[0.15em] uppercase mb-3 md:mb-4 text-xs md:text-[13px]">
            NUESTRO EQUIPO
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-[46px] font-bold text-[#0f172a] mb-5 md:mb-6 tracking-tight leading-[1.2] md:leading-[1.15]">
            Tres niveles de <span className="text-[#14b8a6]">atención profesional</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-[14px] md:text-[16px] leading-relaxed px-4 sm:px-0">
            Encuentra al profesional que mejor se adapte a las necesidades de tu familiar. Todos verificados y calificados.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <div 
                key={index} 
                className={`bg-white rounded-2xl border-2 ${level.cardBorder} p-6 md:p-8 flex flex-col h-full hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-start gap-4 mb-6 md:mb-8">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 ${level.iconBg} ${level.iconColor}`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
                  </div>
                  <div className="flex flex-col items-start pt-1 md:pt-1.5">
                    <h3 className="text-[17px] md:text-[19px] font-bold text-[#0f172a] mb-2 leading-tight">
                      {level.title}
                    </h3>
                    
                 
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {level.services.map((service, sIndex) => (
                        <span 
                          key={sIndex}
                          className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold tracking-wide ${serviceStyles[service]}`}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    
                  </div>
                </div>

                <p className="text-slate-500 text-[13px] md:text-[14px] leading-relaxed mb-8 flex-grow">
                  {level.description}
                </p>

                <div className="flex flex-wrap gap-2 md:gap-2.5 mb-8">
                  {level.badges.map((badge, bIndex) => (
                    <span 
                      key={bIndex} 
                      className={`px-3 py-1.5 rounded-full text-[11px] md:text-[12px] font-medium ${level.badgeClass}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-5 md:pt-6 border-t border-slate-100 flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#10b981]" strokeWidth={2.5} />
                  <span className="text-slate-400 text-[11px] md:text-[12px] font-medium">
                    {level.verification}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}