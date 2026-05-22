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
