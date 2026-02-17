import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/Pages/auth/login";
import SignupPage from "@/Pages/auth/signup";
import UsersPage from "@/Pages/users/users";

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
        element: <UsersPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <SignupPage />,
  },
  {
    path: "*",
    element: <div>404 - Not Found</div>,
  },
]);