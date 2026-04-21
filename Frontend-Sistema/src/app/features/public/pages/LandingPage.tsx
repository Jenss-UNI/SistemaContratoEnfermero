import { Header, Footer } from "../../../shared/layout";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";
import ForProfessionals from "../components/ForProfessionals";

export default function LandingPage() {
  return (
    <>
      <Header transparentOnTop />

      <main>
        <Hero />
        <WhyChooseUs />
        <Benefits />
        <Testimonials />
        <ForProfessionals />
      </main>

      <Footer />
    </>
  );
}
