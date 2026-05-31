import { useState } from "react";
import {
  Calendar,
  Camera,
  CheckCheck,
  CornerDownRight,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";

const MOCK_REPORTE = {
  id: "REP-001",
  titulo: "Enfermero llego tarde",
  estado: "Resuelto",
  severidad: "Alta",
  categoria: "Enfermero",
  profesional: "Carlos Sanchez Martinez",
  fecha: "22/5/2026",
  fechaHoraDetalle: "22 de mayo de 2026 a las 10:18 a. m.",
  descripcion: "LLego 30 min tarde sin justificacion",
  respuesta: "su reporte fue revisado",
  respondido: true,
};


function DetalleReporteModal({ reporte, onClose }: { reporte: any; onClose: () => void }) {
  if (!reporte) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-900">Detalle del Reporte</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Etiquetas */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {reporte.estado}
            </span>
            <span className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-500">
              {reporte.severidad}
            </span>
            <span className="text-sm text-slate-500">{reporte.categoria}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">{reporte.titulo}</h3>

          {/* Descripción */}
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="mb-1 text-xs font-semibold text-slate-500">Descripción</p>
            <p className="text-sm text-slate-700">{reporte.descripcion}</p>
          </div>

          {/* Enfermero y Fecha */}
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <UserRound className="h-4 w-4 text-teal-600" />
            <span>Enfermero: <span className="font-bold">{reporte.profesional}</span></span>
          </div>
          <p className="text-xs text-slate-400">{reporte.fechaHoraDetalle}</p>

          {/* Respuesta de la plataforma */}
          {reporte.respondido && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CornerDownRight className="h-4 w-4" />
                Respuesta de la plataforma
              </div>
              <p className="pl-6 text-sm text-emerald-800">{reporte.respuesta}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function NuevoReporteModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-900">Nuevo Reporte</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Servicio relacionado (opcional)</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Busca por código (SER-...), nombre del enfermero o paciente..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Título *</label>
            <input
              type="text"
              placeholder="Ej: Enfermero llegó tarde"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Categoría</label>
              <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                <option>Servicio</option>
                <option>Plataforma</option>
                <option>Pagos</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Severidad</label>
              <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción detallada *</label>
            <textarea
              rows={4}
              placeholder="Describe el incidente o problema en detalle..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            ></textarea>
            <div className="mt-1 text-right text-xs text-slate-400">0/500</div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Evidencia (opcional)</label>
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-6 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700">
              <Camera className="h-5 w-5" />
              Agregar imagen
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReportesPage() {
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  return (
     <div className="w-full space-y-8 min-h-[70vh] pb-12">
      
  
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mis Reportes</h1>
          <p className="text-sm text-slate-500">Reporta problemas o incidentes con tus servicios</p>
        </div>
        <button
          onClick={() => setIsNewReportOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Nuevo Reporte
        </button>
      </div>

      
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#f2fdfa] p-6 shadow-sm border border-[#ccfbf1]/50">
          <p className="text-sm font-medium text-slate-500">Abiertos</p>
          <p className="mt-2 text-3xl font-bold text-[#0db39e]">0</p>
        </div>
        <div className="rounded-2xl bg-[#fffcf0] p-6 shadow-sm border border-[#fef3c7]/50">
          <p className="text-sm font-medium text-slate-500">En revisión</p>
          <p className="mt-2 text-3xl font-bold text-[#f59e0b]">0</p>
        </div>
        <div className="rounded-2xl bg-[#f0fdf4] p-6 shadow-sm border border-[#dcfce7]/50">
          <p className="text-sm font-medium text-slate-500">Resueltos</p>
          <p className="mt-2 text-3xl font-bold text-[#10b981]">1</p>
        </div>
      </div>

   
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar reporte..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <select className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:w-48">
          <option>Todos los estados</option>
          <option>Abierto</option>
          <option>En revisión</option>
          <option>Resuelto</option>
        </select>
      </div>

  
      <div className="space-y-4">
       
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-bold text-slate-900">{MOCK_REPORTE.titulo}</h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {MOCK_REPORTE.estado}
              </span>
              <span className="rounded-full border border-rose-200 px-2.5 py-0.5 text-xs font-semibold text-rose-500">
                {MOCK_REPORTE.severidad}
              </span>
            </div>

            <p className="text-sm text-slate-500">
              <span className="font-semibold">{MOCK_REPORTE.categoria}</span> · {MOCK_REPORTE.profesional}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="h-4 w-4" />
                {MOCK_REPORTE.fecha}
              </span>
              {MOCK_REPORTE.respondido && (
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                  <CheckCheck className="h-4 w-4" />
                  Respondido
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedReport(MOCK_REPORTE)}
            className="w-full rounded-xl border border-teal-200 px-5 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50 sm:w-auto"
          >
            Ver detalle
          </button>
        </div>
      </div>

      {isNewReportOpen && (
        <NuevoReporteModal onClose={() => setIsNewReportOpen(false)} />
      )}
      
      {selectedReport && (
        <DetalleReporteModal 
          reporte={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}

    </div>
  );
}