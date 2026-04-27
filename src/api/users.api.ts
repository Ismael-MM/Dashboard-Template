import api from "@/api/axios";

export interface RoleOption {
  id: string;
  name: string;
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UsersParams {
  // PaginationDto
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // UserFiltersDto
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

export interface ApiResponse<T>{
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
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

export const getUsers = async (params: UsersParams = {}) => {
  const { data } = await api.get<PaginatedResponse<UserRecord>>("/users", { params });
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
