"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "manager") {
      router.replace("/dashboard/manager");
    } else if (role === "staff") {
      router.replace("/dashboard/staff");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Loading dashboard...</p>
    </div>
  );
}