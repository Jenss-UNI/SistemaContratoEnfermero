import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileSignature, X, Loader2, Eraser } from "lucide-react";
import { signContract } from "../../../../features/private/client/services/hiring.service";

type ConfirmarContratoModalProps = {
  serviceId: string;
  clientName: string;
  clientDni: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ConfirmarContratoModal({
  serviceId,
  clientName,
  clientDni,
  onClose,
  onSuccess,
}: ConfirmarContratoModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1e293b"; // Slate-800 color for ink
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Set correct canvas size based on bounding box
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Handle touch events
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    // Handle mouse events
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: any) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSignContract = async () => {
    if (!hasSignature || !termsAccepted || isSaving) return;

    setIsSaving(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const signatureBase64 = canvas.toDataURL("image/png");
      const clientIp = "127.0.0.1"; // Mock client IP

      await signContract(Number(serviceId), clientDni, signatureBase64, clientIp);
      onSuccess();
    } catch (err: any) {
      console.error("Error signing contract:", err);
      alert(`Error al guardar la firma virtual: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
            <FileSignature className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Firma virtual del contrato</h2>
            <p className="text-xs text-slate-500 mt-0.5">Valida el documento con tu firma digital</p>
          </div>
        </div>

        {/* CLIENT INFO */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Nombre del cliente:</span>
            <span className="font-semibold text-slate-900">{clientName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">DNI del cliente:</span>
            <span className="font-semibold text-slate-900">{clientDni}</span>
          </div>
        </div>

        {/* CANVAS DRAWING PANEL */}
        <div>
          <span className="block text-sm font-medium text-slate-700 mb-2">Firma aquí con el mouse, touchpad o dedo *</span>
          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-44 cursor-crosshair bg-white"
            />
            {/* Eraser button overlay */}
            {hasSignature && (
              <button
                type="button"
                onClick={clearCanvas}
                disabled={isSaving}
                className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <Eraser className="h-3.5 w-3.5" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* CHECKBOX TERMS */}
        <label className="mt-5 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            disabled={isSaving}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <span className="text-sm text-slate-600 leading-relaxed select-none">
            Acepto los términos del contrato y confirmo que los datos ingresados son correctos.
          </span>
        </label>

        {/* FOOTER ACTIONS */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            disabled={!hasSignature || !termsAccepted || isSaving}
            onClick={handleSignContract}
            className="flex-1 rounded-2xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-sm font-bold text-white transition flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Guardando firma..." : "Firmar contrato"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
