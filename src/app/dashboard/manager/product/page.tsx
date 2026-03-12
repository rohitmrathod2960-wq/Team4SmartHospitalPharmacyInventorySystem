"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function ProductPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchData = async () => {

    const prodSnap = await getDocs(collection(db, "products"));
    const catSnap = await getDocs(collection(db, "categories"));

    setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));

  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : "Uncategorized";
  };

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Equipment Overview
        </h1>

        {/* Equipment Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3 text-left">Equipment</th>
                <th className="text-left">Category</th>
                <th className="text-center">Available</th>
                <th className="text-center">Assigned</th>
                <th className="text-center">Status</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No equipment available.
                  </td>
                </tr>

              ) : (

                products.map(p => {

                  const available = p.quantity || 0;
                  const assigned = p.assigned || 0;

                  let status = "Available";

                  if (available === 0) {
                    status = "Out of Stock";
                  } else if (available <= (p.lowStockThreshold || 5)) {
                    status = "Low Stock";
                  }

                  return (

                    <tr key={p.id} className="border-b hover:bg-gray-50">

                      <td className="p-3 font-medium">
                        {p.name}
                      </td>

                      <td>
                        {getCategoryName(p.categoryId)}
                      </td>

                      <td className="text-center">
                        {available}
                      </td>

                      <td className="text-center">
                        {assigned}
                      </td>

                      <td className="text-center">

                        <span
                          className={
                            status === "Available"
                              ? "text-green-600 font-semibold"
                              : status === "Low Stock"
                              ? "text-yellow-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {status}
                        </span>

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