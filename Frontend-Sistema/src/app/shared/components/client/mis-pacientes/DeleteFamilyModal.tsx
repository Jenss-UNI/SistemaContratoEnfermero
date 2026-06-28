import Modal from "./Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

type DeleteFamilyModalProps = {
  patientName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  hasActiveServices?: boolean;
  loadingServices?: boolean;
};

export default function DeleteFamilyModal({
  patientName,
  onClose,
  onConfirm,
  isDeleting = false,
  hasActiveServices = false,
  loadingServices = false,
}: DeleteFamilyModalProps) {
  return (
    <Modal title="Confirmar eliminación" onClose={onClose} maxWidthClass="max-w-md">
      <div className="space-y-6 py-2">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-505" style={{ color: "#ef4444" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              ¿Eliminar a tu familiar {patientName}?
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              {hasActiveServices
                ? "No se puede eliminar este familiar porque tiene contrataciones asociadas en estado pendiente, confirmado o activo."
                : "Esta acción no se puede deshacer."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {loadingServices ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              Verificando servicios asociados...
            </div>
          ) : hasActiveServices ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cerrar
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-sm font-semibold text-white transition flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
