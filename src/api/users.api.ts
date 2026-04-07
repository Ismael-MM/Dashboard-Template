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

export interface ApiResponse<T>{
  message: string;
  data: T;
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

export const getCurrentUser = async () => {
  const { data } = await api.get<ApiResponse<UserRecord>>("/users/me");
  return data.data;
};

export const getRoles = async () => {
  const { data } = await api.get<RoleOption[]>("/roles");
  return data;
};

export const createUser = async (payload: UserFormPayload) => {
  const { data } = await api.post<ApiResponse<UserRecord>>("/users", payload);
  return data.data;
};

export const updateUser = async (id: number, payload: UserFormPayload) => {
  const { data } = await api.patch<ApiResponse<UserRecord>>(`/users/${id}`, payload);
  return data.data;
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete<ApiResponse<null>>(`/users/${id}`);
  return data.data;
};