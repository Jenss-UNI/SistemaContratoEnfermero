import { useState, useRef, useEffect } from "react";
import {
  Trash2,
  Plus,
  Check,
  Camera,
  Loader2,
  Stethoscope,
  HeartPulse,
  Activity,
  AlertCircle,
  Search,
  X,
  Languages,
} from "lucide-react";

// Lista completa de 43 distritos de Lima Metropolitana
const allDistricts = [
  "Ancón",
  "Ate",
  "Barranco",
  "Breña",
  "Carabayllo",
  "Cercado de Lima",
  "Chaclacayo",
  "Chorrillos",
  "Cieneguilla",
  "Comas",
  "El Agustino",
  "Independencia",
  "Jesús María",
  "La Molina",
  "La Victoria",
  "Lince",
  "Los Olivos",
  "Lurigancho-Chosica",
  "Lurín",
  "Magdalena del Mar",
  "Miraflores",
  "Pachacámac",
  "Pucusana",
  "Pueblo Libre",
  "Puente Piedra",
  "Punta Hermosa",
  "Punta Negra",
  "Rímac",
  "San Bartolo",
  "San Borja",
  "San Isidro",
  "San Juan de Lurigancho",
  "San Juan de Miraflores",
  "San Luis",
  "San Martín de Porres",
  "San Miguel",
  "Santa Anita",
  "Santa María del Mar",
  "Santa Rosa",
  "Santiago de Surco",
  "Surquillo",
  "Villa El Salvador",
  "Villa María del Triunfo",
];

// Idiomas predefinidos para evitar ingresos inválidos o código malicioso
const predefinedLanguages = [
  "Español",
  "Quechua",
  "Aimara",
  "Inglés (Básico)",
  "Inglés (Intermedio)",
  "Inglés (Avanzado)",
  "Portugués",
  "Francés",
  "Italiano",
  "Alemán",
  "Chino Mandarín",
];

// Estructura de perfiles precargados para simulación
const mockProfiles = {
  especializado: {
    name: "Carlos Sanchez Martinez",
    specialty: "Geriatría y Cuidado del Adulto Mayor",
    district: "Lince",
    languages: ["Español", "Inglés (Básico)", "Francés"],
    nivel: "Enfermero Especializado",
    rateEspecializado: "53",
    rateAsistencial: "20",
    rateAcompanamiento: "15",
    serviceEspecializado: true,
    serviceAsistencial: true,
    serviceAcompanamiento: true,
    zones: ["Jesús María", "Pueblo Libre", "Lince"],
    education: [
      {
        degree: "Licenciado en enfermería",
        institution: "Universidad Tecnológica del Peru",
        year: "2019",
      },
      {
        degree: "sgsgsgsg",
        institution: "gergegerger",
        year: "2019",
      },
    ],
    certifications: [
      {
        name: "dwdwdw",
        issuer: "dwdwd",
        year: "1990",
      },
    ],
    bio: "Enfermero con 7 años de experiencia verificado",
    photoUrl: null,
  },
  licenciado: {
    name: "Alex Martinez",
    specialty: "",
    district: "La Molina",
    languages: ["Español"],
    nivel: "Licenciado en Enfermería",
    rateEspecializado: "65",
    rateAsistencial: "45",
    rateAcompanamiento: "35",
    serviceEspecializado: false,
    serviceAsistencial: true,
    serviceAcompanamiento: false,
    zones: [] as string[],
    education: [] as { degree: string; institution: string; year: string }[],
    certifications: [] as { name: string; issuer: string; year: string }[],
    bio: "",
    photoUrl: null,
  },
  tecnico: {
    name: "Jair Chavez",
    specialty: "",
    district: "Miraflores",
    languages: ["Español"],
    nivel: "Técnico en Enfermería",
    rateEspecializado: "65",
    rateAsistencial: "45",
    rateAcompanamiento: "35",
    serviceEspecializado: false,
    serviceAsistencial: false,
    serviceAcompanamiento: true,
    zones: ["Miraflores"],
    education: [] as { degree: string; institution: string; year: string }[],
    certifications: [] as { name: string; issuer: string; year: string }[],
    bio: "",
    photoUrl: null,
  },
};

type ProfileKey = "especializado" | "licenciado" | "tecnico";

export default function MiPerfilPage() {
  const [simulatedProfile, setSimulatedProfile] = useState<ProfileKey>("especializado");

  // Formulario principal
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    district: "",
    bio: "",
  });

  // Estados de listas y tarifas
  const [nivel, setNivel] = useState("");
  const [zones, setZones] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [education, setEducation] = useState<{ degree: string; institution: string; year: string }[]>([]);
  const [certifications, setCertifications] = useState<{ name: string; issuer: string; year: string }[]>([]);

  const [rateEspecializado, setRateEspecializado] = useState("53");
  const [rateAsistencial, setRateAsistencial] = useState("20");
  const [rateAcompanamiento, setRateAcompanamiento] = useState("15");

  const [serviceEspecializado, setServiceEspecializado] = useState(true);
  const [serviceAsistencial, setServiceAsistencial] = useState(true);
  const [serviceAcompanamiento, setServiceAcompanamiento] = useState(true);

  // Estados para añadir nueva formación
  const [newEdDegree, setNewEdDegree] = useState("");
  const [newEdInstitution, setNewEdInstitution] = useState("");
  const [newEdYear, setNewEdYear] = useState(""); // Ahora usará selector desplegable

  // Estados para añadir nueva certificación
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState(""); // Ahora usará selector desplegable

  // Búsqueda de distritos
  const [districtSearch, setDistrictSearch] = useState("");

  // Estado para la foto
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados del Toast, Guardado y Errores
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  // Generar array de años desde 1960 hasta el año actual (2026) en orden descendente
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from(
    { length: currentYear - 1960 + 1 },
    (_, index) => (currentYear - index).toString()
  );

  // Cargar datos según el perfil simulado seleccionado
  useEffect(() => {
    const profileData = mockProfiles[simulatedProfile];
    setForm({
      name: profileData.name,
      specialty: profileData.specialty,
      district: profileData.district,
      bio: profileData.bio,
    });
    setNivel(profileData.nivel);
    setZones(profileData.zones);
    setLanguages(profileData.languages);
    setEducation(profileData.education);
    setCertifications(profileData.certifications);
    setRateEspecializado(profileData.rateEspecializado);
    setRateAsistencial(profileData.rateAsistencial);
    setRateAcompanamiento(profileData.rateAcompanamiento);
    setServiceEspecializado(profileData.serviceEspecializado);
    setServiceAsistencial(profileData.serviceAsistencial);
    setServiceAcompanamiento(profileData.serviceAcompanamiento);
    setPhotoUrl(null);
    setErrors({});
    
    // Inicializar años por defecto en el primer elemento de la lista (Año Actual)
    setNewEdYear(currentYear.toString());
    setNewCertYear(currentYear.toString());
  }, [simulatedProfile]);

  // ─── MOTOR DE SANITIZACIÓN Y VALIDACIÓN DEL CLIENTE ───
  const validateField = (name: string, value: string): string => {
    let errorMsg = "";

    // 1. Limpieza inicial: Normalización de múltiples espacios a uno solo
    const cleanedValue = value.replace(/\s+/g, " ").trim();

    // 2. Detección preventiva contra SQL Injection y XSS
    const sqlPattern = /(SELECT|UNION|DROP|INSERT|UPDATE|DELETE|WHERE|OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+|--|\/\*|\*\/|;)/i;
    const xssPattern = /(<script|javascript:|onload=|onerror=|<iframe>|<object|<embed)/i;

    if (sqlPattern.test(cleanedValue)) {
      return "Se detectó un patrón de inyección SQL no permitido.";
    }
    if (xssPattern.test(cleanedValue)) {
      return "Se detectó código HTML o scripts no permitidos.";
    }

    // 3. Validaciones del perfil especificadas por el usuario
    if (name === "name" || name === "specialty" || name === "newEdDegree") {
      if (cleanedValue.length > 0) {
        if (cleanedValue.length < 3 || cleanedValue.length > 50) {
          errorMsg = "La longitud debe estar estrictamente entre 3 y 50 caracteres.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cleanedValue)) {
          errorMsg = "Solo se permiten letras, espacios y tildes (prohibido números y caracteres especiales).";
        }
      } else if (name === "name") {
        errorMsg = "El nombre completo es obligatorio.";
      }
    } else if (name === "district") {
      if (cleanedValue.length < 3 || cleanedValue.length > 50) {
        errorMsg = "El distrito principal debe tener entre 3 y 50 caracteres.";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cleanedValue)) {
        errorMsg = "El distrito solo puede contener letras, espacios y tildes.";
      }
    } else if (name === "bio") {
      if (cleanedValue.length < 20) {
        errorMsg = "La biografía debe contener al menos 20 caracteres para un perfil profesional de calidad.";
      } else if (cleanedValue.length > 500) {
        errorMsg = "La biografía no puede superar los 500 caracteres.";
      }
    }

    return errorMsg;
  };

  // Validar campos de tipo Curso/Institución (Certificaciones)
  const validateCertificationField = (value: string): string => {
    const cleaned = value.replace(/\s+/g, " ").trim();

    // Validar inyección
    if (/(SELECT|UNION|DROP|--|;)/i.test(cleaned) || /(<script|javascript:)/i.test(cleaned)) {
      return "Se detectó contenido peligroso no permitido.";
    }

    if (cleaned.length < 3 || cleaned.length > 100) {
      return "La longitud del curso/institución debe estar entre 3 y 100 caracteres.";
    }
    // Debe contener al menos una letra, pero puede tener números y guiones
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(cleaned)) {
      return "Debe contener letras obligatoriamente (no se permiten entradas puramente numéricas).";
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-]+$/.test(cleaned)) {
      return "Solo se permiten letras, números, espacios y guiones.";
    }

    return "";
  };

  // Validar Tarifas
  const validateRateValue = (value: string): string => {
    const num = parseInt(value, 10);
    if (isNaN(num) || !/^\d+$/.test(value)) {
      return "La tarifa debe ser un número entero.";
    }
    if (num < 10 || num > 500) {
      return "La tarifa debe estar entre S/ 10 y S/ 500 por hora.";
    }
    return "";
  };

  // Manejar cambios en inputs de texto con validación y limpieza en tiempo real
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Guardamos el valor en crudo mientras escribe, pero validamos con el valor limpio
    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Agregar Idioma desde el catálogo cerrado
  const handleAddLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (!selected) return;

    if (!languages.includes(selected)) {
      setLanguages((prev) => [...prev, selected]);
      showToast(`Se agregó el idioma: ${selected}`, "success");
    }
    e.target.value = ""; // Resetear selector
  };

  // Remover Idioma
  const handleRemoveLanguage = (lang: string) => {
    setLanguages((prev) => prev.filter((l) => l !== lang));
  };

  // Toggle de distritos
  const toggleDistrict = (d: string) => {
    setZones((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  // Filtrar los distritos según la búsqueda
  const filteredDistricts = allDistricts.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  // Simular la carga de foto de perfil
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("La imagen debe ser menor a 5MB", "error");
      return;
    }
    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTimeout(() => {
        setPhotoUrl(ev.target?.result as string);
        setPhotoUploading(false);
        showToast("Foto de perfil actualizada", "success");
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  // Disparar Toast emergente
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Guardar datos con validaciones lógicas y de negocio completas antes de enviar
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Limpieza de espacios redundantes intermedios en el onSubmit (.trim() + .replace())
    const cleanedForm = {
      name: form.name.replace(/\s+/g, " ").trim(),
      specialty: form.specialty.replace(/\s+/g, " ").trim(),
      district: form.district.replace(/\s+/g, " ").trim(),
      bio: form.bio.replace(/\s+/g, " ").trim(),
    };

    // Actualizamos el formulario con la versión sanitizada para que el usuario la visualice limpia
    setForm(cleanedForm);

    // 2. Validar campos
    const newErrors: Record<string, string> = {};
    Object.keys(cleanedForm).forEach((key) => {
      const err = validateField(key, cleanedForm[key as keyof typeof cleanedForm]);
      if (err) newErrors[key] = err;
    });

    // 3. Validar tarifas activas
    if (serviceEspecializado && nivel === "Enfermero Especializado") {
      const err = validateRateValue(rateEspecializado);
      if (err) newErrors.rateEspecializado = err;
    }
    if (serviceAsistencial && (nivel === "Enfermero Especializado" || nivel === "Licenciado en Enfermería")) {
      const err = validateRateValue(rateAsistencial);
      if (err) newErrors.rateAsistencial = err;
    }
    if (serviceAcompanamiento) {
      const err = validateRateValue(rateAcompanamiento);
      if (err) newErrors.rateAcompanamiento = err;
    }

    setErrors(newErrors);

    // 4. Validación de negocio: Zonas de atención obligatorias (mínimo 1)
    if (zones.length === 0) {
      showToast("Debes seleccionar al menos un distrito de atención para poder guardar.", "error");
      return;
    }

    // 5. Bloquear si existen errores
    const hasErrors = Object.values(newErrors).some((x) => x !== "");
    if (hasErrors) {
      showToast("Por favor corrige los errores antes de guardar.", "error");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Perfil guardado correctamente", "success");
    }, 1200);
  };

  // Agregar Formación Académica con validación de tildes y longitud estricta
  const addEducation = () => {
    const cleanedDegree = newEdDegree.replace(/\s+/g, " ").trim();
    const cleanedInst = newEdInstitution.replace(/\s+/g, " ").trim();

    const degreeErr = validateField("newEdDegree", cleanedDegree);
    const instErr = validateField("newEdDegree", cleanedInst);

    if (degreeErr || instErr) {
      showToast(degreeErr || instErr, "error");
      return;
    }

    if (cleanedDegree.length > 0 && cleanedInst.length > 0 && newEdYear) {
      setEducation((prev) => [
        ...prev,
        {
          degree: cleanedDegree,
          institution: cleanedInst,
          year: newEdYear,
        },
      ]);
      setNewEdDegree("");
      setNewEdInstitution("");
      setNewEdYear(currentYear.toString());
      showToast("Se agregó formación académica", "success");
    } else {
      showToast("Completa todos los campos de educación para añadir.", "error");
    }
  };

  // Agregar Certificación con validación alfabética y de presencia de letras
  const addCertification = () => {
    const cleanedName = newCertName.replace(/\s+/g, " ").trim();
    const cleanedIssuer = newCertIssuer.replace(/\s+/g, " ").trim();

    const nameErr = validateCertificationField(cleanedName);
    const issuerErr = validateCertificationField(cleanedIssuer);

    if (nameErr || issuerErr) {
      showToast(nameErr || issuerErr, "error");
      return;
    }

    if (cleanedName.length > 0 && cleanedIssuer.length > 0 && newCertYear) {
      setCertifications((prev) => [
        ...prev,
        {
          name: cleanedName,
          issuer: cleanedIssuer,
          year: newCertYear,
        },
      ]);
      setNewCertName("");
      setNewCertIssuer("");
      setNewCertYear(currentYear.toString());
      showToast("Se agregó certificación de curso", "success");
    } else {
      showToast("Completa todos los campos del curso para añadir.", "error");
    }
  };

  // Iniciales del avatar dinámicas
  const getInitials = () => {
    if (!form.name) return "EN";
    const parts = form.name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative w-full space-y-6">
      
      {/* ─── SIMULADOR SUPERIOR (Pruebas de Frontend) ─── */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Simulador de Perfil (Solo Frontend)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSimulatedProfile("especializado")}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer ${
              simulatedProfile === "especializado"
                ? "bg-teal-500 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Enfermero Especializado
          </button>
          <button
            type="button"
            onClick={() => setSimulatedProfile("licenciado")}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer ${
              simulatedProfile === "licenciado"
                ? "bg-teal-500 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Licenciado en Enfermería
          </button>
          <button
            type="button"
            onClick={() => setSimulatedProfile("tecnico")}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer ${
              simulatedProfile === "tecnico"
                ? "bg-teal-500 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Técnico en Enfermería
          </button>
        </div>
      </div>

      {/* Formulario Principal */}
      <form onSubmit={handleSave} className="space-y-6 w-full animate-in fade-in duration-300">
        
        {/* Foto de Perfil */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Foto de Perfil</h3>
          <div className="flex items-center gap-5">
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={form.name}
                  className="w-20 h-20 rounded-full object-cover object-top border-2 border-slate-100 animate-in fade-in"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 text-2xl font-bold text-white shadow-sm border-2 border-teal-100">
                  {getInitials()}
                </div>
              )}
              {photoUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photoUploading}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 border border-teal-200 px-4 py-2 rounded-lg hover:bg-teal-50 cursor-pointer disabled:opacity-50 transition"
              >
                <Camera className="h-4 w-4" />
                Cambiar foto
              </button>
              <p className="text-xs text-slate-400 mt-1.5">JPG o PNG, máx. 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>
        </div>

        {/* Información Básica */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Información Básica</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Nombre completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none transition ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                    : "border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Especialidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Especialidad
              </label>
              <input
                type="text"
                name="specialty"
                value={form.specialty}
                onChange={handleInputChange}
                placeholder="Ej. Geriatría y Cuidado del Adulto Mayor"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none transition ${
                  errors.specialty
                    ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                    : "border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                }`}
              />
              {errors.specialty && (
                <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.specialty}
                </p>
              )}
            </div>

            {/* Distrito principal */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Distrito principal
              </label>
              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleInputChange}
                required
                className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none transition ${
                  errors.district
                    ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                    : "border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                }`}
              />
              {errors.district && (
                <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.district}
                </p>
              )}
            </div>

            {/* Selector de Idiomas Premium por Catalogo y Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Languages className="h-3.5 w-3.5 text-slate-400" />
                Idiomas que hablas
              </label>
              <div className="space-y-2">
                {/* Desplegable cerrado */}
                <select
                  onChange={handleAddLanguage}
                  defaultValue=""
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition bg-white"
                >
                  <option value="" disabled>
                    Selecciona un idioma para agregar...
                  </option>
                  {predefinedLanguages
                    .filter((l) => !languages.includes(l))
                    .map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                </select>

                {/* Tags de idiomas agregados */}
                {languages.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full border border-teal-100"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="hover:bg-teal-150 text-teal-800 rounded-full p-0.5 inline-flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    No has seleccionado ningún idioma. Selecciona al menos uno.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Servicios que Ofrezco */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Servicios que ofrezco</h3>
          <p className="text-xs text-slate-400 mb-5">
            Tipo de profesional: <span className="font-semibold text-slate-700">{nivel}</span>.
            {nivel === "Enfermero Especializado" &&
              " Tu servicio principal es Especializado. Puedes activar los adicionales opcionales."}
            {nivel === "Licenciado en Enfermería" &&
              " Tu servicio principal es Asistencial. Puedes activar Acompañamiento opcionalmente."}
            {nivel === "Técnico en Enfermería" &&
              " Solo puedes ofrecer servicio de Acompañamiento."}
          </p>

          <div className="flex flex-col gap-4">
            
            {/* ESPECIALIZADO — Sólo Enfermero Especializado */}
            {nivel === "Enfermero Especializado" && (
              <div
                className={`rounded-xl border p-5 transition duration-300 ${
                  serviceEspecializado
                    ? "border-teal-200 bg-teal-50/20"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center bg-teal-100 rounded-xl">
                      <Stethoscope className="text-teal-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Servicio Especializado</p>
                      <p className="text-xs text-slate-400">Servicio principal — siempre activo</p>
                    </div>
                  </div>
                  <span className="text-xs text-teal-600 font-bold bg-teal-50 border border-teal-200/50 px-2.5 py-0.5 rounded-full">
                    Principal
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                    Tarifa (S/ por hora)
                  </label>
                  <input
                    type="number"
                    value={rateEspecializado}
                    onChange={(e) => {
                      setRateEspecializado(e.target.value);
                      setErrors((prev) => ({ ...prev, rateEspecializado: validateRateValue(e.target.value) }));
                    }}
                    className={`w-full sm:w-40 border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none transition ${
                      errors.rateEspecializado
                        ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                        : "border-slate-200 focus:border-teal-400"
                    }`}
                  />
                  {errors.rateEspecializado && (
                    <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.rateEspecializado}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ASISTENCIAL — Especialista (opcional) o Licenciado (principal) */}
            {(nivel === "Enfermero Especializado" || nivel === "Licenciado en Enfermería") && (
              <div
                className={`rounded-xl border p-5 transition duration-300 ${
                  serviceAsistencial
                    ? "border-teal-200 bg-teal-50/20"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-xl transition ${
                        serviceAsistencial ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Servicio Asistencial</p>
                      <p className="text-xs text-slate-400">
                        {nivel === "Licenciado en Enfermería"
                          ? "Servicio principal — siempre activo"
                          : "Servicio adicional (opcional)"}
                      </p>
                    </div>
                  </div>
                  {nivel === "Licenciado en Enfermería" ? (
                    <span className="text-xs text-teal-600 font-bold bg-teal-50 border border-teal-200/50 px-2.5 py-0.5 rounded-full">
                      Principal
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setServiceAsistencial(!serviceAsistencial)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        serviceAsistencial ? "bg-teal-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          serviceAsistencial ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}
                </div>
                {serviceAsistencial && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                      Tarifa (S/ por hora)
                    </label>
                    <input
                      type="number"
                      value={rateAsistencial}
                      onChange={(e) => {
                        setRateAsistencial(e.target.value);
                        setErrors((prev) => ({ ...prev, rateAsistencial: validateRateValue(e.target.value) }));
                      }}
                      className={`w-full sm:w-40 border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none transition ${
                        errors.rateAsistencial
                          ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                          : "border-slate-200 focus:border-teal-400"
                      }`}
                    />
                    {errors.rateAsistencial && (
                      <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.rateAsistencial}
                      </p>
                    )}
                  </div>
                )}
                {!serviceAsistencial && (
                  <p className="text-xs text-slate-400 italic mt-1">
                    Activa este servicio para ofrecerlo a los clientes
                  </p>
                )}
              </div>
            )}

            {/* ACOMPAÑAMIENTO — Técnico (principal) o resto (opcional) */}
            <div
              className={`rounded-xl border p-5 transition duration-300 ${
                serviceAcompanamiento
                  ? "border-teal-200 bg-teal-50/20"
                  : "border-slate-100 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition ${
                      serviceAcompanamiento ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Acompañamiento</p>
                    <p className="text-xs text-slate-400">
                      {nivel === "Técnico en Enfermería"
                        ? "Servicio principal — siempre activo"
                        : "Servicio adicional (opcional)"}
                    </p>
                  </div>
                </div>
                {nivel === "Técnico en Enfermería" ? (
                  <span className="text-xs text-teal-600 font-bold bg-teal-50 border border-teal-200/50 px-2.5 py-0.5 rounded-full">
                    Principal
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setServiceAcompanamiento(!serviceAcompanamiento)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      serviceAcompanamiento ? "bg-teal-500" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        serviceAcompanamiento ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                )}
              </div>
              {serviceAcompanamiento && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                    Tarifa (S/ por hora)
                  </label>
                  <input
                    type="number"
                    value={rateAcompanamiento}
                    onChange={(e) => {
                      setRateAcompanamiento(e.target.value);
                      setErrors((prev) => ({ ...prev, rateAcompanamiento: validateRateValue(e.target.value) }));
                    }}
                    className={`w-full sm:w-40 border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none transition ${
                      errors.rateAcompanamiento
                        ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                        : "border-slate-200 focus:border-teal-400"
                    }`}
                  />
                  {errors.rateAcompanamiento && (
                    <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.rateAcompanamiento}
                    </p>
                  )}
                </div>
              )}
              {!serviceAcompanamiento && (
                <p className="text-xs text-slate-400 italic mt-1">
                  Activa este servicio para ofrecerlo a los clientes
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Distritos de Atención */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Distritos de Atención</h3>
          <p className="text-xs text-slate-400 mb-4">
            Selecciona los distritos donde puedes brindar servicios. Los clientes podrán filtrarte por estas zonas.
          </p>

          {/* Listado de distritos seleccionados (Pills) */}
          {zones.length > 0 && (
            <div className="mb-4 animate-in fade-in duration-200">
              <p className="text-xs font-bold text-slate-500 mb-2">
                Distritos seleccionados ({zones.length}):
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100 scrollbar-thin">
                {zones.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100/50 shadow-sm"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => toggleDistrict(d)}
                      className="hover:bg-teal-200 text-teal-800 rounded-full p-0.5 flex items-center justify-center shrink-0 cursor-pointer transition"
                      aria-label={`Deseleccionar ${d}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buscador de distritos en tiempo real + Botones Rápidos */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="Buscar distrito... (ej. Miraflores)"
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setZones([...allDistricts])}
                className="flex-1 md:flex-none text-xs font-semibold px-4.5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                Seleccionar todos
              </button>
              <button
                type="button"
                onClick={() => setZones([])}
                className="flex-1 md:flex-none text-xs font-semibold px-4.5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                Limpiar selección
              </button>
            </div>
          </div>

          {/* Rejilla de distritos compacta con scroll vertical interno */}
          <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50/30 scrollbar-thin">
            {filteredDistricts.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                No se encontraron distritos que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredDistricts.map((d) => {
                  const isSelected = zones.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDistrict(d)}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center justify-between ${
                        isSelected
                          ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600"
                      }`}
                    >
                      <span className="truncate">{d}</span>
                      {isSelected && <Check className="h-3 w-3 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Formación Académica */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Formación Académica</h3>
          <div className="space-y-3">
            {education.map((ed, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl gap-4 transition animate-in fade-in"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">{ed.degree}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ed.institution} · {ed.year}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEducation((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center flex-shrink-0 transition"
                  aria-label="Eliminar formación"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Inputs para agregar nueva formación con selector de años */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <input
                type="text"
                value={newEdDegree}
                onChange={(e) => setNewEdDegree(e.target.value)}
                placeholder="Nombre de la licenciatura"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
              <input
                type="text"
                value={newEdInstitution}
                onChange={(e) => setNewEdInstitution(e.target.value)}
                placeholder="Nombre de la universidad"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
              <div className="flex gap-2">
                <select
                  value={newEdYear}
                  onChange={(e) => setNewEdYear(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition bg-white"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 cursor-pointer transition flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Presentación Profesional */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Presentación Profesional</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Biografía completa (aparece en tu perfil)
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleInputChange}
              rows={4}
              maxLength={500}
              placeholder="Escribe aquí tu presentación profesional para los clientes..."
              className={`w-full border rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none resize-none transition ${
                errors.bio
                  ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                  : "border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              }`}
            />
            {errors.bio && (
              <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.bio}
              </p>
            )}
            <p className="text-[10px] font-semibold text-slate-400 text-right mt-1">
              {form.bio?.length || 0}/500
            </p>
          </div>
        </div>

        {/* Certificaciones */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Certificaciones y Cursos</h3>
          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl gap-4 transition animate-in fade-in"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">{cert.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cert.issuer} · {cert.year}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCertifications((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center flex-shrink-0 transition"
                  aria-label="Eliminar certificación"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Inputs para agregar nueva certificación con selector de años */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <input
                type="text"
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                placeholder="Nombre del curso"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
              <input
                type="text"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                placeholder="Organización que emite"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
              <div className="flex gap-2">
                <select
                  value={newCertYear}
                  onChange={(e) => setNewCertYear(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition bg-white"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 cursor-pointer transition flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Guardado */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl disabled:bg-teal-300 shadow-sm cursor-pointer transition flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando cambios...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>

      </form>

      {/* ─── SISTEMA DE TOAST NOTIFICACIONES FLOTANTES (LOCAL) ─── */}
      {toast && toast.show && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-6 duration-300">
          {toast.type === "success" ? (
            <div className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded-full shrink-0">
              <Check className="text-white h-4 w-4" />
            </div>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center bg-rose-500 rounded-full shrink-0">
              <AlertCircle className="text-white h-4 w-4" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold">
              {toast.type === "success" ? "Éxito" : "Alerta de Validación"}
            </p>
            <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
              {toast.message}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
