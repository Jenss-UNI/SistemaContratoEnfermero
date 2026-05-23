import { FileSignature } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ConfirmarContratoModalProps = {
  onClose: () => void;
  onConfirm: (dni: string) => void;
};

export default function ConfirmarContratoModal({
  onClose,
  onConfirm,
}: ConfirmarContratoModalProps) {
  const [dni, setDni] = useState("");

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
          <FileSignature className="h-6 w-6 text-sky-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Confirmar contrato</h2>
        <p className="mt-2 text-sm text-slate-500">
          Para validar la firma digital, ingresa tu DNI registrado en la plataforma.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-slate-700">DNI</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 12345678"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-2"
          />
        </label>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={dni.length < 8}
            onClick={() => onConfirm(dni)}
            className="flex-1 rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirmar Firma
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
