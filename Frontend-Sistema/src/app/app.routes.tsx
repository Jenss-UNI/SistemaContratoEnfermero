import { Navigate, Route, Routes } from "react-router-dom";

// Auth
import ForgotPasswordPage from "./features/auth/forgot-password/ForgotPasswordPage";
import LoginPage          from "./features/auth/login/LoginPage";
import RegisterPage       from "./features/auth/register/RegisterPage";

// Públicas
import LandingPage      from "./features/public/pages/LandingPage";
import DirectorioPage   from "./features/public/pages/DirectorioPage";
import NurseProfilePage from "./features/public/pages/NurseProfilePage";
import PlanesPage       from "./features/public/pages/PlanesPage";

// Paneles privados (layouts + sub-rutas exportadas)
import { clientPanelRoutes }   from "./features/private/client/client.routes";
import { CLIENT_PANEL_BASE }   from "./features/private/client/clientNav";
import { adminPanelRoutes }    from "./features/private/admin/admin.routes";
import { ADMIN_PANEL_BASE }    from "./features/private/admin/adminNav";
import { enfermeroPanelRoutes } from "./features/private/enfermero/enfermero.routes";
import { ENFERMERO_PANEL_BASE } from "./features/private/enfermero/enfermeroNav";

// Guard de sesión
import { ProtectedRoute } from "./core/guards";

export function AppRoutes() {
  return (
    <Routes>
      {/* ─────────────────────── RUTAS PÚBLICAS ─────────────────────── */}
      <Route path="/"               element={<LandingPage />} />
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/directorio"     element={<DirectorioPage />} />
      <Route path="/enfermero/:id"  element={<NurseProfilePage />} />
      <Route path="/planes"         element={<PlanesPage />} />

      {/* ─────────────────── PANEL CLIENTE (requiere rol cliente) ────── */}
      <Route element={<ProtectedRoute allowedRoles={["cliente"]} />}>
        {clientPanelRoutes}
      </Route>

      {/* ─────────────── PANEL ENFERMERO (requiere rol enfermero) ───── */}
      <Route element={<ProtectedRoute allowedRoles={["enfermero"]} />}>
        {enfermeroPanelRoutes}
      </Route>

      {/* ──────────────── PANEL ADMIN (requiere rol admin) ────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        {adminPanelRoutes}
      </Route>

      {/* ─────────────────── REDIRECCIONES DE ALIAS ──────────────────── */}
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
      <Route
        path="/admin"
        element={<Navigate to={`${ADMIN_PANEL_BASE}/resumen`} replace />}
      />
    </Routes>
  );
}