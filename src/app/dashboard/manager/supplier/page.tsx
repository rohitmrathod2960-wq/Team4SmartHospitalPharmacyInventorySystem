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

  useEffect(() => {
    fetchData();
  }, []);

  // Add Supplier
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

  // Delete Supplier
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "suppliers", id));
    fetchData();
  };

  // Load Defence Suppliers
  const loadDefenceSuppliers = async () => {

    const data = [
      {
        name: "Lockheed Martin",
        phone: "+1 301 897 6000",
        email: "contact@lockheedmartin.com"
      },
      {
        name: "Boeing Defense",
        phone: "+1 312 544 2000",
        email: "defense@boeing.com"
      },
      {
        name: "BAE Systems",
        phone: "+44 1252 373232",
        email: "support@baesystems.com"
      },
      {
        name: "Northrop Grumman",
        phone: "+1 703 280 2900",
        email: "info@northropgrumman.com"
      },
      {
        name: "Raytheon Technologies",
        phone: "+1 781 522 3000",
        email: "contact@raytheon.com"
      }
    ];

    for (let supplier of data) {
      await addDoc(collection(db, "suppliers"), {
        ...supplier,
        createdAt: new Date()
      });
    }

    fetchData();
  };

  return (
    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Defence Supplier Management
        </h1>

        {/* Add Supplier */}
        <div className="flex gap-3 bg-white p-4 rounded-lg shadow">

          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Supplier Name"
            className="border p-2 rounded w-1/4"
          />

          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="border p-2 rounded w-1/4"
          />

          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            className="border p-2 rounded w-1/3"
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Add Supplier
          </button>

          <button
            onClick={loadDefenceSuppliers}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Load Defence Suppliers
          </button>

        </div>

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
                    No suppliers available. Add one or load defence suppliers.
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

                    <td className="text-center">

                      <button
                        onClick={() => handleDelete(s.id)}
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