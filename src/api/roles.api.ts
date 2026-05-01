import api from "@/api/axios";
import type { RolesParams, RoleRecord, RoleOption, RolePayload } from '@/types/roles';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

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