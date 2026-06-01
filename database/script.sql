CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. FUNCIONES BASE
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

 /*CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.get_my_role() = 'admin', FALSE);
$$;
*/
-- ============================================================
-- 2. PROFILES
-- ============================================================
CREATE TABLE profiles (
  id             UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role           TEXT         NOT NULL DEFAULT 'cliente'
                              CHECK (role IN ('cliente', 'enfermero', 'admin')),
  nombres        TEXT         NOT NULL CHECK (char_length(nombres) BETWEEN 2 AND 80),
  apellidos_ma      TEXT         NOT NULL CHECK (char_length(apellidos_ma) BETWEEN 2 AND 80),
  apellidos_pa      TEXT         NOT NULL CHECK (char_length(apellidos_pa) BETWEEN 2 AND 80),
  correo         TEXT         NOT NULL UNIQUE,
  telefono       VARCHAR(9)   CHECK (telefono ~ '^\d{9}$'),
  dni            VARCHAR(8)   UNIQUE CHECK (dni ~ '^\d{8}$'),
  distrito       TEXT,        -- distrito de residencia (compartido por todos los roles)
  foto_url       TEXT,        -- URL en Supabase Storage
  dni_verified        boolean     not null default false,
  email_verified      boolean     not null default false,
  account_status TEXT         NOT NULL DEFAULT 'activo'
                              CHECK (account_status IN ('activo', 'suspendido', 'eliminado')),
  suspension_reason   text,                            
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Perfil base de todos los usuarios (cliente, enfermero, admin).';
COMMENT ON COLUMN profiles.dni IS 'DNI peruano de 8 dígitos. Único por usuario.';
COMMENT ON COLUMN profiles.distrito IS 'Distrito de residencia del usuario. En enfermeros define su distrito principal de operación.';

CREATE INDEX IF NOT EXISTS idx_profiles_role
ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_profiles_account_status
ON public.profiles(account_status);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. VERIFICATION CODES
-- ============================================================

CREATE TABLE verification_codes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL,                    -- correo al que se envió
  code       VARCHAR(6)  NOT NULL,                    -- código de 6 dígitos: '123456'
  purpose    TEXT        NOT NULL 
                         CHECK (purpose IN (
                           'email_verification',      -- verificar correo (paso 2 del registro)
                           'password_reset'          -- recuperar contraseña olvidada
                         )),
  used       BOOLEAN     NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE verification_codes IS 'Códigos OTP de 6 dígitos para verificación de correo y recuperación de contraseña.';
COMMENT ON COLUMN verification_codes.purpose IS 'email_verification = al registrarse, password_reset = olvidé contraseña';

CREATE INDEX IF NOT EXISTS idx_verification_codes_lookup
ON public.verification_codes(email, code, purpose, used, expires_at);

CREATE OR REPLACE FUNCTION public.invalidate_previous_codes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.verification_codes
  SET used = TRUE
  WHERE email = NEW.email
    AND purpose = NEW.purpose
    AND used = FALSE
    AND id <> NEW.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invalidate_previous_codes ON public.verification_codes;

CREATE TRIGGER trg_invalidate_previous_codes
AFTER INSERT ON public.verification_codes
FOR EACH ROW
EXECUTE FUNCTION public.invalidate_previous_codes();

CREATE OR REPLACE FUNCTION public.reset_password_by_otp(
  p_email TEXT,
  p_code TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_otp_id UUID;
BEGIN
  -- 1. Buscar si existe un código OTP válido y obtener su ID
  SELECT id INTO v_otp_id 
  FROM public.verification_codes 
  WHERE email = p_email 
    AND code = p_code 
    AND purpose = 'password_reset' 
    AND used = FALSE 
    AND expires_at > NOW()
  LIMIT 1;

  -- Si no se encuentra un OTP válido, salimos de inmediato
  IF v_otp_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 2. Obtener el UUID del usuario correspondiente al correo en auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
  
  -- 3. Si el usuario existe, proceder con los cambios de forma segura
  IF v_user_id IS NOT NULL THEN
    
    -- A. Actualizar la contraseña usando el esquema correcto de pgcrypto (extensions.)
    UPDATE auth.users 
    SET encrypted_password = extensions.crypt(p_new_password, extensions.gen_salt('bf', 10)),
        updated_at = NOW()
    WHERE id = v_user_id;
    
    -- B. Recién cuando la contraseña se cambió, marcamos el OTP como utilizado
    UPDATE public.verification_codes 
    SET used = TRUE 
    WHERE id = v_otp_id;
    
    RETURN TRUE;
  ELSE
    -- Si el correo no está registrado en auth.users
    RETURN FALSE;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.reset_password_by_otp IS 'Valida de manera atómica el OTP de recuperación y actualiza la contraseña en auth.users de forma segura.';

-- ============================================================
-- 4. PLANS
-- ============================================================

CREATE TABLE plans (
  id                   SERIAL        PRIMARY KEY,
  nombre               TEXT          NOT NULL UNIQUE
                                     CHECK (nombre IN ('basico', 'premium', 'familiar')),
  precio_mensual       NUMERIC(8,2)  NOT NULL CHECK (precio_mensual > 0),
  precio_anual         NUMERIC(8,2)  NOT NULL CHECK (precio_anual > 0),
  max_pacientes        INT,          -- NULL = ilimitado (plan Familiar)
  prioridad_solicitud  BOOLEAN       NOT NULL DEFAULT FALSE,  -- prioridad al enviar solicitudes a enfermeros
  acceso_top_rated     BOOLEAN       NOT NULL DEFAULT FALSE,
  descripcion          TEXT,
  activo               BOOLEAN       NOT NULL DEFAULT TRUE,
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO plans (nombre, precio_mensual, precio_anual, max_pacientes, prioridad_solicitud, acceso_top_rated) VALUES
  ('basico',   24.90, 249.00, 1,    FALSE, FALSE),
  ('premium',  49.90, 499.00, 4,    TRUE,  TRUE),
  ('familiar', 89.90, 899.00, NULL, TRUE,  TRUE);

COMMENT ON TABLE plans IS 'Catálogo de planes disponibles para clientes.';
COMMENT ON COLUMN plans.max_pacientes IS 'NULL significa pacientes ilimitados (plan Familiar).';
COMMENT ON COLUMN plans.prioridad_solicitud IS 'El cliente con este plan tiene prioridad al enviar solicitudes de servicio a enfermeros.';

DROP TRIGGER IF EXISTS trg_plans_updated_at ON public.plans;

CREATE TRIGGER trg_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscriptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id      INT         NOT NULL REFERENCES plans(id),
  ciclo        TEXT        NOT NULL DEFAULT 'mensual'
                           CHECK (ciclo IN ('mensual', 'anual')),
  fecha_inicio DATE        NOT NULL DEFAULT CURRENT_DATE,
  fecha_vence  DATE        NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'expired', 'cancelled')),
  activo       BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (fecha_vence > fecha_inicio)
);

COMMENT ON TABLE subscriptions IS 'Suscripción activa del cliente a un plan.';

CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id
ON public.subscriptions(client_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
ON public.subscriptions(status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_active_subscription_per_client
ON public.subscriptions(client_id)
WHERE status = 'active' AND activo = TRUE;

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON public.subscriptions;

CREATE TRIGGER trg_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 6. PAYMENT METHODS
-- ============================================================

CREATE TABLE payment_methods (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tipo           TEXT        NOT NULL
                             CHECK (tipo IN ('tarjeta', 'yape', 'plin')),
  es_principal   BOOLEAN     NOT NULL DEFAULT FALSE,
  -- Campos para tarjeta
  terminacion    VARCHAR(4),   -- Solo últimos 4 dígitos (nunca el número completo)
  marca          TEXT,         -- 'Visa', 'Mastercard', etc.
  nombre_tarjeta TEXT,
  -- Campos para Yape / Plin
  telefono       VARCHAR(9)  CHECK (telefono ~ '^\d{9}$'),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Integridad: tarjeta requiere terminacion, wallet requiere telefono
  CHECK (
    (tipo = 'tarjeta' AND terminacion IS NOT NULL) OR
    (tipo IN ('yape', 'plin') AND telefono IS NOT NULL)
  )
);

COMMENT ON TABLE payment_methods IS 'Métodos de pago registrados del cliente.';
COMMENT ON COLUMN payment_methods.terminacion IS 'Solo últimos 4 dígitos. El token completo vive en el gateway (Culqi/Stripe).';

CREATE INDEX IF NOT EXISTS idx_payment_methods_client_id
ON public.payment_methods(client_id);


-- ============================================================
-- 7. NURSE PROFILES
-- ============================================================

CREATE TABLE nurse_profiles (
  id                    UUID        PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  nivel                 TEXT        NOT NULL
                                    CHECK (nivel IN (
                                      'Técnico en Enfermería',
                                      'Licenciado en Enfermería',
                                      'Enfermero Especializado'
                                    )),
  especialidad          TEXT,       -- Solo aplica a Enfermero Especializado
  bio                   TEXT        CHECK (char_length(bio) BETWEEN 20 AND 500),
  rating                NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  total_reviews         INT          NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  puntualidad_avg       NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (puntualidad_avg BETWEEN 0 AND 5),
  trato_avg             NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (trato_avg BETWEEN 0 AND 5),
  tecnica_avg           NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (tecnica_avg BETWEEN 0 AND 5),
  servicios_completados INT          NOT NULL DEFAULT 0 CHECK (servicios_completados >= 0),
  anios_experiencia     SMALLINT     CHECK (anios_experiencia BETWEEN 0 AND 70),
  verificacion_status   TEXT         NOT NULL DEFAULT 'not_submitted'
                                     CHECK (verificacion_status IN (
                                       'not_submitted',   -- Sin enviar documentos
                                       'pending',         -- En revisión por admin
                                       'approved',        -- Verificado
                                       'rejected'         -- Documentos rechazados
                                     )),
  visibilidad           TEXT         NOT NULL DEFAULT 'borrador'
                                     CHECK (visibilidad IN (
                                       'borrador',        -- Perfil incompleto, no visible
                                       'publicado',       -- Visible en directorio
                                       'despublicado'    -- Ocultado por admin
                                     )),
  is_top_rated          BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE nurse_profiles IS 'Perfil público y profesional del enfermero.';
COMMENT ON COLUMN nurse_profiles.is_top_rated IS 'TRUE cuando rating >= 4.8 y total_reviews >= 20.';
COMMENT ON COLUMN nurse_profiles.verificacion_status IS 'Calculado automáticamente por trigger según estado de nurse_documents.';

CREATE INDEX IF NOT EXISTS idx_nurse_profiles_visibilidad
ON public.nurse_profiles(visibilidad);

CREATE INDEX IF NOT EXISTS idx_nurse_profiles_verificacion
ON public.nurse_profiles(verificacion_status);

CREATE INDEX IF NOT EXISTS idx_nurse_profiles_rating
ON public.nurse_profiles(rating DESC);

DROP TRIGGER IF EXISTS trg_nurse_profiles_updated_at ON public.nurse_profiles;

CREATE TRIGGER trg_nurse_profiles_updated_at
BEFORE UPDATE ON public.nurse_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.validate_nurse_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = NEW.id
      AND p.role = 'enfermero'
  ) THEN
    RAISE EXCEPTION 'Solo usuarios con role=enfermero pueden tener nurse_profiles';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_nurse_profile_role ON public.nurse_profiles;

CREATE TRIGGER trg_validate_nurse_profile_role
BEFORE INSERT OR UPDATE ON public.nurse_profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_nurse_profile_role();

-- ============================================================
-- 8. NURSE SERVICE TYPES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.nurse_service_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  nurse_id      UUID NOT NULL REFERENCES public.nurse_profiles(id) ON DELETE CASCADE,

  tipo          TEXT NOT NULL
                CHECK (tipo IN ('Especializado', 'Asistencial', 'Acompañamiento')),

  tarifa_hora   NUMERIC(8,2)
                CHECK (
                  tarifa_hora IS NULL
                  OR tarifa_hora BETWEEN 10 AND 500
                ),

  activo        BOOLEAN NOT NULL DEFAULT FALSE,

  principal     BOOLEAN NOT NULL DEFAULT FALSE,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (nurse_id, tipo),

  CHECK (
    activo = FALSE
    OR tarifa_hora IS NOT NULL
  )
);

COMMENT ON TABLE public.nurse_service_types IS 'Tipos de servicio y tarifas por hora del enfermero.';
COMMENT ON COLUMN public.nurse_service_types.tipo IS 'Especializado: solo Enfermero Especializado. Asistencial: Especializado y Licenciado. Acompañamiento: todos los niveles.';
COMMENT ON COLUMN public.nurse_service_types.principal IS 'Indica el servicio principal según el nivel profesional del enfermero.';

CREATE INDEX IF NOT EXISTS idx_nurse_service_types_nurse_id
ON public.nurse_service_types(nurse_id);

CREATE INDEX IF NOT EXISTS idx_nurse_service_types_active
ON public.nurse_service_types(activo);

DROP TRIGGER IF EXISTS trg_nurse_service_types_updated_at ON public.nurse_service_types;

CREATE TRIGGER trg_nurse_service_types_updated_at
BEFORE UPDATE ON public.nurse_service_types
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS uq_one_primary_service_per_nurse
ON public.nurse_service_types(nurse_id)
WHERE principal = TRUE;

CREATE OR REPLACE FUNCTION public.validate_nurse_service_by_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nivel TEXT;
BEGIN
  SELECT nivel
  INTO v_nivel
  FROM public.nurse_profiles
  WHERE id = NEW.nurse_id;

  IF v_nivel IS NULL THEN
    RAISE EXCEPTION 'No existe nurse_profile para este nurse_id';
  END IF;

  IF v_nivel = 'Técnico en Enfermería'
     AND NEW.tipo IN ('Especializado', 'Asistencial') THEN
    RAISE EXCEPTION 'Un Técnico en Enfermería solo puede ofrecer Acompañamiento';
  END IF;

  IF v_nivel = 'Licenciado en Enfermería'
     AND NEW.tipo = 'Especializado' THEN
    RAISE EXCEPTION 'Un Licenciado en Enfermería no puede ofrecer Especializado';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_nurse_service_by_level ON public.nurse_service_types;

CREATE TRIGGER trg_validate_nurse_service_by_level
BEFORE INSERT OR UPDATE ON public.nurse_service_types
FOR EACH ROW
EXECUTE FUNCTION public.validate_nurse_service_by_level();

-- ============================================================
-- 9. NURSE ZONES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.nurse_zones (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID   NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  distrito TEXT   NOT NULL CHECK (char_length(distrito) BETWEEN 3 AND 60),
  UNIQUE (nurse_id, distrito)
);

COMMENT ON TABLE nurse_zones IS 'Distritos de Lima en los que el enfermero acepta prestar servicios.';

CREATE INDEX IF NOT EXISTS idx_nurse_zones_nurse_id
ON public.nurse_zones(nurse_id);

CREATE INDEX IF NOT EXISTS idx_nurse_zones_distrito
ON public.nurse_zones(distrito);

-- ============================================================
-- 10. NURSE LANGUAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.nurse_languages (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID   NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  idioma   TEXT   NOT NULL CHECK (char_length(idioma) BETWEEN 2 AND 60),
  UNIQUE (nurse_id, idioma)
);

CREATE INDEX IF NOT EXISTS idx_nurse_languages_nurse_id
ON public.nurse_languages(nurse_id);

-- ============================================================
-- 11. NURSE EDUCATION
-- ============================================================

CREATE TABLE nurse_education (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id    UUID     NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  titulo      TEXT     NOT NULL CHECK (char_length(titulo) BETWEEN 3 AND 100),
  institucion TEXT     NOT NULL CHECK (char_length(institucion) BETWEEN 3 AND 100),
  anio        SMALLINT NOT NULL CHECK (anio BETWEEN 1900 AND 2100),
  -- solo para verificación interna, el cliente nunca ve esto
  documento_url TEXT, -- URL en Supabase Storage
  verificado    BOOLEAN NOT NULL DEFAULT FALSE,
  verificado_at TIMESTAMPTZ,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE nurse_education IS 'Historial de formación académica del enfermero.';
CREATE INDEX IF NOT EXISTS idx_nurse_education_nurse_id
ON public.nurse_education(nurse_id);

DROP TRIGGER IF EXISTS trg_nurse_education_updated_at ON public.nurse_education;

CREATE TRIGGER trg_nurse_education_updated_at
BEFORE UPDATE ON public.nurse_education
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 12. NURSE CERTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.nurse_certifications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id UUID     NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  nombre   TEXT     NOT NULL CHECK (char_length(nombre) BETWEEN 3 AND 100),
  emisor   TEXT     NOT NULL CHECK (char_length(emisor) BETWEEN 3 AND 100),
  anio     SMALLINT NOT NULL CHECK (anio BETWEEN 1960 AND 2100),
    -- solo para verificación interna, el cliente nunca ve esto
  documento_url TEXT,  -- URL en Supabase Storage
  verificado    BOOLEAN NOT NULL DEFAULT FALSE,
  verificado_at TIMESTAMPTZ,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.nurse_certifications IS 'Cursos y certificaciones del enfermero.';

CREATE INDEX IF NOT EXISTS idx_nurse_certifications_nurse_id
ON public.nurse_certifications(nurse_id);

DROP TRIGGER IF EXISTS trg_nurse_certifications_updated_at ON public.nurse_certifications;

CREATE TRIGGER trg_nurse_certifications_updated_at
BEFORE UPDATE ON public.nurse_certifications
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 13. NURSE DOCUMENTS
-- ============================================================

CREATE TABLE nurse_documents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id    UUID        NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  doc_type    TEXT        NOT NULL
                          CHECK (doc_type IN (
                            'dni_front',
                            'dni_back',
                            'antecedentes_penales',
                            'antecedentes_policiales',
                            'titulo_uni',
                            'sunedu',
                            'colegiatura',
                            'especialidad_rne',
                            'habilidad_cep',
                            'titulo_tecnico',
                            'certificado_estudios',
                            'minedu_sinace'
                          )),
  file_url    TEXT,       -- URL en Supabase Storage
  status      TEXT        NOT NULL DEFAULT 'not_submitted'
                          CHECK (status IN ('not_submitted', 'pending', 'approved', 'rejected')),
  admin_notes TEXT,       -- Motivo de rechazo u observación del admin
  reviewed_by UUID        REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (nurse_id, doc_type),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE nurse_documents IS 'Documentos de verificación profesional del enfermero.';
COMMENT ON COLUMN nurse_documents.reviewed_by IS 'Admin que aprobó o rechazó el documento.';
COMMENT ON COLUMN nurse_documents.file_url IS 'Ruta al archivo en Supabase Storage (bucket: nurse-docs).';

CREATE INDEX IF NOT EXISTS idx_nurse_docs_status
ON public.nurse_documents(status);

DROP TRIGGER IF EXISTS trg_nurse_documents_updated_at ON public.nurse_documents;

CREATE TRIGGER trg_nurse_documents_updated_at
BEFORE UPDATE ON public.nurse_documents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
-- ============================================================
-- 14. NURSE SCHEDULE SLOTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.nurse_schedule_slots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id    UUID     NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_hour  SMALLINT NOT NULL CHECK (start_hour BETWEEN 0 AND 23),
  end_hour    SMALLINT NOT NULL CHECK (end_hour BETWEEN 1 AND 24),
  enabled     BOOLEAN  NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (nurse_id, day_of_week),
  CHECK (end_hour > start_hour)
);


CREATE INDEX IF NOT EXISTS idx_nurse_schedule_slots_lookup
ON public.nurse_schedule_slots(nurse_id, day_of_week, enabled);

DROP TRIGGER IF EXISTS trg_nurse_schedule_slots_updated_at ON public.nurse_schedule_slots;

CREATE TRIGGER trg_nurse_schedule_slots_updated_at
BEFORE UPDATE ON public.nurse_schedule_slots
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 15. NURSE SCHEDULE EXCEPTIONS
-- ============================================================
CREATE TABLE nurse_schedule_exceptions (
  id         UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  nurse_id   UUID     NOT NULL REFERENCES nurse_profiles(id) ON DELETE CASCADE,
  fecha      DATE     NOT NULL,
  tipo       TEXT     NOT NULL
                      CHECK (tipo IN (
                        'block',    -- Día bloqueado (no disponible)
                        'extra',    -- Horario extra diferente al semanal
                        'vacation'  -- Vacaciones
                      )),
  start_hour SMALLINT CHECK (start_hour BETWEEN 0 AND 23),
  end_hour   SMALLINT CHECK (end_hour BETWEEN 1 AND 24),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (nurse_id, fecha),
  -- Si el tipo es 'extra', los horarios son obligatorios y deben ser coherentes
  CHECK (tipo != 'extra' OR (
    start_hour IS NOT NULL AND end_hour IS NOT NULL AND end_hour > start_hour
  ))
);

COMMENT ON TABLE nurse_schedule_exceptions IS 'Días especiales que sobrescriben el horario semanal del enfermero.';

CREATE INDEX IF NOT EXISTS idx_nurse_schedule_exceptions_lookup
ON public.nurse_schedule_exceptions(nurse_id, fecha);

DROP TRIGGER IF EXISTS trg_nurse_schedule_exceptions_updated_at ON public.nurse_schedule_exceptions;

CREATE TRIGGER trg_nurse_schedule_exceptions_updated_at
BEFORE UPDATE ON public.nurse_schedule_exceptions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 10. PATIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.patients (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(), -- 🌟 Cambiado a gen_random_uuid()
  client_id         UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- 🌟 Separación para mayor orden y control
  full_name         text        not null,
  
  age               INT          NOT NULL CHECK (age BETWEEN 0 AND 130),
  photo_url         TEXT,
  
  -- 🌟 Restricción CHECK para controlar los lazos familiares permitidos
  relationship      TEXT         NOT NULL 
                                 CHECK (relationship IN ('Madre', 'Padre', 'Hijo', 'Hija', 'Cónyuge', 'Abuelo', 'Abuela', 'Hermano', 'Hermana', 'Yo mismo', 'Otro')),
  
  -- 🌟 Restricción CHECK para tipos de sangre válidos
  blood_type        TEXT         CHECK (blood_type IN ('O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-')),
  
  emergency_contact TEXT         NOT NULL CHECK (char_length(emergency_contact) BETWEEN 3 AND 100),
  
  -- 🌟 Validación con Expresión Regular para celulares peruanos
  emergency_phone   VARCHAR(9)   NOT NULL CHECK (emergency_phone ~ '^\d{9}$'), 
  
  notes             TEXT,
  address           TEXT         NOT NULL CHECK (char_length(address) > 5),
  district          TEXT         NOT NULL CHECK (char_length(district) BETWEEN 3 AND 60),
  address_reference text,        
  lat               NUMERIC(10,7),
  lng               NUMERIC(10,7),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_client_id ON public.patients(client_id);

DROP TRIGGER IF EXISTS trg_patients_updated_at ON public.patients;
CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 11. PATIENT_CONDITIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.patient_conditions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  condition  TEXT NOT NULL CHECK (char_length(condition) BETWEEN 2 AND 150),
  UNIQUE (patient_id, condition)
);

CREATE INDEX IF NOT EXISTS idx_patient_conditions_patient_id ON public.patient_conditions(patient_id);

-- ============================================================
-- 12. PATIENT_MEDICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.patient_medications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  medication TEXT NOT NULL CHECK (char_length(medication) BETWEEN 2 AND 150),
  UNIQUE (patient_id, medication)
);

CREATE INDEX IF NOT EXISTS idx_patient_medications_patient_id ON public.patient_medications(patient_id);

-- ============================================================
-- 13. PATIENT_ALLERGIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.patient_allergies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  allergy    TEXT NOT NULL CHECK (char_length(allergy) BETWEEN 2 AND 150),
  UNIQUE (patient_id, allergy)
);

CREATE INDEX IF NOT EXISTS idx_patient_allergies_patient_id ON public.patient_allergies(patient_id);




--Bucket de foto_perfil

-- 1. Permitir acceso público de lectura para cualquier persona a las fotos de perfil y pacientes
DROP POLICY IF EXISTS "Fotos visibles para todos" ON storage.objects;
CREATE POLICY "Fotos visibles para todos"
ON storage.objects FOR SELECT
USING (bucket_id = 'foto_perfil');

-- 2. Permitir inserción condicionada por carpetas virtuales
DROP POLICY IF EXISTS "Clientes y enfermeros pueden subir fotos de perfil y pacientes" ON storage.objects;
CREATE POLICY "Clientes y enfermeros pueden subir fotos de perfil y pacientes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'foto_perfil' 
  AND (
    -- Clientes o Enfermeros subiendo su propio avatar corporativo
    ((storage.foldername(name))[1] IN ('clientes', 'enfermeros') AND (storage.foldername(name))[2] = auth.uid()::text)
    OR
    -- Clientes subiendo fotos de los familiares que tienen a su cargo
    ((storage.foldername(name))[1] = 'pacientes' AND (storage.foldername(name))[2] = auth.uid()::text)
  )
);

-- 3. Permitir actualización y borrado solo si el usuario es el creador/dueño
DROP POLICY IF EXISTS "Clientes y enfermeros pueden modificar sus fotos de perfil y pacientes" ON storage.objects;
CREATE POLICY "Clientes y enfermeros pueden modificar sus fotos de perfil y pacientes"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'foto_perfil' 
  AND (storage.foldername(name))[2] = auth.uid()::text
);

--bucket document applications

-- BUCKET: NURSE_DOCUMENTS (🌟 Totalmente privado para el dueño, sin lógica de Admin por ahora)
DROP POLICY IF EXISTS "Solo el dueño o admin pueden ver documentos privados" ON storage.objects;
CREATE POLICY "Solo el dueño puede ver sus propios documentos privados"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'nurse_documents'
  AND (storage.foldername(name))[2] = auth.uid()::text 
);

DROP POLICY IF EXISTS "Enfermeros pueden subir sus propios documentos" ON storage.objects;
CREATE POLICY "Enfermeros pueden subir sus propios documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'nurse_documents'
  AND (storage.foldername(name))[1] IN ('verificacion', 'educacion', 'certificaciones')
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "Enfermeros o admin pueden modificar documentos" ON storage.objects;
CREATE POLICY "Enfermeros pueden modificar sus propios documentos"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'nurse_documents'
  AND (storage.foldername(name))[2] = auth.uid()::text 
);


--admin  6e59ca9f-e99e-4d50-a854-7403fa0fa6a5
INSERT INTO public.profiles (
  id,               -- 👈 PEGA AQUÍ EL UUID QUE COPIASTE EN EL PASO 1
  role, 
  nombres, 
  apellidos_ma, 
  apellidos_pa, 
  correo, 
  dni_verified,     
  email_verified,
  account_status
) VALUES (
  '6e59ca9f-e99e-4d50-a854-7403fa0fa6a5', -- Ejemplo: '3e0772cc-60e2-4c0b...'
  'admin',          -- El rol exacto que acepta tu CHECK constraint
  'Administrador', 
  'Principal', 
  'Sistema', 
  'admin@cuidame.com',
  true,
  true,
  'activo'
);