import { useState } from "react";

import {
  ShieldCheck,
  Lock,
  CheckCircle
} from "lucide-react";

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
  onBack,
  onNext

}: Props) {

  const [showNewCard, setShowNewCard] =
    useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [selectedCard, setSelectedCard] =
    useState<string | null>("1");

  const [cards, setCards] =
    useState<Card[]>([
      {
        id: "1",
        brand: "VISA",
        last4: "4242",
        holder: "CARMEN RODRIGUEZ",
        expiry: "12/27"
      }
    ]);

  const [cardName, setCardName] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardExpiry, setCardExpiry] =
    useState("");

  const [cardCVV, setCardCVV] =
    useState("");

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

                setSelectedCard("1");

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

              onClick={() => {

                if (!isCardValid)
                  return;

                const newCard = {
                  id: Date.now().toString(),
                  brand: "VISA",
                  last4:
                    cardNumber.slice(-4),
                  holder: cardName,
                  expiry: cardExpiry
                };

                setCards([
                  ...cards,
                  newCard
                ]);

                setSelectedCard(
                  newCard.id
                );

                setShowNewCard(false);

                setCardName("");
                setCardNumber("");
                setCardExpiry("");
                setCardCVV("");

              }}

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

          onClick={() => {

            setIsProcessing(true);

            setTimeout(() => {

              setIsProcessing(false);

              onNext();

            }, 2500);

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