/** Modelo base de usuario (extender según roles: cliente, enfermero, admin). */
export interface User {
  id: string;
  email: string;
  nombre: string;
}
