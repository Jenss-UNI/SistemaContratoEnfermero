import { MapPin } from "lucide-react";

type PatientSummaryCardProps = {
  name?: string;
  details?: string;
  location?: string;
};

export default function PatientSummaryCard({
  name = "—",
  details = "—",
  location = "—",
}: PatientSummaryCardProps) {
  
  // Función para obtener iniciales en caso de que no haya foto
  const getInitials = (nombre: string) => {
    if (!nombre || nombre === "—") return "?";
    const parts = nombre.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();

    return nombre.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Avatar del paciente */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700">
          {getInitials(name)}
        </div>
        
        <div>
          <h3 className="font-bold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-500">{details}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 pt-4 text-sm text-teal-600">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
      </div>
    </div>
  );
}