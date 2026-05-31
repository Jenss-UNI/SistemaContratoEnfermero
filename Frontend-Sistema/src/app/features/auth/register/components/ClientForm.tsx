import { useState } from "react";
import ProgressTracker from "./ProgressTracker";
import StepDatos from "./steps/StepDatos";
import StepEmail from "./steps/StepEmail";
import StepDni from "./steps/StepDni";
import StepPlan from "./steps/stepPlan"; 
import StepSuccess from "./steps/StepSuccess";


const SOLO_LETRAS   = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/;
const EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO_RE   = /^9\d{8}$/;                   // 9 dígitos, empieza con 9
const SOLO_NUMEROS  = /^\d*$/;

function validarNombre(v: string, campo: string) {
  if (!v.trim())            return `${campo} es requerido`;
  if (v.trim().length < 2)  return `${campo} debe tener al menos 2 caracteres`;
  if (!SOLO_LETRAS.test(v)) return `${campo} solo puede contener letras`;
  return "";
}

function validarCorreo(v: string) {
  if (!v.trim())           return "El correo es requerido";
  if (!EMAIL_RE.test(v))   return "Ingresa un correo electrónico válido";
  return "";
}

function validarTelefono(v: string) {
  if (!v.trim())                return "El teléfono es requerido";
  if (!TELEFONO_RE.test(v))     return "Debe ser un número peruano de 9 dígitos (empieza con 9)";
  return "";
}

function validarDni(v: string) {
  if (!v.trim())         return "El DNI es requerido";
  if (v.length !== 8)    return "El DNI debe tener exactamente 8 dígitos";
  if (!/^\d{8}$/.test(v)) return "El DNI solo debe contener números";
  return "";
}

function validarDistrito(v: string) {
  if (!v) return "Selecciona un distrito";
  return "";
}

function validarPassword(v: string) {
  if (!v)             return "La contraseña es requerida";
  if (v.length < 6)   return "Mínimo 6 caracteres";
  if (v.length > 64)  return "Máximo 64 caracteres";
  if (!/[A-Za-z]/.test(v)) return "Debe contener al menos una letra";
  if (!/\d/.test(v))        return "Debe contener al menos un número";
  return "";
}

function validarConfirmPassword(pwd: string, confirm: string) {
  if (!confirm)             return "Confirma tu contraseña";
  if (pwd !== confirm)      return "Las contraseñas no coinciden";
  return "";
}


export type FormData = {
  nombres:         string;
  apellidos:       string;
  correo:          string;
  dni:             string;
  telefono:        string;
  password:        string;
  confirmPassword: string;
  distrito:        string;
};

export default function ClienteForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    nombres:         "",
    apellidos:       "",
    correo:          "",
    dni:             "",
    telefono:        "",
    password:        "",
    confirmPassword: "",
    distrito:        "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

  
    if ((name === "dni" || name === "telefono") && value && !SOLO_NUMEROS.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }

    
    if (name === "password" && formData.confirmPassword) {
      const confErr = validarConfirmPassword(value, formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confErr || "" }));
    }
  };


  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};

    const checks: [string, string][] = [
      ["nombres",         validarNombre(formData.nombres, "Nombres")],
      ["apellidos",       validarNombre(formData.apellidos, "Apellidos")],
      ["correo",          validarCorreo(formData.correo)],
      ["telefono",        validarTelefono(formData.telefono)],
      ["dni",             validarDni(formData.dni)],
      ["distrito",        validarDistrito(formData.distrito)],
      ["password",        validarPassword(formData.password)],
      ["confirmPassword", validarConfirmPassword(formData.password, formData.confirmPassword)],
    ];

    checks.forEach(([field, msg]) => { if (msg) e[field] = msg; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep1 = () => { if (validateStep1()) setStep(2); };
  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  return (
    <div className="w-full">
     
      {step <= 5 && (
        <div className="mb-7">
          <ProgressTracker currentStep={step} />
        </div>
      )}

  
      {step === 1 && (
        <StepDatos
          formData={formData}
          onChange={handleChange}
          onNext={handleNextStep1}
          errors={errors}
        />
      )}
      {step === 2 && (
        <StepEmail email={formData.correo} onNext={nextStep} onBack={prevStep} />
      )}
      {step === 3 && (
        <StepDni
          {...({
            dni: formData.dni,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            onNext: nextStep,
            onBack: prevStep,
          } as any)}
        />
      )}
      {step === 4 && (
        <StepPlan onNext={nextStep} onBack={prevStep} />
      )}
      {step === 5 && (
        <StepSuccess formData={formData} />
      )}
    </div>
  );
}