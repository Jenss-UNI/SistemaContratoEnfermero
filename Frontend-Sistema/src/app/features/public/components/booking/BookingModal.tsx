import { useEffect, useState } from "react";

import BookingSteps from "./BookingSteps";
import BookingCalendar from "./BookingCalendar";
import BookingPatientStep from "./BookingPatientStep";
import BookingSummaryStep from "./BookingSummaryStep";
import BookingPaymentStep from "./BookingPaymentStep";
import BookingSuccessStep from "./BookingSuccessStep";
import BookingServiceStep from "./BookingServiceStep";

import type { Nurse } from "../../../../core/models/nurse.model";

interface Props {
  nurse: Nurse;
  open: boolean;
  onClose: () => void;
}

interface SelectedDay {
  date: Date;
  start: string;
  end: string;
}

export default function BookingModal({
  nurse,
  open,
  onClose
}: Props) {

  const [step, setStep] = useState(1);

  const [selectedDays, setSelectedDays] =
    useState<SelectedDay[]>([]);

  const [selectedService, setSelectedService] =
    useState<{
      name: string;
      price: number;
    } | null>(null);

  useEffect(() => {

    if (!open) {

      setStep(1);

      setSelectedDays([]);

      setSelectedService(null);

    }

  }, [open]);

  useEffect(() => {

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [open]);

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">

      <div className="bg-white w-full max-w-3xl max-h-[95vh] rounded-3xl shadow-2xl overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Contratar enfermero
            </h2>

            <p className="text-slate-500 mt-1">
              {nurse.name}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 text-2xl"
          >
            ×
          </button>

        </div>

        {/* STEPS */}
        <BookingSteps step={step} />

        {/* CONTENT */}
        <div className="p-8 min-h-[450px]">

          {/* STEP 1 — SERVICIO */}
          {step === 1 && (

            <BookingServiceStep
              nurse={nurse}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              onBack={onClose}
              onNext={() => setStep(2)}
            />

          )}

          {/* STEP 2 — FECHAS */}
          {step === 2 && selectedService && (

            <BookingCalendar
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              pricePerHour={selectedService.price}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />

          )}

          {/* STEP 3 — PACIENTE */}
          {step === 3 && (

            <BookingPatientStep
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />

          )}

          {/* STEP 4 — RESUMEN */}
          {step === 4 && selectedService && (

            <BookingSummaryStep
              nurse={nurse}
              selectedService={selectedService}
              selectedDays={selectedDays}
              onBack={() => setStep(3)}
              onNext={() => setStep(5)}
            />

          )}

          {/* STEP 5 — PAGO */}
          {step === 5 && selectedService && (

            <BookingPaymentStep
              nurse={nurse}
              selectedService={selectedService}
              selectedDays={selectedDays}
              onBack={() => setStep(4)}
              onNext={() => setStep(6)}
            />

          )}

          {/* STEP 6 — SUCCESS */}
          {step === 6 && selectedService && (

            <BookingSuccessStep
              nurse={nurse}
              selectedService={selectedService}
              selectedDays={selectedDays}
            />

          )}

        </div>

      </div>

    </div>

  );

}