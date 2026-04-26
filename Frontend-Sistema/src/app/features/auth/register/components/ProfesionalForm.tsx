import { useState } from "react";
import ProgressTracker from "./ProgressTracker";
import StepEmail from "./steps/StepEmail";
import StepSuccess from "./steps/StepSuccess";
import StepProDatos from "./steps/StepProProfesional";
import StepDni from "./steps/StepDni";

export default function ProfesionalForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
    telefono: "",
    dni: "",
    distrito: "Miraflores",
    nivel: "Técnico Titulado",
    especialidad: "",
    experiencia: "",
    tarifa: "",
    descripcion: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if ((name === "dni" || name === "telefono") && value && !/^\d*$/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombres.trim()) newErrors.nombres = "El nombre es obligatorio";
    if (!formData.apellidos.trim()) newErrors.apellidos = "Los apellidos son obligatorios";

    if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Ingresa un correo electrónico válido";
    }

    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!/^9\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "Debe tener 9 dígitos y empezar con 9";
    }

    if (formData.dni.length !== 8) {
      newErrors.dni = "El DNI debe tener 8 dígitos";
    }

    if (!formData.especialidad.trim()) {
      newErrors.especialidad = "Indica tu especialidad";
    }

    if (!formData.experiencia || parseInt(formData.experiencia) < 0) {
      newErrors.experiencia = "Ingresa años válidos";
    }

    if (!formData.tarifa || parseFloat(formData.tarifa) <= 0) {
      newErrors.tarifa = "La tarifa debe ser mayor a 0";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción profesional es obligatoria";
    } else if (formData.descripcion.length < 50) {
      newErrors.descripcion = "Escribe al menos 50 caracteres para un perfil confiable";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    if (validate()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {step < 4 && <ProgressTracker currentStep={step} />}

      <div className="mt-8">
        {step === 1 && (
          <StepProDatos
            formData={formData}
            onChange={handleChange}
            onNext={handleNextStep1}
            errors={errors}
          />
        )}

        {step === 2 && (
          <StepEmail
            email={formData.correo}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepDni
            dni={formData.dni}
            nombres={formData.nombres}
            apellidos={formData.apellidos}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && <StepSuccess formData={formData} />}
      </div>
    </div>
  );
}