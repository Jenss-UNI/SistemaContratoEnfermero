import { Eye, EyeOff, ChevronDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { StepProps } from "../register-ui.types";

const DISTRITOS = [
  "Ate", "Barranco", "Breña", "Carabayllo", "Chorrillos",
  "Cieneguilla", "Comas", "El Agustino", "Independencia",
  "Jesús María", "La Molina", "La Victoria", "Lince",
  "Los Olivos", "Lurigancho", "Lurín", "Magdalena del Mar",
  "Miraflores", "Pachacámac", "Pueblo Libre", "Puente Piedra",
  "Rímac", "San Borja", "San Isidro", "San Juan de Lurigancho",
  "San Juan de Miraflores", "San Luis", "San Martín de Porres",
  "San Miguel", "Santa Anita", "Santiago de Surco", "Surquillo",
  "Villa El Salvador", "Villa María del Triunfo",
];

/* ─── Field wrapper ─── */
function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        {label} <span className="text-red-400">*</span>
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-500 mt-0.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}


const inputBase =
  "w-full rounded-lg border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white";

const inputCls = (err?: string) =>
  `${inputBase} ${err ? "border-red-400 bg-red-50/40 focus:ring-red-300 focus:border-red-400" : "border-slate-200 hover:border-slate-300"}`;


export default function StepDatos({ formData, onChange, onNext, errors = {} }: StepProps) {
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);

  /* Fuerza de contraseña */
  const pwdStrength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)        s++;
    if (p.length >= 10)       s++;
    if (/[A-Z]/.test(p))      s++;
    if (/\d/.test(p))         s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  })();

  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][pwdStrength];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][pwdStrength];

  return (
    <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">

   
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Nombres" error={errors.nombres}>
            <input
              name="nombres"
              value={formData.nombres}
              onChange={onChange}
              placeholder="Juan"
              autoComplete="given-name"
              className={inputCls(errors.nombres)}
            />
          </Field>
        </div>
        <Field label="Apellido Paterno" error={errors.apellidos_pa}>
          <input
            name="apellidos_pa"
            value={formData.apellidos_pa}
            onChange={onChange}
            placeholder="Pérez"
            autoComplete="family-name"
            className={inputCls(errors.apellidos_pa)}
          />
        </Field>
        <Field label="Apellido Materno" error={errors.apellidos_ma}>
          <input
            name="apellidos_ma"
            value={formData.apellidos_ma}
            onChange={onChange}
            placeholder="Gómez"
            autoComplete="additional-name"
            className={inputCls(errors.apellidos_ma)}
          />
        </Field>
      </div>

    
      <Field label="Correo electrónico" error={errors.correo}>
        <input
          name="correo"
          type="email"
          value={formData.correo}
          onChange={onChange}
          placeholder="tu@email.com"
          autoComplete="email"
          className={inputCls(errors.correo)}
        />
      </Field>

  
      <Field label="Teléfono" error={errors.telefono}>
        <input
          name="telefono"
          value={formData.telefono}
          onChange={onChange}
          maxLength={9}
          placeholder="+51 999 888 777"
          autoComplete="tel"
          inputMode="numeric"
          className={inputCls(errors.telefono)}
        />
      </Field>

  
      <Field label="DNI" error={errors.dni} hint="Se verificará en el siguiente paso">
        <input
          name="dni"
          value={formData.dni}
          onChange={onChange}
          maxLength={8}
          placeholder="12345678"
          inputMode="numeric"
          className={inputCls(errors.dni)}
        />
      </Field>

   
      <Field label="Distrito" error={errors.distrito}>
        <div className="relative">
          <select
            name="distrito"
            value={formData.distrito}
            onChange={onChange}
            className={`${inputCls(errors.distrito)} appearance-none pr-10 cursor-pointer ${!formData.distrito ? "text-slate-400" : "text-slate-800"}`}
          >
            <option value="">Selecciona tu distrito</option>
            {DISTRITOS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </Field>

    
      <Field label="Contraseña" error={errors.password}>
        <div className="relative">
          <input
            name="password"
            type={showPwd ? "text" : "password"}
            value={formData.password}
            onChange={onChange}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={inputCls(errors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
            aria-label="Mostrar contraseña"
          >
            {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>


        {formData.password && !errors.password && (
          <div className="mt-1.5">
            <div className="flex gap-1 mb-1">
              {[1,2,3,4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwdStrength ? strengthColor : "bg-slate-200"}`}
                />
              ))}
            </div>
            <p className={`text-[11px] font-medium ${["","text-red-500","text-orange-500","text-yellow-600","text-green-600"][pwdStrength]}`}>
              Contraseña {strengthLabel}
            </p>
          </div>
        )}
      </Field>

  
      <Field label="Confirmar contraseña" error={errors.confirmPassword}>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConf ? "text" : "password"}
            value={formData.confirmPassword ?? ""}
            onChange={onChange}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            className={inputCls(errors.confirmPassword)}
          />
          <button
            type="button"
            onClick={() => setShowConf(!showConf)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
            aria-label="Mostrar contraseña"
          >
            {showConf ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
     
        {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
          <p className="text-[11px] text-green-600 font-medium mt-0.5">✓ Las contraseñas coinciden</p>
        )}
      </Field>

      {/* CTA */}
      <button
        type="button"
        onClick={onNext}
        className="mt-2 w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-200/50 transition-all duration-200 group"
      >
        Continuar a Verificación
        <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Terms */}
      <p className="text-center text-[11px] text-slate-400 pb-1">
        Al registrarte aceptas nuestros{" "}
        <a href="/terminos" className="text-teal-600 hover:underline">Términos de Servicio</a>{" "}
        y{" "}
        <a href="/privacidad" className="text-teal-600 hover:underline">Política de Privacidad</a>.
      </p>
    </div>
  );
}