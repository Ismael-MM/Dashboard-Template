import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    const message = response.data?.message;

    if (message) {
      toast.success(message);
    }

    return response;
    
  },
  (error) => {
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      'Ha ocurrido un error inesperado';

    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }

    switch (error.response?.status) {
      case 403:
        toast.error('No tienes permisos para realizar esta acción');
        break;
      case 404:
        toast.error('Recurso no encontrado');
        break;
      case 422:
        toast.error(message);
        break;
      case 500:
        toast.error('Error interno del servidor');
        break;
    
      default:
        toast.error(message);
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
