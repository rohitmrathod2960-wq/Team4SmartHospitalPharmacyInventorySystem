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

/* ============================= */
/*   PHARMACY REPORT (DYNAMIC)    */
/* ============================= */

export default function AdminReportsPage() {

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filter, setFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);

  /* ============================= */
  /*   FETCH PRODUCTS FROM DB      */
  /* ============================= */

  useEffect(() => {

    const fetchProducts = async () => {

      const snap = await getDocs(collection(db, "products"));

      const products = snap.docs.map(doc => {

        const p: any = doc.data();

        return {
          sku: p.sku,
          name: resolveName(p),
          category: p.category,
          supplier: p.supplier,
          current: p.quantity,
          totalIn: p.quantity,
          totalOut: 0,
          teamUsage: "N/A",
          maintenanceCost: 0,
          supplierPerformance: "On Time",
          agingDays: 0,
        };

      });

      setData(products);

    };

    fetchProducts();

  }, []);

  /* ============================= */
  /*        FILTER & SORT          */
  /* ============================= */

  let filtered =
    !filter.trim()
      ? [...data]
      : data.filter((row) =>
          row.name.toLowerCase().includes(filter.toLowerCase())
        );

  if (sortBy === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy === "current") {
    filtered.sort((a, b) => b.current - a.current);
  }

  /* ============================= */
  /*       MULTI SELECT LOGIC      */
  /* ============================= */

  const toggleRow = (sku: string) => {

    if (selectedRows.includes(sku)) {
      setSelectedRows(selectedRows.filter((id) => id !== sku));
    } else {
      setSelectedRows([...selectedRows, sku]);
    }

  };

  /* ============================= */
  /*        DOWNLOAD LOGIC         */
  /* ============================= */

  const handleDownload = () => {

    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    const selectedData =
      selectedRows.length === 0
        ? filtered
        : filtered.filter((row) => selectedRows.includes(row.sku));

    let csv =
      "SKU,Medicine Name,Category,Supplier,Current Stock,Total IN,Total OUT\n";

    selectedData.forEach((row) => {
      csv += `${row.sku},${row.name},${row.category},${row.supplier},${row.current},${row.totalIn},${row.totalOut}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "pharmacy-medicine-report.csv";
    link.click();
  };

  /* ============================= */
  /*     ANALYTICS CALCULATIONS    */
  /* ============================= */

  const mostIssued = [...data].sort((a, b) => b.totalOut - a.totalOut)[0] || {};

  const totalMaintenanceCost = data.reduce(
    (sum, item) => sum + (item.maintenanceCost || 0),
    0
  );

  const delayedSuppliers = data.filter(
    (item) => item.supplierPerformance === "Delayed"
  ).length;

  const agingItems = data.filter((item) => item.agingDays > 120).length;

  return (
    <div className="space-y-8 bg-slate-100 min-h-screen p-6">

      {/* EXISTING REPORT CARD */}

      <Card className="shadow-xl rounded-2xl border-none bg-white">

        <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <CardTitle className="text-2xl font-bold text-blue-800">
            Pharmacy Medicine Reports & Analytics
          </CardTitle>

          <div className="flex flex-wrap gap-4 items-end">

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                From Date
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                To Date
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border px-3 py-2"
              >
                <option value="name">Sort by Name</option>
                <option value="current">Sort by Current Stock</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Medicine Name(s)
              </label>
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg"
                placeholder="Search pharmacy medicine..."
              />
            </div>

            <Button
              onClick={handleDownload}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg"
            >
              Download Report
            </Button>

          </div>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto rounded-xl mt-4">

            <Table>

              <TableHeader>

                <TableRow className="bg-blue-700 hover:bg-blue-700">

                  <TableHead className="text-white">Select</TableHead>
                  <TableHead className="text-white">SKU</TableHead>
                  <TableHead className="text-white">Medicine Name</TableHead>
                  <TableHead className="text-white">Category</TableHead>
                  <TableHead className="text-white">Supplier</TableHead>
                  <TableHead className="text-white">Current Stock</TableHead>
                  <TableHead className="text-white">Total IN</TableHead>
                  <TableHead className="text-white">Total OUT</TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {filtered.map((row, idx) => (

                  <TableRow key={idx} className="hover:bg-slate-100">

                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.sku)}
                        onChange={() => toggleRow(row.sku)}
                      />
                    </TableCell>

                    <TableCell>{row.sku}</TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.supplier}</TableCell>
                    <TableCell>{row.current}</TableCell>
                    <TableCell>{row.totalIn}</TableCell>
                    <TableCell>{row.totalOut}</TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

      {/* NEW ANALYTICS SECTION */}

      <Card className="shadow-xl rounded-2xl border-none bg-white">

        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-800">
            Inventory Analytics Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Most Issued Medicine</p>
            <p className="text-lg font-semibold">{mostIssued?.name || "-"}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Maintenance Cost</p>
            <p className="text-lg font-semibold">${totalMaintenanceCost}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Supplier Delays</p>
            <p className="text-lg font-semibold">{delayedSuppliers}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Aging Inventory</p>
            <p className="text-lg font-semibold">{agingItems}</p>
          </div>

        </CardContent>

      </Card>

    </div>
  );
}