const DANGEROUS_PATTERN =
  /<script|javascript:|on\w+\s*=|data:text\/html|<iframe/i;

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

export function hasDangerousContent(value: string): boolean {
  return DANGEROUS_PATTERN.test(value) || CONTROL_CHARS.test(value);
}

export function sanitizeText(value: string, maxLength = 500): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(CONTROL_CHARS, "")
    .trim()
    .slice(0, maxLength);
}

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]{2,60}$/;

export function validateName(value: string, fieldLabel = "Nombre"): string | undefined {
  const trimmed = sanitizeText(value, 60);
  if (!trimmed) return `${fieldLabel} es obligatorio`;
  if (!NAME_REGEX.test(trimmed)) return `${fieldLabel}: solo letras y espacios`;
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim().slice(0, 120);
  if (!trimmed) return "Correo obligatorio";
  if (hasDangerousContent(trimmed)) return "Correo no válido";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Correo electrónico inválido";
  return undefined;
}

export function validateDistrito(value: string): string | undefined {
  const trimmed = sanitizeText(value, 60);
  if (!trimmed) return "Distrito obligatorio";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'-]{2,60}$/.test(trimmed)) {
    return "Distrito inválido";
  }
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Teléfono obligatorio";
  if (!/^9\d{8}$/.test(digits)) return "Celular inválido (9 dígitos, empieza con 9)";
  return undefined;
}

export function validateAddress(value: string): string | undefined {
  const cleaned = sanitizeText(value, 200);
  if (!cleaned) return "Dirección obligatoria";
  if (cleaned.length < 5) return "Mínimo 5 caracteres";
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,#°'-]+$/.test(cleaned)) {
    return "Dirección: caracteres no permitidos";
  }
  if (hasDangerousContent(value)) return "Contenido no permitido";
  return undefined;
}

export function validateProfileImage(file: File): string | undefined {
  const allowed = ["image/jpeg", "image/png"];
  if (!allowed.includes(file.type)) return "Solo JPG o PNG";
  if (file.size > 5 * 1024 * 1024) return "Máximo 5MB";
  return undefined;
}

export function allowDigitsOnly(value: string, maxLength?: number): string {
  const digits = value.replace(/\D/g, "");
  return maxLength ? digits.slice(0, maxLength) : digits;
}

export function blockNonDigitKey(e: React.KeyboardEvent<HTMLInputElement>): void {
  if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
}

export function validateAge(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Edad obligatoria";
  if (!/^\d{1,3}$/.test(trimmed)) return "Edad inválida";
  const num = Number(trimmed);
  if (num < 0 || num > 120) return "Edad debe estar entre 0 y 120";
  return undefined;
}

export function validateParentesco(value: string): string | undefined {
  const trimmed = sanitizeText(value, 40);
  if (!trimmed) return "Parentesco obligatorio";
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  return undefined;
}

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;

export function validateBloodType(value: string): string | undefined {
  if (!value.trim()) return undefined;
  if (!BLOOD_TYPES.includes(value as (typeof BLOOD_TYPES)[number])) {
    return "Tipo de sangre inválido";
  }
  return undefined;
}

export function validateEmergencyContact(value: string): string | undefined {
  const trimmed = sanitizeText(value, 80);
  if (!trimmed) return "Contacto de emergencia obligatorio";
  if (trimmed.length < 2) return "Mínimo 2 caracteres";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,#°'-]+$/.test(trimmed)) {
    return "Caracteres no permitidos";
  }
  if (hasDangerousContent(value)) return "Contenido no permitido";
  return undefined;
}

export function validateReference(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const cleaned = sanitizeText(value, 200);
  if (cleaned.length < 3) return "Mínimo 3 caracteres";
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,#°'-]+$/.test(cleaned)) {
    return "Caracteres no permitidos";
  }
  if (hasDangerousContent(value)) return "Contenido no permitido";
  return undefined;
}

export function validateNotes(value: string, maxLength = 500): string | undefined {
  if (!value.trim()) return undefined;
  const cleaned = sanitizeText(value, maxLength);
  if (cleaned.length > maxLength) return `Máximo ${maxLength} caracteres`;
  if (hasDangerousContent(value)) return "Contenido no permitido";
  return undefined;
}

export function validateTagItem(value: string): string | undefined {
  const trimmed = sanitizeText(value, 80);
  if (!trimmed) return "Ingresa un valor";
  if (trimmed.length < 2) return "Mínimo 2 caracteres";
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  return undefined;
}

export function validateCardNumber(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Número de tarjeta obligatorio";
  if (digits.length < 13 || digits.length > 19) return "Número de tarjeta inválido";
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  return undefined;
}

export function validateCardHolder(value: string): string | undefined {
  const trimmed = value
    .trim()
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÑ\s]/g, "")
    .slice(0, 60);
  if (!trimmed) return "Nombre en la tarjeta obligatorio";
  if (trimmed.length < 2) return "Mínimo 2 caracteres";
  if (!/^[A-ZÁÉÍÓÚÑ\s]{2,60}$/.test(trimmed)) return "Solo letras mayúsculas";
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  return undefined;
}

export function validateCardExpiry(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Vencimiento obligatorio";
  if (!/^\d{2}\/\d{2}$/.test(trimmed)) return "Formato MM/AA";
  const [mm, yy] = trimmed.split("/");
  const month = Number(mm);
  const year = Number(yy);
  if (month < 1 || month > 12) return "Mes inválido";
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  const now = new Date();
  const currentYY = now.getFullYear() % 100;
  const currentMM = now.getMonth() + 1;
  if (year < currentYY || (year === currentYY && month < currentMM)) {
    return "Tarjeta vencida";
  }
  return undefined;
}

export function validateCvv(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "CVV obligatorio";
  if (!/^\d{3,4}$/.test(digits)) return "CVV inválido (3 o 4 dígitos)";
  if (hasDangerousContent(value)) return "Caracteres no permitidos";
  return undefined;
}
