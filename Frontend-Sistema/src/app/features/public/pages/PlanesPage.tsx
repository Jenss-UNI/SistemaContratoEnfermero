import { useState } from "react";
import { Check, X, Bookmark, Star, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../../../shared/layout";

type BillingCycle = "mensual" | "anual";
interface PlanFeature { label: string; included: boolean }
interface Plan {
  id: string; name: string; icon: React.ReactNode;
  monthlyPrice: number; annualPrice: number; patientsLabel: string;
  features: PlanFeature[]; highlighted: boolean;
  badge?: { label: string; color: "teal" | "orange" };
  buttonVariant: "outline" | "solid";
}

const PLANS: Plan[] = [
  {
    id: "basico", name: "Plan Básico",
    icon: <Bookmark size={20} strokeWidth={1.8} className="text-gray-500" />,
    monthlyPrice: 24.9, annualPrice: 249.0, patientsLabel: "Hasta 1 pacientes",
    features: [
      { label: "Búsqueda de enfermeros",                  included: true  },
      { label: "Pago seguro con retención",               included: true  },
      { label: "Contratar cualquier tipo de profesional", included: true  },
      { label: "Prioridad en solicitudes",                included: false },
      { label: "Acceso a perfiles TOP",                   included: false },
    ],
    highlighted: false, buttonVariant: "outline",
  },
  {
    id: "premium", name: "Plan Premium",
    icon: <Star size={20} strokeWidth={1.8} className="text-white" />,
    monthlyPrice: 49.9, annualPrice: 499.0, patientsLabel: "Hasta 4 pacientes",
    features: [
      { label: "Búsqueda de enfermeros",                  included: true },
      { label: "Pago seguro con retención",               included: true },
      { label: "Contratar cualquier tipo de profesional", included: true },
      { label: "Prioridad en solicitudes",                included: true },
      { label: "Acceso a perfiles TOP",                   included: true },
    ],
    highlighted: true, badge: { label: "Más Popular", color: "teal" }, buttonVariant: "solid",
  },
  {
    id: "familiar", name: "Plan Familiar",
    icon: <Home size={20} strokeWidth={1.8} className="text-amber-400" />,
    monthlyPrice: 89.9, annualPrice: 899.0, patientsLabel: "Pacientes ilimitados",
    features: [
      { label: "Búsqueda de enfermeros",                  included: true },
      { label: "Pago seguro con retención",               included: true },
      { label: "Contratar cualquier tipo de profesional", included: true },
      { label: "Prioridad máxima en solicitudes",         included: true },
      { label: "Acceso a perfiles TOP",                   included: true },
    ],
    highlighted: false, badge: { label: "Mejor Valor", color: "orange" }, buttonVariant: "outline",
  },
];

function BillingToggle({ billing, onChange }: { billing: BillingCycle; onChange: (v: BillingCycle) => void }) {
  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
      <button
        onClick={() => onChange("mensual")}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          billing === "mensual" ? "bg-[#0ABFBC] text-white" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Mensual
      </button>
      <button
        onClick={() => onChange("anual")}
        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          billing === "anual" ? "bg-[#0ABFBC] text-white" : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Anual
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          billing === "anual" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"
        }`}>+2 meses gratis</span>
      </button>
    </div>
  );
}

function PlanCard({ plan, billing, onSelect }: { plan: Plan; billing: BillingCycle; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const price  = billing === "mensual" ? plan.monthlyPrice : plan.annualPrice;
  const period = billing === "mensual" ? "mes" : "año";
  const [int, dec] = price.toFixed(2).split(".");

 
  const glowColor = plan.highlighted
    ? "rgba(10,191,188,0.18)"
    : plan.badge?.color === "orange"
    ? "rgba(245,158,11,0.15)"
    : "rgba(100,116,139,0.10)";

  const borderColor = plan.highlighted
    ? "#0ABFBC"
    : plan.badge?.color === "orange"
    ? "#F59E0B"
    : hovered ? "#cbd5e1" : "#e2e8f0";

  const borderWidth = plan.highlighted || plan.badge?.color === "orange" ? "2px" : "1px";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `${borderWidth} solid ${borderColor}`,
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 20px 40px ${glowColor}, 0 8px 16px rgba(0,0,0,0.06)`
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease",
      }}
      className="relative bg-white rounded-2xl p-7 flex flex-col h-full cursor-default"
    >

      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className={`text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap
            ${plan.badge.color === "teal" ? "bg-[#0ABFBC] text-white" : "bg-[#F59E0B] text-white"}`}>
            {plan.badge.label}
          </span>
        </div>
      )}

   
      <div
        style={{ transition: "transform 0.3s ease" }}
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
          hovered ? "scale-110" : "scale-100"
        } ${plan.highlighted ? "bg-[#0ABFBC]" : plan.badge?.color === "orange" ? "bg-amber-50" : "bg-gray-100"}`}
      >
        {plan.icon}
      </div>

      <h3 className="text-[17px] font-bold text-gray-900 mb-3">{plan.name}</h3>

      
      <div className="flex items-baseline mb-1">
        <span
          style={{ transition: "color 0.3s ease" }}
          className={`text-xl font-bold ${hovered ? "text-[#0ABFBC]" : "text-gray-900"}`}
        >
          S/
        </span>
        <span
          style={{ transition: "color 0.3s ease" }}
          className={`text-[38px] font-black leading-none tracking-tight mx-1 ${
            hovered ? "text-[#0ABFBC]" : "text-gray-900"
          }`}
        >
          {int}.{dec}
        </span>
        <span className="text-sm text-gray-400">/{period}</span>
      </div>
      <p className="text-xs text-gray-400 mb-5">{plan.patientsLabel}</p>

      <ul className="space-y-3 flex-1 mb-7">
        {plan.features.map(({ label, included }, i) => (
          <li
            key={label}
            style={{
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: `transform 0.25s ease ${i * 35}ms`,
            }}
            className="flex items-center gap-2.5"
          >
            {included
              ? <Check size={15} strokeWidth={2.5} className="text-[#0ABFBC] shrink-0" />
              : <X     size={15} strokeWidth={2.5} className="text-gray-300 shrink-0" />}
            <span className={`text-sm ${included ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
          </li>
        ))}
      </ul>

   
      <button
        onClick={() => onSelect(plan.id)}
        style={{ transition: "background 0.25s ease, color 0.25s ease, transform 0.15s ease" }}
        className={`w-full py-3 rounded-xl text-sm font-semibold active:scale-95 ${
          plan.buttonVariant === "solid"
            ? "bg-[#0ABFBC] text-white hover:bg-[#09aaa7]"
            : hovered
              ? "bg-[#0ABFBC] text-white border border-[#0ABFBC]"
              : "border border-[#0ABFBC] text-[#0ABFBC]"
        }`}
      >
        Registrarme y elegir
      </button>
    </div>
  );
}

const HEADER_HEIGHT = "pt-[52px]";

export default function PlanesPage() {
  const [billing, setBilling] = useState<BillingCycle>("mensual");
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main className={`bg-[#F4F6F9] ${HEADER_HEIGHT}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Planes y Suscripciones
            </h1>
            <p className="text-gray-500 text-[15px] max-w-md mx-auto leading-relaxed">
              Elige el plan que mejor se adapte a tus necesidades. Puedes cambiar o renovar en cualquier momento.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <BillingToggle billing={billing} onChange={setBilling} />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch overflow-visible py-6">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billing={billing}
                onSelect={(id) => navigate(`/register?plan=${id}&billing=${billing}`)}
              />
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 pb-2">
            * Comisión de plataforma: 10% sobre el total del servicio. Puedes cancelar tu suscripción en cualquier momento.
          </p>

        </div>
      </main>

      <Footer />
    </>
  );
}