"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatUTCDateTime } from "@/lib/utils";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

type Transaction = {
  id: string;
  medicineName: string;
  quantity: number;
  type: "IN" | "OUT";
  createdAt: any;
};

export default function TransactionsPage() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /* ✅ REAL-TIME FETCH */
  useEffect(() => {

    const q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data: Transaction[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Transaction, "id">)
      }));

      setTransactions(data);

    });

    return () => unsubscribe();

  }, []);

  return (

    <ManagerGuard>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Medicine Transaction History
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left w-1/3">Medicine</th>
                <th className="p-4 text-center w-1/4">Movement</th>
                <th className="p-4 text-center w-1/6">Quantity</th>
                <th className="p-4 text-right w-1/4">Date</th>
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

                  const rawDate = t.createdAt?.toDate?.();
                  const date = rawDate
                    ? formatUTCDateTime(rawDate)
                    : "Unknown";

                  return (

                    <tr key={t.id} className="border-b hover:bg-gray-50">

                      {/* Medicine */}
                      <td className="p-4 font-medium text-left">
                        {t.medicineName || "N/A"}
                      </td>

                      {/* Movement */}
                      <td className="p-4 text-center">
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

                      {/* Quantity */}
                      <td className="p-4 text-center font-mono">
                        {t.quantity ?? 0}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-right text-sm text-gray-600">
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