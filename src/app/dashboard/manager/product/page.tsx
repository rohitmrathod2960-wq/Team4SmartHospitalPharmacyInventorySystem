"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { resolveName } from "@/lib/utils";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function ProductPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [assignedMap, setAssignedMap] = useState<{[key:string]: number}>({});

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
    }
  ];

  // ✅ SERIAL GENERATION FUNCTION (ADDED HERE)
  const generateSerials = async (productId: string, name: string) => {

    const count = prompt("Enter number of serials");
    if (!count) return;

    const prefix = name.slice(0, 2).toUpperCase();

    for (let i = 1; i <= Number(count); i++) {
      await addDoc(collection(db, "serials"), {
        productId,
        serial: `${prefix}-${i.toString().padStart(3, "0")}`,
        status: "available",
        assignedTo: null
      });
    }

    alert("Serials Generated");
  };

  useEffect(() => {
    let unsubscribeProducts = () => {};
    let unsubscribeCategories = () => {};
    let unsubscribeAssignments = () => {};

    const init = async () => {

      const prodQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const prodSnap = await getDocs(prodQuery);

      const assignQuery = query(collection(db, "assignments"));

      unsubscribeAssignments = onSnapshot(assignQuery, (snapshot) => {

        const map: {[key:string]: number} = {};

        snapshot.forEach(doc => {
          const data:any = doc.data();

          data.items?.forEach((item:any) => {
            const id = item.medicineId;
            if (!id) return;
            map[id] = (map[id] || 0) + (item.quantity || 1);
          });

        });

        setAssignedMap(map);

      });

      if (prodSnap.empty) {
        for (let p of defaultProducts) {
          await addDoc(collection(db, "products"), p);
        }
      }

      unsubscribeProducts = onSnapshot(prodQuery, (snapshot) => {
        setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      });

      const catQuery = query(collection(db, "categories"), orderBy("createdAt", "desc"));
      unsubscribeCategories = onSnapshot(catQuery, (snapshot) => {
        setCategories(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      });

    };

    init();

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeAssignments();
    };

  }, []);

  const getCategoryName = (product: any) => {

    if (product.categoryId) {
      const cat = categories.find(c => c.id === product.categoryId);
      if (cat) return cat.name ?? cat.medicineName;
    }

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
                <th className="text-center">Serial</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-500">
                    No medicine available.
                  </td>
                </tr>

              ) : (

                products.map(p => {

                  const available = p.quantity || 0;
                  const assigned = assignedMap[p.id] || 0;
                  const threshold = p.lowStockThreshold || 5;

                  let status = "Available";

                  if (available === 0) status = "Out of Stock";
                  else if (available <= threshold) status = "Low Stock";

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

                      <td className="text-center">
                        {p.serialTracked ? "Yes" : "No"}
                      </td>

                      <td className="text-center">
                        {p.serialTracked && (
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                            onClick={() => generateSerials(p.id, p.medicineName)}
                          >
                            Generate
                          </button>
                        )}
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