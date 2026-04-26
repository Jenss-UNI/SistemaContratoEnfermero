import { User, Mail, CreditCard, Smartphone, MapPin, Award, Clock, Coins, FileText, ChevronRight, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { StepProProps } from "../../../../../core/models/StepProProps";
import InputField from "../InputField";

export default function StepProProfesional({ formData, onChange, onNext, errors = {} }: StepProProps) {
    const [showPassword, setShowPassword] = useState(false);

    const distritos = ["Miraflores", "San Isidro", "Surco", "La Molina", "San Borja", "Barranco", "Jesús María", "Pueblo Libre", "Lince", "Callao", "Los Olivos", "San Martín de Porres", "Ate", "La Victoria"];
    const niveles = ["Estudiante de Enfermería", "Técnico Titulado", "Licenciado en Enfermería", "Licenciado con Especialidad"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-4">
            <InputField label="Nombres" icon={User} name="nombres" value={formData.nombres} onChange={onChange} error={errors.nombres} placeholder="Ej. Maria Elena" />
            <InputField label="Apellidos" icon={User} name="apellidos" value={formData.apellidos} onChange={onChange} error={errors.apellidos} placeholder="Ej. Flores Prado" />

            <div className="md:col-span-2">
                <InputField label="Correo electrónico" icon={Mail} type="email" name="correo" value={formData.correo} onChange={onChange} error={errors.correo} placeholder="ejemplo@profesional.com" />
            </div>

            <div className="md:col-span-2 relative">
                <InputField
                    label="Contraseña"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    error={errors.password}
                    placeholder="Mínimo 8 caracteres"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-slate-400 hover:text-teal-600 z-20"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <InputField label="Teléfono" icon={Smartphone} name="telefono" maxLength={9} value={formData.telefono} onChange={onChange} error={errors.telefono} placeholder="987 654 321" />
            <InputField label="DNI" icon={CreditCard} name="dni" maxLength={8} value={formData.dni} onChange={onChange} error={errors.dni} placeholder="8 dígitos" />

            <InputField as="select" label="Distrito" icon={MapPin} name="distrito" value={formData.distrito} onChange={onChange} options={distritos} />
            <InputField as="select" label="Nivel Profesional" icon={Award} name="nivel" value={formData.nivel} onChange={onChange} options={niveles} />

            <InputField label="Especialidad Principal" icon={Award} name="especialidad" value={formData.especialidad} onChange={onChange} error={errors.especialidad} placeholder="Ej. Pediatría" />
            <InputField label="Años de Experiencia" icon={Clock} type="number" name="experiencia" value={formData.experiencia} onChange={onChange} error={errors.experiencia} placeholder="Ej. 5" />

            <div className="md:col-span-2">
                <InputField label="Tarifa/Hora (S/)" icon={Coins} type="number" name="tarifa" value={formData.tarifa} onChange={onChange} error={errors.tarifa} placeholder="0.00" />
            </div>

            <div className="md:col-span-2">
                <InputField
                    as="textarea"
                    label="Descripción Profesional"
                    icon={FileText}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={onChange}
                    error={errors.descripcion} 
                    maxLength={500}
                    placeholder="Describe tu trayectoria..."
                />
                <div className="flex justify-between mt-1">
                    <p className="text-[10px] text-slate-400 italic">Mínimo 50 caracteres para validación.</p>
                    <p className={`text-[10px] font-bold ${errors.descripcion ? 'text-red-500' : 'text-slate-400'}`}>
                        {formData.descripcion?.length || 0}/500
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onNext}
                className="md:col-span-2 mt-4 w-full bg-teal-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 shadow-lg shadow-teal-100 transition-all group"
            >
                Continuar a Verificación
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}