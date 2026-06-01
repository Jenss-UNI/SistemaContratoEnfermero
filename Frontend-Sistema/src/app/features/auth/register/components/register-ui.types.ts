import type { LucideIcon } from "lucide-react";
import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export interface StepProps {
  formData: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onNext: () => void;
  errors?: Record<string, string>;
}

export interface StepEmailProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

export interface StepDniProps {
  dni: string;
  nombres: string;
  apellidos_pa: string;
  apellidos_ma: string;
  onNext: () => void;
  onBack: () => void;
  onVerified?: (nombres: string, apellidos_pa: string, apellidos_ma: string) => void;
}

export interface StepProProps {
  formData: any;
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onNext: () => void;
  errors?: Record<string, string>;
}

export interface StepSuccessProps {
  formData: {
    nombres: string;
    apellidos_pa: string;
    apellidos_ma: string;
    dni: string;
  };
}

export interface ProgressTrackerProps {
  currentStep: number;
}

export interface InputFieldProps
  extends InputHTMLAttributes<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > {
  label: string;
  icon: LucideIcon;
  error?: string;
  helperText?: string;
  as?: "input" | "select" | "textarea";
  options?: string[];
  children?: ReactNode;
}
