"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { 
  Package, 
  Clock, 
  MapPin, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

import { 
  collection, 
  query, 
  onSnapshot,
  orderBy,
  getDocs
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { formatUTCDate, resolveName, resolveQuantity, resolveLowStockThreshold } from "@/lib/utils";

export default function pharmacistDashboard() {

  const router = useRouter();

  const [alerts,setAlerts] = useState<any[]>([]);
  const [myMedicine,setMyMedicine] = useState<any[]>([]);

 
/* -------------------------------------------------- */
/* Fetch Assigned medicine for pharmacist (FINAL FIX)     */
/* -------------------------------------------------- */

useEffect(()=>{

  const auth = getAuth();

  let unsubscribeSnapshot:any = null;

  const unsubscribeAuth = onAuthStateChanged(auth,(user)=>{

    if(!user) return;

    const q = query(
      collection(db,"assignments"),
      orderBy("createdAt","desc")
    );

    unsubscribeSnapshot = onSnapshot(
      q,
      (snap) => {

        const allData = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // ✅ FILTER BASED ON LOGGED IN USER
        const filtered = allData.filter((item:any) => {

          return (
            item.userId === user.uid ||
            item.userEmail === user.email
          );

        });

        setMyMedicine(filtered.slice(0,2));

      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

  });

  return ()=>{
    unsubscribeAuth();
    if(unsubscribeSnapshot) unsubscribeSnapshot();
  };

},[]);


/* -------------------------------------------------- */
/* AUTO GENERATE LOW STOCK ALERTS                    */
/* -------------------------------------------------- */

useEffect(()=>{

  const fetchLowStockAlerts = async ()=>{

    const snap = await getDocs(collection(db,"products"));

    const products = snap.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }));

    const filtered = products.filter((p:any)=>{

      const quantity = resolveQuantity(p);
      const threshold = resolveLowStockThreshold(p);

      return quantity <= threshold;

    });

    const alertsData = filtered.map((p:any)=>{

      const quantity = resolveQuantity(p);
      const threshold = resolveLowStockThreshold(p);

      return {
        id:p.id,
        medicineName:resolveName(p),
        quantity:quantity,
        threshold:threshold,
        message:"Stock level below threshold. Please notify inventory manager."
      }

    });

    setAlerts(alertsData);

  };

  fetchLowStockAlerts();

},[]);



  return (
    <DashboardLayout role="pharmacist" title="Personal Portal">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          {/* Assigned medicine
          <section>

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-2xl font-bold tracking-tight">
                Assigned Medicine
              </h2>

              <Button
                variant="link"
                className="text-primary font-semibold p-0"
                onClick={()=>router.push("/dashboard/staff/assigned-medicine")}
              >
                View All
              </Button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {myMedicine.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No assigned medicine
                </p>
              )}

              {myMedicine.map((item:any) => (

                <Card
                  key={item.id}
                  className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group"
                >

                  <CardContent className="p-0">

                    <div className="h-2 bg-emerald-500 w-full" />

                    <div className="p-6">

                      <div className="flex justify-between items-start">

                        <div className="bg-primary/10 p-2 rounded-xl">
                          <Package className="w-5 h-5 text-primary" />
                        </div>

                        <Badge
                          variant="secondary"
                          className="rounded-full text-[10px] uppercase"
                        >
                          IN USE
                        </Badge>

                      </div>

                      <h3 className="text-lg font-bold mt-4">
                        {item.medicineName}
                      </h3>

                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {item.serial || "SER-"+item.medicineId}
                      </p>

                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">

                        <div className="flex items-center gap-1">

                          <Clock className="w-3.5 h-3.5" />

                          <span>
                            Issued: {
                              item.createdAt?.toDate
                              ? formatUTCDate(item.createdAt.toDate())
                              : "-"
                            }
                          </span>

                        </div>

                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

                      </div>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

          </section> */}

          {/* Remaining code unchanged */}

          {/* <h2 className="text-2xl font-bold tracking-tight mb-4">
            Inventory Quick View
          </h2>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">

            <CardContent className="p-6 space-y-4">

              {[
                { name: 'NVGs Gen 3', available: 4, category: 'Optics' },
                { name: 'Ballistic Helmets', available: 12, category: 'Personal Gear' },
                { name: 'Satcom Transceiver', available: 2, category: 'Communication' },
              ].map((inv, i) => (

                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-sm font-bold">{inv.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{inv.category}</p>
                    </div>

                  </div>

                  <Badge
                    variant={inv.available > 5 ? 'secondary' : 'outline'}
                    className="rounded-lg"
                  >
                    {inv.available} Available
                  </Badge>

                </div>

              ))}

            </CardContent>

          </Card> */}

          {/* pharmacist Alert View */}
          <section>

            <h2 className="text-2xl font-bold tracking-tight mb-4 text-red-600">
              Low Stock Alerts
            </h2>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">

              <CardContent className="p-6 space-y-4">

                {alerts.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No active alerts
                  </p>
                )}

                {alerts.map((alert:any)=>(

                  <div
                    key={alert.id}
                    className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl"
                  >

                    <p className="text-sm font-bold text-red-800">
                      {alert.medicineName}
                    </p>

                    <p className="text-xs text-red-700 mt-1">
                      Available: {alert.quantity} | Threshold: {alert.threshold}
                    </p>

                    <p className="text-xs text-red-600 mt-1">
                      {alert.message}
                    </p>

                  </div>

                ))}

              </CardContent>

            </Card>

          </section>

        </div>

        {/* Right Side Panel (UNCHANGED) */}
        <div className="space-y-8">

          <Card className="border-none shadow-sm rounded-2xl bg-primary text-primary-foreground overflow-hidden">

            <CardHeader>
              <CardTitle className="text-lg">
                Location Context
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="flex items-center gap-3 mb-6">

                <div className="bg-white/20 p-3 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-bold">Base Sector 7G</p>
                  <p className="text-xs opacity-70">Main Deployment Hub</p>
                </div>

              </div>

              <div className="space-y-4">

                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-xs font-bold uppercase opacity-60">
                    Status
                  </p>

                  <p className="text-sm mt-1">
                    Operational - All units online
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          <Card className="border-none shadow-sm rounded-2xl">

            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Maintenance Alerts
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl">
                <p className="text-xs font-bold text-orange-800">
                  Radio RAD-012 Due
                </p>

                <p className="text-[10px] text-orange-700 mt-1">
                  Scheduled service in 3 days. Please return to armory by 20th.
                </p>

              </div>

              <p className="text-[10px] text-center text-muted-foreground italic">
                No other urgent maintenance required.
              </p>

            </CardContent>

          </Card>

        </div>

      </div>

    </DashboardLayout>
  );
}