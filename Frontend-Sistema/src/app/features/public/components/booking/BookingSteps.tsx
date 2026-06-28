interface Props {
  step: number;
}

const steps = [
  "Servicio",
  "Fecha",
  "Familiar",
  "Resumen",
  "Pago",
  "Confirmación"
];

export default function BookingSteps({
  step
}: Props) {
  return (
    <div className="px-4 md:px-8 pt-6">

      <div className="flex items-start justify-between">

        {steps.map((label, index) => {
          const currentStep = index + 1;

          const active = step === currentStep;
          const completed = step > currentStep;

          return (
            <div
              key={label}
              className="flex-1 flex items-center"
            >
              {/* STEP */}
              <div className="flex flex-col items-center relative">

                {/* CIRCLE */}
                <div
                  className={`
                    w-8 h-8 md:w-11 md:h-11
                    rounded-full
                    flex items-center justify-center
                    text-xs md:text-sm font-bold
                    transition-all duration-300

                    ${completed
                      ? "bg-teal-500 text-white"
                      : active
                        ? "bg-teal-500 text-white ring-4 ring-teal-100 scale-110"
                        : "bg-slate-100 text-slate-400"
                    }
                  `}
                >
                  {completed ? "✓" : currentStep}
                </div>

                {/* LABEL DESKTOP */}
                <p
                  className={`
                    hidden md:block
                    mt-3 text-sm font-medium whitespace-nowrap

                    ${active || completed
                      ? "text-slate-900"
                      : "text-slate-400"
                    }
                  `}
                >
                  {label}
                </p>

              </div>

              {/* LINE */}
              {index !== steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 md:mx-3 rounded-full transition-all duration-300

                    ${step > currentStep
                      ? "bg-teal-500"
                      : "bg-slate-200"
                    }
                  `}
                />
              )}
            </div>
          );
        })}

      </div>

      {/* MOBILE STEP LABEL */}
      <div className="md:hidden text-center mt-5">
        <span className="text-sm font-semibold text-teal-600">
          Paso {step}: {steps[step - 1]}
        </span>
      </div>

    </div>
  );
}