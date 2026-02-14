"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { 
  Package, 
  TrendingUp, 
  Wrench, 
  Users,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function ManagerDashboard() {
  const stats = [
    { label: 'Inventory Value', value: '$2.4M', icon: TrendingUp, colorClass: 'bg-emerald-50 text-emerald-600' },
    { label: 'Stock Items', value: '412', icon: Package, colorClass: 'bg-blue-50 text-blue-600' },
    { label: 'Service Pending', value: '12', icon: Wrench, colorClass: 'bg-orange-50 text-orange-600' },
    { label: 'Active Teams', value: '8', icon: Users, colorClass: 'bg-violet-50 text-violet-600' },
  ];

  const chartData = [
    { name: 'Vehicle', val: 45 },
    { name: 'Optic', val: 82 },
    { name: 'Comm', val: 120 },
    { name: 'Armor', val: 156 },
    { name: 'UAV', val: 24 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <DashboardLayout role="manager" title="Operations Management">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Dashboard</h1>
          <p className="text-muted-foreground mt-1">Oversee stock levels and operational readiness.</p>
        </div>
        <Link href="/dashboard/manager/maintenance">
          <Button className="rounded-xl shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90">
            Predictive AI Tool
            <Activity className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>Stock distribution by equipment category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="val" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription className="text-blue-100">Predictive maintenance summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider opacity-60">High Risk Unit</p>
              <h4 className="font-bold text-xl">UAV-Alpha (SN-009)</h4>
              <p className="text-sm opacity-80">Motor vibrations detected. Failure predicted within 48 operating hours.</p>
            </div>
            <div className="h-px bg-white/20 w-full" />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider opacity-60">Fleet Status</p>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold">82%</span>
                <span className="text-xs opacity-70">Readiness Level</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[82%]" />
              </div>
            </div>
            <Link href="/dashboard/manager/maintenance" className="block mt-4">
              <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none rounded-xl">
                Open AI Tool
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
