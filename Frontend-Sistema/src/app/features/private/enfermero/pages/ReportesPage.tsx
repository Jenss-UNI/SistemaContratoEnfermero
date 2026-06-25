import { useState, useMemo } from 'react';

type IncidentStatus = 'abierto' | 'en_revision' | 'resuelto';
type IncidentSeverity = 'baja' | 'media' | 'alta';

interface ServiceOption {
  id: number;
  patient_name: string;
  service_type: string;
  service_code?: string;
  contract_code?: string;
  clientName?: string;
}

interface IncidentRow {
  id: number;
  service_id: number | null;
  title: string;
  description: string;
  category: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  response: string | null;
  created_at: string;
  patientName?: string;
  evidence_urls?: string[];
}

const MOCK_REPORTS: IncidentRow[] = [
  {
    id: 1,
    service_id: null,
    title: 'jghbvd',
    description: 'Descripción de prueba del incidente reportado.',
    category: 'condiciones',
    severity: 'alta',
    status: 'abierto',
    response: null,
    created_at: '2026-06-20T23:18:00',
    patientName: '',
    evidence_urls: [],
  },
];

const MOCK_SERVICES: ServiceOption[] = [
  {
    id: 101,
    patient_name: 'Roberto Pasco',
    service_type: 'Enfermería',
    service_code: 'SER-001',
    clientName: 'Carlos Mendez',
  },
];

const STATUS_CONFIG: Record<IncidentStatus, { label: string; bg: string; text: string; icon: string }> = {
  abierto: { label: 'Abierto', bg: 'bg-[#ffe4e6]', text: 'text-rose-700', icon: 'ri-time-line' },
  en_revision: { label: 'En revisión', bg: 'bg-[#fef3c7]', text: 'text-amber-700', icon: 'ri-search-eye-line' },
  resuelto: { label: 'Resuelto', bg: 'bg-[#d1fae5]', text: 'text-emerald-700', icon: 'ri-check-double-line' },
};

const SEVERITY_CONFIG: Record<IncidentSeverity, { label: string; dot: string; text: string }> = {
  baja: { label: 'Baja', dot: 'bg-sky-400', text: 'text-gray-700' },
  media: { label: 'Media', dot: 'bg-amber-400', text: 'text-gray-700' },
  alta: { label: 'Alta', dot: 'bg-rose-500', text: 'text-gray-700' },
};

const CATEGORY_LABELS: Record<string, string> = {
  comportamiento: 'Comportamiento del cliente',
  condiciones: 'Condiciones del domicilio',
  seguridad: 'Seguridad',
  salud: 'Salud del paciente',
  pago: 'Pago / Remuneración',
  otro: 'Otro',
};

const ITEMS_PER_PAGE = 5;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const datePart = d.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('es-PE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} a las ${timePart.toLowerCase()}`;
}

export default function IncidentReports() {
  const [reports, setReports] = useState<IncidentRow[]>(MOCK_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailReport, setDetailReport] = useState<IncidentRow | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string } | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSeverity, setFormSeverity] = useState<IncidentSeverity>('media');
  const [formCategory, setFormCategory] = useState('comportamiento');
  const [formServiceSearch, setFormServiceSearch] = useState('');
  const [formSelectedService, setFormSelectedService] = useState<ServiceOption | null>(null);
  const [formEvidenceUrls, setFormEvidenceUrls] = useState<string[]>([]);
  const [showServiceResults, setShowServiceResults] = useState(false);

  const filteredServiceResults = useMemo(() => {
    if (!formServiceSearch.trim()) return [];
    const q = formServiceSearch.toLowerCase();
    return MOCK_SERVICES.filter(
      (s) =>
        (s.service_code || '').toLowerCase().includes(q) ||
        (s.contract_code || '').toLowerCase().includes(q) ||
        (s.clientName || '').toLowerCase().includes(q) ||
        (s.patient_name || '').toLowerCase().includes(q),
    ).slice(0, 6);
  }, [formServiceSearch]);

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormSeverity('media');
    setFormCategory('comportamiento');
    setFormServiceSearch('');
    setFormSelectedService(null);
    setFormEvidenceUrls([]);
    setShowServiceResults(false);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const titleTrimmed = formTitle.trim();

    // Verificar si ya existe un reporte con el mismo título y descripción
    const duplicateExists = reports.some(
      (r) => r.title === titleTrimmed && r.description === formDescription
    );

    if (duplicateExists) {
      showToast('Ya existe un reporte con el mismo título e información', 'error');
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const newReport: IncidentRow = {
        id: Date.now(),
        service_id: formSelectedService?.id || null,
        title: titleTrimmed,
        description: formDescription,
        category: formCategory,
        severity: formSeverity,
        status: 'abierto',
        response: null,
        created_at: new Date().toISOString(),
        patientName: formSelectedService?.patient_name,
        evidence_urls: formEvidenceUrls,
      };

      setReports([newReport, ...reports]);
      setSaving(false);
      showToast('Reporte enviado correctamente', 'success');
      setCreateModal(false);
      resetForm();
    }, 600);
  };

  const filtered = useMemo(() => {
    let result = [...reports];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.patientName || '').toLowerCase().includes(q),
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter((r) => r.status === filterStatus);
    }
    return result;
  }, [reports, searchQuery, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const openCount = reports.filter((r) => r.status === 'abierto').length;
  const reviewCount = reports.filter((r) => r.status === 'en_revision').length;
  const resolvedCount = reports.filter((r) => r.status === 'resuelto').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-[#fff1f2] rounded-xl flex-shrink-0">
              <i className="ri-alert-line text-rose-500 text-3xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Reportes de Incidentes</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Reporta problemas durante tus servicios
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCreateModal(true);
              resetForm();
            }}
            className="inline-flex items-center gap-2 bg-[#f43f5e] hover:bg-rose-600 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 shadow-sm"
          >
            <i className="ri-add-line text-sm"></i>Nuevo reporte
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: 'Abiertos',
              value: openCount,
              icon: 'ri-error-warning-line',
              bg: 'bg-[#fff1f2]',
              border: 'border-rose-100',
              color: 'text-rose-600',
            },
            {
              label: 'En revisión',
              value: reviewCount,
              icon: 'ri-time-line',
              bg: 'bg-[#fefce8]',
              border: 'border-amber-100',
              color: 'text-amber-600',
            },
            {
              label: 'Resueltos',
              value: resolvedCount,
              icon: 'ri-check-double-line',
              bg: 'bg-[#f0fdf4]',
              border: 'border-green-100',
              color: 'text-teal-600',
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} ${s.border} rounded-lg p-4 border flex items-center gap-3`}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg flex-shrink-0 shadow-sm">
                <i className={`${s.icon} ${s.color} text-xl`}></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por título o paciente..."
              className="w-full border-none pl-11 pr-4 py-1.5 text-xs focus:outline-none bg-transparent placeholder:text-gray-400 text-gray-800"
            />
          </div>
          <div className="h-9 w-px bg-gray-200 hidden sm:block"></div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as IncidentStatus | 'all');
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100"
          >
            <option value="all">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en_revision">En revisión</option>
            <option value="resuelto">Resuelto</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-2xl mx-auto mb-3">
              <i className="ri-shield-check-line text-gray-400 text-2xl"></i>
            </div>
            <p className="font-bold text-gray-900 text-lg mb-1">No hay reportes</p>
            <p className="text-sm text-gray-500">
              {filterStatus !== 'all'
                ? 'No tienes reportes en este estado'
                : 'No has creado ningún reporte de incidente aún'}
            </p>
          </div>
        ) : (
          paginated.map((r) => {
            const st = STATUS_CONFIG[r.status];
            const sev = SEVERITY_CONFIG[r.severity];
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-teal-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}
                  >
                    <i className={`${st.icon} text-sm`}></i>
                    {st.label}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${sev.text}`}>
                    <span className={`w-2 h-2 rounded-full ${sev.dot}`}></span>
                    {sev.label}
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                    {CATEGORY_LABELS[r.category] || r.category}
                  </span>
                </div>

                <h4 className="text-base font-bold text-gray-900 mb-2">{r.title}</h4>

                {r.patientName && (
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                    <i className="ri-user-heart-line text-rose-400 text-base"></i>
                    {r.patientName}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 mt-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                    <i className="ri-calendar-line text-sm"></i>
                    {formatDate(r.created_at)}
                  </span>
                  <button
                    onClick={() => setDetailReport(r)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 cursor-pointer whitespace-nowrap transition-colors"
                  >
                    Ver detalle <i className="ri-arrow-right-s-line text-lg"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold cursor-pointer transition-colors ${currentPage === p
                ? 'bg-teal-600 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      )}

      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCreateModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
              <h3 className="text-base font-bold text-gray-900">Nuevo reporte de incidente</h3>
              <button
                onClick={() => setCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <i className="ri-close-line text-gray-500"></i>
              </button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 flex flex-col gap-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Servicio relacionado <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                      type="text"
                      value={
                        formSelectedService
                          ? `${formSelectedService.service_code || formSelectedService.contract_code || `#${formSelectedService.id}`} — ${formSelectedService.patient_name}`
                          : formServiceSearch
                      }
                      onChange={(e) => {
                        setFormServiceSearch(e.target.value);
                        setFormSelectedService(null);
                        setShowServiceResults(true);
                      }}
                      onFocus={() => setShowServiceResults(true)}
                      placeholder="Busca por código (SER-...), nombre del cliente o paciente..."
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 bg-white placeholder:text-gray-400"
                    />
                    {formSelectedService && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormSelectedService(null);
                          setFormServiceSearch('');
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                    )}
                  </div>
                  {showServiceResults &&
                    !formSelectedService &&
                    filteredServiceResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl mt-1 overflow-hidden max-h-48 overflow-y-auto shadow-lg">
                        {filteredServiceResults.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setFormSelectedService(s);
                              setFormServiceSearch('');
                              setShowServiceResults(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-teal-50 border-b border-gray-50 last:border-0 cursor-pointer"
                          >
                            <p className="text-xs font-semibold text-gray-900">
                              {s.service_code || s.contract_code || `#${s.id}`} — {s.patient_name}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {s.clientName} · {s.service_type}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  {showServiceResults &&
                    !formSelectedService &&
                    formServiceSearch.trim() &&
                    filteredServiceResults.length === 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl mt-1 px-4 py-3 shadow-lg">
                        <p className="text-xs text-gray-400">No se encontraron servicios</p>
                      </div>
                    )}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Título *
                </label>
                <input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: Cliente no proporcionó equipamiento"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 bg-white placeholder:text-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Severidad
                  </label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as IncidentSeverity)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Descripción detallada *
                </label>
                <textarea
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe el incidente con el mayor detalle posible..."
                  rows={4}
                  maxLength={500}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 resize-none bg-white placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formDescription.length}/500
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Evidencia (opcional)
                </label>
                <div className="space-y-3">
                  {formEvidenceUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formEvidenceUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0"
                        >
                          <img
                            src={url}
                            alt={`Evidencia ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormEvidenceUrls((p) => p.filter((_, i) => i !== idx))
                            }
                            className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full text-white text-[10px] flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      <i className="ri-camera-line text-gray-400"></i>
                    </div>
                    <span className="text-xs text-gray-500">Agregar imagen (máx. 5)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (formEvidenceUrls.length >= 5) {
                          showToast('Máximo 5 imágenes por reporte', 'error');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setFormEvidenceUrls((p) => [...p, reader.result as string]);
                          }
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-3 rounded-xl cursor-pointer whitespace-nowrap text-sm transition-all duration-200"
                >
                  {saving ? (
                    <span className="inline-flex items-center gap-1.5">
                      <i className="ri-loader-4-line animate-spin"></i>Enviando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <i className="ri-send-plane-line"></i>Enviar reporte
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && toast.show &&
        (() => {
          const isSuccess = toast.type === 'success';

          return (
            <div className="fixed top-6 right-6 z-[100] pointer-events-none">
              <div
                className={`
            flex items-start gap-3 w-[320px]
            px-4 py-3 rounded-2xl shadow-xl border
            bg-white backdrop-blur-md
            animate-in fade-in slide-in-from-right-5 duration-300
            pointer-events-auto
            ${isSuccess ? 'border-emerald-100' : 'border-rose-100'}
          `}
              >
                {/* ICONO */}
                <div
                  className={`
              w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0
              ${isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
            `}
                >
                  <i
                    className={`text-lg ${isSuccess
                        ? 'ri-checkbox-circle-line'
                        : 'ri-error-warning-line'
                      }`}
                  />
                </div>

                {/* TEXTO */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    {isSuccess ? 'Éxito' : 'Error'}
                  </p>
                  <p className="text-xs text-gray-500 leading-snug mt-0.5">
                    {toast.message}
                  </p>
                </div>

                {/* BARRA DE ESTADO */}
                <div
                  className={`w-1.5 h-full rounded-full flex-shrink-0 ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                />
              </div>
            </div>
          );
        })()
      }
      {detailReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailReport(null)}
          ></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 flex-shrink-0">
              <h3 className="text-base font-bold text-gray-900">Detalle del reporte</h3>
              <button
                onClick={() => setDetailReport(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
              >
                <i className="ri-close-line text-gray-500"></i>
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_CONFIG[detailReport.status].bg} ${STATUS_CONFIG[detailReport.status].text}`}
                >
                  <i className={`${STATUS_CONFIG[detailReport.status].icon} text-sm`}></i>
                  {STATUS_CONFIG[detailReport.status].label}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-semibold ${SEVERITY_CONFIG[detailReport.severity].text} bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100`}>
                  <span className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG[detailReport.severity].dot}`}></span>
                  {SEVERITY_CONFIG[detailReport.severity].label}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-xl">{detailReport.title}</h3>

              {detailReport.patientName && (
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-rose-50 rounded-xl px-4 py-3 border border-rose-100">
                  <i className="ri-user-heart-line text-rose-500 text-lg"></i>
                  <span>
                    Paciente: <strong>{detailReport.patientName}</strong>
                  </span>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <i className="ri-file-text-line text-sm"></i>Descripción
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {detailReport.description}
                </p>
              </div>

              <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                <i className="ri-calendar-event-line text-lg"></i>
                {formatDate(detailReport.created_at)}
              </p>

              {detailReport.response && (
                <div className="bg-[#f0fdf4] border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-teal-700 mb-2 flex items-center gap-1.5">
                    <i className="ri-reply-line text-sm"></i>Respuesta de la plataforma
                  </p>
                  <p className="text-sm text-teal-800 leading-relaxed">
                    {detailReport.response}
                  </p>
                </div>
              )}

              {detailReport.evidence_urls &&
                Array.isArray(detailReport.evidence_urls) &&
                detailReport.evidence_urls.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Evidencia
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {detailReport.evidence_urls.map((url: string, idx: number) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 block hover:ring-2 hover:ring-teal-300 transition-all shadow-sm"
                        >
                          <img
                            src={url}
                            alt={`Evidencia ${idx + 1}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setDetailReport(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl cursor-pointer whitespace-nowrap text-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}