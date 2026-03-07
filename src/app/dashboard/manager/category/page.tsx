"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "categories"));
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add Category
  const handleAdd = async () => {
    if (!name) return;

    await addDoc(collection(db, "categories"), {
      name,
      description,
      createdAt: new Date()
    });

    setName("");
    setDescription("");
    fetchData();
  };

  // Delete Category
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "categories", id));
    fetchData();
  };

  // Add Defence Sample Categories
  const addDefaultCategories = async () => {
    const data = [
      { name: "Vehicles", description: "Military transport and combat vehicles" },
      { name: "Optics", description: "Night vision, binoculars, scopes" },
      { name: "Communication", description: "Military communication devices" },
      { name: "Armor", description: "Body armor, helmets, protective gear" },
      { name: "UAV", description: "Unmanned aerial vehicles and drones" },
      { name: "Weapons Support", description: "Weapon maintenance and support equipment" }
    ];

    for (let item of data) {
      await addDoc(collection(db, "categories"), {
        ...item,
        createdAt: new Date()
      });
    }

    fetchData();
  };

  return (
    <ManagerGuard>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Defence Equipment Categories
        </h1>

        {/* Add Category */}
        <div className="flex gap-3 bg-white p-4 rounded-lg shadow">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category Name"
            className="border p-2 rounded w-1/4"
          />

          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            className="border p-2 rounded w-1/2"
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Add Category
          </button>

          <button
            onClick={addDefaultCategories}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Load Defence Categories
          </button>
        </div>

        {/* Category Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">

            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Category Name</th>
                <th className="text-left">Description</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-6 text-gray-500">
                    No categories found. Add one or load defence categories.
                  </td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      {cat.name}
                    </td>

                    <td>
                      {cat.description}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
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