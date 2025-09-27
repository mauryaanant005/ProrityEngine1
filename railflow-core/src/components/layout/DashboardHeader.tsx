import { useEffect, useState } from "react";
import { User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  SidebarTrigger, 
  useSidebar 
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          
          {/* Indian Railways Emblem */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-primary">
              <div className="text-lg font-bold text-primary-foreground">🚂</div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Indian Railways</h1>
              <p className="text-xs text-muted-foreground">AI Decision Support System</p>
            </div>
          </div>
        </div>

        {/* Center Section - Time Display */}
        <div className="flex flex-col items-center">
          <div className="text-2xl font-mono font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(currentTime)} IST
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse" />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-secondary">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Controller A.K. Sharma</p>
                  <p className="text-xs text-muted-foreground">Senior Operations</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
              <DropdownMenuLabel>Controller Dashboard</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}