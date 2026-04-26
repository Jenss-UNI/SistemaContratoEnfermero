import { useState } from "react";
import ProgressTracker from "./ProgressTracker";
import StepDatos from "./steps/StepDatos";
import StepEmail from "./steps/StepEmail";
import StepSuccess from "./steps/StepSuccess";
import StepDni from "./steps/StepDni";

export default function ClienteForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    dni: "",
    telefono: "",
    password: "",
    distrito: "San Borja",
    atencion: "Especializado"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if ((name === "dni" || name === "telefono") && value && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombres.trim()) newErrors.nombres = "Nombres requeridos";
    if (!formData.apellidos.trim()) newErrors.apellidos = "Apellidos requeridos";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) newErrors.correo = "Correo electrónico inválido";
    if (formData.dni.length !== 8) newErrors.dni = "El DNI debe tener 8 dígitos";
    if (!/^9\d{8}$/.test(formData.telefono)) newErrors.telefono = "Número inválido (debe empezar con 9)";
    if (formData.password.length < 8) newErrors.password = "Mínimo 8 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) setStep(2);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen">
      {step < 4 && (
        <div className="mb-10">
          <ProgressTracker currentStep={step} />
        </div>
      )}

      <div className="bg-white rounded-3xl p-2 md:p-4">

        {step === 1 && (
          <StepDatos
            formData={formData}
            onChange={handleChange}
            onNext={handleNextStep1}
            errors={errors}
          />
        )}

        {step === 2 && (
          <StepEmail
            email={formData.correo}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <StepDni
            dni={formData.dni}
            nombres={formData.nombres}
            apellidos={formData.apellidos}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 4 && (
          <StepSuccess
            formData={formData}
          />
        )}
      </div>

    </div>
  );
}