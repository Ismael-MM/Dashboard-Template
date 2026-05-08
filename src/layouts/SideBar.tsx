import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/UseAuth";

import {
  CheckIcon,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { appRoutes, type AppRoute } from '@/router/routes.config';
import { CollapsibleTrigger, Collapsible, CollapsibleContent, } from '@/components/ui/collapsible';
import { useCan } from '@/hooks/auth/UseCan';


function SidebarItem({ item }: { item: AppRoute }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { can } = useCan();

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) setOpenMobile(false);
  };

  const visibleChildren = item.children
    ?.filter((c) => c.showInSidebar && (!c.permission || can(c.permission)))

  // Con hijos → collapsible
  if (visibleChildren?.length) {
    const isActive = item.children.some((c) =>
      location.pathname.startsWith(c.path),
    );

    return (
      <Collapsible defaultOpen={isActive} className='group'>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="h-5! w-5!" />
                <span className="ml-1 text-base">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className='cursor-pointer'>
            <SidebarMenuSub>
              {item.children.filter((c) => c.showInSidebar).map((child) => (
                <SidebarMenuSubItem key={child.path}>
                  <SidebarMenuSubButton
                    isActive={location.pathname === child.path}
                    onClick={() => handleNav(child.path)}
                  >
                    <child.icon className="h-4! w-4!" />
                    <span>{child.label}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

    // Sin hijos → link normal
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={location.pathname === item.path}
        onClick={() => handleNav(item.path)}
      >
        <item.icon className="h-5! w-5!" />
        <span className="ml-1 text-base">{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export const SidebarPage = () => {
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user, logout} = useAuth();
  const { can } = useCan();


  const sidebarRoutes = appRoutes.filter((r) => {
    console.log(r);
    if (!r.showInSidebar) return false;
    if (r.permission && !can(r.permission)) return false;
    if(r.children?.length){
      return r.children.some((c) => !c.permission || can(c.permission));
    }
    return true;
  });

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      if (isMobile) {
        setOpenMobile(false);
      }
      navigate("/login");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup> {/* Estodo esto es el avatar y esas cosas */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-20">
                  <div className="relative flex items-center gap-3 pl-2 py-1">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-offset-background ring-2 ring-green-500 ring-offset-2 dark:ring-green-400">
                        <AvatarImage
                          src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
                          alt="Hallie Richards"
                        />
                        <AvatarFallback className="text-sm font-semibold">
                          HR
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -right-1 -bottom-1 inline-flex size-3.5 items-center justify-center rounded-full border-2 border-white bg-green-500 dark:border-slate-900 dark:bg-green-400">
                        <CheckIcon className="size-2.5 text-white" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-semibold">
                        {user?.username ?? "Usuario"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email ?? "Sin sesion"}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup> {/* Aqui empiezan las paginas y esas cosas */}
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarRoutes.map(( item ) =>
                <SidebarItem key={item.path} item={item} />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Button
        onClick={handleLogout}
        className="m-3 border border-gray-500 bg-neutral-primary text-base text-gray-500 hover:bg-gray-200 hover:text-gray-700 sm:m-5"
      >
        Log out
      </Button>
    </Sidebar>
  );
};

export default SidebarPage;
