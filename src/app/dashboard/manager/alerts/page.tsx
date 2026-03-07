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

  const fetchAlerts = async () => {

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

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold text-red-600">
          Low Stock Alerts
        </h1>

        {/* No Alerts */}
        {lowStock.length === 0 && (

          <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg">
            All equipment levels are healthy. No low stock items detected.
          </div>

        )}

        {/* Alert Cards */}
        <div className="grid grid-cols-3 gap-4">

          {lowStock.map(p => (

            <div
              key={p.id}
              className="bg-white border-l-4 border-red-500 shadow p-4 rounded-lg"
            >

              <h2 className="text-lg font-semibold">
                {p.name}
              </h2>

              <p className="text-gray-600">
                Available: <span className="font-bold text-red-600">
                  {p.quantity}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                Threshold: {p.lowStockThreshold}
              </p>

              <span className="inline-block mt-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Low Stock Warning
              </span>

            </div>

          ))}

        </div>

      </div>

    </ManagerGuard>

  );

}