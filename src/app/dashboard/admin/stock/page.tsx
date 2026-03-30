"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
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

/* ============================= */
/*         MOCK STOCK DATA       */
/* ============================= */

const MOCK_STOCK = [
  {
    sku: "AMX-250",
    name: "Amoxicillin 250mg",
    category: "Capsule",
    quantity: 200,
    type: "IN",
    reason: "Supplier Delivery",
    performedBy: "Supplier",
    date: "2026-03-29",
  },
  {
    sku: "ASP-75",
    name: "Aspirin 75mg",
    category: "Tablet",
    quantity: 350,
    type: "IN",
    reason: "Issued to Unit",
    performedBy: "Supplier",
    date: "2026-03-29",
  },
  {
    sku: "BND-ROL",
    name: "Bandage Roll",
    category: "Consumables",
    quantity: 400,
    type: "IN",
    reason: "Supplier Delivery",
    performedBy: "Supplier",
    date: "2026-03-29",
  },
];

export default function StockManagementPage() {

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [reason, setReason] = useState("");
  const [performedBy, setPerformedBy] = useState("");

  const [data, setData] = useState(MOCK_STOCK);

  /* ============================= */
  /*         STOCK IN FUNCTION     */
  /* ============================= */

  const handleStockIn = () => {

    if (!search) {
      alert("Search medicine name first");
      return;
    }

    const itemIndex = data.findIndex((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    if (itemIndex === -1) {
      alert("Item not found");
      return;
    }

    const updated = [...data];

    updated[itemIndex] = {
      ...updated[itemIndex],
      quantity: updated[itemIndex].quantity + 1,
      type: "IN",
      reason: reason || "Supplier Delivery",
      performedBy: performedBy || "Admin",
      date: new Date().toISOString().split("T")[0],
    };

    setData(updated);
  };

  /* ============================= */
  /*        STOCK OUT FUNCTION     */
  /* ============================= */

  const handleStockOut = () => {

    if (!search) {
      alert("Search medicine name first");
      return;
    }

    const itemIndex = data.findIndex((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    if (itemIndex === -1) {
      alert("Item not found");
      return;
    }

    if (data[itemIndex].quantity <= 0) {
      alert("Stock cannot go below 0");
      return;
    }

    const updated = [...data];

    updated[itemIndex] = {
      ...updated[itemIndex],
      quantity: updated[itemIndex].quantity - 1,
      type: "OUT",
      reason: reason || "Issued to Unit",
      performedBy: performedBy || "Warehouse Officer",
      date: new Date().toISOString().split("T")[0],
    };

    setData(updated);
  };

  /* ============================= */
  /*         FILTER LOGIC          */
  /* ============================= */

  let filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filterType !== "ALL") {
    filtered = filtered.filter((item) => item.type === filterType);
  }

  return (
    <div className="space-y-8 bg-slate-100 min-h-screen p-6">

      <Card className="shadow-xl rounded-2xl border-none bg-white">

        <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <CardTitle className="text-2xl font-bold text-blue-800">
            Stock Management
          </CardTitle>

          <div className="flex flex-wrap gap-4 items-end">

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Search Medicine
              </label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stock..."
                className="rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Transaction Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="ALL">All</option>
                <option value="IN">Stock IN</option>
                <option value="OUT">Stock OUT</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Reason
              </label>
              <Input
                placeholder="Supplier delivery / Issued to unit"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Performed By
              </label>
              <select
                value={performedBy}
                onChange={(e) => setPerformedBy(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Admin">Admin</option>
                <option value="Warehouse Officer">Warehouse Officer</option>
              </select>
            </div>

            <Button
              onClick={handleStockIn}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              + Stock In
            </Button>

            <Button
              onClick={handleStockOut}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
            >
              - Stock Out
            </Button>

          </div>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto rounded-xl mt-4">

            <Table>

              <TableHeader>

                <TableRow className="bg-blue-700 hover:bg-blue-700">

                  <TableHead className="text-white font-bold text-lg">
                    SKU
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                     Name
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Category
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Quantity
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Type
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Reason
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Performed By
                  </TableHead>

                  <TableHead className="text-white font-bold text-lg">
                    Date
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {filtered.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No stock transactions found.
                    </TableCell>

                  </TableRow>

                ) : (

                  filtered.map((item, index) => (

                    <TableRow
                      key={index}
                      className="hover:bg-slate-100 transition-colors"
                    >

                      <TableCell>{item.sku}</TableCell>

                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>

                      <TableCell>{item.category}</TableCell>

                      <TableCell>{item.quantity}</TableCell>

                      <TableCell>
                        {item.type === "IN" ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            IN
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                            OUT
                          </span>
                        )}
                      </TableCell>

                      <TableCell>{item.reason}</TableCell>

                      <TableCell>{item.performedBy}</TableCell>

                      <TableCell>{item.date}</TableCell>

                    </TableRow>

                  ))

                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}