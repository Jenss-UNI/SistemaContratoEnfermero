import { useState } from "react";
import {  Eye, EyeOff, Mail, User, Smartphone, CreditCard,  ChevronRight, MapPin, Briefcase, Lock,  CheckCircle2, ArrowLeft, ShieldCheck, AlertCircle, Send, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClienteForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "", apellidos: "", correo: "", dni: "", 
    telefono: "", password: "", distrito: "San Borja", atencion: "Especializado"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isDniVerified, setIsDniVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if ((name === "dni" || name === "telefono") && value && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombres.trim()) newErrors.nombres = "Requerido";
    if (!formData.apellidos.trim()) newErrors.apellidos = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) newErrors.correo = "Correo inválido";
    if (formData.dni.length !== 8) newErrors.dni = "8 dígitos";
    if (!/^9\d{8}$/.test(formData.telefono)) newErrors.telefono = "9 dígitos (9...)";
    if (formData.password.length < 8) newErrors.password = "Mínimo 8";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => { if (validateStep1()) setStep(2); };

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) { setCodeError("Debe tener 6 dígitos"); return; }
    setCodeError(""); setIsEmailVerified(true);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="animate-in fade-in duration-300">
      
      {}
      <div className="flex justify-between items-center px-2 max-w-md mx-auto mb-10">
        {[
          { n: 1, label: 'Datos' },
          { n: 2, label: 'Correo' },
          { n: 3, label: 'DNI' },
          { n: 4, label: 'Final' }
        ].map((s) => (
          <div key={s.n} className="flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s.n ? 'bg-teal-500 text-white shadow-md shadow-teal-100' : 'bg-slate-100 text-slate-400'}`}>
              {step > s.n ? <CheckCircle2 size={16} /> : s.n}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${step >= s.n ? 'text-teal-600' : 'text-slate-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {}
      {step === 1 && (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nombres *</label>
            <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" /><input type="text" name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Ej. Juan Gabriel" className={`w-full p-3 pl-11 rounded-xl border outline-none focus:ring-2 bg-white ${errors.nombres ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'}`} /></div>
            {errors.nombres && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10}/>{errors.nombres}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Apellidos *</label>
            <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" /><input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Ej. Quispe" className={`w-full p-3 pl-11 rounded-xl border outline-none focus:ring-2 bg-white ${errors.apellidos ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'}`} /></div>
            {errors.apellidos && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10}/>{errors.apellidos}</p>}
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Correo electrónico *</label>
            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" /><input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="correo@ejemplo.com" className={`w-full p-3 pl-11 rounded-xl border outline-none focus:ring-2 bg-white ${errors.correo ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'}`} /></div>
            {errors.correo && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10}/>{errors.correo}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">DNI *</label>
            <div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" /><input type="text" name="dni" maxLength={8} value={formData.dni} onChange={handleChange} placeholder="8 dígitos" className={`w-full p-3 pl-11 rounded-xl border outline-none focus:ring-2 bg-white ${errors.dni ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'}`} /></div>
            {errors.dni && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10}/>{errors.dni}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Teléfono *</label>
            <div className="relative"><Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" /><input type="tel" name="telefono" maxLength={9} value={formData.telefono} onChange={handleChange} placeholder="987..." className={`w-full p-3 pl-11 rounded-xl border outline-none focus:ring-2 bg-white ${errors.telefono ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'}`} /></div>
            {errors.telefono && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10}/>{errors.telefono}</p>}
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contraseña *</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" className={`w-full p-3 pl-11 pr-12 rounded-xl border outline-none focus:ring-2 bg-white ${errors.password ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10}/>{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Distrito *</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <select name="distrito" value={formData.distrito} onChange={handleChange} className="w-full p-3 pl-11 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white appearance-none cursor-pointer">
                <option>San Borja</option>
                <option>San Juan de Lurigancho</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Atención *</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <select name="atencion" value={formData.atencion} onChange={handleChange} className="w-full p-3 pl-11 rounded-xl border border-slate-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white appearance-none cursor-pointer">
                <option>Especializado</option>
                <option>Básico</option>
              </select>
            </div>
          </div>

          <button type="button" onClick={handleNextStep1} className="md:col-span-2 mt-4 w-full bg-teal-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 shadow-lg shadow-teal-100 transition-all group">
            Continuar a Verificación <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      )}

      {}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-teal-50 border border-teal-100 p-4 rounded-2xl flex gap-4 text-pretty">
            <div className="bg-white p-2 rounded-lg text-teal-600 h-fit shadow-sm"><Mail size={20} /></div>
            <div>
              <h4 className="font-bold text-teal-900 text-sm">Verificación de Correo</h4>
              <p className="text-xs text-teal-700 mt-1">Enviaremos un código a <span className="font-bold text-teal-800 underline">{formData.correo || "tu correo"}</span></p>
            </div>
          </div>

          <div className="border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm bg-slate-50/50">
            {!isEmailSent ? (
              <button onClick={() => setIsEmailSent(true)} className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-100 hover:bg-teal-600 transition-all">
                <Send size={18} /> Enviar código
              </button>
            ) : !isEmailVerified ? (
              <div className="space-y-4">
                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs flex items-center gap-2 border border-green-100 italic"><CheckCircle2 size={14} /> Revisa tu bandeja de entrada</div>
                <div>
                  <input type="text" maxLength={6} value={verificationCode} onChange={(e) => { setVerificationCode(e.target.value.replace(/\D/g, '')); setCodeError(""); }} placeholder="123456" className={`w-full p-4 text-center text-2xl tracking-[0.5em] font-bold border rounded-xl outline-none focus:ring-2 ${codeError ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100'}`} />
                  {codeError && <p className="text-[10px] text-red-500 font-bold mt-1 text-center">{codeError}</p>}
                </div>
                <button onClick={handleVerifyCode} className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl hover:bg-teal-600 transition-all">Verificar</button>
              </div>
            ) : (
              <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 flex flex-col items-center gap-2 text-teal-600 font-bold">
                <CheckCircle2 size={32} /> Correo Verificado
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={prevStep} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2"><ArrowLeft size={18} /> Volver</button>
            <button onClick={() => setStep(3)} disabled={!isEmailVerified} className={`flex-1 py-3 rounded-xl font-bold transition-all ${isEmailVerified ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600' : 'bg-slate-100 text-slate-300'}`}>Continuar</button>
          </div>
        </div>
      )}

      {}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-4 text-pretty">
            <div className="bg-white p-2 rounded-lg text-amber-600 h-fit shadow-sm"><ShieldCheck size={20} /></div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Verificación RENIEC</h4>
              <p className="text-xs text-amber-700 mt-1">Tu identidad se valida en tiempo real para máxima seguridad.</p>
            </div>
          </div>

          <div className="border border-slate-100 p-6 rounded-2xl shadow-sm bg-slate-50/50">
            {!isDniVerified ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">DNI: <span className="text-slate-900">{formData.dni}</span></span>
                  <span className="text-[10px] text-teal-600 font-bold italic">Listo para validar</span>
                </div>
                <button onClick={() => setIsDniVerified(true)} className="w-full bg-teal-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-all"><Search size={18} /> Verificar Identidad</button>
              </div>
            ) : (
              <div className="space-y-4 animate-in zoom-in duration-300">
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-teal-700 font-bold text-sm"><CheckCircle2 size={16} /> Datos Coinciden</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded border border-teal-50"><p className="text-slate-400">NOMBRES</p><p className="font-bold uppercase">{formData.nombres}</p></div>
                    <div className="bg-white p-2 rounded border border-teal-50"><p className="text-slate-400">APELLIDOS</p><p className="font-bold uppercase">{formData.apellidos}</p></div>
                    <div className="bg-white p-2 rounded border border-teal-50"><p className="text-slate-400">ESTADO</p><p className="font-bold text-green-600">Activo</p></div>
                    <div className="bg-white p-2 rounded border border-teal-50"><p className="text-slate-400">ANTECEDENTES</p><p className="font-bold text-teal-600">Sin registros</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={prevStep} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2"><ArrowLeft size={18}/>Volver</button>
            <button onClick={() => setStep(4)} disabled={!isDniVerified} className={`flex-1 py-3 rounded-xl font-bold ${isDniVerified ? 'bg-teal-500 text-white shadow-lg hover:bg-teal-600 transition-all' : 'bg-slate-100 text-slate-300'}`}>Finalizar</button>
          </div>
        </div>
      )}

      {}
      {step === 4 && (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center"><div className="bg-teal-500 text-white p-5 rounded-full shadow-xl"><CheckCircle2 size={40} /></div></div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">¡Cuenta Lista!</h2>
            <p className="text-sm text-slate-500 mt-2">Tu perfil ha sido creado correctamente.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left space-y-3">
            <div className="flex justify-between text-xs items-center"><span className="text-slate-400 font-bold uppercase">Usuario</span><span className="font-bold text-slate-700 uppercase">{formData.nombres.split(' ')[0]} {formData.apellidos.split(' ')[0]}</span></div>
            <div className="flex justify-between text-xs items-center"><span className="text-slate-400 font-bold uppercase">ID Registro</span><span className="font-mono font-bold text-teal-600 text-sm">CS-{formData.dni.substring(0, 4) || "XXXX"}</span></div>
          </div>

          <div className="pt-4 space-y-3">
            <button className="w-full bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-teal-600 transition-all flex items-center justify-center gap-2"><Search size={18} /> Buscar Profesionales</button>
            <Link to="/" className="block w-full text-slate-400 font-bold py-2 text-sm hover:text-teal-600 transition-colors underline underline-offset-4">Volver al Inicio</Link>
          </div>
        </div>
      )}

    </div>
  );
}