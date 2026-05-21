import { useState } from "react";
import { Header, Footer } from "../../../shared/layout";
import type { Nurse } from "../../../core/models/nurse.model";
import { Search, Star, Award, X, MapPin, ShieldCheck, Users, Trophy } from "lucide-react";

export const nurses: Nurse[] = [
  {
    id: "1",
    name: "Lic. María Fernández",
    title: "Geriatría y Cuidado del Adulto Mayor",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.9,
    reviews: 142,
    punctuality: 4.9,
    treatment: 5.0,
    technical: 4.8,
    district: "Miraflores",
    experience: 8,
    completedServices: 142,
    pricePerHour: 65
  },
  {
    id: "2",
    name: "Lic. Carlos Mendoza",
    title: "Cuidados Intensivos y Post-Operatorio",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.8,
    reviews: 98,
    punctuality: 4.7,
    treatment: 4.9,
    technical: 4.9,
    district: "San Isidro",
    experience: 10,
    completedServices: 98,
    pricePerHour: 75
  },
  {
    id: "3",
    name: "Tec. Ana Quispe",
    title: "Signos Vitales y Medicación",
    isTopRated: false,
    serviceType: "Técnico",
    rating: 4.7,
    reviews: 67,
    punctuality: 4.8,
    treatment: 4.7,
    technical: 4.6,
    district: "Surco",
    experience: 4,
    completedServices: 67,
    pricePerHour: 38
  },
  {
    id: "4",
    name: "Lic. Rosa Huanca",
    title: "Rehabilitación y Fisioterapia",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.9,
    reviews: 115,
    punctuality: 4.9,
    treatment: 4.8,
    technical: 4.7,
    district: "La Molina",
    experience: 7,
    completedServices: 115,
    pricePerHour: 80
  },
  {
    id: "5",
    name: "Lic. Jorge Castillo",
    title: "Oncología y Cuidados Paliativos",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.9,
    reviews: 87,
    punctuality: 4.8,
    treatment: 5.0,
    technical: 4.9,
    district: "San Borja",
    experience: 12,
    completedServices: 87,
    pricePerHour: 80
  },
  {
    id: "6",
    name: "Tec. Patricia Llanos",
    title: "Pediatría y Cuidado Infantil",
    isTopRated: false,
    serviceType: "Técnico",
    rating: 4.6,
    reviews: 54,
    punctuality: 4.7,
    treatment: 4.8,
    technical: 4.5,
    district: "Barranco",
    experience: 2,
    completedServices: 54,
    pricePerHour: 45
  },
  {
    id: "7",
    name: "Lic. Diego Torres",
    title: "Acompañamiento y Cuidado Básico",
    isTopRated: false,
    serviceType: "Asistencial",
    rating: 4.5,
    reviews: 23,
    punctuality: 4.7,
    treatment: 4.7,
    technical: 4.3,
    district: "Jesús María",
    experience: 5,
    completedServices: 23,
    pricePerHour: 42
  },
  {
    id: "8",
    name: "Tec. Lucía Vargas",
    title: "Diabetes y Enfermedades Crónicas",
    isTopRated: false,
    serviceType: "Técnico",
    rating: 4.6,
    reviews: 41,
    punctuality: 4.7,
    treatment: 4.5,
    technical: 4.6,
    district: "Pueblo Libre",
    experience: 3,
    completedServices: 41,
    pricePerHour: 35
  }
];

export const stats = {
  totalProfessionals: 8,
  verified: 100,
  avgRating: 4.8,
  districts: 14
};

const allDistricts = [
  "Miraflores", "San Isidro", "Surco", "La Molina", "San Borja", 
  "Barranco", "Jesús María", "Pueblo Libre", "Lince", "Callao", 
  "Los Olivos", "San Martín de Porres", "Ate", "La Victoria"
];

const serviceTypes = ["Especializado", "Técnico", "Acompañamiento", "Asistencial"];

export default function DirectorioPage() {
  const [filterService, setFilterService] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterTopRated, setFilterTopRated] = useState(false);
  const [priceRange, setPriceRange] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar si hay filtros activos
  const hasActiveFilters = filterService !== "" || 
                          filterDistrict !== "" || 
                          priceRange !== "todos" || 
                          filterTopRated ||
                          searchTerm !== "";

  const filteredNurses = nurses.filter((nurse) => {
    // Búsqueda por nombre o especialidad
    if (searchTerm && !nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !nurse.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterService && nurse.serviceType !== filterService) return false;
    if (filterDistrict && nurse.district !== filterDistrict) return false;
    if (filterTopRated && !nurse.isTopRated) return false;
    if (priceRange === "0-30" && nurse.pricePerHour > 30) return false;
    if (priceRange === "30-60" && (nurse.pricePerHour < 30 || nurse.pricePerHour > 60)) return false;
    if (priceRange === "60-80" && (nurse.pricePerHour < 60 || nurse.pricePerHour > 80)) return false;
    if (priceRange === "80-300" && nurse.pricePerHour <= 80) return false;
    return true;
  });

  const clearFilters = () => {
    setFilterService("");
    setFilterDistrict("");
    setFilterTopRated(false);
    setPriceRange("todos");
    setSearchTerm("");
  };

    return (
        <>
            <Header />
            <main className="bg-white min-h-screen">
                <div className="bg-gradient-to-b from-[#e8f8f1] via-[#f4fbf8] to-white border-b border-teal-50">

                    <div className="max-w-[1450px] mx-auto px-6 lg:px-10 pt-32 pb-2">

                        {/* Header con título y descripción */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-5">

                            <div className="max-w-xl">
                                <p className="text-teal-600 uppercase tracking-[0.18em] text-base md:text-lg font-bold mb-2">Directorio </p>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                    Encuentra a tu Enfermero Ideal</h1>
                                <p className="text-slate-500 mt-4 text-lg">
                                    Todos verificados y calificados por familias reales</p>
                            </div>

                            {/* BUSCADOR */}
                            <div className="w-full lg:max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por nombre, especialidad..."
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats en fila horizontal */}
                        <div className="flex flex-wrap gap-6 items-center">

                            <div className="flex items-center gap-3 bg-[#dff7ef] px-4 py-3 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-teal-600" />
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">
                                        {stats.totalProfessionals}+
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Profesionales activos
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#dff7ef] px-4 py-3 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">
                                        {stats.verified}%
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Verificados
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#dff7ef] px-4 py-3 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-teal-600 fill-teal-600" />
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">
                                        {stats.avgRating}★
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Calificación promedio
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#dff7ef] px-4 py-3 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-teal-600" />
                                </div>

                                <div>
                                    <p className="font-bold text-slate-900">
                                        {stats.districts}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Distritos cubiertos
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>


                <div className="max-w-[1450px] mx-auto px-6 lg:px-0 py-10">

                    {/* FILTROS */}
                    <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-4 mb-8 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">

                            <div className="flex flex-wrap items-center gap-4">

                                {/* Tipo de servicio */}
                                <select
                                    value={filterService}
                                    onChange={(e) => setFilterService(e.target.value)}
                                    className="min-w-[190px] px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Tipo de servicio</option>

                                    {serviceTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>

                                {/* Distrito */}
                                <select
                                    value={filterDistrict}
                                    onChange={(e) => setFilterDistrict(e.target.value)}
                                    className="min-w-[190px] px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Distrito</option>

                                    {allDistricts.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>

                                {/* Precio */}
                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="min-w-[190px] px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="todos">Todos los precios</option>
                                    <option value="0-30">Hasta S/ 30</option>
                                    <option value="30-60">S/ 30 - S/ 60</option>
                                    <option value="60-80">S/ 60 - S/ 80</option>
                                    <option value="80-300">S/ 80 a más</option>
                                </select>

                                {/* BOTÓN TOP RANKED */}
                                <button
                                    onClick={() => setFilterTopRated(!filterTopRated)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border
          
        ${filterTopRated
                                            ? "bg-teal-600 text-white border-teal-600 shadow-md"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }
      `}
                                >
                                    <Trophy className="w-4 h-4" />

                                    Solo Top Ranked
                                </button>

                                {/* LIMPIAR FILTROS */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Limpiar filtros
                                    </button>
                                )}



                            </div>

                            {/* DERECHA */}
                            <p className="text-sm text-slate-400 whitespace-nowrap">
                                {filteredNurses.length} profesionales encontrados
                            </p>
                        </div>

                    </div>


                    {/* Grid de tarjetas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNurses.map((nurse) => (
                            <NurseCard key={nurse.id} nurse={nurse} />
                        ))}
                    </div>

                    {/* Mensaje si no hay resultados */}
                    {filteredNurses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">No se encontraron profesionales con esos filtros</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-teal-600 font-medium hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </>
    );
}

// Componente NurseCard
function NurseCard({ nurse }: { nurse: Nurse }) {
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">
                        {i < fullStars ? "★" : i === fullStars && hasHalfStar ? "½" : "☆"}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
            <div className="p-5">
                {/* Header con nombre y badge TOP */}
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{nurse.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{nurse.title}</p>
                    </div>
                    {nurse.isTopRated && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" /> TOP
                        </span>
                    )}
                </div>

                {/* Tipo de servicio */}
                <div className="mt-3">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        {nurse.serviceType === "Especializado" ? "Enfermero Especializado" :
                            nurse.serviceType === "Técnico" ? "Técnico en Enfermería" :
                                nurse.serviceType === "Acompañamiento" ? "Acompañamiento" : "Asistencial"}
                    </span>
                </div>

                {/* Rating y reseñas */}
                <div className="flex items-center gap-2 mt-3">
                    {renderStars(nurse.rating)}
                    <span className="font-bold text-sm text-slate-800">{nurse.rating}</span>
                    <span className="text-xs text-slate-400">({nurse.reviews} reseñas)</span>
                </div>

                {/* Calificaciones detalladas */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">{nurse.punctuality}</p>
                        <p className="text-[10px] text-slate-400">Puntualidad</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">{nurse.treatment}</p>
                        <p className="text-[10px] text-slate-400">Trato</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-700">{nurse.technical}</p>
                        <p className="text-[10px] text-slate-400">Técnico</p>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                    <div>
                        <p className="text-xs text-slate-500">{nurse.district}</p>
                        <p className="text-xs text-slate-500">{nurse.experience} años exp.</p>
                        <p className="text-xs text-slate-500">{nurse.completedServices} servicios</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-teal-600">S/ {nurse.pricePerHour}</p>
                        <p className="text-[10px] text-slate-400">/hora</p>
                        {nurse.isTopRated && (
                            <p className="text-[9px] text-amber-600 font-medium">+10% Top Ranked</p>
                        )}
                    </div>
                </div>

                {/* Botón Ver perfil */}
                <button className="w-full mt-4 bg-teal-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors">
                    Ver perfil
                </button>
            </div>
        </div>
    );
}