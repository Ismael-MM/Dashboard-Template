import axios from 'axios';
import { useNavigate } from 'react-router';



const api = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      const navigate = useNavigate();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

export default api;