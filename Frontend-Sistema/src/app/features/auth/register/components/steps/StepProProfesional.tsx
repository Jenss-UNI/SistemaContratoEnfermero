import { User, Mail, CreditCard, Smartphone, MapPin, Award, ChevronRight, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { StepProProps } from "../register-ui.types";
import InputField from "../InputField";

// Función para calcular la fuerza de la contraseña
const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "", width: "0%", text: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Contraseña débil", color: "bg-red-500", width: "33%", text: "text-red-500" };
    if (score <= 3) return { label: "Contraseña media", color: "bg-yellow-500", width: "66%", text: "text-yellow-500" };
    return { label: "Contraseña fuerte", color: "bg-emerald-500", width: "100%", text: "text-emerald-500" };
};

export default function StepProProfesional({ formData, onChange, onNext, errors = {} }: StepProProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const strength = getPasswordStrength(formData.password);
    const distritos = ["Miraflores", "San Isidro", "Surco", "La Molina", "San Borja", "Barranco", "Jesús María", "Pueblo Libre", "Lince", "Callao", "Los Olivos", "San Martín de Porres", "Ate", "La Victoria"];
    const niveles = ["Técnico Titulado", "Licenciado en Enfermería", "Licenciado con Especialidad"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 animate-in slide-in-from-bottom-4 duration-500">
            <div className="md:col-span-2">
                <InputField label="Nombres *" icon={User} name="nombres" value={formData.nombres} onChange={onChange} error={errors.nombres} placeholder="Juan" />
            </div>
            <InputField label="Apellido Paterno *" icon={User} name="apellidos_pa" value={formData.apellidos_pa} onChange={onChange} error={errors.apellidos_pa} placeholder="Pérez" />
            <InputField label="Apellido Materno *" icon={User} name="apellidos_ma" value={formData.apellidos_ma} onChange={onChange} error={errors.apellidos_ma} placeholder="Gómez" />
            <div className="md:col-span-2">
                <InputField label="Correo electrónico *" icon={Mail} type="email" name="correo" value={formData.correo} onChange={onChange} error={errors.correo} placeholder="tu@email.com" />
            </div>
            <div className="md:col-span-2">
                <InputField label="Teléfono *" icon={Smartphone} name="telefono" maxLength={9} value={formData.telefono} onChange={onChange} error={errors.telefono} placeholder="+51 999 888 777" />
            </div>
            <div className="md:col-span-2">
                <InputField label="DNI *" icon={CreditCard} name="dni" maxLength={8} value={formData.dni} onChange={onChange} error={errors.dni} placeholder="12345678" />
            </div>
            <div className="md:col-span-2">
                <InputField as="select" label="Distrito *" icon={MapPin} name="distrito" value={formData.distrito} onChange={onChange} options={distritos} error={errors.distrito} />
            </div>
            <div className="md:col-span-2">
                <InputField as="select" label="Tipo de profesional *" icon={Award} name="nivel" value={formData.nivel} onChange={onChange} options={niveles} error={errors.nivel} />
            </div>

           
            <div className="md:col-span-2 relative">
                <InputField
                    label="Contraseña *"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    error={errors.password}
                    placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                
             
                {formData.password && (
                    <div className="mt-2">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }}></div>
                        </div>
                        <p className={`text-[10px] mt-1 font-bold ${strength.text}`}>{strength.label}</p>
                    </div>
                )}
            </div>

            <div className="md:col-span-2 relative">
                <InputField
                    label="Confirmar contraseña *"
                    icon={Lock}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword || ''}
                    onChange={onChange}
                    error={errors.confirmPassword}
                    placeholder="Repite tu contraseña"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[38px] text-slate-400">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <button type="button" onClick={onNext} className="md:col-span-2 w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl hover:bg-teal-600 transition-all flex items-center justify-center gap-2">
                Continuar a Verificación <ChevronRight size={18} />
            </button>
        </div>
    );
}