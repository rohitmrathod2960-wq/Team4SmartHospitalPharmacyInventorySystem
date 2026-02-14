"use client";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Clock, 
  MapPin, 
  ChevronRight,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

export default function StaffDashboard() {
  const myEquipment = [
    { name: 'Standard Issue Radio', serial: 'RAD-012', date: '2023-11-20', status: 'In Use' },
    { name: 'Tactical Vest (L)', serial: 'VST-981', date: '2023-10-05', status: 'In Use' },
  ];

  return (
    <DashboardLayout role="staff" title="Personal Portal">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Assigned Equipment</h2>
              <Button variant="link" className="text-primary font-semibold p-0">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myEquipment.map((item, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                  <CardContent className="p-0">
                    <div className="h-2 bg-emerald-500 w-full" />
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="bg-primary/10 p-2 rounded-xl">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="rounded-full text-[10px] uppercase">{item.status}</Badge>
                      </div>
                      <h3 className="text-lg font-bold mt-4">{item.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{item.serial}</p>
                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Issued: {item.date}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <button className="border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-muted/30 transition-colors group">
                <div className="bg-muted p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-bold text-sm">Request New Item</p>
                <p className="text-xs text-muted-foreground mt-1">Submit a requisition form</p>
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Inventory Quick View</h2>
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                {[
                  { name: 'NVGs Gen 3', available: 4, category: 'Optics' },
                  { name: 'Ballistic Helmets', available: 12, category: 'Personal Gear' },
                  { name: 'Satcom Transceiver', available: 2, category: 'Communication' },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{inv.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{inv.category}</p>
                      </div>
                    </div>
                    <Badge variant={inv.available > 5 ? 'secondary' : 'outline'} className="rounded-lg">
                      {inv.available} Available
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-2xl bg-primary text-primary-foreground overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Location Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-3 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">Base Sector 7G</p>
                  <p className="text-xs opacity-70">Main Deployment Hub</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-xs font-bold uppercase opacity-60">Status</p>
                  <p className="text-sm mt-1">Operational - All units online</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Maintenance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl">
                <p className="text-xs font-bold text-orange-800">Radio RAD-012 Due</p>
                <p className="text-[10px] text-orange-700 mt-1">Scheduled service in 3 days. Please return to armory by 20th.</p>
              </div>
              <p className="text-[10px] text-center text-muted-foreground italic">No other urgent maintenance required.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
