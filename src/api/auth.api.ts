import api from './axios';

export const loginUser = async (credentials: any) => {
  const payload = {
    email: credentials.identifier,
    password: credentials.password
  }
  const { data } = await api.post('/auth/login', payload);

  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
  }

  return data;
}

export const registerUser = async (userData: any) => {
  const payload = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    passwordConfirm: userData.passwordConfirm,
    nombre: userData.nombre,
    apellido: userData.apellido,
  }

  const { data } = await api.post('/auth/register', payload);

  return data;
}

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};