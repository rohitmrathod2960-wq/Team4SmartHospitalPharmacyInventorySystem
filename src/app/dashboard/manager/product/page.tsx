"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");

  const fetchData = async () => {
    const prodSnap = await getDocs(collection(db, "products"));
    const catSnap = await getDocs(collection(db, "categories"));
    const supSnap = await getDocs(collection(db, "suppliers"));

    setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setSuppliers(supSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    await addDoc(collection(db, "products"), {
      sku,
      name,
      price: Number(price),
      categoryId,
      supplierId,
      quantity: Number(quantity),
      lowStockThreshold: Number(threshold),
      createdAt: new Date()
    });

    setSku(""); setName(""); setPrice(""); setQuantity(""); setThreshold("");
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    fetchData();
  };

  return (
    <ManagerGuard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Product Management</h1>

        <div className="grid grid-cols-4 gap-3">
          <input value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU" className="border p-2 rounded"/>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2 rounded"/>
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="border p-2 rounded"/>

          <select onChange={e => setCategoryId(e.target.value)} className="border p-2 rounded">
            <option>Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select onChange={e => setSupplierId(e.target.value)} className="border p-2 rounded">
            <option>Select Supplier</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Qty" className="border p-2 rounded"/>
          <input value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="Low Stock Threshold" className="border p-2 rounded"/>

          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded">Add</button>
        </div>

        <table className="w-full bg-white rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>SKU</th><th>Name</th><th>Qty</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b">
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 rounded">
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