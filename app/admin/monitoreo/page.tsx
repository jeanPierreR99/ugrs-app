"use client";

import dynamic from "next/dynamic";
import { Activity, Truck } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";

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

      <div className="grid h-[calc(100vh-220px)] min-h-[600px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[280px_1fr]">

        {/* VEHÍCULOS */}
        <aside className="overflow-y-auto border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <Activity
                size={18}
                className="text-emerald-600"
              />

              <p className="font-bold text-slate-700">
                Vehículos en ruta
              </p>
            </div>
          </div>

          {[
            ["CAM-001", "Carlos Mendoza", "32 km/h"],
            ["CAM-002", "Luis Quispe", "24 km/h"],
            ["CAM-004", "Jean Pierre", "12 km/h"],
          ].map(([code, driver, speed]) => (
            <button
              key={code}
              className="flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Truck
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700">
                  {code}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {driver}
                </p>
              </div>

              <span className="text-[10px] font-bold text-emerald-600">
                {speed}
              </span>
            </button>
          ))}
        </aside>

        {/* MAPA */}
        <div className="relative">
          <GarbageMap
            vehicles={[]}
            selectedVehicle={null}
            setSelectedVehicle={() => {}}
            setSheetExpanded={() => {}}
            userLocation={null}
            showRoutes={true}
          />

          <div className="absolute left-4 top-4 z-[500] rounded-xl bg-white px-4 py-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-xs font-bold text-slate-700">
                Sistema conectado
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}