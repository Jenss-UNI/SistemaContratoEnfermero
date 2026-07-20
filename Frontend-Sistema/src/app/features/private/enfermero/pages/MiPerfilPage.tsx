
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
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import {
  fetchEnfermeroProfile,
  updateEnfermeroProfile,
  saveEnfermeroServiceTypes,
  saveEnfermeroZones,
  saveEnfermeroLanguages,
  saveEnfermeroEducation,
  saveEnfermeroCertifications,
  uploadProfilePhoto,
} from "../services/enfermeroProfile.service";

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

// Carga dinámica de PDF.js
const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      resolve(pdfjsLib);
    };
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
};

const detectDistrict = (text: string, allDistricts: string[]): string => {
  for (const dist of allDistricts) {
    const regex = new RegExp(`\\b${dist}\\b`, "i");
    if (regex.test(text)) {
      return dist;
    }
  }
  return "";
};

const detectLanguages = (text: string): string[] => {
  const detected: string[] = [];
  const lines = text.split(/[\n\r]+/);
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    if (/ingl[eé]s|english/i.test(trimmedLine)) {
      if (/avanzado|advanced|c1|c2/i.test(trimmedLine)) {
        detected.push("Inglés (Avanzado)");
      } else if (/intermedio|intermediate|b1|b2/i.test(trimmedLine)) {
        detected.push("Inglés (Intermedio)");
      } else {
        detected.push("Inglés (Básico)");
      }
    }
    
    if (/quechua/i.test(trimmedLine)) detected.push("Quechua");
    if (/aimara/i.test(trimmedLine)) detected.push("Aimara");
    if (/portugu[eé]s/i.test(trimmedLine)) detected.push("Portugués");
    if (/franc[eé]s/i.test(trimmedLine)) detected.push("Francés");
    if (/italiano/i.test(trimmedLine)) detected.push("Italiano");
    if (/alem[aá]n/i.test(trimmedLine)) detected.push("Alemán");
    if (/chino|mandar[ií]n/i.test(trimmedLine)) detected.push("Chino Mandarín");
  }
  
  if (detected.length === 0) {
    detected.push("Español");
  } else if (!detected.includes("Español")) {
    detected.unshift("Español");
  }
  return detected;
};

const detectSpecialty = (text: string): string => {
  const lines = text.split(/[\n\r]+/);
  
  // Look at the first 5 lines for professional titles (like "Técnico en Enfermería")
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (/enfermer|técnico|licenciado|cuidador/i.test(line) && line.length > 5 && line.length < 50) {
      return line.replace(/[^\w\s\dáéíóúÁÉÍÓÚñÑ]/g, "").replace(/\s+/g, " ").trim();
    }
  }

  const specialties = [
    "Geriatría y Cuidado del Adulto Mayor",
    "Pediatría y Cuidado Infantil",
    "Cuidados Intensivos (UCI)",
    "Urgencias y Emergencias",
    "Cardiología",
    "Neonatología",
    "Salud Mental y Psiquiatría",
    "Rehabilitación y Fisioterapia",
    "Oncología",
  ];
  for (const spec of specialties) {
    const keyword = spec.split("y")[0].trim().split(" ")[0]; // e.g. "Geriatría"
    const regex = new RegExp(keyword.replace(/[íí]/gi, "[ií]"), "i");
    if (regex.test(text)) {
      return spec;
    }
  }
  if (/adulto mayor|ancian/i.test(text)) return "Geriatría y Cuidado del Adulto Mayor";
  if (/ni[nñ]o|infantil|pediatr/i.test(text)) return "Pediatría y Cuidado Infantil";
  if (/uci|intensivo/i.test(text)) return "Cuidados Intensivos (UCI)";
  if (/urgencia|emergencia/i.test(text)) return "Urgencias y Emergencias";

  return "";
};

const detectExperience = (text: string): string => {
  const match1 = text.match(/(\d+)\s*(?:a[ñn]os de experiencia|a[ñn]os de trayectoria|a[ñn]os laborados)/i);
  if (match1) return match1[1];

  const match2 = text.match(/(?:experiencia|laboral|trayectoria)\s*(?:de|m[aá]s de)?\s*(\d+)\s*a[ñn]os/i);
  if (match2) return match2[1];

  const match3 = text.match(/(\d+)\s*a[ñn]os\s*(?:en el sector|en el rubro|trabajando)/i);
  if (match3) return match3[1];

  return "";
};

const detectBio = (text: string): string => {
  const lines = text.split(/[\n\r]+/);
  let startIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/perfil profesional|sobre m[ií]|resumen profesional|presentaci[oó]n/i.test(line)) {
      startIndex = i + 1;
      break;
    }
  }
  
  if (startIndex !== -1) {
    const bioLines: string[] = [];
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      // Stop if we hit any subsequent section header
      if (/formaci[oó]n acad[eé]mica|educaci[oó]n|experiencia laboral|certificaciones|idiomas/i.test(line)) {
        break;
      }
      if (line) {
        bioLines.push(line);
      }
    }
    if (bioLines.length > 0) {
      return bioLines.join(" ").substring(0, 500);
    }
  }
  
  const cleanedText = text.replace(/\s+/g, " ").trim();
  return cleanedText.substring(0, 300) + "...";
};

const detectEducation = (text: string): { degree: string; institution: string; year: string }[] => {
  const eduList: { degree: string; institution: string; year: string }[] = [];
  const lines = text.split(/[\n\r]+/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const hasEdKeyword = /licenciad|técnico|tec\.|bachiller|egresad|título|degree|enfermer/i.test(line);
    const hasInstKeyword = /universidad|instituto|facultad|escuela|san marcos|cayetano|vallejo|ucv|unmsm|ispp/i.test(line);
    
    if (hasEdKeyword || hasInstKeyword) {
      let year = "";
      const yearMatchThis = line.match(/\b(19\d\d|20[0-2]\d)\b/);
      if (yearMatchThis) {
        year = yearMatchThis[1];
      } else {
        // Check next 2 lines
        for (let offset = 1; offset <= 2; offset++) {
          if (lines[i + offset]) {
            const ym = lines[i + offset].match(/\b(19\d\d|20[0-2]\d)\b/);
            if (ym) {
              year = ym[1];
              break;
            }
          }
        }
        // Check previous line
        if (!year && lines[i - 1]) {
          const ym = lines[i - 1].match(/\b(19\d\d|20[0-2]\d)\b/);
          if (ym) {
            year = ym[1];
          }
        }
      }
      if (!year) year = new Date().getFullYear().toString();

      let degree = "";
      let institution = "";
      
      const cleanedLine = line.replace(year, "").replace(/\s+/g, " ").trim();
      if (hasEdKeyword && hasInstKeyword) {
        const parts = cleanedLine.split(/(?:en|de|del|la|-)/i);
        if (parts.length >= 2) {
          degree = parts[0].trim();
          institution = parts.slice(1).join(" ").trim();
        } else {
          degree = cleanedLine;
          institution = "Institución Educativa";
        }
      } else if (hasEdKeyword) {
        degree = cleanedLine;
        institution = (lines[i + 1] || lines[i - 1] || "Institución Educativa").trim().substring(0, 50);
      } else {
        institution = cleanedLine;
        degree = (lines[i - 1] || lines[i + 1] || "Formación Profesional").trim().substring(0, 50);
      }
      
      degree = degree.replace(/\b(19\d\d|20[0-2]\d)\b/g, "").replace(/[^\w\s\dáéíóúÁÉÍÓÚñÑ]/g, "").replace(/\s+/g, " ").trim().substring(0, 60);
      institution = institution.replace(/\b(19\d\d|20[0-2]\d)\b/g, "").replace(/[^\w\s\dáéíóúÁÉÍÓÚñÑ]/g, "").replace(/\s+/g, " ").trim().substring(0, 60);
      
      if (degree.length >= 3 && institution.length >= 3) {
        const exists = eduList.some((e) => e.degree.toLowerCase() === degree.toLowerCase() && e.institution.toLowerCase() === institution.toLowerCase());
        if (!exists) {
          eduList.push({ degree, institution, year });
        }
      }
    }
  }
  
  return eduList.slice(0, 4);
};

const detectCertifications = (text: string): { name: string; issuer: string; year: string }[] => {
  const certList: { name: string; issuer: string; year: string }[] = [];
  const lines = text.split(/[\n\r]+/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const hasCertKeyword = /certificado|diplomado|curso|taller|seminario|certificac|constancia|capacitaci/i.test(line);
    
    if (hasCertKeyword) {
      let year = "";
      const yearMatchThis = line.match(/\b(19\d\d|20[0-2]\d)\b/);
      if (yearMatchThis) {
        year = yearMatchThis[1];
      } else {
        for (let offset = 1; offset <= 2; offset++) {
          if (lines[i + offset]) {
            const ym = lines[i + offset].match(/\b(19\d\d|20[0-2]\d)\b/);
            if (ym) {
              year = ym[1];
              break;
            }
          }
        }
      }
      if (!year) year = new Date().getFullYear().toString();

      let name = line.replace(year, "").replace(/\s+/g, " ").trim();
      name = name.replace(/\b(19\d\d|20[0-2]\d)\b/g, "").replace(/[^\w\s\dáéíóúÁÉÍÓÚñÑ]/g, "").replace(/\s+/g, " ").trim().substring(0, 60);
      
      let issuer = (lines[i + 1] || lines[i - 1] || "Organización Emisora").trim();
      issuer = issuer.replace(/\b(19\d\d|20[0-2]\d)\b/g, "").replace(/[^\w\s\dáéíóúÁÉÍÓÚñÑ]/g, "").replace(/\s+/g, " ").trim().substring(0, 60);
      
      if (name.length >= 3 && issuer.length >= 3) {
        const exists = certList.some((c) => c.name.toLowerCase() === name.toLowerCase());
        if (!exists) {
          certList.push({ name, issuer, year });
        }
      }
    }
  }
  
  return certList.slice(0, 5);
};

export default function MiPerfilPage() {
  const { user, refetchAuthProfile } = useAuth();

  // Formulario principal
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    experiencia: "",
    district: "",
    bio: "",
  });

  // Estados de listas y tarifas
  const [nivel, setNivel] = useState("");
  const [zones, setZones] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [education, setEducation] = useState<{ degree: string; institution: string; year: string }[]>([]);
  const [certifications, setCertifications] = useState<{ name: string; issuer: string; year: string }[]>([]);

  const [rateEspecializado, setRateEspecializado] = useState("0");
  const [rateAsistencial, setRateAsistencial] = useState("0");
  const [rateAcompanamiento, setRateAcompanamiento] = useState("0");

  const [serviceEspecializado, setServiceEspecializado] = useState(false);
  const [serviceAsistencial, setServiceAsistencial] = useState(false);
  const [serviceAcompanamiento, setServiceAcompanamiento] = useState(false);

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
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  // Estados para CV Parsing
  const [showCvModal, setShowCvModal] = useState(false);
  const [parsingCv, setParsingCv] = useState(false);
  const [pdfjsLoading, setPdfjsLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    setPdfjsLoading(true);
    let pdfjs;
    try {
      pdfjs = await loadPdfJs();
    } catch (err) {
      setPdfjsLoading(false);
      throw new Error("No se pudo cargar la biblioteca PDF.js. Verifica tu conexión a internet.");
    }

    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            let pageText = "";
            let lastY = null;

            for (const item of textContent.items as any[]) {
              const y = item.transform ? item.transform[5] : null;
              // If y-coordinate has shifted significantly, insert a newline
              if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
                pageText += "\n";
              }
              pageText += item.str;
              lastY = y;
            }
            fullText += pageText + "\n\n";
          }
          resolve(fullText);
        } catch (err) {
          reject(err);
        } finally {
          setPdfjsLoading(false);
        }
      };
      fileReader.onerror = (err) => {
        setPdfjsLoading(false);
        reject(err);
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleCvFileChange = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setCvError("El archivo debe ser un documento PDF.");
      return;
    }
    setCvFile(file);
    setCvError(null);
    setParsingCv(true);

    try {
      const text = await extractTextFromPdf(file);
      
      const spec = detectSpecialty(text);
      const exp = detectExperience(text);
      const dist = detectDistrict(text, allDistricts);
      const bio = detectBio(text);
      const edu = detectEducation(text);
      const cert = detectCertifications(text);
      const langs = detectLanguages(text);

      setParsedData({
        specialty: spec,
        experiencia: exp,
        district: dist,
        bio: bio,
        education: edu,
        certifications: cert,
        languages: langs,
      });
    } catch (err: any) {
      console.error("Error parsing CV:", err);
      setCvError(err.message || "Error al leer y extraer los datos del PDF.");
    } finally {
      setParsingCv(false);
    }
  };

  const applyParsedData = () => {
    if (!parsedData) return;
    
    setForm((prev) => ({
      ...prev,
      specialty: parsedData.specialty || prev.specialty,
      experiencia: parsedData.experiencia || prev.experiencia,
      district: parsedData.district || prev.district,
      bio: parsedData.bio || prev.bio,
    }));

    if (parsedData.education && parsedData.education.length > 0) {
      setEducation(parsedData.education);
    }
    if (parsedData.certifications && parsedData.certifications.length > 0) {
      setCertifications(parsedData.certifications);
    }
    if (parsedData.languages && parsedData.languages.length > 0) {
      setLanguages(parsedData.languages);
    }

    setShowCvModal(false);
    setCvFile(null);
    setParsedData(null);
    showToast("Datos de CV extraídos y aplicados con éxito. ¡Por favor revisa el formulario!", "success");
  };

  // Generar array de años desde 1960 hasta el año actual (2026) en orden descendente
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from(
    { length: currentYear - 1960 + 1 },
    (_, index) => (currentYear - index).toString()
  );

  const loadProfileData = async () => {
    if (!user?.id) return;
    try {
      setPageLoading(true);
      const profileData = await fetchEnfermeroProfile(user.id);
      
      setForm({
        name: `${profileData.nombres || ""} ${profileData.apellidos_pa || ""} ${profileData.apellidos_ma || ""}`.trim(),
        specialty: profileData.nurse_profile?.especialidad || "",
        experiencia: profileData.nurse_profile?.anios_experiencia?.toString() || "",
        district: profileData.distrito || "",
        bio: profileData.nurse_profile?.bio || "",
      });

      setNivel(profileData.nurse_profile?.nivel || "Técnico en Enfermería");
      setZones(profileData.zones || []);
      setLanguages(profileData.languages || []);
      setPhotoUrl(profileData.foto_url);

      setEducation(profileData.education?.map((ed) => ({
        degree: ed.titulo,
        institution: ed.institucion,
        year: String(ed.anio),
      })) || []);

      setCertifications(profileData.certifications?.map((c) => ({
        name: c.nombre,
        issuer: c.emisor,
        year: String(c.anio),
      })) || []);

      // Tarifas y estado activo
      const esp = profileData.service_types?.find((s) => s.tipo === "Especializado");
      const asis = profileData.service_types?.find((s) => s.tipo === "Asistencial");
      const acop = profileData.service_types?.find((s) => s.tipo === "Acompañamiento");

      setRateEspecializado(esp?.tarifa_hora ? String(esp.tarifa_hora) : "0");
      setServiceEspecializado(esp?.activo ?? false);

      setRateAsistencial(asis?.tarifa_hora ? String(asis.tarifa_hora) : "0");
      setServiceAsistencial(
        profileData.nurse_profile?.nivel === "Licenciado en Enfermería"
          ? true
          : (asis?.activo ?? false)
      );

      setRateAcompanamiento(acop?.tarifa_hora ? String(acop.tarifa_hora) : "0");
      setServiceAcompanamiento(acop?.activo ?? false);

      setErrors({});
    } catch (err: any) {
      console.error("[Profile] Error al cargar los datos del perfil:", err);
      showToast("Error al cargar los datos del perfil.", "error");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
    setNewEdYear(currentYear.toString());
    setNewCertYear(currentYear.toString());
  }, [user?.id]);

  // ─── MOTOR DE SANITIZACIÓN Y VALIDACIÓN ───
  const validateField = (name: string, value: string): string => {
    let errorMsg = "";
    const cleanedValue = value.replace(/\s+/g, " ").trim();

    const sqlPattern = /(SELECT|UNION|DROP|INSERT|UPDATE|DELETE|WHERE|OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+|--|\/\*|\*\/|;)/i;
    const xssPattern = /(<script|javascript:|onload=|onerror=|<iframe>|<object|<embed)/i;

    if (sqlPattern.test(cleanedValue)) {
      return "Se detectó un patrón de inyección SQL no permitido.";
    }
    if (xssPattern.test(cleanedValue)) {
      return "Se detectó código HTML o scripts no permitidos.";
    }

    if (name === "name" || name === "specialty" || name === "newEdDegree") {
      if (cleanedValue.length > 0) {
        if (cleanedValue.length < 3 || cleanedValue.length > 80) {
          errorMsg = "La longitud debe estar entre 3 y 80 caracteres.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(cleanedValue)) {
          errorMsg = "Solo se permiten letras, espacios, guiones y tildes.";
        }
      } else if (name === "name") {
        errorMsg = "El nombre completo es obligatorio.";
      }
    } else if (name === "district") {
      if (cleanedValue.length < 3 || cleanedValue.length > 50) {
        errorMsg = "El distrito principal debe tener entre 3 y 50 caracteres.";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cleanedValue)) {
        errorMsg = "El distrito solo puede contener letras y espacios.";
      }
    } else if (name === "experiencia") {
      const num = Number(cleanedValue);
      if (cleanedValue && (isNaN(num) || num < 0 || num > 70)) {
        errorMsg = "Debe ser un número entre 0 y 70.";
      }
    } else if (name === "bio") {
      if (cleanedValue.length < 20) {
        errorMsg = "La biografía debe contener al menos 20 caracteres.";
      } else if (cleanedValue.length > 500) {
        errorMsg = "La biografía no puede superar los 500 caracteres.";
      }
    }

    return errorMsg;
  };

  const validateCertificationField = (value: string): string => {
    const cleaned = value.replace(/\s+/g, " ").trim();

    if (/(SELECT|UNION|DROP|--|;)/i.test(cleaned) || /(<script|javascript:)/i.test(cleaned)) {
      return "Se detectó contenido peligroso no permitido.";
    }

    if (cleaned.length < 3 || cleaned.length > 100) {
      return "La longitud debe estar entre 3 y 100 caracteres.";
    }
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(cleaned)) {
      return "Debe contener letras obligatoriamente.";
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-]+$/.test(cleaned)) {
      return "Solo se permiten letras, números, espacios y guiones.";
    }

    return "";
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleAddLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (!selected) return;

    if (!languages.includes(selected)) {
      setLanguages((prev) => [...prev, selected]);
      showToast(`Se agregó el idioma: ${selected}`, "success");
    }
    e.target.value = "";
  };

  const handleRemoveLanguage = (lang: string) => {
    setLanguages((prev) => prev.filter((l) => l !== lang));
  };

  const toggleDistrict = (d: string) => {
    setZones((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const filteredDistricts = allDistricts.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("La imagen debe ser menor a 5MB", "error");
      return;
    }

    setPhotoUploading(true);
    try {
      const publicUrl = await uploadProfilePhoto(user.id, file);
      setPhotoUrl(publicUrl);
      await refetchAuthProfile();
      showToast("Foto de perfil actualizada", "success");
    } catch (err: any) {
      console.error("[Profile] Error al subir foto:", err);
      showToast("Error al actualizar la foto de perfil.", "error");
    } finally {
      setPhotoUploading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const cleanedForm = {
      name: form.name.replace(/\s+/g, " ").trim(),
      specialty: form.specialty.replace(/\s+/g, " ").trim(),
      experiencia: form.experiencia.trim(),
      district: form.district.replace(/\s+/g, " ").trim(),
      bio: form.bio.replace(/\s+/g, " ").trim(),
    };

    setForm(cleanedForm);

    const newErrors: Record<string, string> = {};
    Object.keys(cleanedForm).forEach((key) => {
      const err = validateField(key, cleanedForm[key as keyof typeof cleanedForm]);
      if (err) newErrors[key] = err;
    });

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

    if (zones.length === 0) {
      showToast("Debes seleccionar al menos un distrito de atención para poder guardar.", "error");
      return;
    }

    const hasErrors = Object.values(newErrors).some((x) => x !== "");
    if (hasErrors) {
      showToast("Por favor corrige los errores antes de guardar.", "error");
      return;
    }

    setSaving(true);
    try {
      // Separar nombre completo en partes para la base de datos
      const nameParts = cleanedForm.name.split(" ");
      let nombres = "";
      let apellidos_pa = "";
      let apellidos_ma = "";

      if (nameParts.length >= 3) {
        apellidos_ma = nameParts.pop() || "";
        apellidos_pa = nameParts.pop() || "";
        nombres = nameParts.join(" ");
      } else if (nameParts.length === 2) {
        nombres = nameParts[0];
        apellidos_pa = nameParts[1];
      } else {
        nombres = cleanedForm.name;
      }

      if (nombres.length < 2 || (apellidos_pa && apellidos_pa.length < 2)) {
        showToast("Por favor ingresa un nombre y apellido paterno válidos.", "error");
        setSaving(false);
        return;
      }

      // 1. Guardar profiles y nurse_profiles
      await updateEnfermeroProfile(user.id, {
        nombres,
        apellidos_pa,
        apellidos_ma,
        district: cleanedForm.district,
        specialty: cleanedForm.specialty,
        bio: cleanedForm.bio,
        experience: cleanedForm.experiencia ? Number(cleanedForm.experiencia) : null,
      });

      // 2. Guardar tipos de servicio y sus tarifas
      const servicesToSave: { tipo: string; tarifa_hora: number; activo: boolean; principal: boolean }[] = [];

      if (nivel === "Enfermero Especializado") {
        servicesToSave.push({
          tipo: "Especializado",
          tarifa_hora: Number(rateEspecializado),
          activo: serviceEspecializado,
          principal: true,
        });
      }

      servicesToSave.push(
        {
          tipo: "Asistencial",
          tarifa_hora: Number(rateAsistencial),
          activo: nivel === "Técnico en Enfermería" ? false : true,
          principal: nivel === "Licenciado en Enfermería",
        },
        {
          tipo: "Acompañamiento",
          tarifa_hora: Number(rateAcompanamiento),
          activo: nivel === "Técnico en Enfermería" ? true : serviceAcompanamiento,
          principal: nivel === "Técnico en Enfermería",
        },
      );
      await saveEnfermeroServiceTypes(user.id, servicesToSave);

      // 3. Guardar zonas
      await saveEnfermeroZones(user.id, zones);

      // 4. Guardar idiomas
      await saveEnfermeroLanguages(user.id, languages);

      // 5. Guardar educación
      await saveEnfermeroEducation(user.id, education);

      // 6. Guardar certificaciones
      await saveEnfermeroCertifications(user.id, certifications);

      await refetchAuthProfile();
      showToast("Perfil guardado correctamente", "success");
    } catch (err: any) {
      console.error("[Profile] Error al guardar cambios:", err);
      showToast("Error al guardar cambios: " + (err.message || ""), "error");
    } finally {
      setSaving(false);
    }
  };

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

  const getInitials = () => {
    if (!form.name) return "EN";
    const parts = form.name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  if (pageLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-sm font-semibold text-slate-500">Cargando perfil profesional...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-6">
      
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

        {/* Banner de Importación de CV */}
        <div className="bg-gradient-to-r from-teal-50/70 to-emerald-50/70 rounded-2xl border border-teal-200/50 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="text-lg">✨</span> Autocompletar Perfil con tu CV (PDF)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Sube tu currículum en formato PDF y nuestro asistente extraerá automáticamente tus datos básicos, formación, cursos y distritos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCvModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            Importar Currículum
          </button>
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

            {/* Años de experiencia */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Años de experiencia
              </label>
              <input
                type="number"
                name="experiencia"
                value={form.experiencia}
                onChange={handleInputChange}
                min={0}
                max={70}
                placeholder="Ej. 10"
                className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none transition ${
                  errors.experiencia
                    ? "border-rose-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                    : "border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                }`}
              />
              {errors.experiencia && (
                <p className="text-xs text-rose-500 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.experiencia}
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

            {/* Selector de Idiomas */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Languages className="h-3.5 w-3.5 text-slate-400" />
                Idiomas que hablas
              </label>
              <div className="space-y-2">
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
            
            {/* ESPECIALIZADO */}
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

            {/* ASISTENCIAL */}
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

            {/* ACOMPAÑAMIENTO */}
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

          {/* Listado de distritos seleccionados */}
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

          {/* Buscador de distritos */}
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

          {/* Rejilla de distritos */}
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

            {/* Inputs para agregar nueva formación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <input
                type="text"
                value={newEdDegree}
                onChange={(e) => setNewEdDegree(e.target.value)}
                placeholder="Nombre de la formación (ej. Licenciatura)"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
              <input
                type="text"
                value={newEdInstitution}
                onChange={(e) => setNewEdInstitution(e.target.value)}
                placeholder="Nombre de la institución"
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

            {/* Inputs para agregar nueva certificación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <input
                type="text"
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                placeholder="Nombre del curso / certificación"
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
              />
              <input
                type="text"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                placeholder="Organización emisora"
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
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl disabled:bg-teal-300 shadow-sm cursor-pointer transition flex items-center gap-1.5 animate-in fade-in"
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

      {/* Sistema de Notificaciones flotantes */}
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

      {/* Modal de Importación de CV */}
      {showCvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Cabecera del Modal */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-55 flex items-center justify-center text-teal-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Importar Perfil desde CV (PDF)</h3>
                  <p className="text-xs text-slate-400 font-medium">Extrae automáticamente tus datos profesionales</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCvModal(false);
                  setCvFile(null);
                  setParsedData(null);
                  setCvError(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-650 flex items-center justify-center transition cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Error Alert */}
              {cvError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                  <p className="leading-normal">{cvError}</p>
                </div>
              )}

              {/* Zona 1: Drag & Drop (Si no hay archivo ni se está procesando) */}
              {!cvFile && !parsingCv && (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-teal-400/70 bg-slate-50/50 hover:bg-teal-50/10 rounded-2xl p-10 transition text-center relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCvFileChange(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-450 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-teal-50 group-hover:text-teal-600 transition">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Arrastra tu CV aquí o haz clic para buscar</h4>
                  <p className="text-xs text-slate-400 font-medium mb-1">Solo se admiten documentos en formato PDF</p>
                  <p className="text-[10px] text-slate-450 font-bold">Tamaño máximo de archivo: 10 MB</p>
                </div>
              )}

              {/* Zona 2: Procesando (Spinner de carga) */}
              {(parsingCv || pdfjsLoading) && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-14 h-14 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                    <FileText className="h-6 w-6 text-teal-600 absolute animate-pulse" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-slate-800 text-sm">Procesando currículum...</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {pdfjsLoading ? "Iniciando motor de lectura..." : "Extrayendo formación, experiencia y aptitudes..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Zona 3: Vista previa de datos extraídos (Si ya se procesaron) */}
              {parsedData && !parsingCv && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="bg-emerald-50/50 border border-emerald-200/40 rounded-xl p-4 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-emerald-800 text-xs">¡CV extraído con éxito!</h4>
                      <p className="text-[11px] text-emerald-700 leading-normal mt-0.5">
                        Hemos detectado los siguientes datos. Puedes revisarlos y corregirlos aquí antes de aplicarlos a tu perfil profesional.
                      </p>
                    </div>
                  </div>

                  {/* Campos detectados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                    {/* Especialidad */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Especialidad Detectada</label>
                      <input
                        type="text"
                        value={parsedData.specialty}
                        onChange={(e) => setParsedData({ ...parsedData, specialty: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white"
                        placeholder="Ej. Geriatría y Cuidado del Adulto Mayor"
                      />
                    </div>

                    {/* Años de Experiencia */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Años de Experiencia</label>
                      <input
                        type="number"
                        value={parsedData.experiencia}
                        onChange={(e) => setParsedData({ ...parsedData, experiencia: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white"
                        placeholder="Ej. 5"
                      />
                    </div>

                    {/* Distrito */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Distrito</label>
                      <select
                        value={parsedData.district}
                        onChange={(e) => setParsedData({ ...parsedData, district: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white"
                      >
                        <option value="">Selecciona distrito...</option>
                        {allDistricts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Idiomas */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Idiomas</label>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-100 rounded-xl min-h-[42px]">
                        {parsedData.languages.map((l: string, idx: number) => (
                          <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-650">
                            {l}
                            <button
                              type="button"
                              onClick={() => setParsedData({
                                ...parsedData,
                                languages: parsedData.languages.filter((_: any, i: number) => i !== idx)
                              })}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        {parsedData.languages.length === 0 && (
                          <span className="text-xs text-slate-400 italic p-1">Ninguno detectado</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Biografía / Presentación */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Presentación / Biografía</label>
                    <textarea
                      value={parsedData.bio}
                      onChange={(e) => setParsedData({ ...parsedData, bio: e.target.value })}
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 resize-none bg-white"
                      placeholder="Resumen profesional..."
                    />
                  </div>

                  {/* Formación Académica */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Formación Académica Detectada</label>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {parsedData.education.map((edu: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEd = [...parsedData.education];
                              newEd[idx].degree = e.target.value;
                              setParsedData({ ...parsedData, education: newEd });
                            }}
                            placeholder="Título / Grado"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEd = [...parsedData.education];
                              newEd[idx].institution = e.target.value;
                              setParsedData({ ...parsedData, education: newEd });
                            }}
                            placeholder="Institución"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                          />
                          <select
                            value={edu.year}
                            onChange={(e) => {
                              const newEd = [...parsedData.education];
                              newEd[idx].year = e.target.value;
                              setParsedData({ ...parsedData, education: newEd });
                            }}
                            className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700"
                          >
                            {yearsList.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setParsedData({
                              ...parsedData,
                              education: parsedData.education.filter((_: any, i: number) => i !== idx)
                            })}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center shrink-0 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {parsedData.education.length === 0 && (
                        <p className="text-xs text-slate-400 italic py-2 text-center">No se detectó formación académica</p>
                      )}
                    </div>
                  </div>

                  {/* Certificaciones y Cursos */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Cursos y Certificaciones Detectados</label>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {parsedData.certifications.map((cert: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const newCert = [...parsedData.certifications];
                              newCert[idx].name = e.target.value;
                              setParsedData({ ...parsedData, certifications: newCert });
                            }}
                            placeholder="Nombre del curso"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => {
                              const newCert = [...parsedData.certifications];
                              newCert[idx].issuer = e.target.value;
                              setParsedData({ ...parsedData, certifications: newCert });
                            }}
                            placeholder="Organización emisora"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                          />
                          <select
                            value={cert.year}
                            onChange={(e) => {
                              const newCert = [...parsedData.certifications];
                              newCert[idx].year = e.target.value;
                              setParsedData({ ...parsedData, certifications: newCert });
                            }}
                            className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700"
                          >
                            {yearsList.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setParsedData({
                              ...parsedData,
                              certifications: parsedData.certifications.filter((_: any, i: number) => i !== idx)
                            })}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center shrink-0 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {parsedData.certifications.length === 0 && (
                        <p className="text-xs text-slate-400 italic py-2 text-center">No se detectaron certificaciones</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pie del Modal */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setShowCvModal(false);
                  setCvFile(null);
                  setParsedData(null);
                  setCvError(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 hover:bg-white transition cursor-pointer"
              >
                Cancelar
              </button>
              {parsedData && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setCvFile(null);
                      setParsedData(null);
                      setCvError(null);
                    }}
                    className="px-4 py-2 border border-teal-250 rounded-xl text-xs font-bold text-teal-650 hover:bg-white transition cursor-pointer"
                  >
                    Subir otro
                  </button>
                  <button
                    type="button"
                    onClick={applyParsedData}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                  >
                    Aplicar al Perfil
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
