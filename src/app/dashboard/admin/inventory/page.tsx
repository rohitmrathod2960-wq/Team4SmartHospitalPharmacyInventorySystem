
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
  MoreVertical,
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
  { id: '4', equipmentName: 'Level IV Plates', category: 'Personal Gear', serialNumber: 'AR-772', quantity: 150, minStockLevelLevel: 50, status: 'Available', createdAt: '2023-08-05' },
  { id: '5', equipmentName: 'Night Vision Goggles Gen 3', category: 'Optics', serialNumber: 'NVG-102', quantity: 8, minStockLevelLevel: 10, status: 'Low Stock', createdAt: '2023-12-01' },
  { id: '6', equipmentName: 'Satcom Terminal B1', category: 'Communication', serialNumber: 'SAT-882', quantity: 5, minStockLevelLevel: 2, status: 'Available', createdAt: '2024-01-10' },
  { id: '7', equipmentName: 'Ballistic Helmet (MICH)', category: 'Personal Gear', serialNumber: 'HLM-003', quantity: 72, minStockLevelLevel: 20, status: 'Available', createdAt: '2023-07-22' },
];

export default function InventoryPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [transactionQty, setTransactionQty] = useState(1);
  const [transactionReason, setTransactionReason] = useState('');
  const { toast } = useToast();

  const filteredEquipment = equipment.filter(item => 
    item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockAction = (type: 'IN' | 'OUT') => {
    if (!selectedItem) return;

    const qtyChange = type === 'IN' ? transactionQty : -transactionQty;
    const newQty = selectedItem.quantity + qtyChange;

    if (newQty < 0) {
      toast({
        variant: "destructive",
        title: "Invalid Quantity",
        description: "Stock cannot fall below zero.",
      });
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
    toast({
      title: `Stock ${type === 'IN' ? 'Increased' : 'Decreased'}`,
      description: `Successfully ${type === 'IN' ? 'added' : 'removed'} ${transactionQty} units of ${selectedItem.equipmentName}.`,
    });
    setSelectedItem(null);
    setTransactionQty(1);
    setTransactionReason('');
  };

  return (
    <DashboardLayout role="admin" title="Inventory Management">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Repository</h1>
          <p className="text-muted-foreground mt-1">Manage global assets, adjust stock levels, and monitor status.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/transactions">
            <Button variant="outline" className="rounded-xl border-dashed">
              <History className="w-4 h-4 mr-2" />
              Audit Logs
            </Button>
          </Link>
          <Button className="rounded-xl shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4 mr-2" />
            New Equipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-primary/5 border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                <h3 className="text-2xl font-bold mt-1">{equipment.length}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-xl">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-orange-50 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Low Stock Alerts</p>
                <h3 className="text-2xl font-bold mt-1 text-orange-900">
                  {equipment.filter(i => i.status === 'Low Stock').length}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-emerald-50 border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-800">Deployment Ready</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-900">
                  {equipment.reduce((acc, curr) => acc + curr.quantity, 0)} Units
                </h3>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <ArrowUpRight className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Asset Table</CardTitle>
              <CardDescription>Live tracking of all defense inventory items.</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search serial or name..." 
                className="pl-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6 font-bold">Equipment</TableHead>
                <TableHead className="font-bold">Serial No.</TableHead>
                <TableHead className="font-bold text-center">In Stock</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="pr-6 text-right">Inventory Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6 py-4">
                    <div className="font-bold">{item.equipmentName}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{item.category}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.serialNumber}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "font-bold text-lg",
                      item.quantity <= item.minStockLevelLevel ? "text-orange-600" : ""
                    )}>
                      {item.quantity}
                    </span>
                    <div className="text-[10px] text-muted-foreground">Min: {item.minStockLevelLevel}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === 'Available' ? 'secondary' : 
                      item.status === 'Low Stock' ? 'destructive' : 'outline'
                    } className="rounded-md px-2 py-0">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-lg h-8 border-emerald-200 hover:bg-emerald-50" onClick={() => setSelectedItem(item)}>
                          <Plus className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Stock In
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Stock In: {selectedItem?.equipmentName}</DialogTitle>
                          <DialogDescription>Add new units to the inventory. This will be logged in the transaction history.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="qty">Quantity to Add</Label>
                            <Input 
                              id="qty" 
                              type="number" 
                              value={transactionQty} 
                              onChange={(e) => setTransactionQty(parseInt(e.target.value) || 0)} 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="reason">Reason / Invoice #</Label>
                            <Input 
                              id="reason" 
                              placeholder="e.g. Monthly Restock, Requisition #882" 
                              value={transactionReason}
                              onChange={(e) => setTransactionReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleStockAction('IN')} className="w-full">Confirm Stock In</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-lg h-8 border-red-200 hover:bg-red-50" onClick={() => setSelectedItem(item)}>
                          <Minus className="w-3.5 h-3.5 mr-1 text-red-600" />
                          Stock Out
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Stock Out: {selectedItem?.equipmentName}</DialogTitle>
                          <DialogDescription>Remove units for deployment or maintenance. Ensure reasoning is documented.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="qty-out">Quantity to Remove</Label>
                            <Input 
                              id="qty-out" 
                              type="number" 
                              value={transactionQty} 
                              onChange={(e) => setTransactionQty(parseInt(e.target.value) || 0)} 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="reason-out">Deployment Code / Destination</Label>
                            <Input 
                              id="reason-out" 
                              placeholder="e.g. Sector 7G Deployment, Damaged in Field" 
                              value={transactionReason}
                              onChange={(e) => setTransactionReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="destructive" onClick={() => handleStockAction('OUT')} className="w-full">Confirm Stock Out</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEquipment.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No equipment found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
