import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, Award, MapPin, Clock, CheckCircle, Lock, Eye, Heart, Stethoscope } from "lucide-react";
import type { Nurse } from "../../../../core/models/nurse.model";

interface NurseCardProps {
    nurse: Nurse;
    isAuthenticated?: boolean; // Estado de autenticación
}

export default function NurseCard({ nurse, isAuthenticated = false }: NurseCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/enfermero/${nurse.id}` } });
        } else {
            navigate(`/enfermero/${nurse.id}`);
        }
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < fullStars
                            ? "text-yellow-400 fill-yellow-400"
                            : i === fullStars && hasHalfStar
                                ? "text-yellow-400 fill-yellow-400/50"
                                : "text-slate-200 fill-slate-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    // Obtener el badge según el tipo de servicio
    const [activeService, setActiveService] = useState(0);

    useEffect(() => {

        if (nurse.serviceType.length <= 1) return;

        const interval = setInterval(() => {

            setActiveService((prev) =>
                prev === nurse.serviceType.length - 1
                    ? 0
                    : prev + 1
            );

        }, 2500);

        return () => clearInterval(interval);

    }, [nurse.serviceType]);

    const currentService =
        nurse.serviceType[activeService];

    const primaryService =
    nurse.serviceType[0];

    const getBadgeStyle = (serviceName: string) => {

        switch (serviceName) {

            case "Especializado":
                return {
                    bg: "bg-teal-100",
                    text: "text-teal-700"
                };

            case "Técnico":
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-700"
                };

            case "Acompañamiento":
                return {
                    bg: "bg-amber-100",
                    text: "text-amber-700"
                };

            case "Asistencial":
                return {
                    bg: "bg-emerald-100",
                    text: "text-emerald-700"
                };

            default:
                return {
                    bg: "bg-slate-100",
                    text: "text-slate-700"
                };
        }
    };

    const badgeStyle =
        getBadgeStyle(primaryService.name);

    return (
        <div
            className="bg-white rounded-3xl p-5 border border-slate-100
      shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full">
            {/* FOTO */}
            <div className="relative flex justify-center mb-4">

                {nurse.isTopRated && (
                    <div className="absolute left-8 top-0 w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center shadow-md">
                        <Award className="w-4 h-4 text-white" />
                    </div>
                )}

                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50">
                    {nurse.photo ? (
                        <img
                            src={nurse.photo}
                            alt={`Foto de ${nurse.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-600">
                            {nurse.name
                                .split(" ")
                                .slice(0, 2)
                                .map(word => word[0])
                                .join("")
                            }
                        </div>
                    )}
                </div>

                <div className="absolute bottom-1 right-20 w-8 h-8 rounded-full bg-teal-500 border-4 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>

            </div>

            {/* Nombre */}
            <div className="text-center mb-3">

                <h3 className="font-bold text-slate-800 text-lg">
                    {nurse.name}
                </h3>

                <p className="text-sm text-slate-500">
                    {nurse.title}
                </p>

            </div>

            {/* BADGES */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">

                {nurse.isTopRated && (
                    <span className="px-3 py-1 rounded-full text-xs bg-teal-500 text-white font-medium">
                        TOP
                    </span>
                )}

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${badgeStyle.bg}
                        ${badgeStyle.text}`}
                >
                    {primaryService.name}
                </span>

            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-5">
                {renderStars(nurse.rating)}

                <span className="font-bold text-slate-800">
                    {nurse.rating}
                </span>

                <span className="text-sm text-slate-400">
                    ({nurse.reviews})
                </span>
            </div>

            {/* MÉTRICAS */}
            <div className="bg-slate-50 rounded-2xl py-4 px-3 grid grid-cols-3 mb-4">

                {/* Puntualidad */}
                <div className="text-center flex flex-col items-center gap-1">

                    <Clock className="w-4 h-4 text-teal-500" />

                    <p className="font-bold text-slate-800">
                        {nurse.punctuality}
                    </p>

                    <p className="text-xs text-slate-400">
                        Puntualidad
                    </p>

                </div>

                {/* Trato */}
                <div className="text-center flex flex-col items-center gap-1">

                    <Heart className="w-4 h-4 text-teal-500" />

                    <p className="font-bold text-slate-800">
                        {nurse.treatment}
                    </p>

                    <p className="text-xs text-slate-400">
                        Trato
                    </p>

                </div>

                {/* Técnico */}
                {nurse.technical && (
                    <div className="text-center flex flex-col items-center gap-1">

                        <Stethoscope className="w-4 h-4 text-teal-500" />

                        <p className="font-bold text-slate-800">
                            {nurse.technical}
                        </p>

                        <p className="text-xs text-slate-400">
                            Técnico
                        </p>

                    </div>
                )}

            </div>

            {/* INFO */}
            <div className="flex justify-between text-xs text-slate-500 mb-5">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{nurse.district}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{nurse.experience} años exp.</span>
                </div>
                <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{nurse.completedServices} servicios</span>
                </div>
            </div>

            {/* SERVICIOS + PRECIOS */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-5 mb-5 overflow-hidden">

                <div className="flex items-center justify-between mb-3">

                    {nurse.serviceType.length > 1 ? (

                        <button
                            onClick={() =>
                                setActiveService((prev) =>
                                    prev === 0
                                        ? nurse.serviceType.length - 1
                                        : prev - 1
                                )
                            }
                            className="text-teal-500 text-lg font-bold"
                        >
                            ‹
                        </button>

                    ) : (

                        <div className="w-5" />

                    )}

                    <div className="text-center transition-all duration-500">

                        <p className="text-sm font-medium text-slate-500 mb-1">
                            {currentService.name}
                        </p>

                        <div className="flex items-end justify-center gap-1">

                            <span className="text-4xl font-bold text-teal-700">
                                S/ {currentService.price}
                            </span>

                            <span className="text-sm text-teal-600 mb-1">
                                /hora
                            </span>

                        </div>

                    </div>

                    {nurse.serviceType.length > 1 ? (

                        <button
                            onClick={() =>
                                setActiveService((prev) =>
                                    prev === nurse.serviceType.length - 1
                                        ? 0
                                        : prev + 1
                                )
                            }
                            className="text-teal-500 text-lg font-bold"
                        >
                            ›
                        </button>

                    ) : (

                        <div className="w-5" />

                    )}

                </div>

                {/* DOTS */}
                {nurse.serviceType.length > 1 && (

                    <div className="flex justify-center gap-2 mt-2">

                        {nurse.serviceType.map((_, index) => (

                            <button
                                key={index}
                                onClick={() =>
                                    setActiveService(index)
                                }
                                className={`h-2 rounded-full transition-all duration-300

                    ${activeService === index
                                        ? "bg-teal-500 w-6"
                                        : "bg-teal-200 w-2"
                                    }
                `}
                            />

                        ))}

                    </div>

                )}

            </div>

            {/* BOTÓN */}
            <button
                onClick={handleClick}
                className={`w-full py-3 rounded-2xl border font-medium transition-all
                     ${isAuthenticated
                        ? "bg-teal-500 text-white border-teal-500 hover:bg-teal-600"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }
      `}
            >

                <div className="flex items-center justify-center gap-2">

                    {!isAuthenticated ? (
                        <>
                            <Lock className="w-4 h-4" />
                            Inicia sesión para ver
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4" />
                            Ver perfil completo
                        </>
                    )}

                </div>

            </button>

        </div>
    );
}