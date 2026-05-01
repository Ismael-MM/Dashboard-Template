import api from "@/api/axios";
import type { UsersParams, UserRecord, UserFormPayload } from '@/types/users';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const getUsers = async (params: UsersParams = {}) => {
  const { data } = await api.get<PaginatedResponse<UserRecord>>("/users", { params });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get<ApiResponse<UserRecord>>("/users/me");
  return data.data;
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