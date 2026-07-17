import { useState } from "react";
import { ArrowLeft, Lock, Mail, Key, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../../shared/layout";
import { supabase } from "../../../core/services/supabase";
import loginImage from "../../../../assets/login/inicarsesion.jpg";

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);

	const [email, setEmail] = useState("");
	const [inputCode, setInputCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const sanitizeNoSpaces = (value: string) => value.replace(/\s/g, "");

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setIsLoading(true);
		setErrorMsg("");
		try {
			// 1. Verificar si el correo pertenece a un perfil registrado
			const { data: profile, error: profileErr } = await supabase
				.from("profiles")
				.select("id")
				.eq("correo", email.trim())
				.maybeSingle();

			if (profileErr) throw profileErr;
			if (!profile) {
				setErrorMsg("El correo electrónico ingresado no se encuentra registrado en nuestro sistema.");
				setIsLoading(false);
				return;
			}

			// 2. Generar el código OTP de 6 dígitos
			const code = Math.floor(100000 + Math.random() * 900000).toString();
			const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

			// 3. Insertar el código OTP en la tabla verification_codes
			const { error: dbError } = await supabase
				.from("verification_codes")
				.insert({
					email: email.trim(),
					code,
					purpose: "password_reset",
					expires_at: expiresAt
				});

			if (dbError) throw dbError;

			// 4. Invocar la Deno Edge Function para enviar el correo usando Resend
			const { error: funcError } = await supabase.functions.invoke("resend-email", {
				body: { email: email.trim(), code, purpose: "password_reset" }
			});

			if (funcError) throw funcError;

			setStep(2);
		} catch (err: any) {
			console.error("Error al enviar código:", err);
			setErrorMsg(err.message || "Ocurrió un error al enviar el código de verificación.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputCode) return;

		setIsLoading(true);
		setErrorMsg("");
		try {
			// Consultar la base de datos para verificar que el código sea correcto, no usado y no expirado
			const { data, error } = await supabase
				.from("verification_codes")
				.select("*")
				.eq("email", email.trim())
				.eq("code", inputCode.trim())
				.eq("purpose", "password_reset")
				.eq("used", false)
				.gt("expires_at", new Date().toISOString())
				.maybeSingle();

			if (error) throw error;

			if (!data) {
				setErrorMsg("El código de seguridad ingresado es incorrecto o ha expirado.");
				setIsLoading(false);
				return;
			}

			// Avanzar al Paso 3 conservando el código ingresado para la ejecución atómica del RPC
			setStep(3);
		} catch (err: any) {
			console.error("Error al verificar código:", err);
			setErrorMsg(err.message || "Ocurrió un error al verificar el código.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newPassword || !confirmPassword) return;

		if (newPassword !== confirmPassword) {
			setErrorMsg("Las contraseñas ingresadas no coinciden.");
			return;
		}

		if (newPassword.length < 6) {
			setErrorMsg("La nueva contraseña debe tener al menos 6 caracteres.");
			return;
		}

		if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
			setErrorMsg("La contraseña debe incluir al menos una letra y un número.");
			return;
		}

		setIsLoading(true);
		setErrorMsg("");
		setSuccessMsg("");
		try {
			// Ejecutar el RPC para cambiar la contraseña de manera segura
			const { data, error } = await supabase.rpc("reset_password_by_otp", {
				p_email: email.trim(),
				p_code: inputCode.trim(),
				p_new_password: newPassword
			});

			if (error) throw error;

			if (!data) {
				setErrorMsg("No se pudo restablecer la contraseña. El código OTP podría haber expirado o ya haber sido usado.");
				setIsLoading(false);
				return;
			}

			setSuccessMsg("¡Contraseña restablecida correctamente! Redirigiendo al inicio de sesión...");
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} catch (err: any) {
			console.error("Error al restablecer contraseña:", err);
			setErrorMsg(err.message || "Ocurrió un error inesperado al actualizar la contraseña.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Header />
			<main className="min-h-screen bg-white pt-14">
				<section className="min-h-[calc(100dvh-56px)] w-full">
					<div className="grid min-h-[calc(100dvh-56px)] w-full overflow-hidden bg-white md:grid-cols-[1.05fr_0.95fr]">
						<div className="relative hidden md:block">
							<img
								src={loginImage}
								alt="Adulto mayor en un entorno de cuidado"
								className="absolute inset-0 h-full w-full object-cover"
							/>
							<div className="absolute inset-0 bg-teal-950/45" />
							<div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
								<h1 className="max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
									Cuidado profesional para tu familia
								</h1>
								<p className="mt-4 max-w-md text-sm text-slate-100 sm:text-base">
									Conectamos familias con enfermeros verificados y certificados
									para el cuidado domiciliario en Lima.
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
								<Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6 hover:text-slate-800 transition">
									<ArrowLeft className="h-4 w-4" />
									Volver al inicio de sesión
								</Link>

								{errorMsg && (
									<div className="p-4 mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-300">
										<span className="mt-0.5">⚠</span>
										<span>{errorMsg}</span>
									</div>
								)}

								{successMsg && (
									<div className="p-4 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-300">
										<span className="mt-0.5">✓</span>
										<span>{successMsg}</span>
									</div>
								)}

								{step === 1 && (
									<>
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-500 mb-4 animate-in zoom-in duration-300">
											<Lock className="h-5 w-5" />
										</div>
										<h1 className="mt-4 text-3xl font-bold text-slate-900 text-center">
											¿Olvidaste tu contraseña?
										</h1>
										<p className="mt-3 text-sm text-slate-500 text-center leading-relaxed">
											Ingresa tu correo registrado y te enviaremos un código de seguridad para restablecer tu contraseña.
										</p>

										<form
											className="mt-8 space-y-5"
											onSubmit={handleSendCode}
										>
											<div>
												<label
													htmlFor="email"
													className="mb-2 block text-sm font-medium text-slate-700"
												>
													Correo electrónico
												</label>
												<div className="relative">
													<Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
													<input
														id="email"
														type="email"
														required
														disabled={isLoading}
														value={email}
														onChange={(e) => setEmail(sanitizeNoSpaces(e.target.value))}
														onKeyDown={(e) => {
															if (e.key === " ") e.preventDefault();
														}}
														autoComplete="email"
														placeholder="tu@correo.com"
														className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
													/>
												</div>
											</div>

											<button
												type="submit"
												disabled={isLoading || !email}
												className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition hover:bg-teal-600 flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
											>
												{isLoading ? (
													<>
														<Loader2 className="h-4 w-4 animate-spin" />
														Enviando código...
													</>
												) : (
													"Enviar código de recuperación"
												)}
											</button>
										</form>
									</>
								)}

								{step === 2 && (
									<>
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-500 mb-4 animate-in zoom-in duration-300">
											<Key className="h-5 w-5" />
										</div>
										<h1 className="mt-4 text-3xl font-bold text-slate-900 text-center">
											Verificar código
										</h1>
										<p className="mt-3 text-sm text-slate-500 text-center leading-relaxed">
											Ingresa el código de seguridad de 6 dígitos enviado a <br />
											<span className="font-semibold text-slate-800">{email}</span>
										</p>

										<form
											className="mt-8 space-y-5"
											onSubmit={handleVerifyCode}
										>
											<div>
												<label
													htmlFor="code"
													className="mb-2 block text-sm font-medium text-slate-700"
												>
													Código de seguridad
												</label>
												<input
													id="code"
													type="text"
													maxLength={6}
													required
													disabled={isLoading}
													value={inputCode}
													onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
													placeholder="000000"
													className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 placeholder:text-slate-300 placeholder:tracking-normal disabled:opacity-60"
												/>
											</div>

											<button
												type="submit"
												disabled={isLoading || inputCode.length !== 6}
												className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition hover:bg-teal-600 flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
											>
												{isLoading ? (
													<>
														<Loader2 className="h-4 w-4 animate-spin" />
														Verificando...
													</>
												) : (
													"Verificar código"
												)}
											</button>
										</form>
									</>
								)}

								{step === 3 && (
									<>
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-500 mb-4 animate-in zoom-in duration-300">
											<ShieldCheck className="h-5 w-5" />
										</div>
										<h1 className="mt-4 text-3xl font-bold text-slate-900 text-center">
											Nueva contraseña
										</h1>
										<p className="mt-3 text-sm text-slate-500 text-center leading-relaxed">
											Crea una contraseña segura para proteger tu cuenta de enfermería.
										</p>

										<form
											className="mt-8 space-y-5"
											onSubmit={handleResetPassword}
										>
											<div>
												<label
													htmlFor="newPassword"
													className="mb-2 block text-sm font-medium text-slate-700"
												>
													Nueva contraseña
												</label>
												<div className="relative">
													<Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
													<input
														id="newPassword"
														type={showNewPassword ? "text" : "password"}
														required
														disabled={isLoading}
														value={newPassword}
														onChange={(e) => setNewPassword(e.target.value)}
														placeholder="••••••••"
														className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
													/>
													<button
														type="button"
														onClick={() => setShowNewPassword(!showNewPassword)}
														className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
													>
														{showNewPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>
												</div>
											</div>

											<div>
												<label
													htmlFor="confirmPassword"
													className="mb-2 block text-sm font-medium text-slate-700"
												>
													Confirmar contraseña
												</label>
												<div className="relative">
													<Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
													<input
														id="confirmPassword"
														type={showConfirmPassword ? "text" : "password"}
														required
														disabled={isLoading}
														value={confirmPassword}
														onChange={(e) => setConfirmPassword(e.target.value)}
														placeholder="••••••••"
														className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:opacity-60"
													/>
													<button
														type="button"
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
														className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
													>
														{showConfirmPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>
												</div>
											</div>

											<button
												type="submit"
												disabled={isLoading || !newPassword || !confirmPassword}
												className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition hover:bg-teal-600 flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
											>
												{isLoading ? (
													<>
														<Loader2 className="h-4 w-4 animate-spin" />
														Restableciendo contraseña...
													</>
												) : (
													"Restablecer contraseña"
												)}
											</button>
										</form>
									</>
								)}
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
