import api from "@/api/axios";
import type { PermissionsParams, PermissionRecord, PermissionOption, PermissionPayload } from '@/types/permissions';
import { createData, deleteData, getData, updateData } from './base.api';

const endPoint = "/permissions";

export const getPermission = async (params: PermissionsParams = {}) => {
  return getData<PermissionsParams, PermissionRecord>(params,endPoint);
};

export const createPermission = async (payload: PermissionPayload) => {
  return createData<PermissionPayload, PermissionRecord>(payload, endPoint);
};

export const updatePermission = async (id: string, payload: PermissionPayload) => {
  return updateData<PermissionPayload, PermissionRecord>(id, payload, endPoint);
};

export const deletePermission = async (id: string) => {
  return deleteData(id, endPoint);
};

export const getPermissionsDropdown = async (): Promise<PermissionOption[]> => {
  const { data } = await api.get<PermissionOption[]>("/permissions/list");
  return data;
};