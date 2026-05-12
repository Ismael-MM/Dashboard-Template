import api from "@/api/axios";
import type { UsersParams, UserRecord, UserFormPayload } from '@/types/users';
import type { ApiResponse } from '@/types/api';
import { createData, deleteData, getData, updateData } from './common.api';

const endPoint = "/users"

export const getUsers = async (params: UsersParams = {}) => {
  return getData<UsersParams, UserRecord>(params,endPoint);
};

export const createUser = async (payload: UserFormPayload) => {
  return createData<UserFormPayload, UserRecord>(payload, endPoint);
};

export const updateUser = async (id: number, payload: UserFormPayload) => {
  const { passwordConfirm: _, ...cleanPayload } = payload;
  return updateData<UserFormPayload, UserRecord>(id, cleanPayload, endPoint);
};

export const deleteUser = async (id: number) => {
  return deleteData(id, endPoint);
};

export const getCurrentUser = async () => {
  const { data } = await api.get<ApiResponse<UserRecord>>("/users/me");
  return data.data;
};