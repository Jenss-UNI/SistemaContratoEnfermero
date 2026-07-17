import { useState } from "react";
import ProgressTracker from "./ProgressTracker";
import StepDatos from "./steps/StepDatos";
import StepEmail from "./steps/StepEmail";
import StepDni from "./steps/StepDni";
import StepPlan from "./steps/stepPlan";
import StepPayment from "./steps/StepPayment";
import type { PaymentMethodData } from "./steps/StepPayment";
import StepSuccess from "./steps/StepSuccess";
import { supabase } from "../../../../core/services/supabase";
import type { SelectedPlanInfo } from "./steps/stepPlan";
import { useToast } from "../../../../shared/components/Toast";

const SOLO_LETRAS   = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/;
const EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO_RE   = /^9\d{8}$/;
const SOLO_NUMEROS  = /^\d*$/;

const PLAN_DB_IDS: Record<string, number> = {
  basico: 1,
  premium: 2,
  familiar: 3,
};

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
  apellidos_pa:    string;
  apellidos_ma:    string;
  correo:          string;
  dni:             string;
  telefono:        string;
  password:        string;
  confirmPassword: string;
  distrito:        string;
};

export default function ClienteForm() {
  const toast = useToast();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    nombres:         "",
    apellidos_pa:    "",
    apellidos_ma:    "",
    correo:          "",
    dni:             "",
    telefono:        "",
    password:        "",
    confirmPassword: "",
    distrito:        "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Plan selected from StepPlan
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanInfo | null>(null);
  // Payment method used (to show in StepSuccess)
  const [usedPaymentTipo, setUsedPaymentTipo] = useState<string | undefined>(undefined);

  // ─── PASO 4 → 5: guardar plan elegido y avanzar ─────────────────────────────
  const handlePlanSelected = (plan: SelectedPlanInfo) => {
    setSelectedPlan(plan);
    setUsedPaymentTipo(undefined);
    setStep(5);
  };

  // ─── PASO 5 → 6: registrar cuenta, suscripción y método de pago ─────────────
  const handlePaymentConfirm = async (paymentData: PaymentMethodData) => {
    if (!selectedPlan) return;
    setIsLoading(true);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.correo,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error("No se pudo crear la cuenta de usuario.");

      const userId = data.user.id;

      // 2. Crear perfil
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          nombres: formData.nombres,
          apellidos_pa: formData.apellidos_pa,
          apellidos_ma: formData.apellidos_ma,
          correo: formData.correo,
          telefono: formData.telefono,
          dni: formData.dni,
          distrito: formData.distrito,
          role: "cliente",
          dni_verified: true,
          email_verified: true,
        });

      if (profileError) throw profileError;

      // 3. Calcular fecha de vencimiento
      const hoy = new Date();
      const fechaInicio = hoy.toISOString().split("T")[0];
      let fechaVence: string;
      if (selectedPlan.billing === "mensual") {
        const vence = new Date(hoy);
        vence.setMonth(vence.getMonth() + 1);
        fechaVence = vence.toISOString().split("T")[0];
      } else {
        const vence = new Date(hoy);
        vence.setMonth(vence.getMonth() + 14); // 12 + 2 meses gratis
        fechaVence = vence.toISOString().split("T")[0];
      }

      // 4. Crear suscripción
      const { error: subError } = await supabase.from("subscriptions").insert({
        client_id: userId,
        plan_id: PLAN_DB_IDS[selectedPlan.id] ?? 1,
        ciclo: selectedPlan.billing,
        fecha_inicio: fechaInicio,
        fecha_vence: fechaVence,
        status: "active",
        activo: true,
      });

      if (subError) throw subError;

      // 5. Guardar tipo de pago usado
      setUsedPaymentTipo(paymentData.tipo);

      // 6. Guardar método de pago
      const paymentInsert: Record<string, any> = {
        client_id: userId,
        tipo: paymentData.tipo,
        es_principal: true,
      };

      if (paymentData.tipo === "tarjeta") {
        paymentInsert.terminacion  = paymentData.terminacion;
        paymentInsert.marca        = paymentData.marca;
        paymentInsert.nombre_tarjeta = paymentData.nombre_tarjeta;
      } else {
        paymentInsert.telefono = paymentData.telefono;
      }

      const { error: pmError } = await supabase.from("payment_methods").insert(paymentInsert);
      if (pmError) throw pmError;

      // 7. Todo OK → mostrar éxito
      setStep(6);
    } catch (err: any) {
      console.error(err);
      toast.error("Error al registrarse: " + (err.message || "Inténtalo de nuevo"));
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "nombres" || name === "apellidos_pa" || name === "apellidos_ma"
        ? value.trimStart()
        : name === "correo" || name === "password" || name === "confirmPassword"
          ? value.replace(/\s/g, "")
          : value;

    if ((name === "dni" || name === "telefono") && sanitizedValue && !SOLO_NUMEROS.test(sanitizedValue)) return;

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    if (errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }

    if (name === "password" && formData.confirmPassword) {
      const confErr = validarConfirmPassword(sanitizedValue, formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confErr || "" }));
    }
  };


  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};

    const checks: [string, string][] = [
      ["nombres",         validarNombre(formData.nombres, "Nombres")],
      ["apellidos_pa",    validarNombre(formData.apellidos_pa, "Apellido Paterno")],
      ["apellidos_ma",    validarNombre(formData.apellidos_ma, "Apellido Materno")],
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
    <div className="w-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-2xl animate-in fade-in duration-300 min-h-[400px]">
          <div className="flex flex-col items-center gap-3 text-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-700">Activando tu cuenta...</p>
            <p className="text-xs text-slate-400">Guardando suscripción y método de pago</p>
          </div>
        </div>
      )}

      {step < 6 && (
        <div className="mb-7">
          <ProgressTracker currentStep={Math.min(step, 5)} />
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
          dni={formData.dni}
          nombres={formData.nombres}
          apellidos_pa={formData.apellidos_pa}
          apellidos_ma={formData.apellidos_ma}
          onNext={nextStep}
          onBack={prevStep}
          onVerified={(nombres, apellidos_pa, apellidos_ma) => {
            setFormData((prev) => ({ ...prev, nombres, apellidos_pa, apellidos_ma }));
          }}
        />
      )}
      {step === 4 && (
        <StepPlan onNext={handlePlanSelected} onBack={prevStep} />
      )}
      {step === 5 && selectedPlan && (
        <StepPayment
          plan={selectedPlan}
          onConfirm={handlePaymentConfirm}
          onBack={() => setStep(4)}
          isLoading={isLoading}
        />
      )}
      {step === 6 && (
        <StepSuccess
          formData={formData}
          planInfo={selectedPlan ? {
            name: selectedPlan.name,
            billing: selectedPlan.billing,
            price: selectedPlan.price,
            paymentTipo: usedPaymentTipo,
          } : undefined}
        />
      )}
    </div>
  );
}