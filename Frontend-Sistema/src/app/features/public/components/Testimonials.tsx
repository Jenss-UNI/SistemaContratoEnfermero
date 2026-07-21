import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Carmen Rodríguez',
    location: 'San Isidro, Lima',
    rating: 5.0,
    comment: 'Contraté a la Lic. María para cuidar a mi madre después de su operación de cadera. Su profesionalismo y calidez nos dieron la tranquilidad que necesitábamos. La plataforma hizo todo muy fácil y el pago fue completamente seguro.',
    service: 'Lic. María Fernández',
    image: 'src/assets/inicio/avatar-12.jpg' 
  },
  {
    name: 'Juan López',
    location: 'Miraflores, Lima',
    rating: 5.0,
    comment: 'El enfermero llegó puntual y con toda la preparación. El proceso de selección fue claro y las reseñas me ayudaron a tomar la mejor decisión.',
    service: 'Enfermero Especializado',
    image: 'src/assets/inicio/avatar-Defecto.jpg'
  },
  {
    name: 'Sofía Martínez',
    location: 'Barranco, Lima',
    rating: 4.9,
    comment: 'Perfecto servicio de principio a fin. La comunicación con el profesional fue excelente y mi madre se sintió muy cuidada.',
    service: 'Técnico en Enfermería',
    image: 'src/assets/inicio/avatar-12.jpg'
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
    <section className="py-16 md:py-24 bg-[#fafafa]">
      
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
       
        <div className="text-center mb-12">
          <p className="text-[#14b8a6] uppercase tracking-[0.2em] text-[12px] md:text-[14px] font-bold mb-3 md:mb-4">
            TESTIMONIOS
          </p>
    
          <h2 className="text-3xl md:text-[38px] lg:text-[42px] font-bold text-[#0f172a] tracking-tight leading-[1.2]">
            Lo que dicen las <span className="text-slate-400 font-normal">(familias)</span> que confían en nosotros
          </h2>
        </div>

  
        <div className="relative">
          <article
            className="group w-full animate-fade-in rounded-[24px] bg-white p-8 md:p-12 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            key={currentIndex}
          >
           
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-4 py-1.5 text-white mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-[14px]">{current.rating.toFixed(1)}</span>
            </div>

          
            <div className="mb-10">
              <span className="block text-[#14b8a6] text-[40px] font-serif leading-none h-6">"</span>
              <p className="text-[16px] md:text-[18px] leading-[1.8] text-slate-500 font-light mt-2 mb-2">
                {current.comment}
              </p>
              <span className="block text-[#14b8a6] text-[40px] font-serif leading-none h-6">"</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 sm:gap-0 mt-8 pt-6 border-t border-slate-50">
             
             <div className="flex items-center gap-4">
                {current.image ? (
                  <img src={current.image} alt={current.name} className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[#14b8a6] text-lg font-bold">
                    {current.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                )}
                
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-[#0f172a] text-[15px] leading-tight mb-1">
                    {current.name}
                  </h4>
                  <p className="text-[13px] text-slate-400 leading-tight mb-1">
                    Familiar - {current.location}
                  </p>
                  <p className="text-[13px] text-[#14b8a6] font-medium leading-tight">
                    Contrató a: {current.service}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
           
                <div className="flex gap-1.5 items-center">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-[#14b8a6] w-6' 
                          : 'bg-slate-200 w-1.5 hover:bg-slate-300' 
                      }`}
                      aria-label={`Ir al testimonio ${index + 1}`}
                    />
                  ))}
                </div>

            
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition-all hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-5 w-5 text-slate-600" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f172a] transition-all hover:bg-slate-800"
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </button>
                </div>

              </div>
            </div>
          </article>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}