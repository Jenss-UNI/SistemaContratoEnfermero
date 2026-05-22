import { CheckCheck, X } from "lucide-react";

type PinRegeneratedToastProps = {
  onClose: () => void;
};

export default function PinRegeneratedToast({ onClose }: PinRegeneratedToastProps) {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <CheckCheck className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-900">PIN regenerado</p>
        <p className="text-sm text-slate-600">Nuevo PIN generado. Válido por 24 horas.</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-slate-400 hover:text-slate-600"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
