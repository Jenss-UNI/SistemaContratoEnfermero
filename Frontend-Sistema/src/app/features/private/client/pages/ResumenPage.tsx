import { useState } from "react";
import { PinRegeneratedToast } from "../../../../shared/components/client/resumen";
import ResumenContent from "../components/resumen/ResumenContent";

export default function ResumenPage() {
  const [showPinToast, setShowPinToast] = useState(false);

  return (
    <>
      {showPinToast && (
        <div className="fixed right-4 top-24 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6">
          <PinRegeneratedToast onClose={() => setShowPinToast(false)} />
        </div>
      )}
      <ResumenContent onPinRegenerado={() => setShowPinToast(true)} />
    </>
  );
}
