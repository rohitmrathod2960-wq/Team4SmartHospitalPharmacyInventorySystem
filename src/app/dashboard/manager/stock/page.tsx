"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { resolveName } from "@/lib/utils";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function StockPage() {

  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {

    const snap = await getDocs(collection(db, "products"));

    setProducts(
      snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Stock Overview
        </h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3 text-left">Medicine</th>
                <th className="text-left">Available</th>
                <th className="text-left">Assigned</th>
                <th className="text-left">Low Stock</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    No medicine found. Add products first.
                  </td>
                </tr>

              ) : (

                products.map(product => {

                  const available = product.quantity || 0;
                  const assigned = product.assigned || 0;

                  const lowStock =
                    available <= (product.lowStockThreshold || 5);

                  return (

                    <tr key={product.id} className="border-b hover:bg-gray-50">

                      <td className="p-3 font-medium">
                        {resolveName(product)}
                      </td>

                      <td>
                        {available}
                      </td>

                      <td>
                        {assigned}
                      </td>

                      <td>

                        {lowStock ? (

                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                            Low Stock
                          </span>

                        ) : (

                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                            OK
                          </span>

                        )}

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </ManagerGuard>

  );
}