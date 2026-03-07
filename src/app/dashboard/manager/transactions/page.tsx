"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

type Transaction = {
  id: string;
  productName: string;
  quantity: number;
  type: "IN" | "OUT";
  timestamp: any;
};

export default function TransactionsPage() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {

    const q = query(
      collection(db, "transactions"),
      orderBy("timestamp", "desc")
    );

    const snap = await getDocs(q);

    const data: Transaction[] = snap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Transaction, "id">)
    }));

    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Equipment Transaction History
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>
                <th className="p-3 text-left">Equipment</th>
                <th>Movement</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>

            </thead>

            <tbody>

              {transactions.length === 0 ? (

                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    No transactions recorded
                  </td>
                </tr>

              ) : (

                transactions.map(t => {

                  const date = t.timestamp?.toDate
                    ? t.timestamp.toDate().toLocaleString()
                    : "Unknown";

                  return (

                    <tr key={t.id} className="border-b hover:bg-gray-50">

                      <td className="p-3 font-medium">
                        {t.productName || "Equipment"}
                      </td>

                      <td>

                        {t.type === "IN" ? (

                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                            Stock In
                          </span>

                        ) : (

                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                            Stock Out
                          </span>

                        )}

                      </td>

                      <td>
                        {t.quantity}
                      </td>

                      <td className="text-sm text-gray-600">
                        {date}
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