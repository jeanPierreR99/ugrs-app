import { Truck, Users, Route, MapPinned, Activity } from "lucide-react";
import Link from "next/link";

import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    totalVehicles,
    totalRoutes,
    vehiclesInOperation,
    totalUsers,
    vehicles,
    recentRoutes,
  ] = await Promise.all([
    prisma.vehicle.count(),

    prisma.route.count(),

    prisma.vehicleRoute.findMany({
      where: {
        vehicle: {
          position: {
            not: null,
          },
          NOT: {
            position: "",
          },
        },
      },
      include: {
        vehicle: {
          select: {
            plate: true,
            position: true,
            status: true,
          },
        },
        route: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.user.count(),

    prisma.vehicle.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        drivers: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                lastname: true,
              },
            },
          },
        },
        routes: {
          include: {
            route: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),

    prisma.route.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),
  ]);

  console.log(vehiclesInOperation);
  return (
    <AdminLayout>
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Vehículos"
          value={String(totalVehicles)}
          description="registrados"
          icon={Truck}
        />

        <StatCard
          title="En ruta"
          value={vehiclesInOperation.length}
          description="actualmente"
          icon={Activity}
        />

        <StatCard
          title="Rutas"
          value={String(totalRoutes)}
          description="configuradas"
          icon={Route}
        />

        <StatCard
          title="Usuarios"
          value={String(totalUsers)}
          description="registrados"
          icon={Users}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
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
            {vehiclesInOperation.map((vehicle) => {
              return (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                      🚛
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        {vehicle.vehicle.plate}
                      </p>
                    </div>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-semibold text-slate-500">
                      {vehicle.vehicle.position ?? "-"}
                    </p>

                    <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                      {vehicle.vehicle.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {vehicles.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                No hay vehículos en oepración.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-800">Actividad reciente</h2>
          </div>

          <div className="space-y-5 p-5">
            {recentRoutes.map((route) => (
              <div key={route.id} className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />

                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Nueva ruta registrada: {route.name}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(route.createdAt).toLocaleString("es-PE")}
                  </p>
                </div>
              </div>
            ))}

            {recentRoutes.length === 0 && (
              <p className="text-sm text-slate-400">
                No hay actividad reciente.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
