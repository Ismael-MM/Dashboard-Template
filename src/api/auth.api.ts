import api from './axios';

interface UserData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  nombre: string;
  apellido: string;
}

interface Credentials {
  identifier: string;
  password: string;
}

export const loginUser = async (credentials: Credentials) => {
  const payload = {
    email: credentials.identifier,
    password: credentials.password
  }
  const { data } = await api.post('/auth/login', payload);

  return data;
}

export const registerUser = async (userData: UserData) => {
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

export const logoutUser = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');

  return data;
}