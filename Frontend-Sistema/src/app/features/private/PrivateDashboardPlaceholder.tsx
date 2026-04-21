import { Link } from "react-router-dom";
import { Header, Footer } from "../../shared/layout";

type PrivateDashboardPlaceholderProps = {
  title: string;
};

/**
 * Vista temporal para áreas privadas hasta implementar paneles reales.
 */
export default function PrivateDashboardPlaceholder({ title }: PrivateDashboardPlaceholderProps) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] pt-28 pb-16 px-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-600 mb-6">Panel en construcción.</p>
        <Link to="/" className="text-teal-600 font-semibold hover:text-teal-700">
          Volver al inicio
        </Link>
      </main>
      <Footer />
    </>
  );
}
