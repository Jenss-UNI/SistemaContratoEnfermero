import { Navigate, Route } from "react-router-dom";
import { AdminPanelLayout } from "./layout";
import ContratosPage from "./pages/ContratosPage";
import GestionClientesPage from "./pages/GestionClientesPage";
import GestionEnfermerosPage from "./pages/GestionEnfermerosPage";
import ReportesPage from "./pages/ReportesPage";
import ResumenPage from "./pages/ResumenPage";
import VerificacionesPage from "./pages/VerificacionesPage";
import { ADMIN_PANEL_BASE } from "./adminNav";

export const adminPanelRoutes = (
  <Route path={`${ADMIN_PANEL_BASE}/*`} element={<AdminPanelLayout />}>
    <Route index element={<Navigate to="resumen" replace />} />
    <Route path="resumen" element={<ResumenPage />} />
    <Route path="verificaciones" element={<VerificacionesPage />} />
    <Route path="gestion-enfermeros" element={<GestionEnfermerosPage />} />
    <Route path="gestion-clientes" element={<GestionClientesPage />} />
    <Route path="contratos" element={<ContratosPage />} />
    <Route path="reportes" element={<ReportesPage />} />
    <Route path="*" element={<Navigate to="resumen" replace />} />
  </Route>
);
