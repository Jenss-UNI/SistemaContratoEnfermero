import { useState, useEffect } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  Loader2
} from "lucide-react";

import { createHiring } from "../../../private/client/services/hiring.service";

import type { Nurse } from "../../../../core/models/nurse.model";

interface SelectedDay {
  date: Date;
  start: string;
  end: string;
}

interface Props {
  nurse: Nurse;
  selectedService: {
    name: string;
    price: number;
  };
  selectedDays: SelectedDay[];
  selectedPatient: string;
  bookingNotes: string;
  onBack: () => void;
  onNext: () => void;
}

interface Card {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  expiry: string;
}

export default function BookingPaymentStep({
  nurse,
  selectedService,
  selectedDays,
  selectedPatient,
  bookingNotes,
  onBack,
  onNext
}: Props) {
  const { user } = useAuth();
  const [showNewCard, setShowNewCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const loadCards = async () => {
      try {
        const { data, error } = await supabase
          .from("payment_methods")
          .select("id, marca, terminacion, nombre_tarjeta, created_at")
          .eq("client_id", user.id)
          .eq("tipo", "tarjeta");

        if (error) throw error;
        const loadedCards = (data || []).map((c: any) => ({
          id: String(c.id),
          brand: c.marca || "VISA",
          last4: c.terminacion || "4242",
          holder: c.nombre_tarjeta || "Titular",
          expiry: "12/29",
        }));
        setCards(loadedCards);
        if (loadedCards.length > 0) {
          setSelectedCard(loadedCards[0].id);
        }
      } catch (err) {
        console.error("Error loading payment methods:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCards();
  }, [user?.id]);

  const handleSaveCard = async () => {
    if (!user?.id) return;
    if (!isCardValid) return;

    try {
      const cleanNumber = cardNumber.replace(/\s/g, "");
      const brand = cleanNumber.startsWith("5") ? "Mastercard" : "VISA";
      const last4 = cleanNumber.slice(-4);

      const { data, error } = await supabase
        .from("payment_methods")
        .insert({
          client_id: user.id,
          tipo: "tarjeta",
          es_principal: cards.length === 0,
          terminacion: last4,
          marca: brand,
          nombre_tarjeta: cardName,
        })
        .select()
        .single();

      if (error) throw error;

      const newCard = {
        id: String(data.id),
        brand: data.marca || "VISA",
        last4: data.terminacion || last4,
        holder: data.nombre_tarjeta || cardName,
        expiry: "12/29",
      };

      setCards((prev) => [...prev, newCard]);
      setSelectedCard(newCard.id);
      setShowNewCard(false);
      setCardName("");
      setCardNumber("");
      setCardExpiry("");
      setCardCVV("");
    } catch (err: any) {
      console.error("Error saving card:", err);
      alert(`Error al guardar la tarjeta: ${err.message}`);
    }
  };


  const parseHour = (value: string) => {

    const [hourStr] = value.split(":");

    let hour = parseInt(hourStr);

    const isPM =
      value.includes("pm");

    if (
      isPM &&
      hour !== 12
    ) {
      hour += 12;
    }

    if (
      !isPM &&
      hour === 12
    ) {
      hour = 0;
    }

    return hour;
  };

  const totalHours =
    selectedDays.reduce((acc, item) => {

      return (
        acc +
        (
          parseHour(item.end) -
          parseHour(item.start)
        )
      );

    }, 0);

  const subtotal =
    totalHours *
    selectedService.price;

  const validateExpiry = () => {

    if (cardExpiry.length !== 5)
      return false;

    const [month, year] =
      cardExpiry.split("/");

    const monthNum =
      Number(month);

    const yearNum =
      Number(year);

    if (
      monthNum < 1 ||
      monthNum > 12
    ) {
      return false;
    }

    const currentDate =
      new Date();

    const currentYear =
      Number(
        currentDate
          .getFullYear()
          .toString()
          .slice(-2)
      );

    const currentMonth =
      currentDate.getMonth() + 1;

    if (yearNum < currentYear)
      return false;

    if (
      yearNum === currentYear &&
      monthNum < currentMonth
    ) {
      return false;
    }

    return true;
  };

  const isCardValid =

    cardName.trim().length >= 5 &&

    cardNumber.replace(/\s/g, "").length === 16 &&

    validateExpiry() &&

    cardCVV.length === 3;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 font-medium">Cargando métodos de pago...</p>
      </div>
    );
  }

  return (

    <div>

      {/* ALERT */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 mb-6">

        <div className="flex items-start gap-3">

          <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5" />

          <p className="text-sm text-teal-700 leading-7">

            El pago se realiza con
            {" "}
            <span className="font-semibold">
              preautorización
            </span>.
            Solo se retiene el monto si el profesional
            acepta tu solicitud.

          </p>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">

        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <span className="text-slate-500">
              Servicio
            </span>

            <span className="font-semibold text-slate-900">
              {nurse.name}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-slate-500">
              Tipo
            </span>

            <span className="font-semibold text-slate-900">
              {selectedService.name}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-slate-500">
              Total horas
            </span>

            <span className="font-semibold text-slate-900">
              {totalHours}h
            </span>

          </div>

        </div>

        <div className="border-t mt-5 pt-5 flex items-center justify-between">

          <span className="text-2xl font-bold text-slate-900">
            Monto a preautorizar
          </span>

          <span className="text-3xl font-bold text-teal-600">
            S/ {subtotal.toFixed(2)}
          </span>

        </div>

      </div>

      {/* CARDS */}
      {!showNewCard && (

        <div className="mt-8">

          <p className="text-sm font-medium text-slate-700 mb-4">
            Selecciona tu tarjeta
          </p>

          <div className="space-y-4">

            {cards.map((card) => {

              const active =
                selectedCard === card.id;

              return (

                <button
                  key={card.id}

                  onClick={() =>
                    setSelectedCard(card.id)
                  }

                  className={`

                    w-full
                    rounded-3xl
                    p-5
                    text-left
                    border-2
                    transition

                    ${
                      active
                        ? `
                          border-teal-500
                          bg-teal-50
                        `
                        : `
                          border-slate-200
                          hover:border-slate-300
                        `
                    }
                  `}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="
                        w-14
                        h-10
                        rounded-xl
                        bg-blue-600
                        flex
                        items-center
                        justify-center
                        text-white
                        font-bold
                        text-sm
                      ">
                        {card.brand}
                      </div>

                      <div>

                        <p className="font-bold text-slate-900">
                          •••• {card.last4}
                        </p>

                        <p className="text-slate-500 text-sm">
                          {card.holder}
                          {" · "}
                          Vence {card.expiry}
                        </p>

                      </div>

                    </div>

                    {active && (
                      <CheckCircle className="w-6 h-6 text-teal-500" />
                    )}

                  </div>

                </button>

              );

            })}

          </div>

          {/* ADD CARD */}
          <button

            onClick={() => {

              setSelectedCard(null);

              setShowNewCard(true);

            }}

            className="
              mt-5
              text-teal-600
              font-medium
              hover:text-teal-700
            "
          >
            + Usar otra tarjeta
          </button>

        </div>

      )}

      {/* NEW CARD */}
      {showNewCard && (

        <div className="
          mt-8
          border
          border-slate-200
          rounded-3xl
          p-6
        ">

          <h4 className="font-bold text-slate-900">
            Registrar nueva tarjeta
          </h4>

          <p className="text-sm text-slate-400 mt-2">
            Solo Visa y Mastercard.
          </p>

          <div className="space-y-5 mt-6">

            {/* NAME */}
            <div>

              <label className="text-sm text-slate-600">
                Nombre del titular
              </label>

              <input
                value={cardName}

                onChange={(e) => {

                  let value =
                    e.target.value;

                  value =
                    value.replace(
                      /[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g,
                      ""
                    );

                  value =
                    value.replace(/\s{2,}/g, " ");

                  value =
                    value.slice(0, 30);

                  setCardName(value);

                }}

                placeholder="CARMEN RODRIGUEZ"

                className="w-full mt-2 border border-slate-200 rounded-2xl px-4 py-4"
              />

            </div>

            {/* NUMBER */}
            <div>

              <label className="text-sm text-slate-600">
                Número de tarjeta
              </label>

              <input

                value={cardNumber}

                onChange={(e) => {

                  const value =
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16);

                  const formatted =
                    value.replace(/(.{4})/g, "$1 ");

                  setCardNumber(
                    formatted.trim()
                  );

                }}

                placeholder="1234 5678 9012 3456"

                className="w-full mt-2 border border-slate-200 rounded-2xl px-4 py-4"
              />

            </div>

            {/* EXPIRY + CVV */}
            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-sm text-slate-600">
                  Fecha
                </label>

                <input

                  value={cardExpiry}

                  onChange={(e) => {

                    let value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);

                    if (value.length >= 3) {

                      value =
                        value.slice(0, 2) +
                        "/" +
                        value.slice(2);

                    }

                    setCardExpiry(value);

                  }}

                  placeholder="MM/AA"

                  className="w-full mt-2 border border-slate-200 rounded-2xl px-4 py-4"
                />

              </div>

              <div>

                <label className="text-sm text-slate-600">
                  CVV
                </label>

                <input

                  value={cardCVV}

                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 3);

                    setCardCVV(value);

                  }}

                  placeholder="123"

                  className="w-full mt-2 border border-slate-200 rounded-2xl px-4 py-4"
                />

              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">

            <button

              onClick={() => {
                setShowNewCard(false);
                setSelectedCard(cards.length > 0 ? cards[0].id : null);
                setCardName("");
                setCardNumber("");
                setCardExpiry("");
                setCardCVV("");
              }}

              className="
                flex-1
                py-4
                rounded-2xl
                border
                border-slate-200
                font-medium
              "
            >
              Cancelar
            </button>

            <button

              disabled={!isCardValid}

              onClick={handleSaveCard}

              className={`

                flex-1
                py-4
                rounded-2xl
                font-semibold
                transition

                ${
                  isCardValid
                    ? `
                      bg-teal-500
                      hover:bg-teal-600
                      text-white
                    `
                    : `
                      bg-slate-200
                      text-slate-400
                      cursor-not-allowed
                    `
                }
              `}
            >

              Guardar tarjeta

            </button>

          </div>

        </div>

      )}

      {/* SECURITY */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">

        <div className="flex items-center gap-3">

          <Lock className="w-5 h-5 text-teal-500" />

          <p className="text-sm text-slate-500">

            Tus datos están protegidos con
            encriptación SSL.

          </p>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-8">

        <button
          onClick={onBack}
          className="
            flex-1
            py-4
            rounded-2xl
            border
            border-slate-200
            font-medium
            hover:bg-slate-50
            transition
          "
        >
          Atrás
        </button>

        <button

          onClick={async () => {
            if (!user?.id) return;
            setIsProcessing(true);
            try {
              const totalHoursVal = selectedDays.reduce((acc, item) => {
                return acc + (parseHour(item.end) - parseHour(item.start));
              }, 0);
              const totalAmountVal = totalHoursVal * selectedService.price;

              await createHiring({
                clientId: user.id,
                nurseId: nurse.id,
                patientId: selectedPatient,
                serviceType: selectedService.name,
                hourlyRate: selectedService.price,
                totalHours: totalHoursVal,
                totalAmount: totalAmountVal,
                notes: bookingNotes || "",
                days: selectedDays.map((d) => ({
                  date: d.date,
                  start: d.start,
                  end: d.end,
                })),
              });

              setIsProcessing(false);
              onNext();
            } catch (err: any) {
              console.error("Error creating hiring record:", err);
              alert(`Error al procesar la contratación: ${err.message || err}`);
              setIsProcessing(false);
            }
          }}

          disabled={
            isProcessing ||
            showNewCard ||
            !selectedCard
          }

          className={`

            flex-1
            py-4
            rounded-2xl
            font-semibold
            transition

            ${
              isProcessing ||
              showNewCard ||
              !selectedCard

                ? `
                  bg-slate-200
                  text-slate-400
                  cursor-not-allowed
                `

                : `
                  bg-teal-500
                  hover:bg-teal-600
                  text-white
                `
            }
          `}
        >

          <div className="flex items-center justify-center gap-3">

            {isProcessing && (

              <div className="
                w-5
                h-5
                border-2
                border-white
                border-t-transparent
                rounded-full
                animate-spin
              " />

            )}

            <span>

              {isProcessing
                ? "Validando pago..."
                : `Preautorizar S/ ${subtotal.toFixed(2)}`
              }

            </span>

          </div>

        </button>

      </div>

    </div>
  );
}