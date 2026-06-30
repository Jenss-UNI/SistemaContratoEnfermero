import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  displayName: string;   // primer nombre capitalizado
  initials: string;      // iniciales para el avatar
  fotoUrl: string | null; // URL o base64 de la foto de perfil
  loading: boolean;
  signOut: () => Promise<void>;
  refetchAuthProfile: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Proveedor
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [session, setSession]         = useState<Session | null>(null);
  const [role, setRole]               = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [initials, setInitials]       = useState<string>("");
  const [fotoUrl, setFotoUrl]         = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);

  // Evita actualizar el estado si el componente ya fue desmontado
  const isMounted = useRef(true);

  /** Obtiene el rol, nombre e imagen del usuario desde la tabla pública profiles */
  const fetchUserRole = async (
    userId: string
  ): Promise<{ role: string | null; displayName: string; initials: string; fotoUrl: string | null }> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role, nombres, apellidos_pa, apellidos_ma, foto_url")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const nombres      = (data?.nombres      ?? "").trim();
      const apellidos_pa = (data?.apellidos_pa ?? "").trim();

      // Solo el PRIMER nombre, con capitalización: "VERTILA GUSHINA" → "Vertila"
      const primerNombre = nombres.split(" ")[0] ?? nombres;
      const capitalize   = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

      const displayName = capitalize(primerNombre);

      // Iniciales: primera letra del primer nombre + primera letra del apellido paterno
      const ini = [
        primerNombre.charAt(0),
        apellidos_pa.charAt(0),
      ]
        .filter(Boolean)
        .join("")
        .toUpperCase();

      return {
        role:    data?.role ?? "cliente",
        displayName,
        initials: ini,
        fotoUrl: data?.foto_url ?? null,
      };
    } catch (err) {
      console.error("[Auth] Error al obtener perfil:", err);
      return { role: null, displayName: "", initials: "", fotoUrl: null };
    }
  };

  const refetchAuthProfile = async () => {
    if (!user?.id) return;
    const { role: userRole, displayName: name, initials: ini, fotoUrl: url } =
      await fetchUserRole(user.id);
    if (isMounted.current) {
      setRole(userRole);
      const emailFallback = user.email?.split("@")[0] ?? "Usuario";
      setDisplayName(name || emailFallback);
      setInitials(ini || emailFallback.slice(0, 2).toUpperCase());
      setFotoUrl(url);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, activeSession) => {
        if (!isMounted.current) return;

        if (activeSession?.user) {
          setSession(activeSession);
          setUser(activeSession.user);

          const { role: userRole, displayName: name, initials: ini, fotoUrl: url } =
            await fetchUserRole(activeSession.user.id);

          if (isMounted.current) {
            setRole(userRole);
            const emailFallback = activeSession.user.email?.split("@")[0] ?? "Usuario";
            setDisplayName(name || emailFallback);
            setInitials(ini || emailFallback.slice(0, 2).toUpperCase());
            setFotoUrl(url);
          }
        } else {
          setSession(null);
          setUser(null);
          setRole(null);
          setDisplayName("");
          setInitials("");
          setFotoUrl(null);
        }

        if (isMounted.current) setLoading(false);
      }
    );

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        displayName,
        initials,
        fotoUrl,
        loading,
        signOut,
        refetchAuthProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook de consumo
// ---------------------------------------------------------------------------
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
}