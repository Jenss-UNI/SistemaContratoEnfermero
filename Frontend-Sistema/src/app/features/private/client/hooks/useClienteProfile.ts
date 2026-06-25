import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import {
  fetchClienteProfile,
  updateClienteProfile,
  fetchClienteSubscription,
} from "../services/clienteProfile.service";
import type {
  ClienteProfile,
  ClienteProfileUpdate,
  ClienteSubscription,
} from "../services/clienteProfile.service";

interface UseClienteProfileReturn {
  profile:      ClienteProfile | null;
  subscription: ClienteSubscription | null;
  loading:      boolean;
  saving:       boolean;
  error:        string | null;
  saveError:    string | null;
  saved:        boolean;
  refetch:      () => Promise<void>;
  save:         (payload: ClienteProfileUpdate) => Promise<boolean>;
}

export function useClienteProfile(): UseClienteProfileReturn {
  const { user } = useAuth();

  const [profile,      setProfile]      = useState<ClienteProfile | null>(null);
  const [subscription, setSubscription] = useState<ClienteSubscription | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [saveError,    setSaveError]    = useState<string | null>(null);
  const [saved,        setSaved]        = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [profileData, subData] = await Promise.all([
        fetchClienteProfile(user.id),
        fetchClienteSubscription(user.id),
      ]);
      setProfile(profileData);
      setSubscription(subData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar el perfil";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Carga inicial
  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (payload: ClienteProfileUpdate): Promise<boolean> => {
      if (!user?.id) return false;
      setSaving(true);
      setSaveError(null);
      setSaved(false);
      try {
        await updateClienteProfile(user.id, payload);
        // Recargar el perfil para reflejar los nuevos datos
        const [updatedProfile, updatedSub] = await Promise.all([
          fetchClienteProfile(user.id),
          fetchClienteSubscription(user.id),
        ]);
        setProfile(updatedProfile);
        setSubscription(updatedSub);
        setSaved(true);
        // Auto-ocultar el mensaje de éxito tras 3 s
        setTimeout(() => setSaved(false), 3000);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error al guardar";
        setSaveError(msg);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [user?.id]
  );

  return {
    profile,
    subscription,
    loading,
    saving,
    error,
    saveError,
    saved,
    refetch: load,
    save,
  };
}
