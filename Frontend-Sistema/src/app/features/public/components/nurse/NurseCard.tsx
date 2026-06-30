import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Nurse } from "../../../../core/models/nurse.model";

interface NurseCardProps {
  nurse: Nurse;
  isAuthenticated?: boolean;
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        let iconClass = "ri-star-line";
        if (value >= star) iconClass = "ri-star-fill";
        else if (value >= star - 0.5) iconClass = "ri-star-half-fill";
        return (
          <div key={star} className="w-3 h-3 flex items-center justify-center">
            <i className={`${iconClass} text-yellow-400 text-xs`}></i>
          </div>
        );
      })}
    </div>
  );
}

const levelBadge: Record<string, { bg: string; text: string; dot: string }> = {
  "Enfermero Especializado": { bg: "bg-teal-100", text: "text-teal-700", dot: "bg-teal-500" },
  "Licenciado en Enfermería": { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Técnico en Enfermería": { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
};

function inferLevel(serviceType: { name: string; price: number }[]): string {
  const names = serviceType.map((s) => s.name);
  if (names.includes("Especializado")) return "Enfermero Especializado";
  if (names.includes("Asistencial")) return "Licenciado en Enfermería";
  return "Técnico en Enfermería";
}

function getServiceColor(name: string): string {
  switch (name) {
    case "Especializado": return "text-teal-700";
    case "Asistencial": return "text-emerald-700";
    case "Acompañamiento": return "text-amber-700";
    default: return "text-teal-700";
  }
}

function PriceCarousel({ nurse }: { nurse: Nurse }) {
  const services = nurse.serviceType;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (services.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % services.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [services.length]);

  const current = services[index];

  if (services.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 text-center">
        <p className="text-xs text-gray-400">Sin servicios activos</p>
      </div>
    );
  }

  return (
    <div className="bg-teal-50 rounded-xl px-4 py-3 mb-4">
      <p className={`text-xs font-semibold text-center mb-1 ${getServiceColor(current.name)}`}>
        {current.name}
      </p>

      <div className="flex items-center justify-center gap-2">
        {services.length > 1 && (
          <button
            onClick={() => setIndex((prev) => (prev - 1 + services.length) % services.length)}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-teal-100 cursor-pointer text-teal-400 flex-shrink-0"
          >
            <i className="ri-arrow-left-s-line text-sm"></i>
          </button>
        )}

        <div className="text-center min-w-[100px]">
          <span className="text-teal-700 font-extrabold text-xl">S/ {current.price}</span>
          <span className="text-teal-500 text-sm">/hora</span>
        </div>

        {services.length > 1 && (
          <button
            onClick={() => setIndex((prev) => (prev + 1) % services.length)}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-teal-100 cursor-pointer text-teal-400 flex-shrink-0"
          >
            <i className="ri-arrow-right-s-line text-sm"></i>
          </button>
        )}
      </div>

      {services.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === index ? "bg-teal-500 w-4" : "bg-teal-200 w-1.5"
              }`}
            />
          ))}
        </div>
      )}

      {nurse.isTopRated && (
        <p className="text-teal-400 text-[10px] mt-1.5 text-center">+10% Top Ranked incluido</p>
      )}
    </div>
  );
}

export default function NurseCard({ nurse, isAuthenticated = false }: NurseCardProps) {
  const navigate = useNavigate();
  const level = inferLevel(nurse.serviceType);
  const badge = levelBadge[level] ?? { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };

  const handleCTAClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/enfermero/${nurse.id}` } });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 hover:ring-2 hover:ring-teal-200 transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <img
            src={nurse.photo}
            alt={nurse.name}
            className="w-24 h-24 rounded-full object-cover object-top border-4 border-gray-100"
          />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center bg-teal-500 rounded-full border-2 border-white">
            <i className="ri-verified-badge-fill text-white text-xs"></i>
          </div>
          {nurse.isTopRated && (
            <div className="absolute -top-1 -left-1 w-7 h-7 flex items-center justify-center bg-teal-500 rounded-full border-2 border-white">
              <i className="ri-medal-fill text-white text-xs"></i>
            </div>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-tight">{nurse.name}</h3>
        <p className="text-gray-500 text-xs mt-0.5">{nurse.title}</p>

        <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
          {nurse.isTopRated && (
            <span className="bg-teal-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
              TOP
            </span>
          )}
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1 ${badge.bg} ${badge.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
            {level}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <StarRating value={nurse.rating || 0} />
        <span className="text-gray-900 font-bold text-sm">{(nurse.rating || 0).toFixed(1)}</span>
        <span className="text-gray-400 text-xs">({nurse.reviews || 0} reseñas)</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-xl p-3">
        {[
          { icon: "ri-time-line", label: "Puntualidad", value: nurse.punctuality || 0 },
          { icon: "ri-heart-line", label: "Trato", value: nurse.treatment || 0 },
          { icon: "ri-brain-line", label: "Técnico", value: nurse.technical || 0 },
        ].map((m) => (
          <div key={m.label} className="flex flex-col items-center">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${m.icon} text-teal-500 text-sm`}></i>
            </div>
            <span className="text-gray-900 font-bold text-sm">{(m.value).toFixed(1)}</span>
            <span className="text-gray-400 text-xs">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Info Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-map-pin-line text-gray-400 text-xs"></i>
          </div>
          {nurse.district}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-briefcase-line text-gray-400 text-xs"></i>
          </div>
          {nurse.experience} años exp.
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-check-double-line text-gray-400 text-xs"></i>
          </div>
          {nurse.completedServices} servicios
        </div>
      </div>

      {/* Price Carousel */}
      <PriceCarousel nurse={nurse} />

      {/* CTA */}
      {isAuthenticated ? (
        <Link
          to={`/enfermero/${nurse.id}`}
          className="block text-center border-2 border-teal-500 text-teal-600 font-semibold text-sm py-2.5 rounded-xl hover:bg-teal-500 hover:text-white transition-colors whitespace-nowrap cursor-pointer mt-auto"
        >
          Ver Perfil
        </Link>
      ) : (
        <button
          onClick={handleCTAClick}
          className="block w-full text-center border-2 border-gray-200 text-gray-500 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer mt-auto"
        >
          <i className="ri-lock-line mr-1"></i>Inicia sesión para ver
        </button>
      )}
    </div>
  );
}
