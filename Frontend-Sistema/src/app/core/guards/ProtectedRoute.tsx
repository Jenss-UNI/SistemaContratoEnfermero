import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  /** Cuando exista auth real, reemplazar por contexto o store. */
  isAuthenticated?: boolean;
};

/**
 * Envuelve rutas que requieren sesión. Por ahora no hay auth: pasar isAuthenticated cuando lo integres.
 */
export function ProtectedRoute({ children, isAuthenticated = false }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
