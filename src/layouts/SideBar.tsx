import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { logout } from "@/api/auth.api";

import {
  ChartPieIcon,
  ChartSplineIcon,
  UsersIcon,
  CheckIcon,
  type LucideIcon,
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
  useSidebar,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartSplineIcon,
  },
  {
    title: "Users",
    url: "/users",
    icon: UsersIcon,
  },
  {
    title: "Engagement Metrics",
    url: "#",
    icon: ChartPieIcon,
  },
];

const SidebarPage = () => {
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigation = (url: string) => {
    navigate(url);

    if (isMobile) {
      setOpenMobile(false);
    }
  };

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
        <SidebarGroup>
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
                        Peter Parker
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        Admin
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        onClick={(event) => {
                          event.preventDefault();
                          handleNavigation(item.url);
                        }}
                      >
                        <item.icon className="!h-5 !w-5" />
                        <span className="ml-1 text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
