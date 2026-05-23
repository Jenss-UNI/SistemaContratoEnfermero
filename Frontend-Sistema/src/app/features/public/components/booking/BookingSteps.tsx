interface Props {
  step: number;
}

const steps = [
  "Servicio",
  "Fecha",
  "Paciente",
  "Resumen",
  "Pago",
  "Confirmación"
];

export default function BookingSteps({
  step
}: Props) {

  return (

    <div className="px-8 pt-6">

      <div className="flex items-center justify-between">

        {steps.map((label, index) => {

          const currentStep = index + 1;

          const active =
            step === currentStep;

          const completed =
            step > currentStep;

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

                    w-11 h-11 rounded-full
                    flex items-center justify-center
                    text-sm font-bold transition-all

                    ${
                      completed
                        ? "bg-teal-500 text-white"
                        : active
                        ? "bg-teal-500 text-white ring-4 ring-teal-100"
                        : "bg-slate-100 text-slate-400"
                    }

                  `}
                >

                  {completed ? "✓" : currentStep}

                </div>

                {/* LABEL */}
                <p
                  className={`

                    mt-3 text-sm font-medium whitespace-nowrap

                    ${
                      active || completed
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

                    flex-1 h-1 mx-3 rounded-full transition-all

                    ${
                      step > currentStep
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

    </div>

  );

}