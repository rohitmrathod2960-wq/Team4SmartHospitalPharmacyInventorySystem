"use client";

import { useState, useEffect } from 'react';
import { SidebarNav } from './sidebar-nav';
import { Shield, Bell, Search, User, Menu, X } from 'lucide-react';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
  title: string;
}

export function DashboardLayout({ children, role, title }: DashboardLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      const parsed = JSON.parse(session);
      setUserName(parsed.fullName);
    }
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className={`bg-card border-r w-72 flex-col hidden md:flex transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'}`}>
        <div className="p-6 border-b flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">DefenseLink</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-semibold">{role} Portal</p>
          </div>
        </div>
        <SidebarNav role={role} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className="hidden md:flex">
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold md:block hidden">{title}</h2>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search equipment, users..." className="pl-10 bg-muted/50 border-none rounded-xl" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 rounded-full hover:bg-muted">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold leading-none">{userName}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-none p-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg">Profile Settings</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">Activity Log</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive rounded-lg" onClick={() => window.location.href='/auth/signin'}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
