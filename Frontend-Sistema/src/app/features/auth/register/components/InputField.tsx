import { AlertCircle, ChevronDown } from "lucide-react";
import type { InputFieldProps } from "../../../../core/models/InputFieldProps";

export default function InputField({
    label,
    icon: Icon,
    error,
    helperText,
    as = "input",
    options,
    children,
    ...props
}: InputFieldProps) {

    const Tag = as as any;

    const renderContent = () => {
        if (as === "select") {
            return (
                <>
                    <option value="" disabled>
                        {props.placeholder || "Selecciona una opción"}
                    </option>
                    {options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                    {children}
                </>
            );
        }
        if (as === "textarea") {
            return children;
        }
        return null; 
    };

    return (
        <div className={`space-y-1 w-full ${props.className || ""}`}>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {label} {props.required && "*"}
            </label>

            <div className="relative">
                <Icon className={`absolute left-4 text-slate-400 h-4 w-4 z-10 ${as === "textarea" ? "top-4" : "top-1/2 -translate-y-1/2"}`} />

                <Tag
                    {...props}
                    className={`w-full p-3 pl-11 rounded-xl border outline-none focus:ring-2 bg-white transition-all text-sm appearance-none
          ${as === "textarea" ? "h-24 resize-none" : "h-12"}
          ${error
                            ? 'border-red-400 focus:ring-red-100 text-red-900'
                            : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100 text-slate-700'
                        }`}
                >
                    {renderContent()}
                </Tag>

                {as === "select" && (
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
                )}
            </div>

            {error ? (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle size={10} /> {error}
                </p>
            ) : helperText && (
                <p className="text-[9px] text-teal-600 font-medium italic px-1">
                    {helperText}
                </p>
            )}
        </div>
    );
}