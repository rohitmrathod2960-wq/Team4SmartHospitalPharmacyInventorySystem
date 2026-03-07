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
    sku: "ARM-556",
    name: "Tactical Body Armor",
    category: "Protective Gear",
    quantity: 40,
    type: "IN",
    date: "2026-02-20",
  },
  {
    sku: "DRN-007",
    name: "Surveillance Drone X7",
    category: "Aerial Systems",
    quantity: 3,
    type: "OUT",
    date: "2026-02-22",
  },
  {
    sku: "RAD-450",
    name: "Portable Radar Unit",
    category: "Detection Systems",
    quantity: 5,
    type: "IN",
    date: "2026-02-23",
  },
];

export default function StockManagementPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [data, setData] = useState(MOCK_STOCK);

  /* ============================= */
  /*         STOCK IN FUNCTION     */
  /* ============================= */

  const handleStockIn = () => {
    if (!search) {
      alert("Search equipment name first");
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
    updated[itemIndex].quantity += 1;
    updated[itemIndex].type = "IN";
    updated[itemIndex].date = new Date().toISOString().split("T")[0];

    setData(updated);
  };

  /* ============================= */
  /*        STOCK OUT FUNCTION     */
  /* ============================= */

  const handleStockOut = () => {
    if (!search) {
      alert("Search equipment name first");
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
    updated[itemIndex].quantity -= 1;
    updated[itemIndex].type = "OUT";
    updated[itemIndex].date = new Date().toISOString().split("T")[0];

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
                Search Equipment
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
                    Equipment Name
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
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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