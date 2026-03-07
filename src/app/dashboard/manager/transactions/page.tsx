"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ManagerGuard from "@/components/dashboard/ManagerGuard";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "transactions"));
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchData();
  }, []);

  return (
    <ManagerGuard>
      <div>
        <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
        {transactions.map(t => (
          <div key={t.id} className="border p-3 mb-2 rounded">
            {t.type} — Qty: {t.quantity}
          </div>
        ))}
      </div>
    </ManagerGuard>
  );
}