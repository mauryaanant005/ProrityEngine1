import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Train,
  Calendar,
  PlayCircle,
  Building,
  AlertTriangle,
  BarChart3,
  Settings,
  Menu,
  X
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

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Train },
  { title: "Scheduling", url: "/scheduling", icon: Calendar },
  { title: "Simulations", url: "/simulations", icon: PlayCircle },
  { title: "Allocations", url: "/allocations", icon: Building },
  { title: "Disruptions", url: "/disruptions", icon: AlertTriangle },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;

  const getNavClass = (isActiveRoute: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      isActiveRoute
        ? "bg-primary text-primary-foreground shadow-primary"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } border-r border-sidebar-border bg-sidebar transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div className="mb-8 flex items-center justify-center">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Train className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Railway AI</h2>
                <p className="text-xs text-sidebar-foreground/60">Control System</p>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 text-xs font-semibold uppercase tracking-wide">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const isActiveRoute = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClass(isActiveRoute)}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                        {isActiveRoute && !collapsed && (
                          <div className="ml-auto h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Indicator */}
        <div className="mt-auto">
          <div className={`flex items-center gap-3 rounded-lg bg-success/10 p-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
            {!collapsed && (
              <div>
                <p className="text-sm font-medium text-success">System Online</p>
                <p className="text-xs text-muted-foreground">All services active</p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}