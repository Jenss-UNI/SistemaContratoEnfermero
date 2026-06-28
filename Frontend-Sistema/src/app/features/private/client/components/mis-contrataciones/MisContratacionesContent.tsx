import { Search, Loader2, Calendar, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../core/contexts/AuthContext";
import { fetchClientHirings, cancelHiring, fetchHiringDays } from "../../services/hiring.service";
import type {
  Contratacion,
  ContratacionEstado,
  ContratacionFiltro,
} from "../../../../../core/models/hiring.model";
import {
  ContratacionCard,
  ContratacionDetailModal,
  ContratacionStats,
} from "../../../../../shared/components/client/mis-contrataciones";
import { CLIENT_PANEL_BASE } from "../../clientNav";

function matchesSearch(c: Contratacion, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const text = `${c.profesionalNombre} ${c.paciente} ${c.codigo} ${c.codigoServicio ?? ""} ${c.codigoContrato ?? ""}`;
  return text.toLowerCase().includes(q);
}

function countByEstado(items: Contratacion[], estado: ContratacionEstado): number {
  return items.filter((item) => item.estado === estado).length;
}

const FILTROS: { id: ContratacionFiltro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Pendientes" },
  { id: "firma_requerida", label: "Firma Requerida" },
  { id: "confirmado", label: "Confirmados" },
  { id: "en_curso", label: "En Curso" },
  { id: "completado", label: "Completados" },
];

export default function MisContratacionesContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contrataciones, setContrataciones] = useState<Contratacion[]>([]);
  const [filtro, setFiltro] = useState<ContratacionFiltro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [detalleModal, setDetalleModal] = useState<Contratacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [jornadasModal, setJornadasModal] = useState<Contratacion | null>(null);
  const [jornadasLoading, setJornadasLoading] = useState(false);
  const [jornadasList, setJornadasList] = useState<{ fecha: string; horario: string; estado: string }[]>([]);

  const handleVerJornadas = async (c: Contratacion) => {
    setJornadasModal(c);
    setJornadasLoading(true);
    setJornadasList([]);
    try {
      const days = await fetchHiringDays(Number(c.id));
      setJornadasList(days);
    } catch (err) {
      console.error("Error fetching hiring days:", err);
    } finally {
      setJornadasLoading(false);
    }
  };

  const loadData = () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchClientHirings(user.id)
      .then((data) => {
        setContrataciones(data);
      })
      .catch((err) => {
        console.error("Error loading client bookings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  // Refrescar automáticamente cuando el usuario vuelve a esta pestaña/ventana
  // (por ejemplo, después de haber confirmado una reserva en otra ruta)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) loadData();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.id]);

  const filtradas = useMemo(() => {
    return contrataciones.filter((c) => {
      if (filtro !== "todos" && c.estado !== filtro) return false;
      return matchesSearch(c, busqueda);
    });
  }, [contrataciones, filtro, busqueda]);

  const stats = useMemo(() => {
    const activos = countByEstado(contrataciones, "en_curso");
    const enCustodia = contrataciones
      .filter((c) => c.pagoEstado === "preautorizado")
      .reduce((sum, c) => sum + c.montoTotal, 0);
    const invertido = contrataciones
      .filter((c) => c.estado === "completado")
      .reduce((sum, c) => sum + c.montoTotal, 0);
    return {
      total: contrataciones.length,
      activos,
      enCustodia,
      invertido,
    };
  }, [contrataciones]);

  const conteos = useMemo(
    () => ({
      todos: contrataciones.length,
      pendiente: countByEstado(contrataciones, "pendiente"),
      firma_requerida: countByEstado(contrataciones, "firma_requerida"),
      confirmado: countByEstado(contrataciones, "confirmado"),
      en_curso: countByEstado(contrataciones, "en_curso"),
      completado: countByEstado(contrataciones, "completado"),
    }),
    [contrataciones]
  );

  const handleCancelar = async (c: Contratacion) => {
    if (!window.confirm(`¿Seguro que deseas cancelar la solicitud ${c.codigo}?`)) return;
    try {
      await cancelHiring(Number(c.id));
      alert("Contratación cancelada correctamente.");
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(`Error al cancelar: ${err.message}`);
    }
  };

  const handleFirmar = (c: Contratacion) => {
    navigate(`${CLIENT_PANEL_BASE}/mis-contrataciones/contrato/${c.id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Cargando contrataciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Mis Contrataciones</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona tus solicitudes, contratos activos y servicios completados
        </p>
      </div>

      <ContratacionStats
        totalContratos={stats.total}
        activos={stats.activos}
        enCustodia={stats.enCustodia}
        totalInvertido={stats.invertido}
      />

      <p className="flex items-center gap-2 text-sm text-teal-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        Notificaciones en tiempo real activas
      </p>

      <div className="space-y-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por enfermero, paciente, código..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTROS.map(({ id, label }) => {
              const count = id === "todos" ? conteos.todos : conteos[id];
              const active = filtro === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFiltro(id)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-slate-600">No hay contrataciones con estos filtros.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtradas.map((c) => (
            <ContratacionCard
              key={c.id}
              contratacion={c}
              onVerDetalle={() => setDetalleModal(c)}
              onCancelar={() => handleCancelar(c)}
              onFirmarContrato={() => handleFirmar(c)}
              onVerJornadas={() => handleVerJornadas(c)}
              onVerContrato={() => handleFirmar(c)}
            />
          ))}
        </div>
      )}

      {detalleModal && (
        <ContratacionDetailModal
          contratacion={detalleModal}
          onClose={() => setDetalleModal(null)}
        />
      )}

      {jornadasModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 w-full max-w-lg relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setJornadasModal(null)}
              className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Jornadas Programadas</h3>
                <p className="text-xs text-slate-500 mt-0.5">Contrato: {jornadasModal.codigo}</p>
              </div>
            </div>

            {jornadasLoading ? (
              <div className="flex flex-col justify-center items-center py-12 gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                <p className="text-xs text-slate-400 font-medium">Cargando jornadas...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {jornadasList.map((j, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${j.estado === "completada" ? "bg-emerald-500" : j.estado === "activa" ? "bg-teal-500" : "bg-slate-300"}`}></span>
                      {j.fecha}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-medium">{j.horario}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide ${
                        j.estado === "completada" ? "bg-emerald-100 text-emerald-700" :
                        j.estado === "activa" ? "bg-teal-100 text-teal-700" :
                        j.estado === "cancelada" ? "bg-rose-100 text-rose-700" :
                        "bg-slate-200 text-slate-650"
                      }`}>
                        {j.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
