"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { resolveName } from "@/lib/utils";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

/* TYPES */

type Product = {
  id: string;
  name?: string;
  quantity?: number;
  qty?: number;
  lowStockThreshold?: number;
  lowStock?: number;
};

type Transaction = {
  id: string;
  type?: string;
};

export default function ReportsPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0
  });

  /* ----------------------------- */
  /* REALTIME PRODUCTS LISTENER   */
  /* ----------------------------- */

  useEffect(() => {

    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {

        const prodData: Product[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Product, "id">)
        }));

        setProducts(prodData);

        /* SUMMARY CALCULATIONS */

        const totalProducts = prodData.length;

        const totalStock = prodData.reduce((sum, p) => {

          const quantity = p.quantity ?? p.qty ?? 0;
          return sum + quantity;

        }, 0);

        const lowStock = prodData.filter(p => {

          const quantity = p.quantity ?? p.qty ?? 0;
          const threshold = p.lowStockThreshold ?? p.lowStock ?? 5;

          return quantity <= threshold;

        }).length;

        setSummary({
          totalProducts,
          totalStock,
          lowStock
        });

      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

    return () => unsubProducts();

  }, []);


  /* ----------------------------- */
  /* REALTIME TRANSACTIONS        */
  /* ----------------------------- */

  useEffect(() => {

    const unsubTransactions = onSnapshot(
      collection(db, "transactions"),
      (snapshot) => {

        const transData: Transaction[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Transaction, "id">)
        }));

        setTransactions(transData);

      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

    return () => unsubTransactions();

  }, []);


  /* ----------------------------- */
  /* BAR CHART DATA (DYNAMIC)     */
  /* ----------------------------- */

  const stockChart = products.map(p => ({

    name: resolveName(p),

    quantity: p.quantity ?? p.qty ?? 0

  }));


  /* ----------------------------- */
  /* PIE CHART DATA               */
  /* ----------------------------- */

  const movement = [

    {
      name: "Stock IN",
      value: transactions.filter(t => t.type === "IN").length
    },

    {
      name: "Stock OUT",
      value: transactions.filter(t => t.type === "OUT").length
    }

  ];

  const COLORS = ["#16a34a", "#ef4444"];


  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Reports & Analysis
        </h1>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-lg shadow">

            <h2 className="text-gray-500">
              Total Medicine
            </h2>

            <p className="text-2xl font-bold">
              {summary.totalProducts}
            </p>

          </div>

          <div className="bg-white p-5 rounded-lg shadow">

            <h2 className="text-gray-500">
              Total Stock
            </h2>

            <p className="text-2xl font-bold">
              {summary.totalStock}
            </p>

          </div>

          <div className="bg-white p-5 rounded-lg shadow">

            <h2 className="text-gray-500">
              Low Stock Items
            </h2>

            <p className="text-2xl font-bold text-red-600">
              {summary.lowStock}
            </p>

          </div>

        </div>


        {/* BAR CHART */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-lg font-semibold mb-4">
            Medicine Inventory Levels
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={stockChart}>

              <XAxis dataKey="name"/>

              <YAxis/>

              <Tooltip/>

              <Bar
                dataKey="quantity"
                fill="#3b82f6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* PIE CHART */}

        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-lg font-semibold mb-4">
            Stock Movement
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={movement}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >

                {movement.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </ManagerGuard>

  );

}