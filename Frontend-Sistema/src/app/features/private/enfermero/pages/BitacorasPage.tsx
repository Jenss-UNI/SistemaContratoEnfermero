import { useState } from "react";
import {
  FileText,
  Send,
  UserRound,
  ClipboardCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

interface Bitacora {
  id: number;
  paciente: string;
  servicio: string;
  fecha: string;
  estado: string;
  resumen: string;
  actividades: string[];
  observaciones: string;
  recomendaciones: string;
}

const mockBitacoras: Bitacora[] = [
  {
    id: 1,
    paciente: "Roberto Pasco",
    servicio: "Especializado",
    fecha: "18 may. 2026",
    estado: "Enviada",
    resumen: "medida de presión · toma de medicamentos",
    actividades: [
      "Medición de presión",
      "Toma de signos vitales",
      "Administración de medicamentos",
    ],
    observaciones:
      "Paciente estable. Presión arterial dentro de parámetros normales.",
    recomendaciones:
      "Mantener hidratación y continuar tratamiento indicado.",
  },
  {
    id: 2,
    paciente: "Carmen Mendoza",
    servicio: "Asistencial",
    fecha: "10 jun. 2026",
    estado: "Sin estado",
    resumen:
      "Evaluación cognitiva inicial · Establecimiento de rutina · Administración de Donepezilo",
    actividades: [
      "Evaluación cognitiva inicial",
      "Establecimiento de rutina",
      "Administración de Donepezilo",
    ],
    observaciones:
      "Paciente orientada en tiempo y espacio por momentos. Responde bien a estímulos visuales.",
    recomendaciones:
      "Establecer rutina diaria con horarios fijos. Usar recordatorios visuales.",
  },
  {
    id: 3,
    paciente: "Carmen Mendoza",
    servicio: "Asistencial",
    fecha: "11 jun. 2026",
    estado: "Sin estado",
    resumen:
      "Actividades cognitivas · Control de signos vitales · Acompañamiento en comidas",
    actividades: [
      "Control de signos vitales",
      "Estimulación cognitiva",
      "Acompañamiento alimentario",
    ],
    observaciones: "Participación adecuada en actividades programadas.",
    recomendaciones: "Continuar ejercicios cognitivos diariamente.",
  },
];

export default function BitacorasPage() {

  const [view, setView] = useState<
    "lista" | "patients" | "services" | "days" | "form"
  >("lista");

  const [selectedBitacora, setSelectedBitacora] =
    useState<Bitacora | null>(null);

  const [photos, setPhotos] = useState<File[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [status, setStatus] = useState("Pendiente");

  const [showSuccess, setShowSuccess] = useState(false);

  const [activities, setActivities] = useState([
    { id: 1, text: "" },
  ]);

  const handleSave = () => {

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);

      setView("lista");

      setSelectedPatient("");
      setSelectedService("");
      setSelectedDay("");

    }, 2000);
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    setPhotos([
      ...photos,
      ...Array.from(e.target.files),
    ]);
  };

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        id: Date.now(),
        text: "",
      },
    ]);
  };

  const removeActivity = (id: number) => {
    if (activities.length === 1) return;

    setActivities(
      activities.filter((activity) => activity.id !== id)
    );
  };

  const updateActivity = (
    id: number,
    value: string
  ) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id
          ? { ...activity, text: value }
          : activity
      )
    );
  };



  const itemsPerPage = 5;

  const totalPages = Math.ceil(
    mockBitacoras.length / itemsPerPage
  );

  const paginatedBitacoras = mockBitacoras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  return (
    <>
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <StatCard
            icon={<FileText size={18} />}
            value="8"
            label="Total bitácoras"
          />

          <StatCard
            icon={<Send size={18} />}
            value="1"
            label="Enviadas"
          />

          <StatCard
            icon={<UserRound size={18} />}
            value="3"
            label="Pacientes"
          />

          <StatCard
            icon={<ClipboardCheck size={18} />}
            value="1"
            label="Servicios activos"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">

          <h2 className="text-sm font-semibold text-teal-600">
            Bitácoras
          </h2>

          <button
            onClick={() => setView("patients")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Nueva bitácora
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-3">

          {view === "lista" && (
            <>
              {paginatedBitacoras.map((bitacora) => (
                <div
                  key={bitacora.id}
                  className="bg-white border border-slate-100 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between">

                    <div className="flex gap-3">

                      <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-semibold">
                        {bitacora.paciente
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {bitacora.paciente}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {bitacora.servicio} · {bitacora.fecha}
                        </p>

                        <p className="text-xs text-slate-600 mt-2">
                          {bitacora.resumen}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`text-[11px] px-3 py-1 rounded-full ${bitacora.estado === "Enviada"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {bitacora.estado}
                    </span>

                  </div>

                  <button
                    onClick={() => setSelectedBitacora(bitacora)}
                    className="mt-4 w-full rounded-lg bg-slate-50 hover:bg-slate-100 py-2 text-sm text-slate-700 transition"
                  >
                    Ver detalle
                  </button>
                </div>
              ))}
            </>
          )}

          {view === "patients" && (
            <div className="space-y-5">

              <div className="flex items-center gap-2 text-sm">

                <button
                  onClick={() => setView("lista")}
                  className="text-slate-500 hover:text-teal-600"
                >
                  Bitácoras
                </button>

                <span>›</span>

                <span className="font-semibold text-teal-600">
                  Pacientes
                </span>

              </div>

              <div className="flex justify-between items-center">

                <div>
                  <h2 className="text-xl font-bold">
                    Selecciona un paciente
                  </h2>

                  <p className="text-sm text-slate-500">
                    Elige un paciente para continuar.
                  </p>
                </div>

                <input
                  placeholder="Buscar paciente..."
                  className="border rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                {[
                  {
                    nombre: "Carmen Mendoza",
                    iniciales: "CM",
                    servicios: 1,
                  },
                  {
                    nombre: "Roberto Pasco",
                    iniciales: "RP",
                    servicios: 1,
                  },
                ].map((p) => (
                  <div
                    key={p.nombre}
                    className="bg-white border border-slate-100 rounded-2xl p-5"
                  >
                    <div className="flex gap-3">

                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center font-semibold text-teal-700">
                        {p.iniciales}
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {p.nombre}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {p.servicios} servicio
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={() => {
                        setSelectedPatient(p.nombre);
                        setView("services");
                      }}
                      className="w-full mt-4 bg-teal-50 hover:bg-teal-100 py-2 rounded-lg text-sm"
                    >
                      Ver servicios
                    </button>
                  </div>
                ))}

              </div>
            </div>
          )}

          {view === "services" && (
            <div className="space-y-5">

              <div className="flex items-center gap-2 text-sm">

                <button
                  onClick={() => setView("lista")}
                  className="text-slate-500 hover:text-teal-600"
                >
                  Bitácoras
                </button>

                <span>›</span>

                <button
                  onClick={() => setView("patients")}
                  className="text-slate-500 hover:text-teal-600"
                >
                  Pacientes
                </button>

                <span>›</span>

                <span className="font-semibold text-teal-600">
                  Servicios
                </span>

              </div>

              <h2 className="text-xl font-bold">
                Servicios de {selectedPatient}
              </h2>

              <div className="bg-white border border-teal-200 rounded-2xl p-5">

                <div className="flex justify-between">

                  <div>

                    <span className="text-xs text-slate-400">
                      SRV-2026-0004
                    </span>

                    <h3 className="font-bold mt-2">
                      Asistencial
                    </h3>

                    <div className="mt-4 text-sm text-slate-500">
                      10 jornadas terminadas
                    </div>

                    <div className="text-sm text-teal-600">
                      3 bitácoras
                    </div>

                  </div>

                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full h-fit">
                    Activo
                  </span>

                </div>

                <button
                  onClick={() => {
                    setSelectedService("Asistencial");
                    setView("days");
                  }}
                  className="w-full mt-5 rounded-lg bg-teal-50 py-2 text-sm text-teal-700 transition-all hover:bg-teal-100 hover:text-teal-800 active:scale-[0.98]"
                >
                  Ver jornadas
                </button>

              </div>

            </div>
          )}

          {view === "days" && (
            <div className="space-y-5">

              <div className="flex items-center gap-2 text-sm">

                <button
                  onClick={() => setView("lista")}
                  className="text-slate-500 hover:text-teal-600"
                >
                  Bitácoras
                </button>

                <span>›</span>

                <button
                  onClick={() => setView("patients")}
                  className="text-slate-500 hover:text-teal-600"
                >
                  Pacientes
                </button>

                <span>›</span>

                <button
                  onClick={() => setView("services")}
                  className="text-slate-500 hover:text-teal-600"
                >
                  Servicios
                </button>

                <span>›</span>

                <span className="font-semibold text-teal-600">
                  Jornadas
                </span>

              </div>

              <h2 className="text-xl font-bold">
                Jornadas: {selectedPatient}
              </h2>

              {[
                "10 jun. 2026",
                "11 jun. 2026",
                "12 jun. 2026",
                "13 jun. 2026",
                "15 jun. 2026",
              ].map((fecha, index) => (
                <div
                  key={fecha}
                  className="bg-white border border-slate-100 rounded-2xl p-5"
                >
                  <div className="flex justify-between">

                    <div>

                      <h3 className="font-semibold">
                        {fecha}
                      </h3>

                      <p className="text-xs text-slate-500">
                        08:00 - 12:00
                      </p>

                    </div>

                    {index < 2 && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">
                        Sin estado
                      </span>
                    )}

                  </div>

                  <button
                    onClick={() => {
                      setSelectedDay(fecha);
                      setView("form");
                    }}
                    className={`w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${index < 2
                      ? "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100 hover:border-teal-200"
                      : "bg-teal-500 text-white border-teal-500 hover:bg-teal-600 hover:border-teal-600 shadow-sm hover:shadow-md"
                      }
  `}
                  >
                    {index < 2 ? "Ver / Editar" : "+ Crear bitácora"}
                  </button>

                </div>
              ))}

            </div>
          )}

          {view === "form" && (
            <div className="space-y-5">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-500">

                <button
                  onClick={() => setView("lista")}
                  className="hover:text-teal-600"
                >
                  Bitácoras
                </button>

                <span>›</span>

                <button
                  onClick={() => setView("patients")}
                  className="hover:text-teal-600"
                >
                  Pacientes
                </button>

                <span>›</span>

                <button
                  onClick={() => setView("services")}
                  className="hover:text-teal-600"
                >
                  Servicios
                </button>

                <span>›</span>

                <button
                  onClick={() => setView("days")}
                  className="hover:text-teal-600"
                >
                  Jornadas
                </button>

                <span>›</span>

                <span className="font-medium text-teal-600">
                  Bitácora
                </span>

              </div>

              {/* Header */}
              <div className="flex items-start gap-3">

                <button
                  onClick={() => setView("days")}
                  className="mt-1 text-slate-500 hover:text-teal-600"
                >
                  ←
                </button>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Nueva bitácora
                  </h2>

                  <p className="text-xs text-slate-400">
                    {selectedPatient} · {selectedDay} · SRV-2026-00001
                  </p>
                </div>

              </div>

              {/* Formulario */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6">

                {/* Datos */}
                <div className="bg-slate-50 rounded-2xl p-5 grid md:grid-cols-2 gap-6 mb-8">

                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Paciente
                    </p>

                    <p className="font-semibold text-slate-800">
                      {selectedPatient}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Tipo
                    </p>

                    <p className="font-semibold text-slate-800">
                      {selectedService}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Fecha
                    </p>

                    <p className="font-semibold text-slate-800">
                      {selectedDay}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Horario
                    </p>

                    <p className="font-semibold text-slate-800">
                      08:00 - 12:00
                    </p>
                  </div>

                </div>

                {/* Actividades */}
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
                  Actividades realizadas
                </h3>

                <div className="space-y-3">

                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3"
                    >

                      <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>

                      <input
                        type="text"
                        value={activity.text}
                        onChange={(e) =>
                          updateActivity(
                            activity.id,
                            e.target.value
                          )
                        }
                        placeholder="Describe la actividad"
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-300"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeActivity(activity.id)
                        }
                        disabled={activities.length === 1}
                        className="text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  ))}

                </div>

                <button
                  type="button"
                  onClick={addActivity}
                  className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  + Agregar actividad
                </button>

                {/* Observaciones */}
                <div className="mt-8">

                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
                    Observaciones
                  </h3>

                  <textarea
                    rows={4}
                    placeholder="Observaciones clínicas sobre el paciente..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-teal-300"
                  />

                </div>

                {/* Recomendaciones */}
                <div className="mt-8">

                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
                    Recomendaciones
                  </h3>

                  <textarea
                    rows={4}
                    placeholder="Recomendaciones para el paciente o familia..."
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-teal-300"
                  />

                </div>

                {/* Fotos */}
                <div className="mt-8">

                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
                    Fotos
                  </h3>

                  <label className="inline-flex items-center gap-2 border border-dashed border-slate-300 rounded-xl px-5 py-3 text-sm cursor-pointer hover:bg-slate-50">

                    📷 Agregar foto

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                  </label>

                  {photos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">

                      {photos.map((photo, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 bg-slate-100 rounded-lg text-xs"
                        >
                          {photo.name}
                        </div>
                      ))}

                    </div>
                  )}

                </div>

                {/* Estado */}
                <div className="mt-8">

                  <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
                    Estado
                  </h3>

                  <div className="grid grid-cols-3 bg-slate-100 rounded-xl p-1">

                    {["Borrador", "Pendiente", "Enviar al cliente"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setStatus(item)}
                          className={`py-3 rounded-lg text-sm transition ${status === item
                            ? "bg-white shadow font-semibold text-slate-800"
                            : "text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* Botones */}
                <div className="grid md:grid-cols-2 gap-4 mt-8">

                  <button
                    onClick={() => {
                      setSelectedPatient("");
                      setSelectedService("");
                      setSelectedDay("");
                      setActivities([{ id: 1, text: "" }]);
                      setPhotos([]);
                      setStatus("Pendiente");
                      setView("lista");
                    }}
                    className="border border-slate-200 rounded-xl py-3 text-sm font-medium hover:bg-slate-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-3 text-sm font-medium"
                  >
                    Guardar bitácora
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Paginación */}
        {view === "lista" && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-2">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-8 w-8 rounded-lg ${currentPage === i + 1
                  ? "bg-teal-500 text-white"
                  : "border border-slate-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>

          </div>
        )}
      </div>

      {/* Modal */}
      {selectedBitacora && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-2xl font-bold text-slate-800">
                Detalle de Bitácora
              </h2>

              <button
                onClick={() => setSelectedBitacora(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-5">

              <div className="flex gap-3">

                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">
                  {selectedBitacora.paciente
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {selectedBitacora.paciente}
                  </p>

                  <p className="text-xs text-slate-500">
                    {selectedBitacora.servicio} · {selectedBitacora.fecha}
                  </p>
                </div>
              </div>

              <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                {selectedBitacora.estado}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">
              Actividades
            </h3>

            <div className="space-y-2 mb-5">

              {selectedBitacora.actividades.map((actividad, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <div className="h-5 w-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center">
                    {index + 1}
                  </div>

                  <span className="text-sm text-slate-700">
                    {actividad}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-3">

              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                Observaciones
              </h4>

              <p className="text-sm text-slate-700">
                {selectedBitacora.observaciones}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4">

              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                Recomendaciones
              </h4>

              <p className="text-sm text-slate-700">
                {selectedBitacora.recomendaciones}
              </p>
            </div>

            <button
              onClick={() => setSelectedBitacora(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 py-2 rounded-lg text-sm transition"
            >
              Cerrar
            </button>

          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50">

          <div className="bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg">

            ✅ Bitácora guardada correctamente

          </div>

        </div>
      )}
    </>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">

      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-3">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-slate-800">
        {value}
      </h3>

      <p className="text-xs text-slate-400">
        {label}
      </p>
    </div>
  );
}