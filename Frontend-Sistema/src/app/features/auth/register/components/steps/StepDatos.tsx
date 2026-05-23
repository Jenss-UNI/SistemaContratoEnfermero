
import { User, Mail, CreditCard, Smartphone, Lock, MapPin, Briefcase, Eye, EyeOff, ChevronRight } from "lucide-react";
import { useState } from "react";
import InputField from "../InputField";
import type { StepProps } from "../register-ui.types";


export default function StepDatos({ formData, onChange, onNext, errors = {} }: StepProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-4">

            <InputField label="Nombres" icon={User} name="nombres" value={formData.nombres} onChange={onChange} error={errors.nombres} placeholder="Ej. Juan Gabriel" />
            <InputField label="Apellidos" icon={User} name="apellidos" value={formData.apellidos} onChange={onChange} error={errors.apellidos} placeholder="Ej. Quispe" />

            <div className="md:col-span-2">
                <InputField label="Correo electrónico" icon={Mail} type="email" name="correo" value={formData.correo} onChange={onChange} error={errors.correo} placeholder="correo@ejemplo.com" />
            </div>

            <InputField label="DNI" icon={CreditCard} name="dni" maxLength={8} value={formData.dni} onChange={onChange} error={errors.dni} placeholder="8 dígitos" />
            <InputField label="Teléfono" icon={Smartphone} name="telefono" maxLength={9} value={formData.telefono} onChange={onChange} error={errors.telefono} placeholder="987 888 777" />

            <div className="md:col-span-2 relative">
                <InputField label="Contraseña" icon={Lock} type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={onChange} error={errors.password} placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-slate-400 hover:text-teal-600 transition-colors z-20">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <InputField
                as="select"
                label="Distrito"
                icon={MapPin}
                name="distrito"
                value={formData.distrito}
                onChange={onChange}
                options={["San Borja", "San Juan de Lurigancho", "Miraflores", "Surco"]}
            />

            <InputField
                as="select"
                label="Atención"
                icon={Briefcase}
                name="atencion"
                value={formData.atencion}
                onChange={onChange}
                options={["Especializado", "Básico", "Acompañamiento"]}
            />

            <button
                type="button"
                onClick={onNext}
                className="md:col-span-2 mt-4 w-full bg-teal-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 shadow-lg transition-all group"
            >
                Continuar a Verificación
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}