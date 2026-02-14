"use client";

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  colorClass: string;
}

export function StatCard({ label, value, icon: Icon, trend, colorClass }: StatCardProps) {
  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={cn("p-3 rounded-xl", colorClass)}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
              {trend.value}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
