import api from "@/api/axios";
import type { UserRecord, ApiResponse, PaginatedResponse} from './users.api';

export interface RoleOption {
  id: string;
  name: string;
}

export interface PermissionOption {
  id: string;
  name: string;
}

export interface RolesParams {
  // PaginationDto
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // UserFiltersDto
  name?: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  permissions?: PermissionOption[] | null;
  users?: UserRecord | null;
}

export interface RolePayload {
  name: string;
  permissions?: string[];
}

export const getRoles = async (params: RolesParams = {}) => {
  const { data } = await api.get<PaginatedResponse<RoleRecord>>("/roles", { params });
  return data;
};

export const getRolesDropdown = async (): Promise<RoleOption[]> => {
  const { data } = await api.get<RoleOption[]>("/roles/list");
  return data;
};

export const createRole = async (payload: RolePayload) => {
  const { data } = await api.post<ApiResponse<RoleRecord>>("/roles", payload);
  return data.data;
};

export const updateRole = async (id: string, payload: RolePayload) => {
  const { data } = await api.patch<ApiResponse<RoleRecord>>(`/roles/${id}`, payload);
  return data.data;
};

export const deleteRole = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/roles/${id}`);
  return data.data;
};