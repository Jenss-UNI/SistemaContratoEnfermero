import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../../../shared/layout";
import loginImage from "../../../../assets/login/inicarsesion.jpg";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-[56px]">
        <section className="min-h-[calc(100dvh-56px)] w-full">
          <div className="grid min-h-[calc(100dvh-56px)] w-full overflow-hidden bg-white md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative hidden md:block">
              <img
                src={loginImage}
                alt="Enfermera brindando cuidado a un adulto mayor"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-teal-950/45" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <h1 className="max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
                  Cuidado profesional para tu familia
                </h1>
                <p className="mt-4 max-w-md text-sm text-slate-100 sm:text-base">
                  Conectamos familias con enfermeros verificados y certificados para el cuidado domiciliario en Lima.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-100">
                  <span>Verificados SUNEDU</span>
                  <span>Pago seguro</span>
                  <span>+500 profesionales</span>
                </div>
              </div>
            </div>

            <div className="flex h-full items-center justify-center bg-white p-6 sm:p-10 lg:p-14">
              <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-slate-900">Bienvenido de vuelta</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Ingresa a tu cuenta para continuar.
                </p>

                <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="tu@correo.com"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-2 text-slate-500">
                      <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                      Recordarme
                    </label>
                    <Link to="/forgot-password" className="font-medium text-teal-600 transition hover:text-teal-700">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition hover:bg-teal-600"
                  >
                    Iniciar sesión
                  </button>

                  <p className="text-center text-sm text-slate-600">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="font-semibold text-teal-600 transition hover:text-teal-700">
                      Regístrate gratis
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
