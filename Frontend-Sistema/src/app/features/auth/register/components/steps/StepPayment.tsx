import { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, Shield, CheckCircle2, Copy } from "lucide-react";

interface PlanInfo {
    id: string;
    name: string;
    price: string;
    billing: "mensual" | "anual";
}

interface StepPaymentProps {
    plan: PlanInfo;
    onConfirm: (paymentMethod: PaymentMethodData) => void;
    onBack: () => void;
    isLoading?: boolean;
}

export interface PaymentMethodData {
    tipo: "tarjeta" | "yape" | "plin";
    // Tarjeta
    terminacion?: string;
    marca?: string;
    nombre_tarjeta?: string;
    // Yape / Plin
    telefono?: string;
}

type PaymentScreen = "method" | "card" | "yape" | "plin";

const YAPE_PHONE = "987654321";
const PLIN_PHONE = "912345678";

function detectCardBrand(number: string): string {
    const n = number.replace(/\s/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "Amex";
    return "Otra";
}

export default function StepPayment({ plan, onConfirm, onBack, isLoading }: StepPaymentProps) {
    const [screen, setScreen] = useState<PaymentScreen>("method");
    const [selectedMethod, setSelectedMethod] = useState<"tarjeta" | "yape" | "plin" | null>(null);

    // Card fields
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardError, setCardError] = useState("");

    // Yape/Plin fields
    const [walletPhone, setWalletPhone] = useState("");
    const [walletCopied, setWalletCopied] = useState(false);
    const [walletError, setWalletError] = useState("");

    const handleCopyPhone = (phone: string) => {
        navigator.clipboard.writeText(phone).then(() => {
            setWalletCopied(true);
            setTimeout(() => setWalletCopied(false), 2000);
        });
    };

    const handleCardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCardError("");
        const clean = cardNumber.replace(/\s/g, "");
        if (clean.length < 13 || clean.length > 19) {
            setCardError("Número de tarjeta inválido");
            return;
        }
        if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
            setCardError("Formato de vencimiento inválido (MM/AA)");
            return;
        }
        if (cardCvv.length < 3) {
            setCardError("CVV inválido");
            return;
        }
        onConfirm({
            tipo: "tarjeta",
            terminacion: clean.slice(-4),
            marca: detectCardBrand(cardNumber),
            nombre_tarjeta: cardName.trim(),
        });
    };

    const handleWalletSubmit = (tipo: "yape" | "plin") => (e: React.FormEvent) => {
        e.preventDefault();
        setWalletError("");
        if (!/^9\d{8}$/.test(walletPhone)) {
            setWalletError("Ingresa un número peruano válido de 9 dígitos (empieza con 9)");
            return;
        }
        onConfirm({
            tipo,
            telefono: walletPhone,
        });
    };

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Plan summary banner */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-0.5">Plan seleccionado</p>
                    <p className="font-bold text-slate-800 text-sm">{plan.name} — {plan.billing === "mensual" ? "Mensual" : "Anual (+2 meses gratis)"}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-extrabold text-teal-600">S/ {plan.price}</p>
                    <p className="text-[10px] text-slate-400">/{plan.billing === "mensual" ? "mes" : "año"}</p>
                </div>
            </div>

            {/* ======================== SCREEN: METHOD SELECTION ======================== */}
            {screen === "method" && (
                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Elige tu método de pago</p>

                    {/* Tarjeta */}
                    <button
                        onClick={() => { setSelectedMethod("tarjeta"); setScreen("card"); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                            ${selectedMethod === "tarjeta"
                                ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-100"
                                : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm"}`}
                    >
                        <div className="w-11 h-11 flex items-center justify-center bg-slate-900 rounded-xl flex-shrink-0">
                            <CreditCard size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800">Tarjeta de débito / crédito</p>
                            <p className="text-xs text-slate-400 mt-0.5">Visa, Mastercard, Amex</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" alt="Visa" className="h-4 object-contain opacity-70" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-4 object-contain opacity-70" />
                        </div>
                    </button>

                    {/* Yape */}
                    <button
                        onClick={() => { setSelectedMethod("yape"); setWalletPhone(""); setScreen("yape"); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                            ${selectedMethod === "yape"
                                ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-100"
                                : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm"}`}
                    >
                        <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex-shrink-0">
                            <Smartphone size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800">Yape</p>
                            <p className="text-xs text-slate-400 mt-0.5">Pago rápido con QR o número</p>
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full flex-shrink-0">QR</span>
                    </button>

                    {/* Plin */}
                    <button
                        onClick={() => { setSelectedMethod("plin"); setWalletPhone(""); setScreen("plin"); }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                            ${selectedMethod === "plin"
                                ? "border-sky-500 bg-sky-50 shadow-md shadow-sky-100"
                                : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm"}`}
                    >
                        <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex-shrink-0">
                            <Smartphone size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800">Plin</p>
                            <p className="text-xs text-slate-400 mt-0.5">Pago rápido con QR o número</p>
                        </div>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-2 py-1 rounded-full flex-shrink-0">QR</span>
                    </button>

                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 text-xs text-slate-500 border border-slate-100">
                        <Shield size={14} className="text-teal-500 flex-shrink-0" />
                        <span>Pago 100% seguro. El cargo se realiza solo al confirmar el registro.</span>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onBack}
                            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <ArrowLeft size={16} /> Volver
                        </button>
                    </div>
                </div>
            )}

            {/* ======================== SCREEN: CARD FORM ======================== */}
            {screen === "card" && (
                <div className="space-y-4">
                    <button
                        onClick={() => setScreen("method")}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Datos de la tarjeta
                    </button>

                    {cardError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
                            {cardError}
                        </div>
                    )}

                    <form onSubmit={handleCardSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Número de tarjeta</label>
                            <div className="relative">
                                <input
                                    required
                                    value={cardNumber}
                                    onChange={(e) =>
                                        setCardNumber(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .replace(/(.{4})/g, "$1 ")
                                                .trim()
                                                .slice(0, 19)
                                        )
                                    }
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                                />
                                {cardNumber && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                                        {detectCardBrand(cardNumber)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Nombre en la tarjeta</label>
                            <input
                                required
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                placeholder="JUAN PEREZ"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Vencimiento</label>
                                <input
                                    required
                                    value={cardExpiry}
                                    onChange={(e) =>
                                        setCardExpiry(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .replace(/^(\d{2})(\d)/, "$1/$2")
                                                .slice(0, 5)
                                        )
                                    }
                                    placeholder="MM/AA"
                                    maxLength={5}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700 block mb-1.5">CVV</label>
                                <input
                                    required
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                    placeholder="123"
                                    maxLength={4}
                                    type="password"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 bg-slate-50 rounded-xl p-3 text-xs text-slate-500 border border-slate-100">
                            <Shield size={13} className="text-teal-500 flex-shrink-0 mt-0.5" />
                            <span>Pago seguro con encriptación SSL. El cargo es una preautorización; solo se debitará al confirmar el servicio.</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl cursor-pointer transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={16} />
                                    Pagar S/ {plan.price}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* ======================== SCREEN: YAPE ======================== */}
            {screen === "yape" && (
                <WalletScreen
                    tipo="yape"
                    businessPhone={YAPE_PHONE}
                    amount={plan.price}
                    walletPhone={walletPhone}
                    setWalletPhone={setWalletPhone}
                    error={walletError}
                    isLoading={!!isLoading}
                    onBack={() => setScreen("method")}
                    onSubmit={handleWalletSubmit("yape")}
                    onCopy={handleCopyPhone}
                    copied={walletCopied}
                />
            )}

            {/* ======================== SCREEN: PLIN ======================== */}
            {screen === "plin" && (
                <WalletScreen
                    tipo="plin"
                    businessPhone={PLIN_PHONE}
                    amount={plan.price}
                    walletPhone={walletPhone}
                    setWalletPhone={setWalletPhone}
                    error={walletError}
                    isLoading={!!isLoading}
                    onBack={() => setScreen("method")}
                    onSubmit={handleWalletSubmit("plin")}
                    onCopy={handleCopyPhone}
                    copied={walletCopied}
                />
            )}
        </div>
    );
}

/* ===================== SHARED WALLET SCREEN COMPONENT ===================== */
interface WalletScreenProps {
    tipo: "yape" | "plin";
    businessPhone: string;
    amount: string;
    walletPhone: string;
    setWalletPhone: (v: string) => void;
    error: string;
    isLoading: boolean;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onCopy: (phone: string) => void;
    copied: boolean;
}

function WalletScreen({
    tipo, businessPhone, amount, walletPhone, setWalletPhone,
    error, isLoading, onBack, onSubmit, onCopy, copied
}: WalletScreenProps) {
    const isYape = tipo === "yape";
    const colorPrimary = isYape ? "purple" : "sky";
    const gradientFrom = isYape ? "from-purple-600" : "from-sky-400";
    const gradientTo = isYape ? "to-purple-800" : "to-sky-600";
    const ringColor = isYape ? "ring-purple-200 focus:ring-purple-300" : "ring-sky-200 focus:ring-sky-300";
    const btnColor = isYape
        ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
        : "bg-sky-500 hover:bg-sky-600 shadow-sky-200";
    const badgeBg = isYape ? "bg-purple-100 text-purple-700" : "bg-sky-100 text-sky-700";

    return (
        <div className="space-y-4">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
                <ArrowLeft size={16} /> Pagar con {isYape ? "Yape" : "Plin"}
            </button>

            {/* QR Card */}
            <div className={`rounded-2xl overflow-hidden border ${isYape ? "border-purple-100" : "border-sky-100"}`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} px-5 py-4 flex items-center justify-between`}>
                    <div>
                        <p className="text-white font-bold text-base">{isYape ? "Yape" : "Plin"}</p>
                        <p className="text-white/70 text-xs mt-0.5">Escanea el QR o yapea al número</p>
                    </div>
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        S/ {amount}
                    </span>
                </div>

                {/* QR placeholder */}
                <div className="bg-white p-5 flex flex-col items-center gap-4">
                    <div className={`w-36 h-36 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg p-1`}>
                        <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                            <div className="grid grid-cols-5 gap-0.5 p-2">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-sm ${Math.random() > 0.4 ? (isYape ? "bg-purple-700" : "bg-sky-600") : "bg-white"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center leading-relaxed">
                        Abre tu app de {isYape ? "Yape" : "Plin"}, escanea el QR<br />o yapea directo al número:
                    </p>
                    <button
                        onClick={() => onCopy(businessPhone)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl ${badgeBg} text-sm font-bold transition-all cursor-pointer hover:opacity-80`}
                    >
                        {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                        {copied ? "¡Copiado!" : businessPhone}
                    </button>
                    <p className="text-[10px] text-slate-400">El monto a {isYape ? "yapear" : "plinear"}: <strong>S/ {amount}</strong></p>
                </div>
            </div>

            {/* Confirmation form */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Tu número {isYape ? "Yape" : "Plin"} (para confirmar)
                    </label>
                    <input
                        required
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                        placeholder="9XX XXX XXX"
                        maxLength={9}
                        className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${ringColor} focus:border-transparent transition-all`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                        Ingresa el número desde el que realizaste el {isYape ? "Yape" : "Plin"}
                    </p>
                </div>

                <div className="flex items-start gap-2 bg-slate-50 rounded-xl p-3 text-xs text-slate-500 border border-slate-100">
                    <Shield size={13} className="text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>
                        Una vez confirmado tu pago, activa tu cuenta ingresando tu número {isYape ? "Yape" : "Plin"}. 
                        Nuestro equipo verificará el pago en minutos.
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${btnColor} disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2`}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={16} />
                            Confirmar pago con {isYape ? "Yape" : "Plin"}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
