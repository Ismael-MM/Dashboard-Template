import api from "@/api/axios";
import type { PermissionsParams, PermissionRecord, PermissionOption, PermissionPayload } from '@/types/permissions';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const getPermission = async (params: PermissionsParams = {}) => {
  const { data } = await api.get<PaginatedResponse<PermissionRecord>>("/permissions", { params });
  return data;
};

export const getPermissionsDropdown = async (): Promise<PermissionOption[]> => {
  const { data } = await api.get<PermissionOption[]>("/permissions/list");
  return data;
};

export const createPermission = async (payload: PermissionPayload) => {
  const { data } = await api.post<ApiResponse<PermissionRecord>>("/permissions", payload);
  return data.data;
};

export const updatePermission = async (id: string, payload: PermissionPayload) => {
  const { data } = await api.patch<ApiResponse<PermissionRecord>>(`/permissions/${id}`, payload);
  return data.data;
};

export const deletePermission = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`/permissions/${id}`);
  return data.data;
};