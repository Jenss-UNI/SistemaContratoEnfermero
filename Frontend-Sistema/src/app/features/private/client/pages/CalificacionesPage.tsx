import { useState } from "react";
import { CalendarDays, Star, UserRound } from "lucide-react";


const MOCK_CALIFICACIONES = [
  {
    id: 1,
    initials: "CM",
    professionalName: "Carlos Sanchez Martinez",
    type: "Especializado",
    patientName: "Elena Rodriguez",
    date: "23 may. 2026",
    price: "S/ 106",
    rating: 2.0,
    comment: "“Debe ser más paciente”",
    estado: "Calificados",
  },
  {
    id: 2,
    initials: "CM",
    professionalName: "Carlos Sanchez Martinez",
    type: "Asistencial",
    patientName: "Elena Rodriguez",
    date: "21 may. 2026",
    price: "S/ 100",
    rating: 3.7,
    comment: "“Llego un poco trade pero su atencion fue de buena calidad”",
    estado: "Calificados",
  },
];

const FILTROS = ["Todos", "Calificados", "Pendientes"];

export default function CalificacionesPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");

 
  const filteredCalificaciones = MOCK_CALIFICACIONES.filter((item) => {
    if (activeFilter === "Todos") return true;
    return item.estado === activeFilter;
  });

 
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[17px] font-bold text-slate-900">
          Calificaciones Post-Servicio
        </h1>
        
        <div className="flex items-center gap-2">
          {FILTROS.map((filtro) => (
            <button
              key={filtro}
              onClick={() => setActiveFilter(filtro)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                activeFilter === filtro
                  ? "border border-teal-500 bg-white text-teal-600"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

     
      <div className="space-y-4">
        {filteredCalificaciones.length > 0 ? (
          filteredCalificaciones.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 rounded-[1.25rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
            >
             
              <div className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#0db39e] text-lg font-bold text-white">
                {item.initials}
              </div>

          
              <div className="min-w-0 flex-1">
                
              
                <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-[15px] font-bold text-slate-900">
                    {item.professionalName}
                  </h3>
                  <span className="text-[13px] text-slate-400">{item.type}</span>
                </div>

            
                <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <UserRound className="h-[14px] w-[14px] text-pink-400" />
                    {item.patientName}
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-[14px] w-[14px] text-teal-500" />
                    {item.date}
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="font-bold text-slate-700">
                    {item.price}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50/80 px-3 py-1.5">
                    <span className="text-[15px] font-bold text-amber-500">
                      {item.rating.toFixed(1)}
                    </span>
                    {renderStars(item.rating)}
                  </div>
                  <p className="text-[14px] italic text-slate-500">
                    {item.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.25rem] border border-slate-100 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            No hay calificaciones para mostrar en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
}