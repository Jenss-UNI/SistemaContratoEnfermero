import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../../core/contexts/AuthContext";
import { supabase } from "../../../../core/services/supabase";
import {
  fetchPatients,
  insertPatient,
  updatePatient,
  deletePatient,
} from "../services/patient.service";
import type { Patient } from "../../../../core/models/patient.model";

interface UsePatientsReturn {
  patients:  Patient[];
  loading:   boolean;
  saving:    boolean;
  error:     string | null;
  refetch:   () => Promise<void>;
  add:       (patient: Omit<Patient, "id" | "clientId">, photoFile?: File | null) => Promise<boolean>;
  edit:      (patientId: string, patient: Omit<Patient, "id" | "clientId">, photoFile?: File | null) => Promise<boolean>;
  remove:    (patientId: string) => Promise<boolean>;
}

const initializationsInProgress = new Set<string>();

export function usePatients(): UsePatientsReturn {
  const { user } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // ── Cargar familiares y verificar "Yo mismo" ──────────────────────────────
  const load = useCallback(async () => {
    if (!user?.id) return;

    if (initializationsInProgress.has(user.id)) {
      try {
        const list = await fetchPatients(user.id);
        setPatients(list);
      } catch (err) {
        console.error("Error reloading concurrent:", err);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Obtener la lista de familiares del usuario
      const list = await fetchPatients(user.id);

      // 2. Verificar si ya existe el familiar "Yo mismo"
      const hasSelf = list.some((p) => p.parentesco === "Yo mismo");

      if (!hasSelf) {
        initializationsInProgress.add(user.id);
        try {
          // 3. Si no existe, obtener los datos del perfil del cliente para auto-crearlo
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("nombres, apellidos_pa, apellidos_ma, telefono, direccion, distrito, foto_url")
            .eq("id", user.id)
            .single();

          if (profileError) throw profileError;

          if (profile) {
            const fullName = [
              profile.nombres,
              profile.apellidos_pa,
              profile.apellidos_ma
            ]
              .filter(Boolean)
              .join(" ");

            const selfPatient: Omit<Patient, "id" | "clientId"> = {
              nombreCompleto: fullName,
              edad: 30, // Edad por defecto (editable por el usuario)
              parentesco: "Yo mismo",
              tipoSangre: "",
              fotoUrl: profile.foto_url || undefined,
              condicionesMedicas: [],
              medicamentos: [],
              alergias: [],
              contactoEmergencia: "",
              telefonoEmergencia: profile.telefono || "",
              distrito: profile.distrito || "",
              googleMapsUrl: "",
              notasCuidado: "",
            };

            // Guardar el familiar automático "Yo mismo" en la BD
            await insertPatient(user.id, selfPatient);

            // Volver a cargar la lista para incluir el nuevo registro
            const updatedList = await fetchPatients(user.id);
            setPatients(updatedList);
          }
        } finally {
          initializationsInProgress.delete(user.id);
        }
      } else {
        setPatients(list);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar los familiares";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Carga inicial al montar el hook
  useEffect(() => {
    load();
  }, [load]);

  // ── Agregar familiar ───────────────────────────────────────────────────────
  const add = useCallback(
    async (patient: Omit<Patient, "id" | "clientId">, photoFile?: File | null): Promise<boolean> => {
      if (!user?.id) return false;
      setSaving(true);
      setError(null);
      try {
        const newPatient = await insertPatient(user.id, patient);

        if (photoFile) {
          try {
            const fileExt = photoFile.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `pacientes/${user.id}/${newPatient.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("foto_perfil")
              .upload(filePath, photoFile, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
              .from("foto_perfil")
              .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            // Actualizar paciente en la BD con la URL pública de la foto
            await updatePatient(newPatient.id, {
              ...patient,
              fotoUrl: publicUrl,
            });
          } catch (uploadErr) {
            console.error("Error al subir la foto del familiar:", uploadErr);
            throw uploadErr;
          }
        }

        await load();
        return true;
      } catch (err: unknown) {
        let msg = err instanceof Error ? err.message : "Error al guardar el familiar";
        if (msg.includes("row-level security policy")) {
          msg = "No tienes permisos para subir imágenes a esta carpeta o se violan las políticas de seguridad.";
        }
        setError(msg);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [user?.id, load]
  );

  // ── Editar familiar ────────────────────────────────────────────────────────
  const edit = useCallback(
    async (patientId: string, patient: Omit<Patient, "id" | "clientId">, photoFile?: File | null): Promise<boolean> => {
      if (!user?.id) return false;
      setSaving(true);
      setError(null);
      try {
        let finalFotoUrl = patient.fotoUrl;

        if (photoFile) {
          const fileExt = photoFile.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `pacientes/${user.id}/${patientId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("foto_perfil")
            .upload(filePath, photoFile, { upsert: true });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from("foto_perfil")
            .getPublicUrl(filePath);

          finalFotoUrl = publicUrlData.publicUrl;
        }

        await updatePatient(patientId, {
          ...patient,
          fotoUrl: finalFotoUrl,
        });
        await load();
        return true;
      } catch (err: unknown) {
        let msg = err instanceof Error ? err.message : "Error al actualizar el familiar";
        if (msg.includes("row-level security policy")) {
          msg = "No tienes permisos para subir imágenes a esta carpeta o se violan las políticas de seguridad.";
        }
        setError(msg);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [user?.id, load]
  );

  // ── Eliminar familiar ──────────────────────────────────────────────────────
  const remove = useCallback(
    async (patientId: string): Promise<boolean> => {
      setError(null);
      try {
        await deletePatient(patientId);
        await load();
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error al eliminar el familiar";
        setError(msg);
        return false;
      }
    },
    [load]
  );

  return {
    patients,
    loading,
    saving,
    error,
    refetch: load,
    add,
    edit,
    remove,
  };
}
