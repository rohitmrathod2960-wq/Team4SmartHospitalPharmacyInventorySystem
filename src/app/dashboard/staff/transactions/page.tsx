"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn, formatUTCDateTime } from "@/lib/utils";

/* 🔹 FIREBASE */
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Activity = {
  id: string;
  type: "ISSUED" | "RETURNED" | "REQUESTED";
  item: string;
  status: "completed" | "pending" | "approved";
  date: string;
};

export default function pharmacistTransactionsPage() {

  const [activity, setActivity] = useState<Activity[]>([]);

  /* ============================= */
  /* FETCH pharmacist ACTIVITY          */
  /* ============================= */

  const fetchActivity = async () => {

    const result: Activity[] = [];

    /* ----------------------------- */
    /* ASSIGNED medicine → ISSUED  */
    /* ----------------------------- */

    const assignSnap = await getDocs(collection(db,"assignments"));

    assignSnap.forEach(doc => {

      const data:any = doc.data();

      data.items?.forEach((item:any) => {
   const issuedRaw = data.issuedDate?.toDate?.();
        result.push({
          id: doc.id,
          type: "ISSUED",
          item: item.medicineName,
          status: "completed",
          date: issuedRaw
  ? formatUTCDateTime(issuedRaw)
  : "Unknown"
        });

      });

    });


    /* ----------------------------- */
    /* RETURNS → RETURNED            */
    /* ----------------------------- */

    const returnSnap = await getDocs(collection(db,"returns"));

    returnSnap.forEach(doc => {

      const data:any = doc.data();
     const returnedRaw = data.returnedAt?.toDate?.();
      result.push({
        id: doc.id,
        type: "RETURNED",
        item: data.medicineName,
        status: "completed",
        
date: returnedRaw
  ? formatUTCDateTime(returnedRaw)
  : "Unknown"
      });

    });


    /* ----------------------------- */
    /* REQUESTS → REQUESTED          */
    /* ----------------------------- */

    const orderSnap = await getDocs(collection(db,"orders"));

    orderSnap.forEach(doc => {

      const data:any = doc.data();

      data.items?.forEach((item:any) => {
        const createdRaw = data.createdAt?.toDate?.();
        result.push({
          id: doc.id,
          type: "REQUESTED",
          item: item.medicineName,
          status: data.status || "pending",
           date: createdRaw
    ? formatUTCDateTime(createdRaw)
    : "Unknown"
        });

      });

    });

    /* ----------------------------- */
    /* SORT BY DATE (LATEST FIRST)   */
    /* ----------------------------- */

    // result.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setActivity(result);

  };

  useEffect(()=>{
    fetchActivity();
  },[]);


  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Medicine Activity
      </h1>

      {/* Card Container */}
      <Card className="shadow-lg rounded-2xl border bg-white">

        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Personal Activity
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto rounded-lg border">

            <Table>

              {/* Table Header */}
              <TableHeader>
                <TableRow className="bg-green-700 hover:bg-green-700">

                  <TableHead className="text-white font-semibold">
                    ID
                  </TableHead>

                  <TableHead className="text-white font-semibold">
                    Type
                  </TableHead>

                  <TableHead className="text-white font-semibold">
                    Item
                  </TableHead>

                  <TableHead className="text-white font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="text-white font-semibold">
                    Date
                  </TableHead>

                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody>

                {activity.map((act, index) => (

                  <TableRow
                    key={act.id}
                    className={cn(
                      "transition-colors",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      "hover:bg-green-50"
                    )}
                  >

                    <TableCell className="font-medium text-gray-700">
                      {index+1}
                    </TableCell>

                    {/* Type Badge */}
                    <TableCell>

                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          act.type === "ISSUED" && "bg-blue-100 text-blue-700",
                          act.type === "RETURNED" && "bg-purple-100 text-purple-700",
                          act.type === "REQUESTED" && "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {act.type}
                      </span>

                    </TableCell>

                    <TableCell className="text-gray-700">
                      {act.item}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>

                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          act.status === "completed" && "bg-green-100 text-green-700",
                          act.status === "approved" && "bg-green-100 text-green-700",
                          act.status === "pending" && "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        {act.status}
                      </span>

                    </TableCell>

                    <TableCell className="text-gray-600 text-sm">
                      {act.date}
                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>

  );

}