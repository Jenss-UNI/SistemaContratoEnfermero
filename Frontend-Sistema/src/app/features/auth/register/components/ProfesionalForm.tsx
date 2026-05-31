import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import ProgressTracker from "./ProgressTracker";
import StepEmail from "./steps/StepEmail";
import StepProDatos from "./steps/StepProProfesional";
import StepDni from "./steps/StepDni";

const SOLO_LETRAS = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO_RE = /^9\d{8}$/;
const SOLO_NUMEROS = /^\d*$/;

const validarNombre = (v: string, campo: string) => (!v.trim() ? `${campo} es requerido` : !SOLO_LETRAS.test(v) ? `${campo} solo letras` : "");
const validarCorreo = (v: string) => (!EMAIL_RE.test(v) ? "Correo inválido" : "");
const validarTelefono = (v: string) => (!TELEFONO_RE.test(v) ? "Número peruano de 9 dígitos" : "");
const validarDni = (v: string) => (!/^\d{8}$/.test(v) ? "DNI debe tener 8 números" : "");
const validarDistrito = (v: string) => (!v || v === "Selecciona tu distrito" ? "Selecciona un distrito" : "");
const validarPassword = (v: string) => (v.length < 6 ? "Mínimo 6 caracteres" : !/[A-Za-z]/.test(v) || !/\d/.test(v) ? "Debe incluir letra y número" : "");
const validarConfirmPassword = (pwd: string, confirm: string) => (pwd !== confirm ? "No coinciden" : "");

const getPasswordStrength = (password: string) => {
  if (!password) return { label: "", color: "", width: "0%", text: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score <= 2 ? { label: "Contraseña débil", color: "bg-red-500", width: "33%", text: "text-red-500" } :
         score <= 3 ? { label: "Contraseña media", color: "bg-yellow-500", width: "66%", text: "text-yellow-500" } :
         { label: "Contraseña fuerte", color: "bg-emerald-500", width: "100%", text: "text-emerald-500" };
};

function StepProSuccess({ formData }: { formData: any }) {
  const navigate = useNavigate();
  const [redirectDots, setRedirectDots] = useState("");
  const codigoGenerado = `CS-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    const interval = setInterval(() => setRedirectDots(p => p.length >= 3 ? "" : p + "."), 500);
    const timer = setTimeout(() => navigate("/profesional/dashboard"), 5000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [navigate]);

  return (
    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 max-w-md mx-auto py-4">
      <div className="flex justify-center mb-4"><div className="bg-teal-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-teal-200"><Check size={40} strokeWidth={3} /></div></div>
      <h2 className="text-2xl font-bold text-slate-900">¡Registro Completado!</h2>
      <p className="text-sm text-slate-500">Tu cuenta de profesional ha sido creada exitosamente.</p>
      <div className="text-left mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RESUMEN</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Nombre</span><span className="font-semibold">{formData.nombres} {formData.apellidos}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Correo</span><span className="font-semibold">{formData.correo}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-500">DNI</span><span className="font-semibold">{formData.dni}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Tipo</span><span className="font-semibold">{formData.nivel}</span></div>
          <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Validación Profesional</span><span className="font-bold text-teal-600">Sí</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Código</span><span className="font-mono font-semibold">{codigoGenerado}</span></div>
        </div>
      </div>
      <p className="text-xs font-medium text-teal-600 animate-pulse">Redirigiendo al panel{redirectDots}</p>
    </div>
  );
}
export default function ProfesionalForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ nombres: "", apellidos: "", correo: "", telefono: "", dni: "", distrito: "Selecciona tu distrito", nivel: "Selecciona tu tipo", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if ((name === "dni" || name === "telefono") && value && !SOLO_NUMEROS.test(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {
        nombres: validarNombre(formData.nombres, "Nombres"),
        apellidos: validarNombre(formData.apellidos, "Apellidos"),
        correo: validarCorreo(formData.correo),
        telefono: validarTelefono(formData.telefono),
        dni: validarDni(formData.dni),
        distrito: validarDistrito(formData.distrito),
        password: validarPassword(formData.password),
        confirmPassword: validarConfirmPassword(formData.password, formData.confirmPassword)
    };
    const cleanErrors = Object.fromEntries(Object.entries(e).filter(([_, v]) => v !== ""));
    setErrors(cleanErrors);
    return Object.keys(cleanErrors).length === 0;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {step <= 4 && <div className="mb-7"><ProgressTracker key="pro-tracker" currentStep={step} isPro={true} /></div>}
      
      {step === 1 && formData.password && (
        <div className="mb-5 mt-2">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${passwordStrength.color}`} style={{ width: passwordStrength.width }} /></div>
          <p className={`text-xs mt-1 font-semibold ${passwordStrength.text}`}>{passwordStrength.label}</p>
        </div>
      )}

      <div className="mt-8">
        {step === 1 && <StepProDatos formData={formData} onChange={handleChange} onNext={() => { if(validate()) { setStep(2); window.scrollTo(0, 0); } }} errors={errors} />}
        {step === 2 && <StepEmail email={formData.correo} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepDni dni={formData.dni} nombres={formData.nombres} apellidos={formData.apellidos} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <StepProSuccess formData={formData} />}
      </div>
    </div>
  );
}