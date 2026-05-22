import { AlertCircle, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { sanitizeText } from "../../../../shared/utils/validation";

type DistritoComboboxProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
};

export default function DistritoCombobox({
  label,
  value,
  onChange,
  options,
  error,
  required,
  placeholder = "Selecciona o escribe un distrito",
}: DistritoComboboxProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [value, options]);

  const inputClass = `h-11 w-full rounded-xl border px-4 pr-10 text-sm outline-none transition focus:ring-2 ${
    error
      ? "border-red-400 text-red-900 focus:ring-red-100"
      : "border-slate-200 text-slate-800 focus:border-teal-500 focus:ring-teal-100"
  }`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const next = sanitizeText(
              e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.'-]/g, ""),
              60
            );
            onChange(next);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          maxLength={60}
          className={inputClass}
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Mostrar distritos"
        >
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectOption(opt)}
                  >
                    {opt}
                  </button>
                </li>
              ))
            ) : (
              value.trim() && (
                <li>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setOpen(false)}
                  >
                    Usar &quot;{value.trim()}&quot;
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
