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
/*   SMART DEFENCE MOCK REPORT   */
/* ============================= */

const MOCK_REPORT = [
  {
    sku: "NVG-001",
    name: "Night Vision Goggles",
    category: "Optical Equipment",
    supplier: "DefTech Industries",
    current: 25,
    totalIn: 50,
    totalOut: 25,
  },
  {
    sku: "DRN-007",
    name: "Surveillance Drone X7",
    category: "Aerial Systems",
    supplier: "AeroDefense Corp",
    current: 12,
    totalIn: 20,
    totalOut: 8,
  },
  {
    sku: "RAD-450",
    name: "Portable Radar Unit",
    category: "Detection Systems",
    supplier: "SecureWave Technologies",
    current: 8,
    totalIn: 15,
    totalOut: 7,
  },
  {
    sku: "ARM-556",
    name: "Tactical Body Armor",
    category: "Protective Gear",
    supplier: "ShieldOps Ltd",
    current: 40,
    totalIn: 70,
    totalOut: 30,
  },
  {
    sku: "COM-900",
    name: "Encrypted Radio Device",
    category: "Communication Systems",
    supplier: "SignalSecure Pvt Ltd",
    current: 18,
    totalIn: 35,
    totalOut: 17,
  },
];

export default function AdminReportsPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filter, setFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [data] = useState(MOCK_REPORT);

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
      "SKU,Equipment Name,Category,Supplier,Current Stock,Total IN (Range),Total OUT (Range)\n";

    selectedData.forEach((row) => {
      csv += `${row.sku},${row.name},${row.category},${row.supplier},${row.current},${row.totalIn},${row.totalOut}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "defence-equipment-report.csv";
    link.click();
  };

  return (
    <div className="space-y-8 bg-slate-100 min-h-screen p-6">
      <Card className="shadow-xl rounded-2xl border-none bg-white">
        <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-blue-800">
            Defence Equipment Reports & Analytics
          </CardTitle>

          <div className="flex flex-wrap gap-4 items-end">
            {/* From Date */}
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

            {/* To Date */}
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

            {/* Sort */}
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

            {/* Search */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">
                Equipment Name(s)
              </label>
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg"
                placeholder="Search defence equipment..."
              />
            </div>

            {/* Download Button */}
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
                <TableRow className="bg-blue-700 hover:bg-blue-700 cursor-default">
                  <TableHead className="text-white font-bold text-lg">
                    Select
                  </TableHead>
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
                    Supplier
                  </TableHead>
                  <TableHead className="text-white font-bold text-lg">
                    Current Stock
                  </TableHead>
                  <TableHead className="text-white font-bold text-lg">
                    Total IN (Range)
                  </TableHead>
                  <TableHead className="text-white font-bold text-lg">
                    Total OUT (Range)
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
                      No defence equipment found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-slate-100 transition-colors"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.sku)}
                          onChange={() => toggleRow(row.sku)}
                        />
                      </TableCell>
                      <TableCell>{row.sku}</TableCell>
                      <TableCell className="font-medium">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.supplier}</TableCell>
                      <TableCell>{row.current}</TableCell>
                      <TableCell>{row.totalIn}</TableCell>
                      <TableCell>{row.totalOut}</TableCell>
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