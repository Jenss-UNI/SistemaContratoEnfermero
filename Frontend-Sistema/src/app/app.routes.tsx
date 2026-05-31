import { Navigate, Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "./features/auth/forgot-password/ForgotPasswordPage";
import LoginPage from "./features/auth/login/LoginPage";
import PrivateDashboardPlaceholder from "./features/private/PrivateDashboardPlaceholder";
import RegisterPage from "./features/auth/register/RegisterPage";
import LandingPage from "./features/public/pages/LandingPage";

import { clientPanelRoutes } from "./features/private/client/client.routes";
import { CLIENT_PANEL_BASE } from "./features/private/client/clientNav";
import { adminPanelRoutes } from "./features/private/admin/admin.routes";
import { ADMIN_PANEL_BASE } from "./features/private/admin/adminNav";
import { enfermeroPanelRoutes } from "./features/private/enfermero/enfermero.routes";
import { ENFERMERO_PANEL_BASE } from "./features/private/enfermero/enfermeroNav";

import DirectorioPage from "./features/public/pages/DirectorioPage";

import NurseProfilePage from "./features/public/pages/NurseProfilePage";
import PlanesPage from "./features/public/pages/PlanesPage"; // ← NUEVO


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/directorio" element={<DirectorioPage />} />
      <Route path="/enfermero/:id" element={<NurseProfilePage />} />

      <Route path="/planes" element={<PlanesPage />} /> 

      {clientPanelRoutes}

      <Route
        path="/panel-familiar"
        element={<Navigate to={`${CLIENT_PANEL_BASE}/resumen`} replace />}
      />
      <Route
        path="/mi-perfil-cliente"
        element={<Navigate to={`${CLIENT_PANEL_BASE}/mi-perfil`} replace />}
      />

      <Route
        path="/panel-enfermero"
        element={<Navigate to={`${ENFERMERO_PANEL_BASE}/resumen`} replace />}
      />
      {enfermeroPanelRoutes}
      <Route
        path="/admin"
        element={<Navigate to={`${ADMIN_PANEL_BASE}/resumen`} replace />}
      />
      {adminPanelRoutes}
    </Routes>
  );
}