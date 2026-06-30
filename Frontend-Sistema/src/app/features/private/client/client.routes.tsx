import { Navigate, Route } from "react-router-dom";
import { ClientPanelLayout } from "./layout";
import CalificacionesPage from "./pages/CalificacionesPage";
import MiPerfilPage from "./pages/MiPerfilPage";
import MisFamiliaresPage from "./pages/MisFamiliaresPage";
import MisContratacionesPage from "./pages/MisContratacionesPage";
import PagosPage from "./pages/PagosPage";
import ReportesPage from "./pages/ReportesPage";
import ResumenPage from "./pages/ResumenPage";
import ContratoPage from "./pages/ContratoPage"; 

import { CLIENT_PANEL_BASE } from "./clientNav";

export const clientPanelRoutes = (
  <Route path={CLIENT_PANEL_BASE} element={<ClientPanelLayout />}>
    <Route index element={<Navigate to="resumen" replace />} />
    <Route path="resumen" element={<ResumenPage />} />
    <Route path="mi-perfil" element={<MiPerfilPage />} />
    <Route path="mis-familiares" element={<MisFamiliaresPage />} />
    <Route path="mis-contrataciones/*" element={<MisContratacionesPage />} />
    <Route path="pagos" element={<PagosPage />} />
    <Route path="calificaciones" element={<CalificacionesPage />} />
    <Route path="reportes" element={<ReportesPage />} />
    <Route path="contrato/:id" element={<ContratoPage />} />
  </Route>
);