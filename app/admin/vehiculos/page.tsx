"use client";

import {
  Plus,
  Search,
  MoreVertical,
  MapPinned,
  Pencil,
} from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";

const VEHICLES = [
  {
    code: "CAM-001",
    plate: "EAB-245",
    driver: "Carlos Mendoza",
    status: "EN RUTA",
    routes: 3,
  },
  {
    code: "CAM-002",
    plate: "EBC-731",
    driver: "Luis Quispe",
    status: "EN RUTA",
    routes: 2,
  },
  {
    code: "CAM-003",
    plate: "EAC-512",
    driver: "José Flores",
    status: "DETENIDO",
    routes: 4,
  },
  {
    code: "CAM-004",
    plate: "EX-B2",
    driver: "Jean Pierre",
    status: "EN RUTA",
    routes: 1,
  },
];

export default function VehiclesPage() {
  return (
    <AdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Vehículos
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Registra y administra los vehículos recolectores.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20">
          <Plus size={18} />
          Registrar vehículo
        </button>
      </div>

      <div className="mb-5 flex max-w-md items-center rounded-xl border border-slate-200 bg-white">
        <Search size={18} className="ml-3 text-slate-400" />

        <input
          placeholder="Buscar vehículo..."
          className="h-11 flex-1 bg-transparent px-3 text-sm outline-none"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {VEHICLES.map((vehicle) => (
          <div
            key={vehicle.code}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  🚛
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-800">
                    {vehicle.code}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {vehicle.plate}
                  </p>
                </div>
              </div>

              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Conductor
                </span>

                <span className="font-semibold text-slate-700">
                  {vehicle.driver}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Rutas asignadas
                </span>

                <span className="font-semibold text-slate-700">
                  {vehicle.routes}
                </span>
              </div>

              <div className="flex justify-between">
                <span
                  className={`
                    rounded-full px-3 py-1 text-[10px] font-bold
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

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                <Pencil size={15} />
                Editar
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700">
                <MapPinned size={15} />
                Monitorear
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}