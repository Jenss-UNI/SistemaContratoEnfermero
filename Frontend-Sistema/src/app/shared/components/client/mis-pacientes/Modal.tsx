import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  footer?: React.ReactNode;
};

export default function Modal({
  title,
  onClose,
  children,
  maxWidthClass = "max-w-2xl",
  footer,
}: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const blockBackgroundScroll = (e: WheelEvent | TouchEvent) => {
      const modal = document.getElementById("app-modal-layer");
      if (modal?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    document.addEventListener("wheel", blockBackgroundScroll, { passive: false });
    document.addEventListener("touchmove", blockBackgroundScroll, { passive: false });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", blockBackgroundScroll);
      document.removeEventListener("touchmove", blockBackgroundScroll);
    };
  }, [onClose]);

  return createPortal(
    <div
      id="app-modal-layer"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className={`relative flex max-h-[min(92vh,900px)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ${maxWidthClass} mx-auto`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 id="modal-title" className="text-lg font-bold text-slate-900 sm:text-xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-slate-100 px-5 py-4 sm:px-6">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
