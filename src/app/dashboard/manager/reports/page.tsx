"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

type Product = {
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold: number;
};

export default function AlertsPage() {
  const [lowStock, setLowStock] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "products"));

      const products: Product[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">)
      }));

      const filtered = products.filter(
        p => p.quantity <= p.lowStockThreshold
      );

      setLowStock(filtered);
    };

    fetchData();
  }, []);

  return (
    <ManagerGuard>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-red-600">
          Low Stock Alerts
        </h1>

        {lowStock.length === 0 && (
          <p className="text-green-600">No low stock items</p>
        )}

        {lowStock.map(p => (
          <div key={p.id} className="border p-3 rounded">
            {p.name} — Qty: {p.quantity}
          </div>
        ))}
      </div>
    </ManagerGuard>
  );
}