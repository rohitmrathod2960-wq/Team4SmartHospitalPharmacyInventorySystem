"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { 
  Shield, 
  Users, 
  Package, 
  AlertTriangle, 
  Plus, 
  Download,
  MoreVertical,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Equipment', value: '1,284', icon: Package, colorClass: 'bg-blue-50 text-blue-600', trend: { value: '+12%', positive: true } },
    { label: 'Active Users', value: '86', icon: Users, colorClass: 'bg-violet-50 text-violet-600', trend: { value: '+4%', positive: true } },
    { label: 'In Maintenance', value: '18', icon: AlertTriangle, colorClass: 'bg-orange-50 text-orange-600', trend: { value: '-2%', positive: false } },
    { label: 'Security Health', value: '98%', icon: Shield, colorClass: 'bg-emerald-50 text-emerald-600' },
  ];

  const recentEquipment = [
    { name: 'M1 Abrams Optic', category: 'Heavy Machinery', serial: 'SN-90210', status: 'Available', qty: 12 },
    { name: 'Tactical Drone v4', category: 'UAV', serial: 'DR-4421', status: 'Assigned', qty: 8 },
    { name: 'encrypted Radio RT-1', category: 'Communication', serial: 'RAD-551', status: 'Maintenance', qty: 45 },
    { name: 'Level IV Plates', category: 'Personal Gear', serial: 'AR-772', status: 'Available', qty: 150 },
  ];

  return (
    <DashboardLayout role="admin" title="Administrator Dashboard">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-1">Manage global inventory and user privileges.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-dashed">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Inventory</CardTitle>
              <CardDescription>Real-time equipment tracking across all sectors.</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6 font-bold">Equipment</TableHead>
                  <TableHead className="font-bold">Serial No.</TableHead>
                  <TableHead className="font-bold">Quantity</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEquipment.map((item, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell className="pl-6 font-medium">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{item.category}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.serial}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'Available' ? 'secondary' : 
                        item.status === 'Assigned' ? 'outline' : 'destructive'
                      } className="rounded-md px-2 py-0">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Audit Logs
            </CardTitle>
            <CardDescription>Recent system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">New assignment created</p>
                    <p className="text-xs text-muted-foreground">Admin updated serial SN-90210 status to assigned.</p>
                    <p className="text-[10px] text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl">View All Logs</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
