import { Route, Routes } from "react-router-dom";
import ContratoDetailContent from "../components/mis-contrataciones/ContratoDetailContent";
import MisContratacionesContent from "../components/mis-contrataciones/MisContratacionesContent";

export default function MisContratacionesPage() {
  return (
    <Routes>
      <Route index element={<MisContratacionesContent />} />
      <Route path="contrato/:contratoId" element={<ContratoDetailContent />} />
    </Routes>
  );
}
