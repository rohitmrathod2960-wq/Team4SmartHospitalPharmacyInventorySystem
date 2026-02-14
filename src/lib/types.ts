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
  status: 'Available' | 'Assigned' | 'Maintenance';
  assignedTo?: string;
  createdAt: string;
  usageDescription?: string;
  manufacturerSpecs?: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  task: string;
  frequency: string;
  dueDate: string;
  notes?: string;
}
