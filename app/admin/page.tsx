"use client";

import { Truck, Users, Route, MapPinned, Activity } from "lucide-react";

import Link from "next/link";

import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";

const vehicles = [
  {
    code: "CAM-001",
    plate: "EAB-245",
    driver: "Carlos Mendoza",
    route: "Sector 01 · Tambopata",
    status: "EN RUTA",
  },
  {
    code: "CAM-002",
    plate: "EBC-731",
    driver: "Luis Quispe",
    route: "Sector 03 · Tambopata",
    status: "EN RUTA",
  },
  {
    code: "CAM-003",
    plate: "EAC-512",
    driver: "José Flores",
    route: "Sector 05",
    status: "DETENIDO",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Dashboard</h1>

          <p className="mt-1 text-sm text-slate-400">
            Resumen general del sistema de monitoreo.
          </p>
        </div>

        <Link
          href="/admin/monitoreo"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
        >
          <MapPinned size={18} />
          Ver monitoreo
        </Link>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Vehículos"
          value="24"
          description="registrados"
          trend="+3"
          icon={Truck}
        />

        <StatCard
          title="En ruta"
          value="18"
          description="actualmente"
          trend="+12%"
          icon={Activity}
        />

        <StatCard
          title="Rutas"
          value="36"
          description="configuradas"
          trend="+4"
          icon={Route}
        />

        <StatCard
          title="Usuarios"
          value="42"
          description="registrados"
          trend="+5"
          icon={Users}
        />
      </div>

      {/* CONTENIDO */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* VEHÍCULOS */}
        <div className="rounded-2xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-800">
                Vehículos en operación
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Estado actual de los vehículos
              </p>
            </div>

            <Link
              href="/admin/vehiculos"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Ver todos
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.code}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                    🚛
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {vehicle.code}
                    </p>

                    <p className="text-xs text-slate-400">
                      {vehicle.plate} · {vehicle.driver}
                    </p>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-xs font-semibold text-slate-500">
                    {vehicle.route}
                  </p>

                  <span
                    className={`
                      mt-1 inline-flex rounded-full px-2 py-1
                      text-[10px] font-bold
                      ${
                        vehicle.status === "EN RUTA"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }
                    `}
                  >
                    {vehicle.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVIDAD */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-800">Actividad reciente</h2>
          </div>

          <div className="space-y-5 p-5">
            {[
              "CAM-001 inició recorrido",
              "Nueva ruta registrada",
              "Usuario registrado",
              "CAM-003 fue detenido",
              "Ruta Sector 05 actualizada",
            ].map((item, index) => (
              <div key={item} className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />

                <div>
                  <p className="text-sm font-medium text-slate-600">{item}</p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Hace {index + 1} horas
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
