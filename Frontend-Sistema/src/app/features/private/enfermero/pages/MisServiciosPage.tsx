import { useState, useMemo } from "react";
import {
  Briefcase,
  Calendar,
  MapPin,
  Search,
  MoreVertical,
  PlayCircle,
  Eye,
  Inbox,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  XCircle,
  X,
  Lock,
  Check,
  Clock,
  Loader2,
  Filter,
  Camera,
  AlertTriangle,
} from "lucide-react";

/* ─── Types ─── */
type ServiceStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
type ServiceTab = "pending" | "confirmed" | "active" | "completed";

interface ServiceDay {
  id: number;
  day_date: string;
  start_hour: number;
  end_hour: number;
  status: string;
  real_start?: string;
  real_end?: string;
  report?: string;
}

interface ServiceRow {
  id: number;
  client_id: string;
  status: ServiceStatus;
  payment_status: string;
  service_type: string;
  total_hours: number;
  total_amount: number;
  hourly_rate: number;
  notes?: string;
  contract_code?: string;
  service_code?: string;
  pin_code?: string;
  patient_name?: string;
  patient_age?: number;
  address?: string;
  district?: string;
  created_at: string;
  service_days: ServiceDay[];
  clientName?: string;
  clientPlan?: string;
}

const TAB_LABELS: Record<ServiceTab, string> = {
  pending: "Pendientes",
  confirmed: "Aceptados",
  active: "En curso",
  completed: "Completado",
};

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Pendiente", bg: "bg-amber-50 text-amber-700 border border-amber-200/50", text: "text-amber-750" },
  confirmed: { label: "Aceptado", bg: "bg-sky-50 text-sky-700 border border-sky-200/50", text: "text-sky-750" },
  active: { label: "En curso", bg: "bg-teal-50 text-teal-700 border border-teal-200/50", text: "text-teal-750" },
  completed: { label: "Completado", bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/50", text: "text-emerald-750" },
  cancelled: { label: "Cancelado", bg: "bg-rose-50 text-rose-700 border border-rose-200/50", text: "text-rose-750" },
};

function formatHour(h: number) {
  const suffix = h >= 12 ? "pm" : "am";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${suffix}`;
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

const ITEMS_PER_PAGE = 4;

export default function MisServiciosPage() {
  // Mock data perfectly matching screenshots
  const [services, setServices] = useState<ServiceRow[]>([
    // En Curso (Tab 3) - Carmen Rodriguez matching mockup perfectly
    {
      id: 11,
      client_id: "c-3",
      status: "active",
      payment_status: "paid",
      service_type: "Especializado",
      total_hours: 30,
      total_amount: 4500,
      hourly_rate: 150,
      service_code: "SER-000050",
      pin_code: "PIN123",
      patient_name: "Elena Rodriguez",
      patient_age: 78,
      address: "Av. Larco 1234",
      district: "Miraflores",
      created_at: "2026-05-10T08:00:00.000Z",
      clientName: "Carmen Rodriguez",
      clientPlan: "Premium",
      notes: "Paciente con artrosis de cadera. Necesita asistencia completa.",
      service_days: [
        { id: 201, day_date: "2026-05-12", start_hour: 8, end_hour: 14, status: "completed", real_start: "08:05", real_end: "14:10" },
        { id: 202, day_date: "2026-05-13", start_hour: 8, end_hour: 14, status: "active", real_start: "08:15" },
        { id: 203, day_date: "2026-05-14", start_hour: 8, end_hour: 14, status: "scheduled" },
        { id: 204, day_date: "2026-05-15", start_hour: 8, end_hour: 14, status: "scheduled" },
        { id: 205, day_date: "2026-05-16", start_hour: 8, end_hour: 14, status: "scheduled" }
      ]
    },

    // Pendientes (Tab 1)
    {
      id: 1,
      client_id: "c-1",
      status: "pending",
      payment_status: "paid",
      service_type: "Asistencial",
      total_hours: 6,
      total_amount: 120,
      hourly_rate: 20,
      service_code: "SER-000039",
      pin_code: "PIN123",
      patient_name: "Elena Rodriguez",
      patient_age: 12,
      address: "Av. Larco 456",
      district: "Miraflores",
      created_at: "2026-05-25T01:00:00.000Z",
      clientName: "Jens Jeremies Luna Levita",
      clientPlan: "Premium",
      notes: "Paciente requiere cambio de vendajes y control de temperatura.",
      service_days: [
        { id: 101, day_date: "2026-05-29", start_hour: 8, end_hour: 14, status: "scheduled" }
      ]
    },
    {
      id: 2,
      client_id: "c-1",
      status: "pending",
      payment_status: "paid",
      service_type: "Acompañamiento",
      total_hours: 4,
      total_amount: 75,
      hourly_rate: 18.75,
      service_code: "SER-000038",
      pin_code: "PIN388",
      patient_name: "Elena Rodriguez",
      patient_age: 12,
      address: "Av. Larco 456",
      district: "Miraflores",
      created_at: "2026-05-24T18:00:00.000Z",
      clientName: "Jens Jeremies Luna Levita",
      clientPlan: "Premium",
      notes: "Paseo por el parque y lectura por la tarde.",
      service_days: [
        { id: 102, day_date: "2026-05-30", start_hour: 14, end_hour: 18, status: "scheduled" }
      ]
    },
    {
      id: 3,
      client_id: "c-1",
      status: "pending",
      payment_status: "paid",
      service_type: "Acompañamiento",
      total_hours: 10,
      total_amount: 180,
      hourly_rate: 18,
      service_code: "SER-000037",
      pin_code: "PIN377",
      patient_name: "Elena Rodriguez",
      patient_age: 12,
      address: "Av. Larco 456",
      district: "Miraflores",
      created_at: "2026-05-24T12:00:00.000Z",
      clientName: "Jens Jeremies Luna Levita",
      clientPlan: "Premium",
      notes: "Acompañamiento escolar y tareas.",
      service_days: [
        { id: 103, day_date: "2026-05-28", start_hour: 8, end_hour: 13, status: "scheduled" },
        { id: 104, day_date: "2026-05-29", start_hour: 8, end_hour: 13, status: "scheduled" }
      ]
    },
    {
      id: 4,
      client_id: "c-1",
      status: "pending",
      payment_status: "paid",
      service_type: "Asistencial",
      total_hours: 6,
      total_amount: 120,
      hourly_rate: 20,
      service_code: "SER-000036",
      pin_code: "PIN366",
      patient_name: "Elena Rodriguez",
      patient_age: 12,
      address: "Av. Larco 456",
      district: "Miraflores",
      created_at: "2026-05-23T10:00:00.000Z",
      clientName: "Jens Jeremies Luna Levita",
      clientPlan: "Premium",
      notes: "Monitoreo rutinario posoperatorio.",
      service_days: [
        { id: 105, day_date: "2026-05-29", start_hour: 8, end_hour: 14, status: "scheduled" }
      ]
    },
    {
      id: 5,
      client_id: "c-1",
      status: "pending",
      payment_status: "paid",
      service_type: "Asistencial",
      total_hours: 8,
      total_amount: 160,
      hourly_rate: 20,
      service_code: "SER-000035",
      pin_code: "PIN355",
      patient_name: "Elena Rodriguez",
      patient_age: 12,
      address: "Av. Larco 456",
      district: "Miraflores",
      created_at: "2026-05-22T08:00:00.000Z",
      clientName: "Jens Jeremies Luna Levita",
      clientPlan: "Premium",
      service_days: [
        { id: 106, day_date: "2026-05-27", start_hour: 9, end_hour: 17, status: "scheduled" }
      ]
    },

    // Aceptados / Confirmados (Tab 2)
    {
      id: 7,
      client_id: "c-2",
      status: "confirmed",
      payment_status: "paid",
      service_type: "Asistencial",
      total_hours: 15,
      total_amount: 340,
      hourly_rate: 22.6,
      service_code: "SER-000042",
      pin_code: "PIN777",
      patient_name: "Juana Lopez Casas",
      patient_age: 88,
      address: "Jr. Huamanga 123",
      district: "La Victoria",
      created_at: "2026-05-24T09:00:00.000Z",
      clientName: "Axel Perez",
      clientPlan: "Familiar",
      service_days: [
        { id: 108, day_date: "2026-05-26", start_hour: 7, end_hour: 12, status: "scheduled" },
        { id: 109, day_date: "2026-05-27", start_hour: 7, end_hour: 12, status: "scheduled" },
        { id: 110, day_date: "2026-05-28", start_hour: 7, end_hour: 12, status: "scheduled" }
      ]
    },

    // Finalizados / Completados (Tab 4)
    {
      id: 9,
      client_id: "c-1",
      status: "completed",
      payment_status: "paid",
      service_type: "Especializado",
      total_hours: 4,
      total_amount: 106,
      hourly_rate: 26.5,
      service_code: "SER-000034",
      pin_code: "PIN034",
      patient_name: "Elena Rodriguez",
      patient_age: 12,
      address: "Av. Larco 456",
      district: "Miraflores",
      created_at: "2026-05-21T09:00:00.000Z",
      clientName: "Jens Jeremies Luna Levita",
      clientPlan: "Premium",
      service_days: [
        {
          id: 112,
          day_date: "2026-05-27",
          start_hour: 8,
          end_hour: 12,
          status: "completed",
          real_start: "08:02",
          real_end: "12:00",
          report: "Se realizó curación de herida, suministro de analgésico y monitoreo de pulso."
        }
      ]
    },
    {
      id: 10,
      client_id: "c-1",
      status: "completed",
      payment_status: "paid",
      service_type: "Asistencial",
      total_hours: 5,
      total_amount: 100,
      hourly_rate: 20,
      service_code: "SER-000033",
      pin_code: "PIN033",
      patient_name: "Elena Rodriguez",
      patient_age: 12,
      address: "Av. Larco 456",
      district: "Miraflores",
      created_at: "2026-05-20T09:00:00.000Z",
      clientName: "Jens Jeremies Luna Levita",
      clientPlan: "Premium",
      service_days: [
        {
          id: 113,
          day_date: "2026-05-21",
          start_hour: 9,
          end_hour: 14,
          status: "completed",
          real_start: "08:55",
          real_end: "14:05",
          report: "Control general y acompañamiento en terapia física."
        }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<ServiceTab>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Modals & States
  const [detailModal, setDetailModal] = useState<ServiceRow | null>(null);
  const [pinModal, setPinModal] = useState<{ service: ServiceRow; dayIndex: number } | null>(null);
  const [endModal, setEndModal] = useState<{ service: ServiceRow; dayIndex: number } | null>(null);
  const [acceptConfirm, setAcceptConfirm] = useState<ServiceRow | null>(null);
  const [rejectConfirm, setRejectConfirm] = useState<ServiceRow | null>(null);
  const [activeJourney, setActiveJourney] = useState<{ service: ServiceRow; dayIndex: number } | null>(null);

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [endNotes, setEndNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "info" | "error"; message: string } | null>(null);

  // Custom Toast helper
  const showToast = (message: string, type: "success" | "info" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Accept a service solicitation
  const handleAccept = (service: ServiceRow) => {
    setProcessing(true);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, status: "confirmed" } : s))
      );
      setProcessing(false);
      setAcceptConfirm(null);
      showToast("Solicitud aceptada exitosamente.", "success");
    }, 1000);
  };

  // Reject a service solicitation
  const handleReject = (service: ServiceRow) => {
    setProcessing(true);
    setTimeout(() => {
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      setProcessing(false);
      setRejectConfirm(null);
      showToast("Solicitud rechazada correctamente.", "info");
    }, 1000);
  };

  // Start assisted session with PIN
  const handleStartJourney = () => {
    if (!pinModal) return;
    const { service, dayIndex } = pinModal;
    const pinCode = service.pin_code || "123456";

    if (pinInput.trim().toUpperCase() !== pinCode.trim().toUpperCase()) {
      setPinError("PIN incorrecto. Verifica con el cliente.");
      return;
    }

    const now = new Date();
    const realStart = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== service.id) return s;
        const newDays = s.service_days.map((d, i) =>
          i === dayIndex ? { ...d, status: "active", real_start: realStart } : d
        );
        return { ...s, status: "active", service_days: newDays };
      })
    );

    // Dynamic state update for Active Journey Modal
    const updatedService = {
      ...service,
      status: "active" as ServiceStatus,
      service_days: service.service_days.map((d, i) =>
        i === dayIndex ? { ...d, status: "active", real_start: realStart } : d
      ),
    };

    setPinModal(null);
    setPinInput("");
    setPinError("");
    setActiveJourney({ service: updatedService, dayIndex });
    showToast("Jornada iniciada correctamente. ¡Buen servicio!", "success");
  };

  // End active assisted session
  const handleEndJourney = () => {
    if (!endModal) return;
    const { service, dayIndex } = endModal;
    const now = new Date();
    const realEnd = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updatedDays = service.service_days.map((d, i) =>
      i === dayIndex ? { ...d, status: "completed", real_end: realEnd, report: endNotes || undefined } : d
    );
    const allDone = updatedDays.every((d) => d.status === "completed");

    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== service.id) return s;
        return { ...s, status: allDone ? "completed" : "active", service_days: updatedDays };
      })
    );

    setEndModal(null);
    setEndNotes("");
    setActiveJourney(null);
    showToast(
      allDone
        ? "Todas las jornadas completadas. Servicio finalizado."
        : "Jornada finalizada y guardada con éxito.",
      "success"
    );
  };

  // Helper check methods
  const getTodaysPendingDay = (s: ServiceRow) => {
    const idx = s.service_days.findIndex((d) => d.status === "scheduled");
    return idx;
  };

  const getActiveDayIndex = (s: ServiceRow) => s.service_days.findIndex((d) => d.status === "active");

  const completedCount = (s: ServiceRow) => s.service_days.filter((d) => d.status === "completed").length;

  // Filters and Pagination
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (s.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (s.clientName || "").toLowerCase().includes(q) ||
          (s.patient_name || "").toLowerCase().includes(q) ||
          (s.district || "").toLowerCase().includes(q) ||
          (s.service_code || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [services, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / ITEMS_PER_PAGE));
  const paginatedServices = useMemo(() => {
    return filteredServices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  // Tab counters
  const tabCounts = useMemo(() => {
    return {
      pending: services.filter((s) => s.status === "pending").length,
      confirmed: services.filter((s) => s.status === "confirmed").length,
      active: services.filter((s) => s.status === "active").length,
      completed: services.filter((s) => s.status === "completed").length,
    };
  }, [services]);

  return (
    <div className="relative w-full space-y-6">
      
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Mis Servicios</h2>
          <p className="text-xs text-slate-450">Administra tus contratos, firma de jornadas asistenciales y registros con PIN</p>
        </div>
      </div>

      {/* Tabs / Selectores de Estado */}
      <div className="flex bg-slate-100/70 border border-slate-200/50 rounded-xl p-1 overflow-x-auto gap-1">
        {(["pending", "confirmed", "active", "completed"] as ServiceTab[]).map((tab) => {
          const count = tabCounts[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
                isActive
                  ? "bg-white text-slate-850 shadow-sm border border-slate-200/20"
                  : "text-slate-500 hover:text-slate-850 hover:bg-slate-200/30"
              }`}
            >
              {TAB_LABELS[tab]}
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                  isActive ? "bg-teal-50 text-teal-700 border border-teal-200/30" : "bg-slate-200 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Búsqueda y Botón de Filtros */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por cliente, paciente o dirección..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/30 transition placeholder-slate-400"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            showFilters
              ? "bg-teal-50 text-teal-750 border-teal-200"
              : "bg-white border-slate-200 text-slate-650 hover:bg-slate-550/10"
          }`}
        >
          <Filter className="h-4 w-4 text-teal-550" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Resultados e Info de Página */}
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
        <span>{filteredServices.length} {filteredServices.length === 1 ? "resultado" : "resultados"}</span>
        <span>Página {currentPage} de {totalPages}</span>
      </div>

      {/* Grid de Contratos / Solicitudes */}
      {paginatedServices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center shadow-sm max-w-full">
          <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-full mx-auto mb-3.5 border border-slate-100">
            <Inbox className="text-slate-450 h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No hay servicios {TAB_LABELS[activeTab].toLowerCase()}</h4>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            {activeTab === "pending"
              ? "Las nuevas solicitudes de pacientes que coincidan con tu perfil y distrito aparecerán aquí."
              : activeTab === "confirmed"
              ? "Los servicios aceptados y confirmados que esperan ser iniciados mediante PIN por el paciente."
              : activeTab === "active"
              ? "No tienes jornadas asistenciales o acompañamientos activos en este momento."
              : "Tus contratos asistenciales completados e históricos se archivarán en esta pestaña."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedServices.map((service) => {
            const badge = STATUS_BADGES[service.status];
            const completed = completedCount(service);
            const total = service.service_days.length;
            const todayIdx = getTodaysPendingDay(service);
            const firstDay = service.service_days[0];
            const lastDay = service.service_days[service.service_days.length - 1];

            return (
              <div
                key={service.id}
                className="bg-white rounded-xl  border-slate-150 p-5 hover:border-teal-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                        {service.service_code && (
                          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-md">
                            {service.service_code}
                          </span>
                        )}
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/30">
                          {service.clientPlan}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-850 truncate">{service.clientName}</h3>
                      <p className="text-xs text-slate-400 truncate mt-1">
                        Paciente: <span className="font-semibold text-slate-650">{service.patient_name}</span>
                        {service.patient_age ? `, ${service.patient_age} años` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailModal(service)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-450 hover:text-slate-800 transition cursor-pointer flex-shrink-0 ml-2"
                      aria-label="Más detalles"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Fila de Detalles Rápidos */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-teal-50/30 px-2.5 py-1 rounded-lg border border-teal-100/20">
                      <Briefcase className="text-teal-500 h-3.5 w-3.5 shrink-0" />
                      <span>{service.service_type}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="text-teal-400 h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">
                        {firstDay ? formatDateShort(firstDay.day_date) : "—"} -{" "}
                        {lastDay ? formatDateShort(lastDay.day_date) : "—"}
                      </span>
                    </span>
                    {service.district && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 max-w-[180px]">
                        <MapPin className="text-teal-400 h-3.5 w-3.5 shrink-0" />
                        <span className="truncate font-medium">{service.district}</span>
                      </span>
                    )}
                  </div>

                  {/* Progreso de Jornadas (SIEMPRE visible por requerimiento) */}
                  <div className="mb-4 bg-slate-50/50 border border-slate-100 rounded-xl p-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-teal-600 font-semibold text-[10px]">
                        {completed}/{total} jornadas
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Monto y Botones de Acción */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Monto total</span>
                    <span className="text-base font-extrabold text-slate-850">
                      S/ {Number(service.total_amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2 w-full">
                    {service.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setRejectConfirm(service)}
                          className="flex-1 px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl cursor-pointer transition whitespace-nowrap"
                        >
                          Rechazar
                        </button>
                        <button
                          type="button"
                          onClick={() => setAcceptConfirm(service)}
                          className="flex-1 px-3.5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition whitespace-nowrap"
                        >
                          Aceptar
                        </button>
                      </>
                    )}
                    {service.status === "confirmed" && (
                      todayIdx >= 0 ? (
                        <button
                          type="button"
                          onClick={() => setPinModal({ service, dayIndex: todayIdx })}
                          className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap animate-pulse"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Iniciar PIN
                        </button>
                      ) : (
                        <span className="w-full text-center text-xs text-slate-450 italic font-medium bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                          Próx: {firstDay ? formatDateShort(firstDay.day_date) : "—"}
                        </span>
                      )
                    )}
                    {service.status === "active" && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const idx = getActiveDayIndex(service) >= 0 ? getActiveDayIndex(service) : getTodaysPendingDay(service);
                            if (idx >= 0) {
                              setActiveJourney({ service, dayIndex: idx });
                            }
                          }}
                          className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <Eye className="h-4 w-4" />
                          Ver jornada activa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailModal(service)}
                          className="flex-1 py-2.5 border border-slate-200 text-slate-650 hover:bg-slate-50 text-xs font-bold rounded-xl transition cursor-pointer text-center"
                        >
                          Ver detalle
                        </button>
                      </>
                    )}
                    {service.status === "completed" && (
                      <button
                        type="button"
                        onClick={() => setDetailModal(service)}
                        className="w-full py-2.5 border border-slate-200 text-slate-650 hover:text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer whitespace-nowrap text-center"
                      >
                        Ver Detalle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setCurrentPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold cursor-pointer transition ${
                currentPage === p
                  ? "bg-teal-500 text-white shadow-sm"
                  : "border border-slate-200 text-slate-650 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ─── MODAL CONFIRMAR ACEPTAR SOLICITUD ─── */}
      {acceptConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAcceptConfirm(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-9 h-9 flex items-center justify-center bg-teal-50 text-teal-600 rounded-xl border border-teal-200/50">
                <CheckCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Aceptar Solicitud</h3>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed mb-4">
              ¿Confirmas que deseas aceptar el contrato propuesto por <strong>{acceptConfirm.clientName}</strong> para atender a <strong>{acceptConfirm.patient_name}</strong>?
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4 text-xs text-slate-600 space-y-1.5">
              <p><strong>Tipo de Cuidado:</strong> {acceptConfirm.service_type}</p>
              <p><strong>Jornadas Pactadas:</strong> {acceptConfirm.service_days.length} días</p>
              <p><strong>Honorarios Totales:</strong> S/ {Number(acceptConfirm.total_amount).toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAcceptConfirm(null)}
                className="flex-1 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleAccept(acceptConfirm)}
                disabled={processing}
                className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-bold py-2.5 rounded-xl cursor-pointer transition text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Sí, aceptar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL CONFIRMAR RECHAZAR SOLICITUD ─── */}
      {rejectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRejectConfirm(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-9 h-9 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl border border-rose-200/50">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Rechazar Solicitud</h3>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed mb-4">
              ¿Estás completamente seguro de que deseas rechazar la solicitud de <strong>{rejectConfirm.clientName}</strong>? Esto liberará la oferta al directorio de enfermeros.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRejectConfirm(null)}
                className="flex-1 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleReject(rejectConfirm)}
                disabled={processing}
                className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-355 text-white font-bold py-2.5 rounded-xl cursor-pointer transition text-xs shadow-sm"
              >
                Sí, rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DETALLES DEL CONTRATO (Screenshot 3 Style) ─── */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailModal(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-850">Detalle de la reserva</h3>
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Datos del Cliente Section */}
            <div className="mb-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Datos del Cliente</p>
              <div className="flex items-start justify-between bg-slate-50/50 border border-slate-100 rounded-xl p-3.5">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">{detailModal.clientName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Paciente: {detailModal.patient_name}, {detailModal.patient_age} años</p>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/50">
                  Plan {detailModal.clientPlan}
                </span>
              </div>
            </div>

            {/* Servicio Section */}
            <div className="mb-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Servicio</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5 text-xs text-slate-705">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-teal-500" />
                    <span>Tipo</span>
                  </span>
                  <span className="font-bold text-slate-800">{detailModal.service_type}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/55 pt-2.5">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-teal-500" />
                    <span>Ubicación</span>
                  </span>
                  <span className="font-bold text-slate-800 text-right max-w-[65%]">{detailModal.address}, {detailModal.district}, Lima</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/55 pt-2.5">
                  <span className="text-slate-400">Monto total</span>
                  <span className="font-extrabold text-slate-800">S/ {Number(detailModal.total_amount).toLocaleString()}</span>
                </div>
                {detailModal.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-white p-2.5 rounded-lg border border-slate-200/30 leading-relaxed mt-2.5">
                    {detailModal.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Jornadas Programadas Section */}
            <div className="mb-5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Jornadas Programadas</p>
              <div className="space-y-2">
                {detailModal.service_days.map((d, i) => (
                  <div
                    key={d.id}
                    className={`p-3.5 rounded-xl border transition ${
                      d.status === "active"
                        ? "border-teal-200 bg-teal-50/10"
                        : "border-slate-100 bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">
                        Jornada {i + 1}: {formatDateShort(d.day_date)}
                      </span>
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          d.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-250/30"
                            : d.status === "active"
                            ? "bg-teal-50 text-teal-700 border border-teal-200/50"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {d.status === "completed" ? "Completado" : d.status === "active" ? "Activo" : "Programado"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-450 flex items-center gap-1.5 mt-1">
                      <Clock className="h-3.5 w-3.5 text-slate-350 shrink-0" />
                      <span>{formatHour(d.start_hour)} - {formatHour(d.end_hour)}</span>
                    </p>
                    
                    {d.real_start && (
                      <p className="text-xs text-teal-600 font-semibold mt-1">
                        Inicio real {d.real_start}
                      </p>
                    )}
                    {d.real_end && (
                      <p className="text-xs text-teal-600 font-semibold">
                        Fin real {d.real_end}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custody Info Box */}
            <div className="bg-amber-50 border-amber-250/30 rounded-xl p-3.5 mb-5 flex items-start gap-2 text-[11px] text-amber-800 leading-normal font-medium">
              <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p>El pago de S/ {Number(detailModal.total_amount).toLocaleString()} está en custodia segura. Se liberará al completar todas las jornadas.</p>
            </div>

            <button
              type="button"
              onClick={() => setDetailModal(null)}
              className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-655 font-bold py-3 rounded-xl cursor-pointer text-xs transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL PARA INGRESAR EL PIN DE INICIO ─── */}
      {pinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setPinModal(null); setPinInput(""); setPinError(""); }}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-800">Iniciar Jornada Asistencial</h3>
            <p className="text-xs text-slate-400 mt-1">
              Jornada programada para el {pinModal.service.service_days[pinModal.dayIndex] ? formatDateShort(pinModal.service.service_days[pinModal.dayIndex].day_date) : ""} · {formatHour(pinModal.service.service_days[pinModal.dayIndex]?.start_hour || 8)} a {formatHour(pinModal.service.service_days[pinModal.dayIndex]?.end_hour || 14)}
            </p>

            <div className="bg-teal-50 border-teal-150 rounded-xl p-3.5 my-4">
              <p className="text-[11px] text-teal-700 text-center leading-relaxed font-semibold">
                Ingresa el PIN de seguridad alfanumérico que el paciente/cliente visualiza en su aplicación para firmar tu asistencia de entrada.
              </p>
            </div>

            <input
              type="text"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.toUpperCase());
                setPinError("");
              }}
              placeholder="CÓDIGO PIN"
              maxLength={6}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-xl font-black tracking-[0.25em] text-slate-800 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/50 mb-2 uppercase"
            />
            
            {pinError && <p className="text-xs text-rose-500 text-center font-semibold mb-3">{pinError}</p>}
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center text-[10px] text-slate-400 mb-4">
              * Para simular escribe: <strong className="text-slate-600 font-bold">{pinModal.service.pin_code || "PIN123"}</strong>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setPinModal(null); setPinInput(""); setPinError(""); }}
                className="flex-1 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleStartJourney}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl cursor-pointer text-xs shadow-sm transition"
              >
                Confirmar PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PANEL DETALLE JORNADA EN CURSO (Screenshot 2 Style) ─── */}
      {activeJourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveJourney(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Servicio en curso</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeJourney.service.clientName} - {activeJourney.service.patient_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveJourney(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition cursor-pointer flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {(() => {
              const day = activeJourney.service.service_days[activeJourney.dayIndex];
              if (!day) return null;
              return (
                <div className="space-y-4">
                  {/* Hours Grid */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="border-r border-slate-200/50 pr-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hora programada</p>
                        <p className="text-xs font-extrabold text-slate-700 mt-1">
                          {formatHour(day.start_hour)} - {formatHour(day.end_hour)}
                        </p>
                      </div>
                      <div className="pl-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Inicio real</p>
                        <p className="text-xs font-extrabold text-teal-600 mt-1">
                          {day.real_start || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evidencia Fotográfica Box */}
                  <div>
                    <label className="text-xs font-bold text-slate-650 block mb-1.5">
                      Evidencia fotográfica
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/30">
                      <div className="w-10 h-10 bg-slate-100 border border-slate-200/50 rounded-xl flex items-center justify-center text-slate-400 mb-2">
                        <Camera className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Tomar foto o subir imagen</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG hasta 10MB</p>
                    </div>
                  </div>

                  {/* Evidencia del servicio Textarea */}
                  <div>
                    <label className="text-xs font-bold text-slate-650 block mb-1.5">
                      Comentarios finales o novedades del cierre (opcional)
                    </label>
                    <textarea
                      value={endNotes}
                      onChange={(e) => setEndNotes(e.target.value)}
                      placeholder="Describe las actividades realizadas durante esta jornada..."
                      rows={4}
                      maxLength={500}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-slate-50/30 resize-none transition"
                    />
                    <p className="text-[10px] text-slate-450 text-right mt-1">
                      {endNotes.length}/500
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEndModal({ service: activeJourney.service, dayIndex: activeJourney.dayIndex })}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition cursor-pointer text-xs shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      Finalizar servicio
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        showToast("Servicio reportado administrativamente para revisión.", "error");
                        setActiveJourney(null);
                      }}
                      className="w-full border border-slate-200 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-50 transition cursor-pointer text-xs flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                      Reportar servicio
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ─── MODAL CONFIRMAR SALIDA / FINALIZAR JORNADA ─── */}
      {endModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setEndModal(null); setEndNotes(""); }}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-800">Finalizar Jornada</h3>
            <p className="text-xs text-slate-400 leading-normal mt-1 mb-4">
              ¿Estás listo para registrar tu hora de salida y guardar el reporte de cuidados realizado hoy?
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-4 text-xs text-slate-600 space-y-1.5">
              <p><strong>Paciente:</strong> {endModal.service.patient_name}</p>
              <p><strong>Fecha:</strong> {endModal.service.service_days[endModal.dayIndex] ? formatDateShort(endModal.service.service_days[endModal.dayIndex].day_date) : "—"}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setEndModal(null); setEndNotes(""); }}
                className="flex-1 border border-slate-200 text-slate-500 font-bold py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEndJourney}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl cursor-pointer text-xs shadow-sm transition"
              >
                Sí, Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICACIONES FLOTANTES (LOCAL) ─── */}
      {toast && toast.show && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full shrink-0 ${
              toast.type === "success"
                ? "bg-emerald-500"
                : toast.type === "error"
                ? "bg-rose-500"
                : "bg-teal-500"
            }`}
          >
            <Check className="text-white h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold">{toast.type === "success" ? "Éxito" : "Información"}</p>
            <p className="text-[11px] text-slate-350 leading-tight mt-0.5">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
