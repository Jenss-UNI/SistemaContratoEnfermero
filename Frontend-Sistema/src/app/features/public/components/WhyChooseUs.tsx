import { ShieldCheck, Lock, FileText, MessageCircle, BadgeCheck } from 'lucide-react';

const topCards = [
  {
    icon: ShieldCheck,
    title: 'Verificación SUNEDU automática',
    description:
      'Todos nuestros profesionales tienen sus títulos validados contra la base de datos oficial de SUNEDU. El badge azul garantiza autenticidad.',
    color: 'bg-emerald-50 text-emerald-700',
    iconColor: 'text-emerald-500'
  },
  {
    icon: Lock,
    title: 'Pago protegido en custodia',
    description:
      'Tu dinero queda en custodia hasta que el servicio se complete satisfactoriamente. El enfermero recibe el pago solo cuando tú confirmas.',
    color: 'bg-rose-50 text-rose-700',
    iconColor: 'text-rose-500'
  }
];

const bottomCards = [
  {
    icon: FileText,
    title: 'Contrato digital',
    description:
      'PDF automático generado al confirmar cada servicio. Protección legal para ambas partes.',
    color: 'bg-amber-50 text-amber-700',
    iconColor: 'text-amber-500'
  },
  {
    icon: MessageCircle,
    title: 'Reseñas verificadas',
    description:
      'Calificaciones reales de familias que contrataron el servicio. Puntualidad, trato y conocimiento.',
    color: 'bg-violet-50 text-violet-700',
    iconColor: 'text-violet-500'
  },
  {
    icon: BadgeCheck,
    title: 'Verificación de DNI',
    description:
      'Validación de identidad de cada profesional para evitar perfiles falsos en la plataforma.',
    color: 'bg-cyan-50 text-cyan-700',
    iconColor: 'text-cyan-500'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              ¿Por qué elegirnos?
            </h2>
            <p className="mt-4 text-lg text-slate-700">
              Tu tranquilidad es nuestra <span className="text-emerald-600 font-semibold">PRIORIDAD</span>.
            </p>
            <p className="mt-3 text-sm text-slate-500 leading-7">
              Cada profesional en nuestra plataforma pasa por un riguroso proceso de verificación para garantizar la seguridad de tu familia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 h-[620px]">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20nurse%20checking%20vital%20signs%20of%20elderly%20patient%20at%20home%2C%20warm%20caring%20atmosphere%2C%20medical%20equipment%2C%20soft%20natural%20lighting%2C%20high%20quality%20photography%2C%20warm%20tones%2C%20professional%20healthcare&width=600&height=700&seq=feat-main&orientation=portrait"
                alt="Enfermera atendiendo paciente"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-6 left-6 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs text-white backdrop-blur-sm">
                Asistencia Profesional 24/7
              </div>
            </div>

            <div className="flex flex-col justify-between h-full gap-6">
              {topCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`rounded-[1.75rem] p-6 shadow-sm border border-slate-200 ${item.color} flex-1 flex flex-col`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 ${item.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-6">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {bottomCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className={`rounded-[1.75rem] p-6 shadow-sm border border-slate-200 ${card.color}`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-6">
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
