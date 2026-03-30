"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn, formatUTCDateTime } from "@/lib/utils";

import {
  collection,
  query,
  orderBy,
  onSnapshot,   // ✅ added
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Transaction = {
  id: string;
  medicineName: string;
  quantity: number;
  type: "IN" | "OUT";
  reason?: string;
  performedBy?: string;
  ipAddress?: string;
  createdAt: any;
};

export default function TransactionsPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /* -------------------------------------------------- */
  /* 🔥 REAL-TIME FETCH (DYNAMIC UPDATE)                */
  /* -------------------------------------------------- */

  useEffect(() => {

    const q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {

        const data: Transaction[] = snap.docs.map(doc => ({
        id: doc.id,   // ✅ unique ID from Firestore
        ...(doc.data() as Omit<Transaction, "id">)
      }));

      setTransactions(data);

    }, (error) => {
      console.error("Firestore listener error:", error);
    });

    return () => unsubscribe();

  }, []);

  /* -------------------------------------------------- */

  const filtered = transactions.filter((t) =>
    (t.medicineName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (

    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">

      <Card className="shadow-lg rounded-2xl border bg-white">

        <CardHeader className="border-b">

          <div className="flex justify-between items-center">

            <CardTitle className="text-xl font-semibold">
              Transaction History
            </CardTitle>

            <Input
              placeholder="Search transactions..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>

              <TableRow className="bg-blue-700 hover:bg-blue-700">

                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Medicine</TableHead>
                <TableHead className="text-white">Quantity</TableHead>
                <TableHead className="text-white">Reason</TableHead>
                <TableHead className="text-white">User</TableHead>
                {/* <TableHead className="text-white">IP Address</TableHead> */}
                <TableHead className="text-white">Timestamp</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filtered.length === 0 ? (

                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>

              ) : (

                filtered.map((t) => {

                  const date = t.createdAt?.toDate
                    ? formatUTCDateTime(t.createdAt.toDate())
                    : "Unknown";

                  return (

                    <TableRow key={t.id}>

                      <TableCell>

                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            t.type === "IN"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          )}
                        >

                          {t.type === "IN" ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}

                        </div>

                      </TableCell>

                      <TableCell>{t.medicineName || "-"}</TableCell>

                      <TableCell>

                        <Badge>
                          {t.type === "IN" ? "+" : "-"}
                          {t.quantity || 0}
                        </Badge>

                      </TableCell>

                      <TableCell>{t.reason || "N/A"}</TableCell>

                      <TableCell className="flex items-center gap-2">

                        <User className="w-4 h-4 text-gray-500" />
                        {t.performedBy || "System"}

                      </TableCell>

                      <TableCell>{date}</TableCell>

                    </TableRow>

                  );

                })

              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

    </div>

  );
}