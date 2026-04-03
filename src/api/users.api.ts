import api from "@/api/axios";

export interface RoleOption {
  id: string;
  name: string;
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

export const getUsers = async () => {
  const { data } = await api.get<UserRecord[]>("/users");
  return data;
};

export const getRoles = async () => {
  const { data } = await api.get<RoleOption[]>("/roles");
  return data;
};

export const createUser = async (payload: UserFormPayload) => {
  const { data } = await api.post<UserRecord>("/users", payload);
  return data;
};

export const updateUser = async (id: number, payload: UserFormPayload) => {
  const { data } = await api.patch<UserRecord>(`/users/${id}`, payload);
  return data;
};
