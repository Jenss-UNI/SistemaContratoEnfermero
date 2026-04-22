import { useState } from "react";
import { ArrowLeft, Lock, Mail, Key, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../../shared/layout";
import loginImage from "../../../../assets/login/inicarsesion.jpg";

export default function ForgotPasswordPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	
	const [email, setEmail] = useState("");
	const [generatedCode, setGeneratedCode] = useState("");
	const [inputCode, setInputCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSendCode = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;
		
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		console.log("Código generado:", code);
		setGeneratedCode(code);
		setStep(2);
	};

	const handleVerifyCode = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputCode === generatedCode) {
			setStep(3);
		} else {
			alert("El código ingresado es incorrecto. Por favor, verifica la consola.");
		}
	};

	const handleResetPassword = (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword === confirmPassword && newPassword !== "") {
			alert("Contraseña restablecida correctamente.");
			navigate("/login");
		} else {
			alert("Las contraseñas no coinciden.");
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

								{step === 1 && (
									<>
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-500 mb-4">
											<Lock className="h-5 w-5" />
										</div>
										<h1 className="mt-6 text-3xl font-bold text-slate-900 text-center">
											¿Olvidaste tu contraseña?
										</h1>
										<p className="mt-4 text-sm text-slate-500 text-center">
											Ingresa tu correo y te enviaremos un código para restablecer
											tu contraseña.
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
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														autoComplete="email"
														placeholder="tu@correo.com"
														className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
													/>
												</div>
											</div>

											<button
												type="submit"
												className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition hover:bg-teal-600"
											>
												Enviar código de recuperación
											</button>
										</form>
									</>
								)}

								{step === 2 && (
									<>
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-500 mb-4">
											<Key className="h-5 w-5" />
										</div>
										<h1 className="mt-6 text-3xl font-bold text-slate-900 text-center">
											Verificar código
										</h1>
										<p className="mt-4 text-sm text-slate-500 text-center">
											Ingresa el código de 6 dígitos que enviamos a <br />
											<span className="font-medium text-slate-900">{email}</span>
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
													value={inputCode}
													onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
													placeholder="000000"
													className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 placeholder:text-slate-300 placeholder:tracking-normal"
												/>
											</div>

											<button
												type="submit"
												className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition hover:bg-teal-600"
											>
												Verificar código
											</button>
										</form>
									</>
								)}

								{step === 3 && (
									<>
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-500 mb-4">
											<ShieldCheck className="h-5 w-5" />
										</div>
										<h1 className="mt-6 text-3xl font-bold text-slate-900 text-center">
											Nueva contraseña
										</h1>
										<p className="mt-4 text-sm text-slate-500 text-center">
											Crea una nueva contraseña segura para tu cuenta.
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
														value={newPassword}
														onChange={(e) => setNewPassword(e.target.value)}
														placeholder="••••••••"
														className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
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
														value={confirmPassword}
														onChange={(e) => setConfirmPassword(e.target.value)}
														placeholder="••••••••"
														className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
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
												className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white transition hover:bg-teal-600"
											>
												Restablecer contraseña
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
