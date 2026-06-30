import { AlertCircle, ChevronDown } from "lucide-react";

type FormFieldProps = {
  label: string;
  error?: string;
  helperText?: string;
  as?: "input" | "select" | "textarea";
  options?: string[];
  selectPlaceholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>;

export default function FormField({
  label,
  error,
  helperText,
  as = "input",
  options,
  selectPlaceholder,
  className = "",
  disabled,
  ...props
}: FormFieldProps) {
  const isReadOnly = props.readOnly || disabled;

  const inputClass = `h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:ring-2 ${
    isReadOnly
      ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
      : error
        ? "border-red-400 text-red-900 focus:ring-red-100"
        : "border-slate-200 text-slate-800 focus:border-teal-500 focus:ring-teal-100"
  }`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500"> *</span>}
      </label>

      {as === "select" ? (
        <div className="relative">
          <select {...props} disabled={disabled} className={`${inputClass} appearance-none pr-10`}>
            {selectPlaceholder && (
              <option value="" disabled>
                {selectPlaceholder}
              </option>
            )}
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      ) : as === "textarea" ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          disabled={disabled}
          className={`min-h-[100px] w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${
            isReadOnly
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
              : error
                ? "border-red-400 text-red-900 focus:ring-red-100"
                : "border-slate-200 text-slate-800 focus:border-teal-500 focus:ring-teal-100"
          }`}
        />
      ) : (
        <input {...props} disabled={disabled} className={inputClass} />
      )}

      {error ? (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      ) : (
        helperText && <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
