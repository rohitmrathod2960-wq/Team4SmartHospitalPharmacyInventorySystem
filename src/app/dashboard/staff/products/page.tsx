"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* 🔹 Firestore */
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StaffProductsPage() {

  const [products] = useState([
    { id: 1, name: "Standard Issue Radio", category: "Communication", qty: 18 },
    { id: 2, name: "Tactical Vest (L)", category: "Armor", qty: 12 },
    { id: 3, name: "NVGs Gen 3", category: "Optics", qty: 4 },
    { id: 4, name: "Ballistic Helmet", category: "Armor", qty: 12 },
    { id: 5, name: "Satcom Transceiver", category: "Communication", qty: 2 },
    { id: 6, name: "Level IV Plates", category: "Armor", qty: 150 },
    { id: 7, name: "Tactical Drone v4", category: "UAV", qty: 3 },
    { id: 8, name: "Night Vision Gen 3", category: "Optics", qty: 8 },
    { id: 9, name: "Field Medical Kit", category: "Medical", qty: 20 },
    { id: 10, name: "Combat Boots", category: "Gear", qty: 30 },
  ]);

  /* 🔹 Request Equipment */
  const requestItem = async (product: any) => {

    try {

      await addDoc(collection(db, "orders"), {

        items: [
          {
            productId: product.id,
            productName: product.name,
            quantity: 1,
          }
        ],

        status: "pending",
        userId: "staff1", // replace with logged in user later
        createdAt: Timestamp.now(),

      });

      alert("Request submitted for approval");

    } catch (err) {

      console.error(err);
      alert("Error submitting request");

    }

  };

  /* 🔹 Availability Status */
  const getStatus = (qty:number) => {

    if(qty === 0) return { label:"Out of Stock", color:"text-red-600" };
    if(qty <= 5) return { label:"Limited", color:"text-yellow-600" };
    return { label:"Available", color:"text-green-600" };

  };

  return (

    <div className="space-y-6 bg-[#f8fafc] min-h-screen p-4">

      <h1 className="text-3xl font-extrabold mb-4 text-gray-800 drop-shadow-sm">
        Equipment Catalog
      </h1>

      <Card className="shadow-2xl rounded-2xl border-none">

        <CardHeader className="pb-2">

          <CardTitle className="text-2xl font-bold text-gray-900">
            Available Equipment
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto rounded-xl">

            <Table>

              <TableHeader>

                <TableRow className="bg-green-700 hover:bg-green-700 cursor-default">

                  <TableHead className="text-white font-bold text-lg">
                    ID
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Item
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Category
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Availability
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Action
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {products.map((product, idx) => {

                  const status = getStatus(product.qty);

                  return(

                  <TableRow
                    key={product.id}
                    className={cn(
                      "transition-colors",
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50",
                      "hover:bg-green-50"
                    )}
                  >

                    <TableCell className="font-semibold text-gray-700">
                      {product.id}
                    </TableCell>

                    <TableCell className="text-gray-700">
                      {product.name}
                    </TableCell>

                    <TableCell className="text-gray-700">
                      {product.category}
                    </TableCell>

                    <TableCell className={cn("font-semibold",status.color)}>
                      {status.label}
                    </TableCell>

                    <TableCell>

                      <Button
                        disabled={product.qty === 0}
                        onClick={() => requestItem(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Request
                      </Button>

                    </TableCell>

                  </TableRow>

                )})}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>

  );

}