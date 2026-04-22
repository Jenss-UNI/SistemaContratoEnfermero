import { Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "./features/auth/forgot-password/ForgotPasswordPage";
import LoginPage from "./features/auth/login/LoginPage";
import PrivateDashboardPlaceholder from "./features/private/PrivateDashboardPlaceholder";
import ComingSoonPage from "./features/public/pages/ComingSoonPage";
import LandingPage from "./features/public/pages/LandingPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/register"
        element={<ComingSoonPage title="Registro" showFooter={false} />}
      />
      <Route
        path="/directorio"
        element={<ComingSoonPage title="Directorio de profesionales" />}
      />
      <Route path="/planes" element={<ComingSoonPage title="Planes" />} />
      <Route
        path="/panel-familiar"
        element={<PrivateDashboardPlaceholder title="Panel familiar" />}
      />
      <Route
        path="/mi-perfil-cliente"
        element={<PrivateDashboardPlaceholder title="Mi perfil cliente" />}
      />
      <Route
        path="/panel-enfermero"
        element={<PrivateDashboardPlaceholder title="Panel enfermero" />}
      />
      <Route
        path="/admin"
        element={<PrivateDashboardPlaceholder title="Administración" />}
      />
    </Routes>
  );
}
