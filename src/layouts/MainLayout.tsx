import { Outlet } from "react-router";
import SidebarPage from "./SideBar";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full">
      <div className="bg-white border-r overflow-auto">
        <SidebarPage />
      </div>

      <main className="flex-1 p-8 bg-gray-100 overflow-auto">
        <header className="mb-4 border-b pb-2">
          <span className="text-lg font-semibold">Bienvenido de nuevo</span>
        </header>

        {/* Aquí es donde React Router inyecta las páginas (dashboard, users, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}
