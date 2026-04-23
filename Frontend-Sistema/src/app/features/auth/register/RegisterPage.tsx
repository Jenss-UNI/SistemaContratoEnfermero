import { useState } from "react";
import { Heart, UserPlus, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../../../shared/layout";
import loginImage from "../../../../assets/login/inicarsesion.jpg";


import ClienteForm from "./components/ClientForm";
import ProfesionalForm from "./components/ProfesionalForm";

export default function RegisterPage() {
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'profesional'>('cliente');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-[56px]">
        <section className="min-h-[calc(100dvh-56px)] w-full grid md:grid-cols-[0.8fr_1.2fr]">
          
          <div className="relative hidden md:block">
            <img src={loginImage} alt="Cuidado Salud" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-teal-950/45" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <h1 className="text-4xl font-bold italic">Cuidado profesional para tu familia</h1>
              <p className="mt-4 opacity-90 font-light tracking-wide">Plataforma segura y verificada.</p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 bg-slate-50/30 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-teal-600">
                  <Heart size={24} fill="currentColor" />
                  <h2 className="text-3xl font-bold text-slate-900">Crear cuenta</h2>
                </div>
                <p className="text-sm text-slate-500">¿Ya tienes cuenta? <Link to="/login" className="text-teal-600 font-bold hover:underline">Inicia sesión</Link></p>
              </div>

              {/* SELECTOR */}
              <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center mb-8">
                <button 
                  type="button" 
                  onClick={() => setTipoUsuario('cliente')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${tipoUsuario === 'cliente' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  <UserPlus size={18} /> Busco Cuidador
                </button>
                <button 
                  type="button" 
                  onClick={() => setTipoUsuario('profesional')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${tipoUsuario === 'profesional' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  <Stethoscope size={18} /> Soy Profesional
                </button>
              </div>

              {}
              {tipoUsuario === 'cliente' ? <ClienteForm /> : <ProfesionalForm />}

            </div>
          </div>
        </section>
      </main>
    </>
  );
}