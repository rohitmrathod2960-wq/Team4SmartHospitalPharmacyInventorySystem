"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function SupplierPage() {

  const [suppliers, setSuppliers] = useState<any[]>([]);

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "suppliers"));
    setSuppliers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Defence Supplier Management
        </h1>

        {/* Supplier Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3 text-left">Supplier Name</th>
                <th className="text-left">Phone</th>
                <th className="text-left">Email</th>
                <th className="text-center">Action</th>
              </tr>

            </thead>

            <tbody>

              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    No suppliers available.
                  </td>
                </tr>
              ) : (

                suppliers.map(s => (

                  <tr key={s.id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      {s.name}
                    </td>

                    <td>
                      {s.phone}
                    </td>

                    <td>
                      {s.email}
                    </td>

                    {/* Managers cannot modify suppliers */}
                    <td className="text-center text-gray-400 font-medium">
                      View Only
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </ManagerGuard>
  );
}