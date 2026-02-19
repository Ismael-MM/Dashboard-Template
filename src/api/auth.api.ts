import api from './axios';

export const loginUser = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);

  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
  }

  return data;
}

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};