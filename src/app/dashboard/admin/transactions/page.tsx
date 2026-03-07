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
import { useState } from "react";
import { StockTransaction } from "@/lib/types";
import { cn } from "@/lib/utils"; 
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";      

const MOCK_TRANSACTIONS: StockTransaction[] = [
  { id: "1", equipmentId: "1", equipmentName: "M1 Abrams Optic", type: "IN", quantity: 5, reason: "Restock from HQ", performedBy: "Admin User", timestamp: "2024-05-20 10:30" },
  { id: "2", equipmentId: "4", equipmentName: "Level IV Plates", type: "OUT", quantity: 20, reason: "Field Deployment Sector 4", performedBy: "Admin User", timestamp: "2024-05-19 14:15" },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
   async function addTestTransaction() {
  await addDoc(collection(db, "transactions"), {
    equipmentName: "Test Equipment",
    quantity: 5,
    type: "IN",
    reason: "Testing Firebase",
    performedBy: "Admin",
    timestamp: new Date().toISOString(),
  });

  alert("Saved to Firestore!");
}
  const filtered = MOCK_TRANSACTIONS.filter((t) =>
    t.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
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
          {/* <button
  onClick={addTestTransaction}
  className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
>
  Add Test Transaction
</button> */}
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-700 hover:bg-blue-700">
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Equipment</TableHead>
                <TableHead className="text-white">Quantity</TableHead>
                <TableHead className="text-white">Reason</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((t) => (
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

                  <TableCell>{t.equipmentName}</TableCell>

                  <TableCell>
                    <Badge>
                      {t.type === "IN" ? "+" : "-"}
                      {t.quantity}
                    </Badge>
                  </TableCell>

                  <TableCell>{t.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}