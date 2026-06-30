import { AlertTriangle, X } from "lucide-react";

export type TagVariant = "condition" | "medication" | "allergy";

const VARIANT_STYLES: Record<TagVariant, string> = {
  condition: "bg-rose-50 text-rose-700",
  medication: "bg-teal-50 text-teal-700",
  allergy: "bg-amber-50 text-amber-800",
};

type TagBadgeProps = {
  label: string;
  variant?: TagVariant;
  onRemove?: () => void;
  showWarning?: boolean;
};

export default function TagBadge({
  label,
  variant = "condition",
  onRemove,
  showWarning,
}: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${VARIANT_STYLES[variant]}`}
    >
      {showWarning && <AlertTriangle className="h-3 w-3 shrink-0" />}
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded p-0.5 opacity-70 transition hover:opacity-100"
          aria-label={`Quitar ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
