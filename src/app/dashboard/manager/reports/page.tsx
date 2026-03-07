"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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

/* ✅ Added Types */
type Product = {
  id: string;
  name?: string;
  quantity?: number;
  lowStockThreshold?: number;
};

type Transaction = {
  id: string;
  type?: string;
};

export default function ReportsPage() {

  /* ✅ Updated state types */
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0
  });

  useEffect(() => {

    const fetchData = async () => {

      const prodSnap = await getDocs(collection(db, "products"));
      const transSnap = await getDocs(collection(db, "transactions"));

      /* ✅ Cast Firestore data to Product type */
      const prodData: Product[] = prodSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">)
      }));

      const transData: Transaction[] = transSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Transaction, "id">)
      }));

      setProducts(prodData);
      setTransactions(transData);

      const totalProducts = prodData.length;

      const totalStock = prodData.reduce(
        (sum, p) => sum + (p.quantity || 0),
        0
      );

      const lowStock = prodData.filter(
        p => (p.quantity || 0) <= (p.lowStockThreshold || 0)
      ).length;

      setSummary({
        totalProducts,
        totalStock,
        lowStock
      });

    };

    fetchData();

  }, []);

  // Chart data
  const stockChart = products.map(p => ({
    name: p.name,
    quantity: p.quantity
  }));

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

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Total Equipment</h2>
            <p className="text-2xl font-bold">
              {summary.totalProducts}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Total Stock</h2>
            <p className="text-2xl font-bold">
              {summary.totalStock}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-gray-500">Low Stock Items</h2>
            <p className="text-2xl font-bold text-red-600">
              {summary.lowStock}
            </p>
          </div>

        </div>

        {/* Stock Chart */}
        <div className="bg-white p-6 rounded-lg shadow">

          <h2 className="text-lg font-semibold mb-4">
            Equipment Inventory Levels
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

        {/* Stock Movement */}
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