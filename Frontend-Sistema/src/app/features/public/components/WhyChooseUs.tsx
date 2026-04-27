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

        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
            ¿Por qué elegirnos?
          </h2>

          <p className="mt-4 text-lg text-slate-700">
            Tu tranquilidad es nuestra{' '}
            <span className="text-emerald-600 font-semibold">PRIORIDAD</span>.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Cada profesional pasa por un proceso de verificación.
          </p>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* IMAGEN */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 h-[380px] sm:h-[450px] lg:h-[520px]">
            <img
              src="https://readdy.ai/api/search-image?query=professional%20nurse%20checking%20vital%20signs%20of%20elderly%20patient%20at%20home%2C%20warm%20caring%20atmosphere%2C%20medical%20equipment%2C%20soft%20natural%20lighting%2C%20high%20quality%20photography%2C%20warm%20tones%2C%20professional%20healthcare&width=600&height=700&seq=feat-main&orientation=portrait"
              alt="Enfermera atendiendo paciente"
              className="h-full w-full object-cover"
            />

            <div className="absolute top-6 left-6 rounded-full bg-white/20 border border-white/30 px-4 py-2 text-xs text-white backdrop-blur-sm">
              Asistencia Profesional 24/7
            </div>
          </div>

          {/* CARDS */}
          <div className="space-y-6">

            {/* TOP CARDS */}
            <div className="space-y-6">
              {topCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl p-5 shadow-sm border border-slate-200 ${item.color}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 flex items-center justify-center rounded-xl bg-white/80 ${item.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* BOTTOM CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bottomCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl p-4 shadow-sm border border-slate-200 ${card.color}`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 ${card.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-sm font-semibold text-slate-900">
                        {card.title}
                      </h3>

                      <p className="text-xs text-slate-600">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}