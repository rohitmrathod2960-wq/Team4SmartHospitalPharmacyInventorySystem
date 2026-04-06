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

/* 🔥 FIREBASE IMPORTS */
import { db } from "@/lib/firebase"; // make sure you have this
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export default function StockManagementPage() {

  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    quantity: "",
    reason: "",
    performedBy: "",
    date: "",
  });

  /* ============================= */
  /*     FETCH FROM FIRESTORE      */
  /* ============================= */

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ============================= */
  /*         STOCK IN LOGIC        */
  /* ============================= */

  const handleAddStock = async () => {

    if (!form.sku || !form.name || !form.quantity) {
      alert("Fill required fields");
      return;
    }

    const qty = parseInt(form.quantity);

    try {

      // 🔍 Check if product exists
      const q = query(
        collection(db, "products"),
        where("sku", "==", form.sku)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {

        // ✅ UPDATE EXISTING
        const existingDoc = snapshot.docs[0];
        const existingData = existingDoc.data();

        await updateDoc(doc(db, "products", existingDoc.id), {
          quantity: existingData.quantity + qty,
        });

      } else {

        // ➕ ADD NEW
        await addDoc(collection(db, "products"), {
          sku: form.sku,
          medicineName: form.name,
          category: form.category,
          quantity: qty,
          createdAt: new Date(),
        });

      }

      // 🔄 REFRESH DATA
      fetchProducts();

      // reset form
      setForm({
        sku: "",
        name: "",
        category: "",
        quantity: "",
        reason: "",
        performedBy: "",
        date: "",
      });

      setShowPanel(false);

    } catch (err) {
      console.error(err);
      alert("Error updating stock");
    }
  };

  /* ============================= */
  /*         FILTER SEARCH         */
  /* ============================= */

  const filtered = data.filter((item) =>
    item.medicineName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 bg-slate-100 min-h-screen p-6">

      <Card className="shadow-xl rounded-2xl border-none bg-white">

        <CardHeader className="flex justify-between items-center">

          <CardTitle className="text-2xl font-bold text-blue-800">
            Stock Management
          </CardTitle>

          <div className="flex gap-4">

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine..."
              className="w-64"
            />

            <Button
              onClick={() => setShowPanel(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              + Stock In
            </Button>

          </div>

        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow className="bg-blue-700">

                <TableHead className="text-white">SKU</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Category</TableHead>
                <TableHead className="text-white">Quantity</TableHead>
                <TableHead className="text-white">Reason</TableHead>
                <TableHead className="text-white">Performed By</TableHead>
                <TableHead className="text-white">Date</TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {filtered.map((item, index) => (
                <TableRow key={index}>

                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.medicineName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Stock Added</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    {item.createdAt?.seconds
                      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                      : "-"}
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      {/* ============================= */}
      {/*       STOCK IN PANEL          */}
      {/* ============================= */}

      {showPanel && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 z-50">

          <h2 className="text-xl font-bold mb-4">Stock In</h2>

          <div className="space-y-3">

            <Input placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm({...form, sku: e.target.value})}
            />

            <Input placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
            />

            <Input placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
            />

            <Input placeholder="Quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({...form, quantity: e.target.value})}
            />

            <Input placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({...form, reason: e.target.value})}
            />

            <Input placeholder="Performed By"
              value={form.performedBy}
              onChange={(e) => setForm({...form, performedBy: e.target.value})}
            />

            <Input type="date"
              value={form.date}
              onChange={(e) => setForm({...form, date: e.target.value})}
            />

            <div className="flex gap-2 pt-2">

              <Button
                variant="outline"
                onClick={() => setShowPanel(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-green-600 text-white"
                onClick={handleAddStock}
              >
                Save
              </Button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}