import api from "@/api/axios";
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const getData = async<TParams, TRecord> (params: TParams, endPoint: string) => {
  const { data } = await api.get<PaginatedResponse<TRecord>>(endPoint, { params });
  return data;
};

export const createData = async<TPayload extends object, TRecord> (payload: TPayload, endPoint: string) => {
  const { data } = await api.post<ApiResponse<TRecord>>(endPoint, payload);
  return data.data;
};

export const updateData = async<TPayload extends object, TRecord> (id: number | string, payload: TPayload, endPoint: string) => {
  const { data } = await api.patch<ApiResponse<TRecord>>(`${endPoint}/${id}`, payload);
  return data.data;
};

export const deleteData = async (id: number | string, endPoint: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`${endPoint}/${id}`);
  return data.data;
};