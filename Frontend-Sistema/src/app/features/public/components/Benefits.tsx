import { Search, Users, Calendar, CreditCard, Star } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Busca y Filtra',
    description: 'Ingresa tu distrito y el tipo de cuidado que necesitas. Filtra por precio, especialidad y nivel profesional.'
  },
  {
    number: '02',
    icon: Users,
    title: 'Elige tu Profesional',
    description: 'Revisa perfiles verificados, calificaciones reales y reseñas de otras familias antes de decidir.'
  },
  {
    number: '03',
    icon: Calendar,
    title: 'Agenda el Servicio',
    description: 'Selecciona los días y horarios que necesitas. El sistema calcula el costo total automáticamente.'
  },
  {
    number: '04',
    icon: CreditCard,
    title: 'Pago Seguro',
    description: 'Tu pago queda en custodia. El enfermero lo recibe solo cuando tú confirmas que el servicio fue satisfactorio.'
  },
  {
    number: '05',
    icon: Star,
    title: 'Califica la Experiencia',
    description: 'Evalúa puntualidad, trato y conocimiento técnico. Tus reseñas ayudan a otras familias a elegir mejor.'
  }
];

export default function Benefits() {
  return (
    <div className="relative py-24 bg-slate-950 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-4">
            PROCESO SIMPLE Y SEGURO
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white mb-1 leading-tight">
            Conectamos familias con<br />
            <span className="text-white font-bold">profesionales de salud</span>
          </h2>
          <p className="text-teal-400 text-3xl font-bold mt-2">
            verificados en 5 pasos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button type="button" className="px-7 py-2.5 bg-white text-slate-950 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg text-sm">
              Buscar Enfermero
            </button>
            <button type="button" className="px-7 py-2.5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors text-sm">
              Registrarme como Profesional
            </button>
          </div>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 auto-rows-fr">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative w-full h-full">
                  <div className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/70 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 hover:border-teal-500/70 hover:from-slate-800/70 hover:to-slate-900/90 hover:shadow-2xl hover:shadow-teal-500/15 transition-all duration-300 group flex flex-col justify-start overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/8 rounded-full blur-2xl group-hover:bg-teal-500/15 transition-all duration-300"></div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/30 to-teal-400/15 border border-teal-500/50 group-hover:from-teal-500/50 group-hover:to-teal-400/30 group-hover:border-teal-400/70 transition-all duration-300 shadow-lg shadow-teal-500/10">
                          <Icon className="w-7 h-7 text-teal-300 group-hover:text-teal-100 transition-colors duration-300" />
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-br from-slate-400 to-slate-500 bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-teal-400 transition-all duration-300 leading-none">
                          {step.number}
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-slate-700/60 via-slate-600/40 to-transparent group-hover:via-teal-500/30 transition-colors duration-300"></div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-teal-100 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
