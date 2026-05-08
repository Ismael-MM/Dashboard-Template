export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthUser {
  id?: number;
  userId?: number;
  email: string;
  username: string;
  roleId: string;
    role?: {
    id: string;
    name: string;
    permissions: { id: string; name: string }[];
  } | null;
}