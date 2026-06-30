import { useState } from "react";
import { UserPlus, Stethoscope, ShieldCheck, Wallet, FileText, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../../../shared/layout";
import ClienteForm from "./components/ClientForm";
import ProfesionalForm from "./components/ProfesionalForm";
import registroImg from "../../../../assets/registro/registro-image.jpg";

const HERO_IMAGE = registroImg;

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Profesionales verificados por SUNEDU" },
  { icon: Wallet,      label: "Pago protegido en custodia" },
  { icon: FileText,    label: "Contrato digital automático" },
  { icon: CreditCard,  label: "Verificación de identidad DNI" },
];

export default function RegisterPage() {
  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "profesional">("cliente");

  return (
    <>
      <Header />

      <main className="h-screen bg-white pt-[56px] overflow-hidden">
        <section className="grid md:grid-cols-[38%_62%] lg:grid-cols-[40%_60%] xl:grid-cols-[42%_58%] w-full h-[calc(100dvh-56px)]">

   
          <div className="relative hidden md:flex flex-col w-full h-full overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt="Enfermera cuidando a paciente mayor"
              className="absolute inset-0 w-full h-full object-cover object-[center_10%]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-800/85 via-teal-700/45 to-teal-500/15" />

            <div className="relative mt-auto p-8 lg:p-10 text-white">
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-3">
                Únete a la plataforma de salud más confiable del Perú
              </h1>
              <p className="text-white/75 text-sm leading-relaxed mb-7 max-w-xs">
                Más de 2,500 familias ya confían en nosotros para el cuidado de sus seres queridos.
              </p>
              <div className="flex flex-col gap-3">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-teal-500/70 backdrop-blur flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-white" />
                    </div>
                    <span className="text-sm text-white/90 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        
          <div className="flex items-start md:items-center justify-center px-4 sm:px-8 md:px-10 lg:px-14 py-8 bg-white overflow-y-auto w-full h-full">
            <div className="w-full max-w-[500px] my-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Crear cuenta</h2>
                <p className="text-sm text-slate-500 mt-1">
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </div>

              <div className="bg-slate-100 p-1 rounded-2xl flex mb-7">
                {(["cliente", "profesional"] as const).map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoUsuario(tipo)}
                    className={[
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                      tipoUsuario === tipo
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600",
                    ].join(" ")}
                  >
                    {tipo === "cliente" ? <UserPlus size={16} /> : <Stethoscope size={16} />}
                    {tipo === "cliente" ? "Cliente" : "Enfermero"}
                  </button>
                ))}
              </div>

              {/* Formulario animado */}
              <div key={tipoUsuario} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {tipoUsuario === "cliente" ? <ClienteForm /> : <ProfesionalForm />}
              </div>

            </div>
          </div>

        </section>
      </main>
    </>
  );
}