"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  ClipboardList, 
  History,
  TrendingUp,
  Wrench,
  LogOut
} from 'lucide-react';

interface SidebarNavProps {
  role: 'admin' | 'manager' | 'staff';
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

  const getLinks = () => {
    const common = [
      { href: `/dashboard/${role}`, label: 'Overview', icon: LayoutDashboard },
      { href: `/dashboard/${role}/inventory`, label: 'Inventory', icon: Package },
    ];

    if (role === 'admin') {
      return [
        ...common,
        { href: `/dashboard/${role}/users`, label: 'User Management', icon: Users },
        { href: `/dashboard/${role}/assignments`, label: 'Equipment Tracking', icon: ClipboardList },
        { href: `/dashboard/${role}/settings`, label: 'System Settings', icon: Settings },
      ];
    }

    if (role === 'manager') {
      return [
        ...common,
        { href: `/dashboard/${role}/reports`, label: 'Usage Reports', icon: TrendingUp },
        { href: `/dashboard/${role}/maintenance`, label: 'Predictive Maintenance', icon: Wrench },
        { href: `/dashboard/${role}/assignments`, label: 'Assign Equipment', icon: ClipboardList },
      ];
    }

    return [
      ...common,
      { href: `/dashboard/${role}/assigned`, label: 'My Equipment', icon: ClipboardList },
      { href: `/dashboard/${role}/history`, label: 'Request History', icon: History },
    ];
  };

  const links = getLinks();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
            pathname === link.href 
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <link.icon className={cn(
            "w-5 h-5",
            pathname === link.href ? "text-primary-foreground" : "group-hover:text-primary transition-colors"
          )} />
          <span className="font-medium">{link.label}</span>
        </Link>
      ))}
      
      <div className="mt-auto pt-4 border-t">
        <Link
          href="/auth/signin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </nav>
  );
}
