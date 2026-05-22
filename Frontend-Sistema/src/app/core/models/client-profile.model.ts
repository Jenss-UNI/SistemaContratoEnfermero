/** Datos editables del perfil cliente (listo para POST/PUT al backend). */
export type ClientProfileUpdate = {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  distrito: string;
  direccion: string;
};

/** Perfil completo incluye campos de solo lectura del servidor. */
export type ClientProfile = ClientProfileUpdate & {
  correo: string;
  dni: string;
  planNombre: string;
  planVence: string;
};
