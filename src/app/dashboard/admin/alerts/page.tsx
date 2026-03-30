"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { resolveName } from "@/lib/utils";

export default function LowStockAlerts() {

  const [mailQty, setMailQty] = useState("1200");

  const [data, setData] = useState<any[]>([]);
  const [expiryData, setExpiryData] = useState<any[]>([]);

  /* ============================= */
  /* FETCH LOW STOCK PRODUCTS      */
  /* ============================= */

  const fetchLowStock = async () => {

    const snap = await getDocs(collection(db, "products"));

    const products = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filtered = products.filter((p:any) => {

      const quantity = p.quantity ?? p.qty ?? 0;
      const threshold = p.lowStockThreshold ?? p.lowStock ?? 5;

      return quantity <= threshold;

    });

    setData(filtered);

  };
  const fetchExpiryAlerts = async () => {
  const snap = await getDocs(collection(db, "products"));

  const today = new Date();
  const next3Days = new Date();
  next3Days.setDate(today.getDate() + 3);

  const products = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const filtered = products.filter((p: any) => {
    if (!p.expiryDate) return false;

    const expiry = p.expiryDate?.toDate
      ? p.expiryDate.toDate()
      : new Date(p.expiryDate);

    return expiry <= next3Days; // includes expired + upcoming
  });

  setExpiryData(filtered);
};

  useEffect(() => {
    fetchLowStock();
    fetchExpiryAlerts();
  }, []);
  

  /* ============================== */
  /* MAIL TRIGGER FUNCTION          */
  /* ============================== */

  const handleMailTrigger = async (
    product: string,
    quantity: number,
    supplier: string
  ) => {

    try {

      const response = await fetch("/api/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicineName: product,
          quantity: quantity,
          supplier: supplier,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Email Sent Successfully!");
      } else {
        alert("Failed to send email");
        console.error(result);
      }

    } catch (error) {

      console.error("Mail Trigger Error:", error);
      alert("Something went wrong while sending email");

    }

  };

  return (

    <div className="bg-slate-100 min-h-screen p-6 flex flex-col">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
      <div>
      <Card className="flex flex-col h-full">

        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-700">
            Low Stock Alerts
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">

          <div className="flex-1 overflow-auto">
          
            <Table>

              <TableHeader>

                <TableRow className="bg-red-700 hover:bg-red-700">

                  <TableHead className="text-white font-semibold">#</TableHead>
                  <TableHead className="text-white font-semibold">Product</TableHead>
                  <TableHead className="text-white font-semibold">Category</TableHead>
                  <TableHead className="text-white font-semibold">Supplier</TableHead>
                  <TableHead className="text-white font-semibold text-center">
                    Available Qty
                  </TableHead>
                  <TableHead className="text-white font-semibold text-center">
                    Mail Trigger
                  </TableHead>
                  <TableHead className="text-white font-semibold text-center">
                    Action
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {data.length === 0 ? (

                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No Low Stock Alerts
                    </TableCell>
                  </TableRow>

                ) : (

                  data.map((item, index) => {

                    const quantity = item.quantity ?? item.qty ?? 0;

                    return (

                      <TableRow
                        key={item.id}
                        className="hover:bg-red-50 transition"
                      >

                        <TableCell>{index + 1}</TableCell>

                        <TableCell className="font-medium">
                          {resolveName(item)}
                        </TableCell>

                        <TableCell>
                          {item.category}
                        </TableCell>

                        <TableCell>
                          {item.supplier}
                        </TableCell>

                        <TableCell className="text-center">
                          {quantity}
                        </TableCell>

                        <TableCell>

                          <div className="flex flex-col items-center gap-2">

                            <Input
                              type="number"
                              value={mailQty}
                              onChange={(e) => setMailQty(e.target.value)}
                              className="w-28 text-center"
                            />

                            <button
                              onClick={() =>
                                handleMailTrigger(
                                  resolveName(item),
                                  quantity,
                                  item.supplier
                                )
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                              Mail Trigger
                            </button>

                          </div>

                        </TableCell>

                        <TableCell className="text-center">

                          <Button className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-6">
                            Delete
                          </Button>

                        </TableCell>

                      </TableRow>

                    );

                  })

                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>
<div>
        <Card className="shadow-xl rounded-2xl border-none bg-white flex flex-col h-full">

          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-600">
              Expiry Alerts
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">

            {<div className="flex-1 overflow-auto rounded-xl">

  <Table>

    <TableHeader>
      <TableRow className="bg-orange-600 hover:bg-orange-600">

        <TableHead className="text-white">#</TableHead>
        <TableHead className="text-white">Product</TableHead>
        <TableHead className="text-white">Category</TableHead>
        <TableHead className="text-white">Supplier</TableHead>
        <TableHead className="text-white text-center">Expiry Date</TableHead>
        <TableHead className="text-white text-center">Status</TableHead>

      </TableRow>
    </TableHeader>

    <TableBody>

      {expiryData.length === 0 ? (

        // ✅ EMPTY STATE
        <TableRow>
          <TableCell colSpan={6} className="text-center py-6 text-gray-500">
            No Expiry Medicines 🚫
          </TableCell>
        </TableRow>

      ) : (

        expiryData.map((item, index) => {

          const expiry = item.expiryDate?.toDate
            ? item.expiryDate.toDate()
            : new Date(item.expiryDate);

          const today = new Date();
          const diffDays = Math.ceil(
            (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          const isExpired = diffDays < 0;

          return (

            <TableRow key={item.id} className="hover:bg-orange-50">

              <TableCell>{index + 1}</TableCell>

              <TableCell className="font-medium">
                {resolveName(item)}
              </TableCell>

              <TableCell>{item.category}</TableCell>

              <TableCell>{item.supplier}</TableCell>

              <TableCell className="text-center">
                {expiry.toLocaleDateString()}
              </TableCell>

              <TableCell className="text-center">

                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
                    isExpired
                      ? "bg-red-600"
                      : diffDays <= 3
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                >
                  {isExpired
                    ? "Expired"
                    : diffDays <= 3
                    ? "Expiring Soon"
                    : "Safe"}
                </span>

              </TableCell>

            </TableRow>

          );

        })

      )}

    </TableBody>

  </Table>

</div>}

          </CardContent>

        </Card>
      </div>

    </div>
    {/* GRID END */}

  </div>
);
  

}