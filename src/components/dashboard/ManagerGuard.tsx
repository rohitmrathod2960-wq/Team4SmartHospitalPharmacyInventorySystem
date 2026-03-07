"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("user_session");

    if (!session) {
      router.replace("/auth/signin");
      return;
    }

    const user = JSON.parse(session);

    // ✅ FIX: redirect non-manager users to their correct dashboard
    if (user.role !== "manager") {
      if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user.role === "staff") {
        router.replace("/dashboard/staff");
      } else {
        router.replace("/auth/signin");
      }
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return <>{children}</>;
}