"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';

import { 
  Package, 
  TrendingUp, 
  Wrench, 
  Users,
  Activity,
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  ClipboardCheck
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

import { 
  collection,
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function ManagerDashboard() {

  const [activity,setActivity] = useState<any[]>([]);

  const stats = [
    { label: 'Inventory Value', value: '$2.4M', icon: TrendingUp, colorClass: 'bg-emerald-50 text-emerald-600' },
    { label: 'Stock Items', value: '412', icon: Package, colorClass: 'bg-blue-50 text-blue-600' },
    { label: 'Service Pending', value: '12', icon: Wrench, colorClass: 'bg-orange-50 text-orange-600' },
    { label: 'Active Teams', value: '8', icon: Users, colorClass: 'bg-violet-50 text-violet-600' },
  ];

  const chartData = [
    { name: 'Injection', val: 230 },
    { name: 'Capsule', val: 420 },
    { name: 'Tablet', val: 600 },
    { name: 'Liquid', val: 250 },
    { name: 'Consumables', val: 1400 },
    { name: 'IV Fluid', val: 180 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  /* ====================================== */
  /* REALTIME OPERATION ACTIVITY FETCH      */
  /* ====================================== */

  useEffect(()=>{

    const q = query(
      collection(db,"transactions"),
      orderBy("createdAt","desc"),
      limit(5)
    );

    const unsub = onSnapshot(
      q,
      (snap)=>{

        const data = snap.docs.map(doc=>{

          const d:any = doc.data();

          return {
            id:doc.id,
            type:d.type,
            message:d.message,
            createdAt:d.createdAt
          }

        });

        setActivity(data);

      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

    return ()=>unsub();

  },[]);

  /* ====================================== */
  /* TIME FORMATTER (AUTO UPDATE TIME AGO)  */
  /* ====================================== */

  const getTimeAgo = (timestamp:any)=>{

    if(!timestamp) return "";

    const seconds = Math.floor(
      (Date.now() - timestamp.toDate().getTime())/1000
    );

    const minutes = Math.floor(seconds/60);
    const hours = Math.floor(minutes/60);

    if(minutes < 1) return "Just now";
    if(minutes < 60) return `${minutes} minutes ago`;
    if(hours < 24) return `${hours} hours ago`;

    return `${Math.floor(hours/24)} days ago`;

  };


  return (

    <DashboardLayout role="manager" title="Operations Management">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resource Dashboard
          </h1>

          <p className="text-muted-foreground mt-1">
            Oversee stock levels and operational readiness.
          </p>
        </div>

        <Link href="/dashboard/manager/maintenance">
          <Button className="rounded-xl shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90">
            Predictive AI Tool
            <Activity className="w-4 h-4 ml-2" />
          </Button>
        </Link>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">

          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>
              Stock distribution by medicine category.
            </CardDescription>
          </CardHeader>

          <CardContent className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />

                <Tooltip/>

                <Bar dataKey="val" radius={[8,8,0,0]} barSize={40}>
                  {chartData.map((entry,index)=>(
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

      </div>

      {/* ===================================== */}
      {/* DYNAMIC OPERATIONS ACTIVITY           */}
      {/* ===================================== */}

      <Card className="border-none shadow-sm rounded-2xl">

        <CardHeader>
          <CardTitle>Operations Activity</CardTitle>

          <CardDescription>
            Medicine issued, returned and approved requests
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

          {activity.map((item)=> (

            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-3"
            >

              <div className="flex items-center gap-3">

                {item.type === "IN" && (
                  <ArrowUpRight className="text-red-500 w-5 h-5"/>
                )}

                {item.type === "OUT" && (
                  <ArrowDownRight className="text-green-500 w-5 h-5"/>
                )}

                {item.type === "REQUEST" && (
                  <ClipboardCheck className="text-blue-500 w-5 h-5"/>
                )}

                <span className="font-medium">
                  {item.message}
                </span>

              </div>

              <span className="text-sm text-gray-500">
                {getTimeAgo(item.createdAt)}
              </span>

            </div>

          ))}

        </CardContent>

      </Card>

    </DashboardLayout>

  );

}