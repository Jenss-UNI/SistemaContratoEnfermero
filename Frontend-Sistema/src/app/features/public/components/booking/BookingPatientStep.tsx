import { useState } from "react";

interface Props {
  onBack: () => void;
  onNext: () => void;
}

const patients = [
  {
    id: "1",
    name: "Elena Rodríguez",
    age: 78,
    relation: "Madre",
    photo:
      "https://st2.depositphotos.com/1743476/44189/i/450/depositphotos_441890538-stock-photo-retired-senior-woman-laughing-her.jpg",
    address:
      "Av. Larco 1234, Dpto 502, Miraflores"
  },

  {
    id: "2",
    name: "Mateo Rodríguez",
    age: 6,
    relation: "Hijo",
    photo:
      "https://img.freepik.com/foto-gratis/nino-alegre-dulce-pie-posando-parque-verano-apoyando-barbilla-manos-sonriendo-mirando-otro-lado-fotografia-cerca-concepto-infancia_74855-12734.jpg?semt=ais_hybrid&w=740&q=80",
    address:
      "Av. Larco 1234, Dpto 502, Miraflores"
  }
];

export default function BookingPatientStep({
  onBack,
  onNext
}: Props) {

  const [selectedPatient, setSelectedPatient] =
    useState("1");

  const [notes, setNotes] =
    useState("");

  return (

    <div>

      <h3 className="text-xl font-bold text-slate-900 mb-6">
        Selecciona el paciente
      </h3>

      {/* PATIENTS */}
      <div className="space-y-4">

        {patients.map((patient) => {

          const active =
            selectedPatient === patient.id;

          return (

            <button
              key={patient.id}
              onClick={() =>
                setSelectedPatient(patient.id)
              }
              className={`w-full border rounded-3xl p-5 transition-all text-left

              ${
                active
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 hover:border-slate-300"
              }
            `}
            >

              <div className="flex items-center gap-4">

                <img
                  src={patient.photo}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div className="flex-1">

                  <h4 className="font-semibold text-slate-900">
                    {patient.name}
                  </h4>

                  <p className="text-slate-500 text-sm mt-1">
                    {patient.age} años · {patient.relation}
                  </p>

                  <p className="text-slate-400 text-sm mt-1">
                    {patient.address}
                  </p>

                </div>

                {/* CHECK */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center

                  ${
                    active
                      ? "bg-teal-500 border-teal-500"
                      : "border-slate-300"
                  }
                `}
                >
                  {active && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>

              </div>

            </button>
          );
        })}

      </div>

      {/* ADD PATIENT */}
      <button className="mt-5 text-teal-600 font-medium hover:text-teal-700">
        + Agregar nuevo paciente
      </button>

      {/* NOTES */}
      <div className="mt-8">

        <label className="block text-sm font-medium text-slate-700 mb-3">
          Notas adicionales para el enfermero
        </label>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          rows={5}
          placeholder="Indicaciones especiales, rutinas, preferencias..."
          className="w-full border border-slate-200 rounded-2xl px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

      </div>

      {/* ACTIONS */}
      <div className="flex justify-between gap-4 mt-10">

        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-slate-200 font-medium hover:bg-slate-50 transition"
        >
          Atrás
        </button>

        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition"
        >
          Continuar
        </button>

      </div>

    </div>
  );
}