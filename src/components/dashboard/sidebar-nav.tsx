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
  LogOut,
  ArrowLeftRight,
  Bell
} from 'lucide-react';

interface SidebarNavProps {
  role: 'admin' | 'manager' | 'staff';
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

  const getLinks = () => {

    if (role === 'staff') {
      return [
        { href: `/dashboard/staff`, label: 'Dashboard', icon: LayoutDashboard },

        { href: `/dashboard/staff/products`, label: 'Products', icon: Package },
        { href: `/dashboard/staff/stock`, label: 'Stock IN / OUT', icon: ArrowLeftRight },
        { href: `/dashboard/staff/alerts`, label: 'Alerts', icon: Bell },
        { href: `/dashboard/staff/transactions`, label: 'Transactions', icon: ClipboardList },
        { href: `/dashboard/staff/reports`, label: 'Report & Analysis', icon: TrendingUp },
      ];
    }

    if (role === 'admin') {
      return [
        { href: `/dashboard/admin`, label: 'Dashboard', icon: LayoutDashboard },

        { href: `/dashboard/admin/category`, label: 'Category', icon: Package },
        { href: `/dashboard/admin/supplier`, label: 'Supplier', icon: Users },
        { href: `/dashboard/admin/product`, label: 'Product', icon: ClipboardList },
        { href: `/dashboard/admin/stock`, label: 'Stock', icon: ArrowLeftRight },
        { href: `/dashboard/admin/alerts`, label: 'Alerts', icon: Bell },
        { href: `/dashboard/admin/transactions`, label: 'Transactions', icon: History },
        { href: `/dashboard/admin/reports`, label: 'Report & Analysis', icon: TrendingUp },
      ];
    }

    if (role === 'manager') {
      return [
        { href: `/dashboard/manager`, label: 'Dashboard', icon: LayoutDashboard },

        { href: `/dashboard/manager/category`, label: 'Category', icon: Package },
        { href: `/dashboard/manager/supplier`, label: 'Supplier', icon: Users },
        { href: `/dashboard/manager/product`, label: 'Product', icon: ClipboardList },
        { href: `/dashboard/manager/stock`, label: 'Stock', icon: ArrowLeftRight },
        { href: `/dashboard/manager/alerts`, label: 'Alerts', icon: Bell },
        { href: `/dashboard/manager/transactions`, label: 'Transactions', icon: History },
        { href: `/dashboard/manager/reports`, label: 'Report & Analysis', icon: TrendingUp },
      ];
    }

    return [];
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

            pathname.startsWith(link.href)
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <link.icon
            className={cn(
              "w-5 h-5",
              pathname.startsWith(link.href)
                ? "text-primary-foreground"
                : "group-hover:text-primary transition-colors"
            )}
          />

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