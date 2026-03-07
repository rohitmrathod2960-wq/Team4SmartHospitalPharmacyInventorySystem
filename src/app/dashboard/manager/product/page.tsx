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

  useEffect(() => {
    fetchData();
  }, []);

  // Add Product
  const handleAdd = async () => {

    if (!sku || !name) return;

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

    setSku("");
    setName("");
    setPrice("");
    setQuantity("");
    setThreshold("");

    fetchData();
  };

  // Delete Product
  const handleDelete = async (id: string) => {

    await deleteDoc(doc(db, "products", id));
    fetchData();

  };

  // Load Defence Equipment
  const loadDefenceProducts = async () => {

    const items = [
      { sku:"DEF-001", name:"Night Vision Goggles", price:1500, quantity:25 },
      { sku:"DEF-002", name:"Military Tactical Radio", price:2200, quantity:15 },
      { sku:"DEF-003", name:"Armored Helmet", price:450, quantity:50 },
      { sku:"DEF-004", name:"Drone Surveillance UAV", price:8500, quantity:8 },
      { sku:"DEF-005", name:"Thermal Imaging Scope", price:3200, quantity:12 },
      { sku:"DEF-006", name:"Ballistic Body Armor", price:900, quantity:40 },
      { sku:"DEF-007", name:"Combat Tactical Vehicle Kit", price:12000, quantity:4 }
    ];

    for (let item of items) {

      await addDoc(collection(db, "products"), {
        ...item,
        categoryId: "",
        supplierId: "",
        lowStockThreshold: 5,
        createdAt: new Date()
      });

    }

    fetchData();

  };

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Defence Equipment Product Management
        </h1>

        {/* Add Product */}
        <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow">

          <input
            value={sku}
            onChange={e => setSku(e.target.value)}
            placeholder="SKU"
            className="border p-2 rounded"
          />

          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Product Name"
            className="border p-2 rounded"
          />

          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-2 rounded"
          />

          <select
            onChange={e => setCategoryId(e.target.value)}
            className="border p-2 rounded"
          >

            <option value="">Select Category</option>

            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}

          </select>

          <select
            onChange={e => setSupplierId(e.target.value)}
            className="border p-2 rounded"
          >

            <option value="">Select Supplier</option>

            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}

          </select>

          <input
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="border p-2 rounded"
          />

          <input
            value={threshold}
            onChange={e => setThreshold(e.target.value)}
            placeholder="Low Stock Threshold"
            className="border p-2 rounded"
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Add Product
          </button>

        </div>

        {/* Load Defence Equipment */}
        <button
          onClick={loadDefenceProducts}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Load Defence Equipment
        </button>

        {/* Product Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-2">SKU</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No products available. Add or load defence equipment.
                  </td>
                </tr>

              ) : (

                products.map(p => (

                  <tr key={p.id} className="border-b hover:bg-gray-50">

                    <td className="p-2">{p.sku}</td>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>{p.quantity}</td>

                    <td>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
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