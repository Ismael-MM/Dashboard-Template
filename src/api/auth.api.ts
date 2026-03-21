import api from './axios';

export const loginUser = async (credentials: any) => {
  const payload = {
    email: credentials.identifier,
    password: credentials.password
  }
  const { data } = await api.post('/auth/login', payload);

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

export const logoutUser = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');

  return data;
}