import { Link } from "react-router-dom";
import { Header, Footer } from "../../../shared/layout";

type ComingSoonPageProps = {
  title: string;
  description?: string;
  showFooter?: boolean;
};

export default function ComingSoonPage({ title, description, showFooter = true }: ComingSoonPageProps) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] pt-28 pb-16 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
        <p className="text-slate-600 mb-8">
          {description ?? "Esta sección estará disponible pronto."}
        </p>
        <Link
          to="/"
          className="text-teal-600 font-semibold hover:text-teal-700 underline"
        >
          Volver al inicio
        </Link>
      </main>
      {showFooter && <Footer />}
    </>
  );
}
