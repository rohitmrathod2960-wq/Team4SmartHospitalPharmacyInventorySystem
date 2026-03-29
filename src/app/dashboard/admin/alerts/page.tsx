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

  useEffect(() => {
    fetchLowStock();
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
          productName: product,
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

    <div className="bg-slate-100 min-h-screen p-6">

      <Card className="shadow-xl rounded-2xl border-none bg-white">

        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-700">
            Low Stock Alerts
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto rounded-xl">

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

  );

}