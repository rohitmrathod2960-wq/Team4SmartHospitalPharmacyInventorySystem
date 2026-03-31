"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* 🔹 Firestore */
import { addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function pharmacistProductsPage() {

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.warn("No products found in the database.");
        setProducts([]);
        return;
      }

      const productList = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (!data.createdAt) {
          console.error(`Product ${doc.id} is missing 'createdAt' field.`);
        }
        return { id: doc.id, ...data };
      });

      setProducts(productList);
    }, (err) => console.error("Failed to load products", err));

    return () => {
      unsubscribe();
    };
  }, []);

  const requestItem = async (product: any) => {
    try {
      await addDoc(collection(db, "orders"), {
        items: [
          {
            medicineId: product.id,
            medicineName: product.medicineName || product.name,
            quantity: 1,
          },
        ],
        status: "pending",
        userId: "pharmacist",
        createdAt: serverTimestamp(),
      });
      alert("Request submitted for approval");
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    }
  };

  const getStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "text-red-600" };
    if (quantity <= 5) return { label: "Limited", color: "text-yellow-600" };
    return { label: "Available", color: "text-green-600" };
  };

    

  return (

    <div className="space-y-6 bg-[#f8fafc] min-h-screen p-4">

      <h1 className="text-3xl font-extrabold mb-4 text-gray-800 drop-shadow-sm">
        Medicine Catalog
      </h1>

      <Card className="shadow-2xl rounded-2xl border-none">

        <CardHeader className="pb-2">

          <CardTitle className="text-2xl font-bold text-gray-900">
            Available Medicine
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

                  const stockQty = product.quantity || product.qty || 0;
                  const status = getStatus(stockQty);

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
  {product.medicineName || product.name || "N/A"}
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