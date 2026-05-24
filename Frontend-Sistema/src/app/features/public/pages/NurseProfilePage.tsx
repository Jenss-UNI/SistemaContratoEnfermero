import { Link, useParams } from "react-router-dom";

import NurseProfileHero from "../components/nurse/NurseProfileHero";
import NurseAbout from "../components/nurse/NurseAbout";
import NurseAvailability from "../components/nurse/NurseAvailability";
import NurseEducation from "../components/nurse/NurseEducation";
import NurseCertifications from "../components/nurse/NurseCertifications";
import NurseReviews from "../components/nurse/NurseReviews";
import NursePriceCard from "../components/nurse/NursePriceCard";
import { nurses } from "./DirectorioPage";
import { Footer, Header } from "../../../shared/layout";
import { ChevronLeft } from "lucide-react";
import NurseZones from "../components/nurse/NurseZones";
import NurseRatings from "../components/nurse/NurseRatings";
import NurseLanguages from "../components/nurse/NurseLanguages";
import { useState } from "react";
import BookingModal from "../components/booking/BookingModal";

export default function NurseProfilePage() {

  const [openBooking, setOpenBooking] =
    useState(false);

  const { id } = useParams();

  const nurse = nurses.find(n => n.id === id);

  if (!nurse) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-32">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Profesional no encontrado</h1>
                    <Link
                        to="/directorio"
                        className="mt-4 inline-block text-teal-600 hover:underline"
                    >
                        Volver al directorio
                    </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
    <main className="bg-slate-50 min-h-screen pt-28 pb-20">

      <div className="max-w-7xl mx-auto px-6">

                  {/* Botón volver */}
                  <Link
                      to="/directorio"
                      className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors mb-6 group"
                  >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Volver al directorio
                  </Link>

          <NurseProfileHero
            nurse={nurse}
            onBook={() => setOpenBooking(true)}
          />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            <NurseAbout nurse={nurse} />

            <NurseZones nurse={nurse} />

            <NurseRatings nurse={nurse} />

            <NurseEducation nurse={nurse} />

            <NurseCertifications nurse={nurse} />

            <NurseLanguages nurse={nurse} />

            <NurseReviews nurse={nurse} />

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <NurseAvailability />

              <NursePriceCard
                nurse={nurse}
                onBook={() => setOpenBooking(true)}
              />

          </div>

        </div>

      </div>

    </main>
    <Footer />

      {/* MODAL */}
      <BookingModal
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        nurse={nurse}
      />
    </>
  );
}