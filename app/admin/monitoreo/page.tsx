"use client";

import dynamic from "next/dynamic";
import { Activity, Truck } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import GarbageTracking from "@/components/garbage-tracking/GarbageTracking";

const GarbageMap = dynamic(
  () => import("@/components/garbage-tracking/garbagMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-slate-100">
        Cargando mapa...
      </div>
    ),
  },
);

export default function MonitoringPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">
          Monitoreo en tiempo real
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Seguimiento de los vehículos recolectores.
        </p>
      </div>

      <div className="grid h-[calc(100vh-220px)] overflow-hidden w-full min-h-[600px] rounded-2xl border border-slate-200 bg-white">
        <GarbageTracking />
      </div>
    </AdminLayout >
  );
}