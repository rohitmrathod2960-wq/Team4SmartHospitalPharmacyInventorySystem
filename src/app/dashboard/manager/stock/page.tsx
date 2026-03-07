
"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { 
  Package, 
  Search, 
  Plus, 
  Minus, 
  ArrowDownLeft, 
  ArrowUpRight,
  Filter,
  AlertCircle,
  History
} from 'lucide-react';
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Equipment } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const INITIAL_EQUIPMENT: Equipment[] = [
  { id: '1', equipmentName: 'M1 Abrams Optic', category: 'Heavy Machinery', serialNumber: 'SN-90210', quantity: 12, minStockLevelLevel: 5, status: 'Available', createdAt: '2023-10-01' },
  { id: '2', equipmentName: 'Tactical Drone v4', category: 'UAV', serialNumber: 'DR-4421', quantity: 3, minStockLevelLevel: 5, status: 'Low Stock', createdAt: '2023-11-15' },
  { id: '3', equipmentName: 'Encrypted Radio RT-1', category: 'Communication', serialNumber: 'RAD-551', quantity: 45, minStockLevelLevel: 10, status: 'Available', createdAt: '2023-09-20' },
  { id: '5', equipmentName: 'Night Vision Goggles Gen 3', category: 'Optics', serialNumber: 'NVG-102', quantity: 8, minStockLevelLevel: 10, status: 'Low Stock', createdAt: '2023-12-01' },
];

export default function ManagerInventoryPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [transactionQty, setTransactionQty] = useState(1);
  const { toast } = useToast();

  const filteredEquipment = equipment.filter(item => 
    item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockAction = (type: 'IN' | 'OUT') => {
    if (!selectedItem) return;
    const qtyChange = type === 'IN' ? transactionQty : -transactionQty;
    const newQty = selectedItem.quantity + qtyChange;
    if (newQty < 0) {
      toast({ variant: "destructive", title: "Invalid Quantity", description: "Stock cannot fall below zero." });
      return;
    }
    const updatedEquipment = equipment.map(item => {
      if (item.id === selectedItem.id) {
        const status = newQty <= item.minStockLevelLevel ? 'Low Stock' : 'Available';
        return { ...item, quantity: newQty, status: status as any };
      }
      return item;
    });
    setEquipment(updatedEquipment);
    toast({ title: `Stock Updated`, description: `Successfully adjusted ${selectedItem.equipmentName}.` });
    setSelectedItem(null);
  };

  return (
    <DashboardLayout role="manager" title="Inventory Control">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground">Adjust quantities and track resource availability.</p>
        </div>
        <Link href="/dashboard/manager/transactions">
          <Button variant="outline" className="rounded-xl">
            <History className="w-4 h-4 mr-2" />
            Stock Movements
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Equipment List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search equipment..." 
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
                <TableHead className="pl-6 font-bold">Equipment</TableHead>
                <TableHead className="font-bold text-center">Available</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6 py-4 font-medium">{item.equipmentName}</TableCell>
                  <TableCell className="text-center font-bold">{item.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Available' ? 'secondary' : 'destructive'} className="rounded-md">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-lg h-8" onClick={() => setSelectedItem(item)}>
                          <Plus className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Stock In
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Stock In</DialogTitle></DialogHeader>
                        <Input type="number" value={transactionQty} onChange={e => setTransactionQty(parseInt(e.target.value) || 0)} />
                        <Button onClick={() => handleStockAction('IN')} className="w-full">Update</Button>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-lg h-8" onClick={() => setSelectedItem(item)}>
                          <Minus className="w-3.5 h-3.5 mr-1 text-red-600" />
                          Stock Out
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Stock Out</DialogTitle></DialogHeader>
                        <Input type="number" value={transactionQty} onChange={e => setTransactionQty(parseInt(e.target.value) || 0)} />
                        <Button variant="destructive" onClick={() => handleStockAction('OUT')} className="w-full">Update</Button>
                      </DialogContent>
                    </Dialog>
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
