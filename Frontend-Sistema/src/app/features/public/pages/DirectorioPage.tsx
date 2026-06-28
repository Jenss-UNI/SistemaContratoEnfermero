import { useEffect, useState } from "react";
import { Header, Footer } from "../../../shared/layout";
import NurseCard from "../components/nurse/NurseCard";
import type { Nurse } from "../../../core/models/nurse.model";
import { Search, Star, X, MapPin, ShieldCheck, Users, Trophy, Loader2 } from "lucide-react";
import { fetchPublicNurses } from "../services/directorio.service";
import { useAuth } from "../../../core/contexts/AuthContext";


export const nurses: Nurse[] = [
  {
  id: "1",
  name: "Lic. María Fernández",
  photo: "https://citbm.unmsm.edu.pe/wp-content/uploads/2021/04/ENFERMERA-IV-edited.png",
  title: "Geriatría y Cuidado del Adulto Mayor",

  about:
    "Especialista en cuidado geriátrico con más de 8 años de experiencia atendiendo pacientes adultos mayores en domicilio, rehabilitación y control de enfermedades crónicas. Me enfoco en brindar atención humana, segura y profesional.",

  isTopRated: true,

  serviceType: [
  {
    name: "Especializado",
    price: 65
  },
  {
    name: "Asistencial",
    price: 53
  },
  {
    name: "Acompañamiento",
    price: 45
  }
],

  rating: 4.9,
  reviews: 142,

  punctuality: 4.9,
  treatment: 5.0,
  technical: 4.8,

  district: "Miraflores",

  districts: [
    "Miraflores",
    "San Isidro",
    "Barranco"
  ],

  experience: 8,
  completedServices: 142,

  languages: [
    "Español",
    "Inglés"
  ],

  education: [
    {
      degree: "Licenciatura en Enfermería",
      institution: "Universidad Peruana Cayetano Heredia",
      year: 2016
    },
    {
      degree: "Especialización en Geriatría",
      institution: "Universidad Nacional Mayor de San Marcos",
      year: 2018
    }
  ],

  certifications: [
    {
      title: "Cuidados Geriátricos Avanzados",
      institution: "MINSA",
      year: 2021
    },
    {
      title: "Atención Domiciliaria Integral",
      institution: "EsSalud",
      year: 2022
    }
  ],

  reviewList: [
    {
      id: "r1",
      author: "Carlos R.",
      date: "Hace 2 semanas",
      comment:
        "Excelente profesional. Muy paciente y puntual con mi padre.",
      rating: 5,
      punctuality: 5,
      treatment: 5,
      technical: 5
    },
    {
      id: "r2",
      author: "Lucía M.",
      date: "Hace 1 mes",
      comment:
        "Muy amable y profesional. Totalmente recomendada.",
      rating: 5,
      punctuality: 5,
      treatment: 5,
      technical: 4.8
    }
  ]
},
  {
  id: "2",
  name: "Lic. Carlos Mendoza",
  photo: "https://cdn-cjlhn.nitrocdn.com/MDbIaQnHgvYrWdlkNlAApgMXaoLyMZQw/assets/images/optimized/rev-2534a30/www.brooklinecollege.edu/wp-content/uploads/2023/11/shutterstock_1572238627-scaled.jpg",
  title: "Cuidados Intensivos y Post-Operatorio",

  about:
    "Especialista en UCI y recuperación postoperatoria. Experiencia en monitoreo constante, administración de medicamentos y cuidado crítico domiciliario.",

  isTopRated: true,

  serviceType: [
  {
    name: "Especializado",
    price: 75
  }
],

  rating: 4.8,
  reviews: 98,

  punctuality: 4.7,
  treatment: 4.9,
  technical: 4.9,

  district: "San Isidro",

  districts: [
    "San Isidro",
    "Miraflores",
    "Surco"
  ],

  experience: 10,
  completedServices: 98,

  languages: [
    "Español"
  ],

  education: [
    {
      degree: "Licenciatura en Enfermería",
      institution: "Universidad Ricardo Palma",
      year: 2014
    }
  ],

  certifications: [
    {
      title: "Cuidados Intensivos",
      institution: "Colegio de Enfermeros del Perú",
      year: 2020
    }
  ],

  reviewList: [
    {
      id: "r3",
      author: "María T.",
      date: "Hace 5 días",
      comment:
        "Gran profesional en recuperación postoperatoria.",
      rating: 5,
      punctuality: 4.8,
      treatment: 5,
      technical: 5
    }
  ]
},
  {
    id: "3",
    name: "Tec. Ana Quispe",
    title: "Signos Vitales y Medicación",
    isTopRated: false,
    serviceType: [
      {
        name: "Técnico",
        price: 38
      }
    ],
    rating: 4.7,
    reviews: 67,
    punctuality: 4.8,
    treatment: 4.7,
    technical: 4.6,
    district: "Surco",
    experience: 4,
    completedServices: 67,
  },
  {
    id: "4",
    name: "Lic. Rosa Huanca",
    title: "Rehabilitación y Fisioterapia",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 80
      }
    ],
    rating: 4.9,
    reviews: 115,
    punctuality: 4.9,
    treatment: 4.8,
    technical: 4.7,
    district: "La Molina",
    experience: 7,
    completedServices: 115,
  },
  {
    id: "5",
    name: "Lic. Jorge Castillo",
    title: "Oncología y Cuidados Paliativos",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 80
      }
    ],
    rating: 4.9,
    reviews: 87,
    punctuality: 4.8,
    treatment: 5.0,
    technical: 4.9,
    district: "San Borja",
    experience: 12,
    completedServices: 87,
  },
  {
    id: "6",
    name: "Tec. Patricia Llanos",
    title: "Pediatría y Cuidado Infantil",
    isTopRated: false,
    serviceType: [
      {
        name: "Técnico",
        price: 45
      }
    ],
    rating: 4.6,
    reviews: 54,
    punctuality: 4.7,
    treatment: 4.8,
    technical: 4.5,
    district: "Barranco",
    experience: 2,
    completedServices: 54,
  },
  {
    id: "7",
    name: "Lic. Diego Torres",
    title: "Acompañamiento y Cuidado Básico",
    isTopRated: false,
    serviceType: [
      {
        name: "Asistencial",
        price: 42
      }
    ],
    rating: 4.5,
    reviews: 23,
    punctuality: 4.7,
    treatment: 4.7,
    technical: 4.3,
    district: "Jesús María",
    experience: 5,
    completedServices: 23,
  },
  {
    id: "8",
    name: "Tec. Lucía Vargas",
    title: "Diabetes y Enfermedades Crónicas",
    isTopRated: false,
    serviceType: [
      {
        name: "Técnico",
        price: 35
      }
    ],
    rating: 4.6,
    reviews: 41,
    punctuality: 4.7,
    treatment: 4.5,
    technical: 4.6,
    district: "Pueblo Libre",
    experience: 3,
    completedServices: 41,
  },
  {
    id: "9",
    name: "Lic. Andrea Salazar",
    title: "Cuidados Cardiológicos",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 78
      }
    ],
    rating: 4.8,
    reviews: 76,
    punctuality: 4.9,
    treatment: 4.8,
    technical: 4.9,
    district: "Lince",
    experience: 9,
    completedServices: 76,
},
{
    id: "10",
    name: "Tec. Javier Ramos",
    title: "Aplicación de Medicamentos",
    isTopRated: false,
    serviceType: [
      {
        name: "Técnico",
        price: 30
      }
    ],
    rating: 4.5,
    reviews: 43,
    punctuality: 4.6,
    treatment: 4.7,
    technical: 4.5,
    district: "Callao",
    experience: 3,
    completedServices: 43,
},
{
    id: "11",
    name: "Lic. Sofía Navarro",
    title: "Enfermería Neonatal",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 85
      }
    ],
    rating: 5.0,
    reviews: 102,
    punctuality: 5,
    treatment: 5,
    technical: 4.9,
    district: "Los Olivos",
    experience: 11,
    completedServices: 102,
},
{
    id: "12",
    name: "Tec. Ricardo Flores",
    title: "Control de Signos Vitales",
    isTopRated: false,
    serviceType: [
      {
        name: "Técnico",
        price: 35
      }
    ],
    rating: 4.4,
    reviews: 29,
    punctuality: 4.5,
    treatment: 4.6,
    technical: 4.3,
    district: "Ate",
    experience: 2,
    completedServices: 29,
},
{
    id: "13",
    name: "Lic. Diana Herrera",
    title: "Cuidados Paliativos",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 82
      }
    ],
    rating: 4.9,
    reviews: 96,
    punctuality: 4.8,
    treatment: 5,
    technical: 4.8,
    district: "San Martín de Porres",
    experience: 10,
    completedServices: 96,
},
{
    id: "14",
    name: "Tec. Luis Gutiérrez",
    title: "Asistencia Domiciliaria",
    isTopRated: false,
    serviceType: [
      {
        name: "Asistencial",
        price: 40
      }
    ],
    rating: 4.3,
    reviews: 31,
    punctuality: 4.4,
    treatment: 4.6,
    technical: 4.2,
    district: "Miraflores",
    experience: 3,
    completedServices: 31,
},
{
    id: "15",
    name: "Lic. Valeria Campos",
    title: "Pediatría Especializada",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 90
      }
    ],
    rating: 4.9,
    reviews: 121,
    punctuality: 5,
    treatment: 5,
    technical: 4.9,
    district: "La Victoria",
    experience: 8,
    completedServices: 121,
},
{
    id: "16",
    name: "Tec. Miguel Torres",
    title: "Inyecciones y Curaciones",
    isTopRated: false,
    serviceType: [
      {
        name: "Técnico",
        price: 42
      }
    ],
    rating: 4.6,
    reviews: 58,
    punctuality: 4.7,
    treatment: 4.8,
    technical: 4.6,
    district: "Barranco",
    experience: 4,
    completedServices: 58,
},
{
    id: "17",
    name: "Lic. Karen Vega",
    title: "Cuidados Intensivos",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 95
      }
    ],
    rating: 4.9,
    reviews: 137,
    punctuality: 5,
    treatment: 4.9,
    technical: 5,
    district: "San Borja",
    experience: 12,
    completedServices: 137,
},
{
    id: "18",
    name: "Tec. Diego Paredes",
    title: "Atención Básica",
    isTopRated: false,
    serviceType: [
      {
        name: "Acompañamiento",
        price: 32
      }
    ],
    rating: 4.4,
    reviews: 37,
    punctuality: 4.5,
    treatment: 4.5,
    technical: 4.3,
    district: "Jesús María",
    experience: 3,
    completedServices: 37,
},
{
    id: "19",
    name: "Lic. Patricia León",
    title: "Geriatría Avanzada",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 79
      }
    ],
    rating: 4.8,
    reviews: 110,
    punctuality: 4.8,
    treatment: 5,
    technical: 4.8,
    district: "Pueblo Libre",
    experience: 9,
    completedServices: 110,
},
{
    id: "20",
    name: "Tec. Kevin Díaz",
    title: "Monitoreo de Pacientes",
    isTopRated: false,
    serviceType: [
      {
        name: "Técnico",
        price: 36
      }
    ],
    rating: 4.5,
    reviews: 44,
    punctuality: 4.6,
    treatment: 4.7,
    technical: 4.4,
    district: "Surco",
    experience: 4,
    completedServices: 44,
},
{
    id: "21",
    name: "Lic. Brenda Soto",
    title: "Oncología",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 98
      }
    ],
    rating: 5,
    reviews: 148,
    punctuality: 5,
    treatment: 5,
    technical: 5,
    district: "San Isidro",
    experience: 14,
    completedServices: 148,
},
{
    id: "22",
    name: "Tec. Marco Silva",
    title: "Cuidado Postoperatorio",
    isTopRated: false,
    serviceType: [
      {
        name: "Asistencial",
        price: 39
      }
    ],
    rating: 4.4,
    reviews: 36,
    punctuality: 4.5,
    treatment: 4.5,
    technical: 4.3,
    district: "La Molina",
    experience: 4,
    completedServices: 36,
},
{
    id: "23",
    name: "Lic. Elena Cruz",
    title: "Rehabilitación Integral",
    isTopRated: true,
    serviceType: [
      {
        name: "Especializado",
        price: 88
      }
    ],
    rating: 4.9,
    reviews: 118,
    punctuality: 4.9,
    treatment: 4.9,
    technical: 4.8,
    district: "Miraflores",
    experience: 10,
    completedServices: 118,
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
  const { user } = useAuth();
  const [nursesList, setNursesList] = useState<Nurse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublicNurses()
      .then((data) => {
        if (!active) return;
        setNursesList(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar los enfermeros en el directorio:", err);
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

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

  const filteredNurses = nursesList.filter((nurse) => {

      // búsqueda
      // búsqueda
      if (searchTerm.trim().length >= 2) {

          const term =
              searchTerm.toLowerCase();

          const matchesName =
              nurse.name
                  .toLowerCase()
                  .includes(term);

          const matchesTitle =
              nurse.title
                  .toLowerCase()
                  .includes(term);

          const matchesService =
              nurse.serviceType.some(
                  (service) =>
                      service.name
                          .toLowerCase()
                          .includes(term)
              );

          if (
              !matchesName &&
              !matchesTitle &&
              !matchesService
          ) {
              return false;
          }

      }

      // filtro por tipo de servicio
      if (
          filterService &&
          !nurse.serviceType.some(
              (service) => service.name === filterService
          )
      ) {
          return false;
      }

      // distrito
      if (
          filterDistrict &&
          nurse.district !== filterDistrict
      ) {
          return false;
      }

      // top rated
      if (
          filterTopRated &&
          !nurse.isTopRated
      ) {
          return false;
      }

      // filtro por precios
      const hasPriceInRange = nurse.serviceType.some(
          (service) => {

              if (priceRange === "todos") return true;

              if (
                  priceRange === "0-30"
              ) {
                  return service.price <= 30;
              }

              if (
                  priceRange === "30-60"
              ) {
                  return (
                      service.price >= 30 &&
                      service.price <= 60
                  );
              }

              if (
                  priceRange === "60-80"
              ) {
                  return (
                      service.price >= 60 &&
                      service.price <= 80
                  );
              }

              if (
                  priceRange === "80-300"
              ) {
                  return service.price > 80;
              }

              return true;
          }
      );

      if (!hasPriceInRange) {
          return false;
      }

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

  const isAuthenticated = !!user;

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
                                        onChange={(e) => {

                                            let value = e.target.value;

                                            // quitar espacios al inicio
                                            value = value.replace(/^\s+/, "");

                                            // evitar espacios múltiples
                                            value = value.replace(/\s{2,}/g, " ");

                                            // limitar longitud
                                            if (value.length > 40) return;

                                            // permitir letras, números y espacios
                                            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

                                            if (!regex.test(value)) return;

                                            setSearchTerm(value);

                                        }}
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


                    {/* Loader o Grid de tarjetas */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
                            <p className="text-sm font-semibold text-slate-500">Cargando directorio de profesionales...</p>
                        </div>
                    ) : (
                        <>
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
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
                                        >
                                            ←
                                        </button>

                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(index + 1)}
                                                className={`w-10 h-10 rounded-xl transition-all ${
                                                    currentPage === index + 1
                                                        ? "bg-teal-500 text-white shadow-md"
                                                        : "bg-white border border-slate-200 hover:bg-slate-50"
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>
                            )}

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
                        </>
                    )}

                </div>
            </main>
            <Footer />
        </>
    );
}
