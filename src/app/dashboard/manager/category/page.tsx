"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoryPage() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("");

  const fetchData = async () => {

    const snap = await getDocs(collection(db, "categories"));

    const data: Category[] = snap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Category, "id">)
    }));

    setCategories(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ========================= */
  /* CATEGORY FILTER LOGIC     */
  /* ========================= */

  const filteredCategories = !filter
    ? categories
    : categories.filter(cat =>
        (cat.name ?? cat.medicineName)?.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Pharmacy Medicine Categories
        </h1>

        {/* CATEGORY FILTER */}

        <div className="flex gap-3 bg-white p-4 rounded-lg shadow">

          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter medicine by category..."
            className="border p-2 rounded w-1/3"
          />

        </div>

        {/* Category Table */}

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-3 text-left">
                  Category Name
                </th>

                <th className="text-left">
                  Description
                </th>

                <th className="text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCategories.length === 0 ? (

                <tr>

                  <td colSpan={3} className="text-center p-6 text-gray-500">
                    No categories found.
                  </td>

                </tr>

              ) : (

                filteredCategories.map(cat => (

                  <tr key={cat.id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      {cat.name ?? cat.medicineName}
                    </td>

                    <td>
                      {cat.description}
                    </td>

                    {/* Managers cannot delete categories */}

                    <td className="text-center text-gray-400">
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