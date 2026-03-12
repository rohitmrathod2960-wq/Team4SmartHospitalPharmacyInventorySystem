export type Role = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: Role;
  createdAt: string;
}

export interface Equipment {
  id: string;
  equipmentName: string;
  category: string;
  serialNumber: string;
  quantity: number;
  minStockLevelLevel: number;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Low Stock';
  assignedTo?: string;
  createdAt: string;
  usageDescription?: string;
  manufacturerSpecs?: string;
}

export type TransactionType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface StockTransaction {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: TransactionType;
  quantity: number;
  reason: string;
  performedBy: string;

  /* NEW AUDIT FIELD ADDED */
  ipAddress: string;

  timestamp: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  task: string;
  frequency: string;
  dueDate: string;
  notes?: string;
}