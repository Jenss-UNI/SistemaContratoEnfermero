import { Shield } from "lucide-react";

export default function SecurityBanner() {
  return (
    <div className="flex gap-3 rounded-xl border border-teal-100 bg-teal-50/80 px-4 py-3.5">
      <Shield className="h-5 w-5 shrink-0 text-teal-600" />
      <div>
        <p className="text-sm font-semibold text-teal-800">Pagos seguros garantizados</p>
        <p className="mt-0.5 text-xs leading-relaxed text-teal-700/90">
          Todos los pagos se procesan con encriptación SSL. El dinero queda en custodia hasta
          confirmar el servicio.
        </p>
      </div>
    </div>
  );
}
