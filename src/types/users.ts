import type { FiltersParams } from './api';
import type { RoleOption } from './roles';

export interface UsersParams extends FiltersParams {
  email?: string;
  username?: string;
  nombre?: string;
  apellido?: string;
  roleId?: string;
}

export interface UserRecord {
  id: number;
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  roleId?: string | null;
  role?: RoleOption | null;
  createdAt?: string;
}


export interface UserFormPayload {
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  password?: string;
  passwordConfirm?: string;
  roleId?: string;
}

export interface UserUpdatePayload {
  email: string;
  username: string;
  nombre: string;
  apellido: string;
  password?: string;
}