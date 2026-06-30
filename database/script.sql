-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role text NOT NULL DEFAULT 'cliente'::text CHECK (role = ANY (ARRAY['cliente'::text, 'enfermero'::text, 'admin'::text])),
  nombres text NOT NULL CHECK (char_length(nombres) >= 2 AND char_length(nombres) <= 80),
  apellidos_ma text NOT NULL CHECK (char_length(apellidos_ma) >= 2 AND char_length(apellidos_ma) <= 80),
  apellidos_pa text NOT NULL CHECK (char_length(apellidos_pa) >= 2 AND char_length(apellidos_pa) <= 80),
  correo text NOT NULL UNIQUE,
  telefono character varying CHECK (telefono::text ~ '^\d{9}$'::text),
  dni character varying UNIQUE CHECK (dni::text ~ '^\d{8}$'::text),
  distrito text,
  foto_url text,
  account_status text NOT NULL DEFAULT 'activo'::text CHECK (account_status = ANY (ARRAY['activo'::text, 'suspendido'::text, 'eliminado'::text])),
  suspension_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  dni_verified boolean NOT NULL DEFAULT false,
  email_verified boolean NOT NULL DEFAULT false,
  direccion text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.verification_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code character varying NOT NULL,
  purpose text NOT NULL CHECK (purpose = ANY (ARRAY['email_verification'::text, 'password_reset'::text])),
  used boolean NOT NULL DEFAULT false,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '00:15:00'::interval),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT verification_codes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.plans (
  id integer NOT NULL DEFAULT nextval('plans_id_seq'::regclass),
  nombre text NOT NULL UNIQUE CHECK (nombre = ANY (ARRAY['basico'::text, 'premium'::text, 'familiar'::text])),
  precio_mensual numeric NOT NULL CHECK (precio_mensual > 0::numeric),
  precio_anual numeric NOT NULL CHECK (precio_anual > 0::numeric),
  max_pacientes integer,
  prioridad_solicitud boolean NOT NULL DEFAULT false,
  acceso_top_rated boolean NOT NULL DEFAULT false,
  descripcion text,
  activo boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT plans_pkey PRIMARY KEY (id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  plan_id integer NOT NULL,
  ciclo text NOT NULL DEFAULT 'mensual'::text CHECK (ciclo = ANY (ARRAY['mensual'::text, 'anual'::text])),
  fecha_inicio date NOT NULL DEFAULT CURRENT_DATE,
  fecha_vence date NOT NULL,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'expired'::text, 'cancelled'::text])),
  activo boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT subscriptions_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id),
  CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id)
);
CREATE TABLE public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['tarjeta'::text, 'yape'::text, 'plin'::text])),
  es_principal boolean NOT NULL DEFAULT false,
  terminacion character varying,
  marca text,
  nombre_tarjeta text,
  telefono character varying CHECK (telefono::text ~ '^\d{9}$'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payment_methods_pkey PRIMARY KEY (id),
  CONSTRAINT payment_methods_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.nurse_profiles (
  id uuid NOT NULL,
  nivel text NOT NULL CHECK (nivel = ANY (ARRAY['Técnico en Enfermería'::text, 'Licenciado en Enfermería'::text, 'Enfermero Especializado'::text])),
  especialidad text,
  bio text CHECK (char_length(bio) >= 20 AND char_length(bio) <= 500),
  rating numeric NOT NULL DEFAULT 0 CHECK (rating >= 0::numeric AND rating <= 5::numeric),
  total_reviews integer NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  puntualidad_avg numeric NOT NULL DEFAULT 0 CHECK (puntualidad_avg >= 0::numeric AND puntualidad_avg <= 5::numeric),
  trato_avg numeric NOT NULL DEFAULT 0 CHECK (trato_avg >= 0::numeric AND trato_avg <= 5::numeric),
  tecnica_avg numeric NOT NULL DEFAULT 0 CHECK (tecnica_avg >= 0::numeric AND tecnica_avg <= 5::numeric),
  servicios_completados integer NOT NULL DEFAULT 0 CHECK (servicios_completados >= 0),
  anios_experiencia smallint CHECK (anios_experiencia >= 0 AND anios_experiencia <= 70),
  verificacion_status text NOT NULL DEFAULT 'not_submitted'::text CHECK (verificacion_status = ANY (ARRAY['not_submitted'::text, 'pending'::text, 'approved'::text, 'rejected'::text])),
  visibilidad text NOT NULL DEFAULT 'borrador'::text CHECK (visibilidad = ANY (ARRAY['borrador'::text, 'publicado'::text, 'despublicado'::text])),
  is_top_rated boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nurse_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_profiles_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id)
);
CREATE TABLE public.nurse_service_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['Especializado'::text, 'Asistencial'::text, 'Acompañamiento'::text])),
  tarifa_hora numeric CHECK (tarifa_hora IS NULL OR tarifa_hora >= 10::numeric AND tarifa_hora <= 500::numeric),
  activo boolean NOT NULL DEFAULT false,
  principal boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nurse_service_types_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_service_types_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id)
);
CREATE TABLE public.nurse_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  distrito text NOT NULL CHECK (char_length(distrito) >= 3 AND char_length(distrito) <= 60),
  CONSTRAINT nurse_zones_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_zones_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id)
);
CREATE TABLE public.nurse_languages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  idioma text NOT NULL CHECK (char_length(idioma) >= 2 AND char_length(idioma) <= 60),
  CONSTRAINT nurse_languages_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_languages_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id)
);
CREATE TABLE public.nurse_education (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  titulo text NOT NULL CHECK (char_length(titulo) >= 3 AND char_length(titulo) <= 100),
  institucion text NOT NULL CHECK (char_length(institucion) >= 3 AND char_length(institucion) <= 100),
  anio smallint NOT NULL CHECK (anio >= 1900 AND anio <= 2100),
  documento_url text,
  verificado boolean NOT NULL DEFAULT false,
  verificado_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nurse_education_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_education_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id)
);
CREATE TABLE public.nurse_certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  nombre text NOT NULL CHECK (char_length(nombre) >= 3 AND char_length(nombre) <= 100),
  emisor text NOT NULL CHECK (char_length(emisor) >= 3 AND char_length(emisor) <= 100),
  anio smallint NOT NULL CHECK (anio >= 1960 AND anio <= 2100),
  documento_url text,
  verificado boolean NOT NULL DEFAULT false,
  verificado_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nurse_certifications_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_certifications_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id)
);
CREATE TABLE public.nurse_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  doc_type text NOT NULL CHECK (doc_type = ANY (ARRAY['dni_front'::text, 'dni_back'::text, 'antecedentes_penales'::text, 'antecedentes_policiales'::text, 'titulo_uni'::text, 'sunedu'::text, 'colegiatura'::text, 'especialidad_rne'::text, 'habilidad_cep'::text, 'titulo_tecnico'::text, 'certificado_estudios'::text, 'minedu_sinace'::text])),
  file_url text,
  status text NOT NULL DEFAULT 'not_submitted'::text CHECK (status = ANY (ARRAY['not_submitted'::text, 'pending'::text, 'approved'::text, 'rejected'::text])),
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nurse_documents_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_documents_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id),
  CONSTRAINT nurse_documents_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.nurse_schedule_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  day_of_week smallint NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_hour smallint NOT NULL CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour smallint NOT NULL CHECK (end_hour >= 1 AND end_hour <= 24),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nurse_schedule_slots_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_schedule_slots_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id)
);
CREATE TABLE public.nurse_schedule_exceptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nurse_id uuid NOT NULL,
  fecha date NOT NULL,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['block'::text, 'extra'::text, 'vacation'::text])),
  start_hour smallint CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour smallint CHECK (end_hour >= 1 AND end_hour <= 24),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nurse_schedule_exceptions_pkey PRIMARY KEY (id),
  CONSTRAINT nurse_schedule_exceptions_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.nurse_profiles(id)
);
CREATE TABLE public.patients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age >= 0 AND age <= 130),
  photo_url text,
  relationship text NOT NULL CHECK (relationship = ANY (ARRAY['Madre'::text, 'Padre'::text, 'Hijo'::text, 'Hija'::text, 'Cónyuge'::text, 'Abuelo'::text, 'Abuela'::text, 'Hermano'::text, 'Hermana'::text, 'Yo mismo'::text, 'Otro'::text])),
  blood_type text CHECK (blood_type = ANY (ARRAY['O+'::text, 'A+'::text, 'B+'::text, 'AB+'::text, 'O-'::text, 'A-'::text, 'B-'::text, 'AB-'::text])),
  emergency_contact text CHECK (char_length(emergency_contact) >= 3 AND char_length(emergency_contact) <= 100),
  emergency_phone character varying CHECK (emergency_phone::text ~ '^\d{9}$'::text),
  notes text,
  address text CHECK (char_length(address) > 5),
  district text CHECK (char_length(district) >= 3 AND char_length(district) <= 60),
  address_reference text,
  lat numeric,
  lng numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  google_maps_url text,
  CONSTRAINT patients_pkey PRIMARY KEY (id),
  CONSTRAINT patients_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.patient_conditions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  condition text NOT NULL CHECK (char_length(condition) >= 2 AND char_length(condition) <= 150),
  CONSTRAINT patient_conditions_pkey PRIMARY KEY (id),
  CONSTRAINT patient_conditions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.patient_medications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  medication text NOT NULL CHECK (char_length(medication) >= 2 AND char_length(medication) <= 150),
  dosage text,
  CONSTRAINT patient_medications_pkey PRIMARY KEY (id),
  CONSTRAINT patient_medications_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.patient_allergies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  allergy text NOT NULL CHECK (char_length(allergy) >= 2 AND char_length(allergy) <= 150),
  CONSTRAINT patient_allergies_pkey PRIMARY KEY (id),
  CONSTRAINT patient_allergies_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.services (
  id integer NOT NULL DEFAULT nextval('services_id_seq'::regclass),
  client_id uuid,
  nurse_id uuid,
  patient_id uuid,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'active'::text, 'completed'::text, 'cancelled'::text])),
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'in_custody'::text, 'released'::text, 'refunded'::text])),
  service_type text,
  total_hours integer DEFAULT 0,
  total_amount numeric DEFAULT 0,
  hourly_rate numeric DEFAULT 0,
  notes text,
  contract_code text,
  service_code text,
  pin_code text,
  patient_name text,
  patient_age integer,
  address text,
  district text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  cancel_reason text,
  cancelled_at timestamp with time zone,
  refund_amount numeric,
  refund_percentage integer,
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id),
  CONSTRAINT services_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.profiles(id),
  CONSTRAINT services_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id)
);
CREATE TABLE public.service_days (
  id integer NOT NULL DEFAULT nextval('service_days_id_seq'::regclass),
  service_id integer,
  day_date date NOT NULL,
  start_hour integer NOT NULL,
  end_hour integer NOT NULL,
  status text DEFAULT 'scheduled'::text,
  real_start text,
  real_end text,
  report text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_days_pkey PRIMARY KEY (id),
  CONSTRAINT service_days_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);
CREATE TABLE public.ratings (
  id integer NOT NULL DEFAULT nextval('ratings_id_seq'::regclass),
  service_id integer,
  nurse_id uuid,
  client_id uuid,
  rating numeric DEFAULT 0,
  punctuality numeric DEFAULT 0,
  treatment numeric DEFAULT 0,
  knowledge numeric DEFAULT 0,
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ratings_pkey PRIMARY KEY (id),
  CONSTRAINT ratings_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id),
  CONSTRAINT ratings_nurse_id_fkey FOREIGN KEY (nurse_id) REFERENCES public.profiles(id),
  CONSTRAINT ratings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);
CREATE TABLE public.incident_reports (
  id integer NOT NULL DEFAULT nextval('incident_reports_id_seq'::regclass),
  reporter_id uuid,
  reporter_role text DEFAULT 'cliente'::text,
  service_id integer,
  service_day_id integer,
  title text NOT NULL,
  description text,
  category text DEFAULT 'otro'::text,
  severity text DEFAULT 'media'::text,
  status text DEFAULT 'abierto'::text,
  response text,
  evidence_urls ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT incident_reports_pkey PRIMARY KEY (id),
  CONSTRAINT incident_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.profiles(id),
  CONSTRAINT incident_reports_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id),
  CONSTRAINT incident_reports_service_day_id_fkey FOREIGN KEY (service_day_id) REFERENCES public.service_days(id)
);
CREATE TABLE public.service_binnacles (
  id integer NOT NULL DEFAULT nextval('service_binnacles_id_seq'::regclass),
  service_id integer,
  service_day_id integer,
  activities ARRAY,
  observations text,
  recommendations text,
  photos ARRAY,
  status text DEFAULT 'draft'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_binnacles_pkey PRIMARY KEY (id),
  CONSTRAINT service_binnacles_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id),
  CONSTRAINT service_binnacles_service_day_id_fkey FOREIGN KEY (service_day_id) REFERENCES public.service_days(id)
);
CREATE TABLE public.contract_signatures (
  id integer NOT NULL DEFAULT nextval('contract_signatures_id_seq'::regclass),
  service_id integer,
  dni text NOT NULL,
  signed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  signature_url text,
  CONSTRAINT contract_signatures_pkey PRIMARY KEY (id),
  CONSTRAINT contract_signatures_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);
CREATE TABLE public.notifications (
  id bigint NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  meta jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
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