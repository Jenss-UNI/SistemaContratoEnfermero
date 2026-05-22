import { Navigate, Route } from "react-router-dom";
import ClientPanelLayout from "./layout/ClientPanelLayout";
import CalificacionesPage from "./pages/CalificacionesPage";
import MiPerfilPage from "./pages/MiPerfilPage";
import MisContratacionesPage from "./pages/MisContratacionesPage";
import MisPacientesPage from "./pages/MisPacientesPage";
import PagosPage from "./pages/PagosPage";
import ReportesPage from "./pages/ReportesPage";
import ResumenPage from "./pages/ResumenPage";
import { CLIENT_PANEL_BASE } from "./clientNav";

export const clientPanelRoutes = (
  <Route path={CLIENT_PANEL_BASE} element={<ClientPanelLayout />}>
    <Route index element={<Navigate to="resumen" replace />} />
    <Route path="resumen" element={<ResumenPage />} />
    <Route path="mis-pacientes" element={<MisPacientesPage />} />
    <Route path="mis-contrataciones" element={<MisContratacionesPage />} />
    <Route path="pagos" element={<PagosPage />} />
    <Route path="calificaciones" element={<CalificacionesPage />} />
    <Route path="reportes" element={<ReportesPage />} />
    <Route path="mi-perfil" element={<MiPerfilPage />} />
  </Route>
);
