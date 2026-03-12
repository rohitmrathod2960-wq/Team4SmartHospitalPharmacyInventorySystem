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
    teamUsage: "Recon Team",
    maintenanceCost: 12000,
    supplierPerformance: "On Time",
    agingDays: 120,
  },
  {
    sku: "DRN-007",
    name: "Surveillance Drone X7",
    category: "Aerial Systems",
    supplier: "AeroDefense Corp",
    current: 12,
    totalIn: 20,
    totalOut: 8,
    teamUsage: "Drone Unit",
    maintenanceCost: 45000,
    supplierPerformance: "Delayed",
    agingDays: 90,
  },
  {
    sku: "RAD-450",
    name: "Portable Radar Unit",
    category: "Detection Systems",
    supplier: "SecureWave Technologies",
    current: 8,
    totalIn: 15,
    totalOut: 7,
    teamUsage: "Security Team",
    maintenanceCost: 18000,
    supplierPerformance: "On Time",
    agingDays: 210,
  },
  {
    sku: "ARM-556",
    name: "Tactical Body Armor",
    category: "Protective Gear",
    supplier: "ShieldOps Ltd",
    current: 40,
    totalIn: 70,
    totalOut: 30,
    teamUsage: "Infantry",
    maintenanceCost: 6000,
    supplierPerformance: "On Time",
    agingDays: 60,
  },
  {
    sku: "COM-900",
    name: "Encrypted Radio Device",
    category: "Communication Systems",
    supplier: "SignalSecure Pvt Ltd",
    current: 18,
    totalIn: 35,
    totalOut: 17,
    teamUsage: "Communication Unit",
    maintenanceCost: 9000,
    supplierPerformance: "Delayed",
    agingDays: 150,
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
      "SKU,Equipment Name,Category,Supplier,Current Stock,Total IN,Total OUT\n";

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

  /* ============================= */
  /*     ANALYTICS CALCULATIONS    */
  /* ============================= */

  const mostIssued = [...data].sort((a, b) => b.totalOut - a.totalOut)[0];

  const totalMaintenanceCost = data.reduce(
    (sum, item) => sum + item.maintenanceCost,
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
            Defence Equipment Reports & Analytics
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
                Equipment Name(s)
              </label>
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg"
                placeholder="Search defence equipment..."
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
                  <TableHead className="text-white">Equipment Name</TableHead>
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
            <p className="text-sm text-gray-500">Most Issued Equipment</p>
            <p className="text-lg font-semibold">{mostIssued.name}</p>
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