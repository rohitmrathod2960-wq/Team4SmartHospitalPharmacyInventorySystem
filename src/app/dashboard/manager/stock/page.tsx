"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";
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

  // STOCK IN
  const stockIn = async (product: any) => {

    const qty = Number(prompt("Enter quantity to add"));

    if (!qty || qty <= 0) return;

    const newQty = product.quantity + qty;

    await updateDoc(doc(db, "products", product.id), {
      quantity: newQty
    });

    await addDoc(collection(db, "transactions"), {
      productId: product.id,
      productName: product.name,
      type: "IN",
      quantity: qty,
      timestamp: new Date()
    });

    fetchProducts();
  };

  // STOCK OUT
  const stockOut = async (product: any) => {

    const qty = Number(prompt("Enter quantity to remove"));

    if (!qty || qty <= 0) return;

    if (qty > product.quantity) {
      alert("Not enough stock");
      return;
    }

    const newQty = product.quantity - qty;

    await updateDoc(doc(db, "products", product.id), {
      quantity: newQty
    });

    await addDoc(collection(db, "transactions"), {
      productId: product.id,
      productName: product.name,
      type: "OUT",
      quantity: qty,
      timestamp: new Date()
    });

    fetchProducts();
  };

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Stock Management
        </h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3 text-left">Equipment</th>
                <th className="text-left">Available</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    No equipment found. Add products first.
                  </td>
                </tr>

              ) : (

                products.map(product => {

                  const lowStock =
                    product.quantity <= product.lowStockThreshold;

                  return (

                    <tr key={product.id} className="border-b hover:bg-gray-50">

                      <td className="p-3 font-medium">
                        {product.name}
                      </td>

                      <td>
                        {product.quantity}
                      </td>

                      <td>

                        {lowStock ? (

                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                            Low Stock
                          </span>

                        ) : (

                          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                            Available
                          </span>

                        )}

                      </td>

                      <td className="flex gap-2 justify-center p-2">

                        <button
                          onClick={() => stockIn(product)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          + Stock In
                        </button>

                        <button
                          onClick={() => stockOut(product)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          - Stock Out
                        </button>

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