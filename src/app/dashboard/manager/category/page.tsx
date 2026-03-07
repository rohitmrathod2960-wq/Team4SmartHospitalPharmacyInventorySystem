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

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "categories", id));
    fetchData();
  };

  return (
    <ManagerGuard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Category Management</h1>

        <div className="flex gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2 rounded"/>
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded"/>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded">Add</button>
        </div>

        <table className="w-full bg-white rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b">
                <td className="p-2">{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button onClick={() => handleDelete(cat.id)} className="bg-red-500 text-white px-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerGuard>
  );
}