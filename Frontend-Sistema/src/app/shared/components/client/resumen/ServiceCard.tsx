import { CalendarDays, Clock, UserRound, CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { CLIENT_PANEL_BASE } from "../../../../features/private/client/clientNav";

type ServiceCardProps = {
  dbId?: number | string;
  id?: string;
  status?: string;
  type?: string;
  professionalName?: string;
  specialty?: string;
  patientName?: string;
  dateRange?: string;
  schedule?: string;
  rate?: string;
  total?: string;
  hours?: string;
};

export default function ServiceCard({
  dbId,
  id = "SER-000000",
  status = "Pendiente",
  type = "Asistencial",
  professionalName = "—",
  specialty = "—",
  patientName = "—",
  dateRange = "—",
  schedule = "—",
  rate = "—",
  total = "—",
  hours = "—",
}: ServiceCardProps) {
  
  const getInitials = (name: string) => {
    if (name === "—" || !name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Colores del badge de estado
  const badgeClass =
    status === "Firma Requerida"
      ? "bg-orange-100 text-orange-700"
      : status === "Confirmado"
      ? "bg-teal-100 text-teal-700"
      : status === "En Curso"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700"; // Pendiente

  // Solo en "Firma Requerida" se ofrece firmar; en el resto se ve el detalle
  const isFirmaRequerida = status === "Firma Requerida";
  const contractLink = dbId
    ? `${CLIENT_PANEL_BASE}/contrato/${dbId}`
    : `${CLIENT_PANEL_BASE}/contrato/${(id || "").replace("SER-", "CON-")}`;

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
            {getInitials(professionalName)}
          </div>
          
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
                {status}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                type === "Asistencial" ? "bg-teal-100 text-teal-700" : "bg-indigo-100 text-indigo-700"
              }`}>
                {type}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{professionalName}</h3>
            <p className="text-sm text-slate-500">{specialty}</p>
            
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <UserRound className="h-4 w-4 text-pink-400" />{patientName}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-teal-500" />{schedule}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-amber-500" />{dateRange}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CircleDollarSign className="h-4 w-4 text-emerald-500" />{rate}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
          <div className="w-full text-right lg:w-auto">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-lg font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-500">{hours}</p>
          </div>
          
          <div className="mt-4 flex w-full items-center justify-between gap-4 lg:mt-0 lg:w-auto lg:justify-end">
            <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {id}
            </span>
            <Link
              to={contractLink}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition inline-flex items-center justify-center ${
                isFirmaRequerida
                  ? "border-orange-400 text-orange-600 hover:bg-orange-50"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isFirmaRequerida ? "Firmar Contrato" : "Ver detalle"}
            </Link>
          </div>
        </div>

      </div>
    </article>
  );
}