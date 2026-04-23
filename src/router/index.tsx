import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import ProtectedRoute from "./ProtectedRoute";
import { appRoutes, type AppRoute } from './routes.config';

function flattenRoutes(routes: AppRoute[]): AppRoute[] {
  return routes.flatMap((route) =>
    route.children ? flattenRoutes(route.children) : route
  );
}

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          ...flattenRoutes(appRoutes)
            .filter((e) => e.element)
            .map(({path, element}) => ({
            path: path.replace(/^\//, ''),
            element,
          })),
        ],
      },
    ]
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
