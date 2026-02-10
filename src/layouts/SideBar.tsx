import {
  ChartPieIcon,
  ChartSplineIcon,
  UsersIcon,
  CheckIcon,
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
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

const SidebarPage = () => {
  return (
    <SidebarProvider className="w-full">
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
                          <AvatarFallback className="text-sm font-semibold">HR</AvatarFallback>
                        </Avatar>
                        <span className="absolute -right-1 -bottom-1 inline-flex size-3.5 items-center justify-center rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-900">
                          <CheckIcon className="size-2.5 text-white" />
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">Peter Parker</span>
                        <span className="text-xs text-muted-foreground">Admin</span>
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
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <ChartSplineIcon className="!w-5 !h-5" />
                      <span className="ml-1 text-base">Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <UsersIcon className="!w-5 !h-5" />
                      <span className="ml-1 text-base">Users</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <ChartPieIcon className="!w-5 !h-5" />
                      <span className="ml-1 text-base">Engagement Metrics</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Button className="m-5 text-base text-gray-500 bg-neutral-primary border border-gray-500 hover:bg-gray-200 hover:text-gray-700">
          Log out
        </Button>
      </Sidebar>
    </SidebarProvider>
  );
};

export default SidebarPage;
