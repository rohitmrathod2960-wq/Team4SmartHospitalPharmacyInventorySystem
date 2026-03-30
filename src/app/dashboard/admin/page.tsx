"use client";
import { cn } from "@/lib/utils";
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
  Activity,
  ArrowRight
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
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Assets', value: '3,080', icon: Package, colorClass: 'bg-blue-50 text-blue-600', trend: { value: '+12%', positive: true } },
    { label: 'Active Users', value: '6', icon: Users, colorClass: 'bg-violet-50 text-violet-600', trend: { value: '+4%', positive: true } },
    { label: 'Low Stock Items', value: '1', icon: AlertTriangle, colorClass: 'bg-orange-50 text-orange-600', trend: { value: '+2%', positive: false } },
    { label: 'System Integrity', value: '99.9%', icon: Shield, colorClass: 'bg-emerald-50 text-emerald-600' },
  ];

  const criticalStock = [
    { name: 'Paracetamol 500mg', category: 'Tablet', serial: 'SN-90210', status: 'Available', qty: 50 },
    { name: 'Ceftriaxone Injection', category: 'Injection', serial: 'DR-4421', status: 'Available', qty: 150 },
    { name: 'Glucose Drip', category: 'IV Fluid', serial: 'NVG-102', status: 'Available', qty: 180 },
    { name: 'Insulin Injection', category: 'Injection', serial: 'AR-772', status: 'Available', qty: 80 },
  ];

  return (
    <DashboardLayout role="admin" title="Administrator Dashboard">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Hub</h1>
           <p className="text-muted-foreground mt-1">High-level visibility into pharmacy inventory and logistical operations.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/inventory">
            <Button className="rounded-xl shadow-lg shadow-primary/25">
              <Package className="w-4 h-4 mr-2" />
              Manage Inventory
            </Button>
          </Link>
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
              <CardTitle>Asset Monitor</CardTitle>
              <CardDescription>Primary inventory items requiring attention.</CardDescription>
            </div>
            <Link href="/dashboard/admin/inventory">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                View Full Repository
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6 font-bold">medicine</TableHead>
                  <TableHead className="font-bold">Serial No.</TableHead>
                  <TableHead className="font-bold">Qty</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalStock.map((item, i) => (
                  <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-medium">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{item.category}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.serial}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-bold",
                        item.status === 'Low Stock' ? "text-orange-600" : ""
                      )}>
                        {item.qty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'Available' ? 'secondary' : 'destructive'
                      } className="rounded-md px-2 py-0">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Link href="/dashboard/admin/inventory">
                        <Button variant="ghost" size="sm">Adjust</Button>
                      </Link>
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
              System Activity
            </CardTitle>
            <CardDescription>Recent logistic operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { title: 'Stock-In Confirmed', detail: '15 units of RT-1 Radio added.', time: '2 hours ago' },
                { title: 'Field Deployment', detail: '20 armor plates issued to Team B.', time: '5 hours ago' },
                { title: 'New User Registered', detail: 'Supply Officer assigned to Sector 4.', time: '1 day ago' },
                { title: 'Inventory Audit', detail: 'Annual audit completed for Warehouse A.', time: '2 days ago' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{log.title}</p>
                    <p className="text-xs text-muted-foreground">{log.detail}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/admin/transactions">
              <Button variant="outline" className="w-full mt-6 rounded-xl">View Audit Logs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
