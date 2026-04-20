import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";
import ForProfessionals from "../components/ForProfessionals";

export default function LandingPage() {
  return (
    <>
      <Navbar />

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