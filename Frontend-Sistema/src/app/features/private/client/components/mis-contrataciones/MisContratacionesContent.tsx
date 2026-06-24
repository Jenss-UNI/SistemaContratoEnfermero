import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { MOCK_CONTRATACIONES } from "../../data/mockContrataciones";

const FILTROS: { id: ContratacionFiltro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Pendientes" },
  { id: "confirmado", label: "Confirmados" },
  { id: "activo", label: "Activos" },
  { id: "completado", label: "Completados" },
];

function matchesSearch(c: Contratacion, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const text = `${c.profesionalNombre} ${c.paciente} ${c.codigo} ${c.codigoServicio ?? ""} ${c.codigoContrato ?? ""}`;
  return text.toLowerCase().includes(q);
}

function countByEstado(items: Contratacion[], estado: ContratacionEstado): number {
  return items.filter((c) => c.estado === estado).length;
}

export default function MisContratacionesContent() {
  const navigate = useNavigate();
  const [contrataciones, setContrataciones] = useState(MOCK_CONTRATACIONES);
  const [filtro, setFiltro] = useState<ContratacionFiltro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [detalleModal, setDetalleModal] = useState<Contratacion | null>(null);

  const filtradas = useMemo(() => {
    return contrataciones.filter((c) => {
      if (filtro !== "todos" && c.estado !== filtro) return false;
      return matchesSearch(c, busqueda);
    });
  }, [contrataciones, filtro, busqueda]);

  const stats = useMemo(() => {
    const activos = countByEstado(contrataciones, "activo");
    const enCustodia = contrataciones
      .filter((c) => c.pagoEstado === "preautorizado")
      .reduce((sum, c) => sum + c.montoTotal, 0);
    const invertido = contrataciones
      .filter((c) => c.estado === "completado")
      .reduce((sum, c) => sum + c.montoTotal, 0);
    return { total: contrataciones.length, activos, enCustodia, invertido };
  }, [contrataciones]);

  const conteos = useMemo(
    () => ({
      todos: contrataciones.length,
      pendiente: countByEstado(contrataciones, "pendiente"),
      confirmado: countByEstado(contrataciones, "confirmado"),
      activo: countByEstado(contrataciones, "activo"),
      completado: countByEstado(contrataciones, "completado"),
    }),
    [contrataciones]
  );

  const handleCancelar = (c: Contratacion) => {
    if (!window.confirm(`¿Cancelar la solicitud ${c.codigo}?`)) return;
    setContrataciones((prev) => prev.filter((x) => x.id !== c.id));
  };

  const handleFirmar = (c: Contratacion) => {
    navigate(`${CLIENT_PANEL_BASE}/mis-contrataciones/contrato/${c.id}`);
  };

  return (
    <div className="space-y-6">
   

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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Buscador */}
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

        {/* Filtros con badge numérico separado */}
        <div className="flex flex-wrap gap-2">
          {FILTROS.map(({ id, label }) => {
            const count = id === "todos" ? conteos.todos : conteos[id];
            const active = filtro === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFiltro(id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                    active
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
              onVerJornadas={() =>
                window.alert("Ver jornadas — disponible próximamente.")
              }
              onVerContrato={() =>
                window.alert("Ver contrato — disponible próximamente.")
              }
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
    </div>
  );
}