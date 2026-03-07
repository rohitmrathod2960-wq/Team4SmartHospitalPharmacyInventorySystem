"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "suppliers"));
    setSuppliers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!name) return;

    await addDoc(collection(db, "suppliers"), {
      name,
      phone,
      email,
      createdAt: new Date()
    });

    setName("");
    setPhone("");
    setEmail("");
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "suppliers", id));
    fetchData();
  };

  return (
    <ManagerGuard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Supplier Management</h1>

        <div className="flex gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2 rounded"/>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="border p-2 rounded"/>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded"/>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded">Add</button>
        </div>

        <table className="w-full bg-white rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} className="border-b">
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.email}</td>
                <td>
                  <button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white px-2 rounded">
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