import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "@/layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <div>Métricas Principales (Conectar con NestJS)</div>,
      },
      {
        path: "users",
        element: <div>Lista de Usuarios</div>,
      },
    ],
  },
  {
    path: "/login",
    element: <div>Página de Login</div>,
  },
  {
    path: "*",
    element: <div>404 - Not Found</div>,
  },
]);