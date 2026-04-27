import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/auth/UseAuth";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className=" text-muted-foreground text-sm">Cargando...</span>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}