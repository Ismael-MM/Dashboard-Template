import { Outlet } from "react-router";

import SidebarPage from "./SideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
  return (
    <SidebarProvider defaultOpen>
      <SidebarPage />
      <SidebarInset className="min-h-svh bg-gray-100">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-gray-100/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <SidebarTrigger className="md:hidden" />
          <div className="min-w-0">
            <span className="block truncate text-base font-semibold sm:text-lg">
              Bienvenido de nuevo
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster
        position="top-right"
        richColors
        duration={4000}
        visibleToasts={5}
      />
    </SidebarProvider>
  );
}
