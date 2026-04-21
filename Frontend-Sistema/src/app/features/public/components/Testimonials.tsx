import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Testimonial } from '../../../core/models';

const testimonials: Testimonial[] = [
  {
    name: 'Carmen Rodríguez',
    location: 'San Isidro, Lima',
    rating: 5,
    comment:
      'Contraté a la Lic. María para cuidar a mi madre después de su operación de cadera. Su profesionalismo y calidez nos dieron la tranquilidad que necesitábamos. La plataforma hizo todo muy fácil y el pago fue completamente seguro.',
    service: 'Cuidado Domiciliario'
  },
  {
    name: 'Juan López',
    location: 'Miraflores, Lima',
    rating: 5,
    comment:
      'El enfermero llegó puntual y con toda la preparación. El proceso de selección fue claro y las reseñas me ayudaron a tomar la mejor decisión.',
    service: 'Post-Operatorio'
  },
  {
    name: 'Sofía Martínez',
    location: 'Barranco, Lima',
    rating: 4.9,
    comment:
      'Perfecto servicio de principio a fin. La comunicación con el profesional fue excelente y mi madre se sintió muy cuidada.',
    service: 'Adulto Mayor'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-[#F2F2F2]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-500 uppercase tracking-[0.35em] text-xs font-bold mb-4">
            TESTIMONIOS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Lo que dicen las <span className="text-gray-400">(familias)</span> que confían en nosotros
          </h2>
        </div>

        <div className="relative">
          <div className="min-h-[480px] flex items-center justify-center">
            <article
              className="group w-full max-w-5xl animate-fade-in rounded-3xl border border-gray-200 bg-white p-10 shadow-lg hover:shadow-2xl transition-all duration-300"
              key={currentIndex}
            >
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-white">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-lg">{current.rating}</span>
                </div>

                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-gray-800 font-normal">
                    &quot;{current.comment}&quot;
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-8 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-500/20 to-slate-200 flex items-center justify-center text-teal-600 text-xl font-bold">
                    {current.name
                      .split(' ')
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {current.name}
                    </p>
                    <p className="text-sm text-gray-500">Familiar · {current.location}</p>
                    <p className="mt-2 text-sm text-teal-600 font-medium">
                      Contrató: {current.service}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-teal-500 w-8'
                            : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                        }`}
                        aria-label={`Ir al testimonio ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50"
                      aria-label="Testimonio anterior"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600 transition-colors group-hover:text-teal-600" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-50 transition-all duration-300 hover:border-teal-500 hover:bg-teal-50"
                      aria-label="Siguiente testimonio"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600 transition-colors group-hover:text-teal-600" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
