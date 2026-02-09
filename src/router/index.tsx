import { createBrowserRouter, Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";

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
        element: <Button> Hola </Button>,
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