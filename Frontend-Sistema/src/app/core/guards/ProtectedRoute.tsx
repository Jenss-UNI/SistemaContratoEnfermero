import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  /** Roles que pueden acceder. Si no se pasa, solo requiere estar autenticado. */
  allowedRoles?: string[];
}

/**
 * Layout route de React Router v6.
 * Úsalo como <Route element={<ProtectedRoute allowedRoles={["cliente"]} />}>
 *   <Route ... />   ← Estas rutas usan <Outlet /> internamente
 * </Route>
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Mientras Supabase recupera la sesión del localStorage → spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  // Sin usuario → redirigir al login conservando la ruta de origen
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rol no permitido → redirigir al inicio
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Autenticado y con rol correcto → renderizar las rutas hijas
  return <Outlet />;
}