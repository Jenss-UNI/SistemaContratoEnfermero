import { useEffect, useState } from "react";
import { Header, Footer } from "../../../shared/layout";
import NurseCard from "../components/NurseCard";
import type { Nurse } from "../../../core/models/nurse.model";
import { Search, Star, X, MapPin, ShieldCheck, Users, Trophy } from "lucide-react";


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
  },
  {
    id: "9",
    name: "Lic. Andrea Salazar",
    title: "Cuidados Cardiológicos",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.8,
    reviews: 76,
    punctuality: 4.9,
    treatment: 4.8,
    technical: 4.9,
    district: "Lince",
    experience: 9,
    completedServices: 76,
    pricePerHour: 78
},
{
    id: "10",
    name: "Tec. Javier Ramos",
    title: "Aplicación de Medicamentos",
    isTopRated: false,
    serviceType: "Técnico",
    rating: 4.5,
    reviews: 43,
    punctuality: 4.6,
    treatment: 4.7,
    technical: 4.5,
    district: "Callao",
    experience: 3,
    completedServices: 43,
    pricePerHour: 30
},
{
    id: "11",
    name: "Lic. Sofía Navarro",
    title: "Enfermería Neonatal",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 5.0,
    reviews: 102,
    punctuality: 5,
    treatment: 5,
    technical: 4.9,
    district: "Los Olivos",
    experience: 11,
    completedServices: 102,
    pricePerHour: 85
},
{
    id: "12",
    name: "Tec. Ricardo Flores",
    title: "Control de Signos Vitales",
    isTopRated: false,
    serviceType: "Técnico",
    rating: 4.4,
    reviews: 29,
    punctuality: 4.5,
    treatment: 4.6,
    technical: 4.3,
    district: "Ate",
    experience: 2,
    completedServices: 29,
    pricePerHour: 35
},
{
    id: "13",
    name: "Lic. Diana Herrera",
    title: "Cuidados Paliativos",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.9,
    reviews: 96,
    punctuality: 4.8,
    treatment: 5,
    technical: 4.8,
    district: "San Martín de Porres",
    experience: 10,
    completedServices: 96,
    pricePerHour: 82
},
{
    id: "14",
    name: "Tec. Luis Gutiérrez",
    title: "Asistencia Domiciliaria",
    isTopRated: false,
    serviceType: "Asistencial",
    rating: 4.3,
    reviews: 31,
    punctuality: 4.4,
    treatment: 4.6,
    technical: 4.2,
    district: "Miraflores",
    experience: 3,
    completedServices: 31,
    pricePerHour: 40
},
{
    id: "15",
    name: "Lic. Valeria Campos",
    title: "Pediatría Especializada",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.9,
    reviews: 121,
    punctuality: 5,
    treatment: 5,
    technical: 4.9,
    district: "La Victoria",
    experience: 8,
    completedServices: 121,
    pricePerHour: 90
},
{
    id: "16",
    name: "Tec. Miguel Torres",
    title: "Inyecciones y Curaciones",
    isTopRated: false,
    serviceType: "Técnico",
    rating: 4.6,
    reviews: 58,
    punctuality: 4.7,
    treatment: 4.8,
    technical: 4.6,
    district: "Barranco",
    experience: 4,
    completedServices: 58,
    pricePerHour: 42
},
{
    id: "17",
    name: "Lic. Karen Vega",
    title: "Cuidados Intensivos",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.9,
    reviews: 137,
    punctuality: 5,
    treatment: 4.9,
    technical: 5,
    district: "San Borja",
    experience: 12,
    completedServices: 137,
    pricePerHour: 95
},
{
    id: "18",
    name: "Tec. Diego Paredes",
    title: "Atención Básica",
    isTopRated: false,
    serviceType: "Acompañamiento",
    rating: 4.4,
    reviews: 37,
    punctuality: 4.5,
    treatment: 4.5,
    technical: 4.3,
    district: "Jesús María",
    experience: 3,
    completedServices: 37,
    pricePerHour: 32
},
{
    id: "19",
    name: "Lic. Patricia León",
    title: "Geriatría Avanzada",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.8,
    reviews: 110,
    punctuality: 4.8,
    treatment: 5,
    technical: 4.8,
    district: "Pueblo Libre",
    experience: 9,
    completedServices: 110,
    pricePerHour: 79
},
{
    id: "20",
    name: "Tec. Kevin Díaz",
    title: "Monitoreo de Pacientes",
    isTopRated: false,
    serviceType: "Técnico",
    rating: 4.5,
    reviews: 44,
    punctuality: 4.6,
    treatment: 4.7,
    technical: 4.4,
    district: "Surco",
    experience: 4,
    completedServices: 44,
    pricePerHour: 36
},
{
    id: "21",
    name: "Lic. Brenda Soto",
    title: "Oncología",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 5,
    reviews: 148,
    punctuality: 5,
    treatment: 5,
    technical: 5,
    district: "San Isidro",
    experience: 14,
    completedServices: 148,
    pricePerHour: 98
},
{
    id: "22",
    name: "Tec. Marco Silva",
    title: "Cuidado Postoperatorio",
    isTopRated: false,
    serviceType: "Asistencial",
    rating: 4.4,
    reviews: 36,
    punctuality: 4.5,
    treatment: 4.5,
    technical: 4.3,
    district: "La Molina",
    experience: 4,
    completedServices: 36,
    pricePerHour: 39
},
{
    id: "23",
    name: "Lic. Elena Cruz",
    title: "Rehabilitación Integral",
    isTopRated: true,
    serviceType: "Especializado",
    rating: 4.9,
    reviews: 118,
    punctuality: 4.9,
    treatment: 4.9,
    technical: 4.8,
    district: "Miraflores",
    experience: 10,
    completedServices: 118,
    pricePerHour: 88
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

    // PAGINACIÓN
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 8;

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

  // reiniciar página al cambiar filtros
useEffect(() => {
    setCurrentPage(1);
}, [
    filterService,
    filterDistrict,
    filterTopRated,
    priceRange,
    searchTerm
]);

// volver arriba al cambiar página
useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}, [currentPage]);

// CÁLCULOS DE PAGINACIÓN
const totalPages = Math.ceil(
    filteredNurses.length / cardsPerPage
);

const startIndex =
    (currentPage - 1) * cardsPerPage;

const endIndex =
    startIndex + cardsPerPage;

const paginatedNurses =
    filteredNurses.slice(
        startIndex,
        endIndex
);

  const clearFilters = () => {
    setFilterService("");
    setFilterDistrict("");
    setFilterTopRated(false);
    setPriceRange("todos");
    setSearchTerm("");
  };

  const isAuthenticated = true; // Cambiar para probar modo autenticado

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {paginatedNurses.map((nurse) => (
                            <NurseCard
                                key={nurse.id}
                                nurse={nurse}
                                isAuthenticated={isAuthenticated}
                            />
                        ))}

                    </div>

                    {filteredNurses.length > cardsPerPage && (

<div className="mt-10 flex flex-col items-center gap-4">

    {/* texto */}
    <p className="text-sm text-slate-500">
        Mostrando {startIndex + 1} - {Math.min(endIndex, filteredNurses.length)} de {filteredNurses.length} profesionales
    </p>

    {/* botones */}
    <div className="flex items-center gap-2">

        <button
            onClick={() =>
                setCurrentPage(prev => prev - 1)
            }
            disabled={currentPage===1}
            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition">
            ←
        </button>

        {[...Array(totalPages)].map((_,index)=>(

            <button
                key={index}
                onClick={() =>
                    setCurrentPage(index+1)
                }
                className={`w-10 h-10 rounded-xl transition-all

                ${
                currentPage===index+1
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white border border-slate-200 hover:bg-slate-50"
                }
            `}
            >
                {index+1}
            </button>

        ))}

        <button
            onClick={() =>
                setCurrentPage(prev=>prev+1)
            }
            disabled={
                currentPage===totalPages
            }
            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition">
            →
        </button>

    </div>

</div>

)}

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
