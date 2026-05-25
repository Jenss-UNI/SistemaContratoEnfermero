import { Navigate, Route } from "react-router-dom";
import { EnfermeroPanelLayout } from "./layout";
import ResumenPage from "./pages/ResumenPage";
import VerificacionPage from "./pages/VerificacionPage";
import MiPerfilPage from "./pages/MiPerfilPage";
import MisServiciosPage from "./pages/MisServiciosPage";
import BitacorasPage from "./pages/BitacorasPage";
import MiAgendaPage from "./pages/MiAgendaPage";
import CalificacionesPage from "./pages/CalificacionesPage";
import ReportesPage from "./pages/ReportesPage";
import BilleteraPage from "./pages/BilleteraPage";
import { ENFERMERO_PANEL_BASE } from "./enfermeroNav";

export const enfermeroPanelRoutes = (
  <Route path={`${ENFERMERO_PANEL_BASE}/*`} element={<EnfermeroPanelLayout />}>
    <Route index element={<Navigate to="resumen" replace />} />
    <Route path="resumen" element={<ResumenPage />} />
    <Route path="verificacion" element={<VerificacionPage />} />
    <Route path="mi-perfil" element={<MiPerfilPage />} />
    <Route path="mis-servicios" element={<MisServiciosPage />} />
    <Route path="bitacoras" element={<BitacorasPage />} />
    <Route path="mi-agenda" element={<MiAgendaPage />} />
    <Route path="calificaciones" element={<CalificacionesPage />} />
    <Route path="reportes" element={<ReportesPage />} />
    <Route path="billetera" element={<BilleteraPage />} />
    <Route path="*" element={<Navigate to="resumen" replace />} />
  </Route>
);
