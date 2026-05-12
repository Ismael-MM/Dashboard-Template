import api from "@/api/axios";
import type { RolesParams, RoleRecord, RoleOption, RolePayload } from '@/types/roles';
import { createData, deleteData, getData, updateData } from './base.api';

const endPoint = "/roles"

export const getRoles = async (params: RolesParams = {}) => {
  return getData<RolesParams, RoleRecord>(params,endPoint);
};

export const createRole = async (payload: RolePayload) => {
  return createData<RolePayload, RoleRecord>(payload, endPoint);
};

export const updateRole = async (id: string, payload: RolePayload) => {
  return updateData<RolePayload, RoleRecord>(id, payload, endPoint);
};

export const deleteRole = async (id: string) => {
  return deleteData(id, endPoint);
};

export const getRolesDropdown = async (): Promise<RoleOption[]> => {
  const { data } = await api.get<RoleOption[]>("/roles/list");
  return data;
};