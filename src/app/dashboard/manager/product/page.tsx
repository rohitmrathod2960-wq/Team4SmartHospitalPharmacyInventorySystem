"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { resolveName } from "@/lib/utils";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function ProductPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const defaultProducts = [
    {
      name: "Amoxicillin 250mg",
      medicineName: "Amoxicillin 250mg",
      category: "Capsule",
      categoryId: "cat_capsule",
      sku: "AMX-250",
      price: 45,
      quantity: 200,
      lowStockThreshold: 20,
      serialTracked: false,
      status: "in_stock",
      supplier: "Vikram Shetty",
      expiryDate: new Date("2027-03-18T00:00:00Z"),
      createdAt: new Date()
    },
    {
      name: "Paracetamol 500mg",
      medicineName: "Paracetamol 500mg",
      category: "Tablet",
      categoryId: "cat_tablet",
      sku: "PCM-500",
      price: 20,
      quantity: 150,
      lowStockThreshold: 25,
      serialTracked: false,
      status: "in_stock",
      supplier: "Vikram Shetty",
      expiryDate: new Date("2027-08-30T00:00:00Z"),
      createdAt: new Date()
    },
    {
      name: "Aspirin 75mg",
      medicineName: "Aspirin 75mg",
      category: "Tablet",
      categoryId: "cat_tablet",
      sku: "ASP-075",
      price: 35,
      quantity: 120,
      lowStockThreshold: 30,
      serialTracked: false,
      status: "in_stock",
      supplier: "Vikram Shetty",
      expiryDate: new Date("2028-02-03T00:00:00Z"),
      createdAt: new Date()
    }
  ];

  const fetchData = async () => {

    const prodSnap = await getDocs(collection(db, "products"));

    // If no products in Firestore → insert admin products
    if (prodSnap.empty) {

      for (let p of defaultProducts) {
        await addDoc(collection(db, "products"), p);
      }

      const newSnap = await getDocs(collection(db, "products"));
      setProducts(newSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    } else {

      setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    }

    const catSnap = await getDocs(collection(db, "categories"));
    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));

  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (product: any) => {

    if (product.categoryId) {
      const cat = categories.find(c => c.id === product.categoryId);
      if (cat) return cat.name ?? cat.medicineName;
    if (product.category) {
      return product.category;
    }

    return "Uncategorized";
  };

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Medicine Overview
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3 text-left">Medicine</th>
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
                    No medicine available.
                  </td>
                </tr>

              ) : (

                products.map(p => {

                  const available = p.quantity || 0;
                  const assigned = p.assigned || 0;

                  const threshold = p.lowStockThreshold || 5;

                  let status = "Available";

                  if (available === 0) {
                    status = "Out of Stock";
                  }
                  else if (available <= threshold) {
                    status = "Low Stock";
                  }

                  return (

                    <tr key={p.id} className="border-b hover:bg-gray-50">

                      <td className="p-3 font-medium">
                        {resolveName(p)}
                      </td>

                      <td>
                        {getCategoryName(p)}
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