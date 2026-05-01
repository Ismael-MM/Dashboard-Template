import api, { setCsrfToken } from "@/api/axios";
import type { LoginPayload, AuthUser, RegisterPayload } from '@/types/auth';

export const getCsrf = async () => {
  const { data } = await api.get<{ token: string }>('/auth/csrf-token');
  setCsrfToken(data.token); // guarda directamente aquí
  return data.token;
};

export const loginUser = async (credentials: LoginPayload) => {
  const { data } = await api.post<{ user: AuthUser }>("/auth/login", credentials);
  return data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get<{ user: AuthUser | null }>("/auth/me");
  return data;
};

export const logoutUser = async () => {
  await api.post('/auth/logout');
};

export const isAuthenticated = async () => {
  try {
    const { user } = await getCurrentUser();
    return Boolean(user);
  } catch {
    return false;
  }
};
