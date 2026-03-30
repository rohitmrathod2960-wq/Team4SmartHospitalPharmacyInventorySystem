
"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Package, Search, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/hooks/use-toast';
import { Medicine } from '@/lib/types';
//////////////////////////////////////////////////////////////////////////////////////////////
const MOCK_INVENTORY: Medicine[] = [
  // { id: '1', medicineName: 'M1 Abrams Optic', category: 'Heavy Machinery', serialNumber: 'SN-90210', quantity: 12, lowStockThreshold: 5, status: 'Available', createdAt: '2023-10-01' },
  // { id: '3', medicineName: 'Encrypted Radio RT-1', category: 'Communication', serialNumber: 'RAD-551', quantity: 45, lowStockThreshold: 10, status: 'Available', createdAt: '2023-09-20' },
  // { id: '5', medicineName: 'Night Vision Goggles Gen 3', category: 'Optics', serialNumber: 'NVG-102', quantity: 8, lowStockThreshold: 10, status: 'Low Stock', createdAt: '2023-12-01' },
  // { id: '7', medicineName: 'Ballistic Helmet (MICH)', category: 'Personal Gear', serialNumber: 'HLM-003', quantity: 72, lowStockThreshold: 20, status: 'Available', createdAt: '2023-07-22' },
];

export default function pharmacistInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filtered = MOCK_INVENTORY.filter(item => 
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequest = (name: string) => {
    toast({
      title: "Requisition Submitted",
      description: `Your request for ${name} has been sent to the manager for approval.`,
    });
  };

  return (
    <DashboardLayout role="pharmacist" title="Resource Catalog">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Available Inventory</h1>
        <p className="text-muted-foreground">View real-time stock and submit requisition requests.</p>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Catalog</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 font-bold">Medicine</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold text-center">Availability</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6 py-4 font-medium">{item.medicineName}</TableCell>
                  <TableCell className="text-xs uppercase text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-center font-bold">
                    <Badge variant={item.quantity > 0 ? 'secondary' : 'outline'}>
                      {item.quantity} In Stock
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg h-8 border-primary/20 text-primary hover:bg-primary/5"
                      onClick={() => handleRequest(item.medicineName)}
                      disabled={item.quantity === 0}
                    >
                      <ClipboardList className="w-3.5 h-3.5 mr-1" />
                      Request Item
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
