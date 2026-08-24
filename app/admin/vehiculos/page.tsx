import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import VehiclesTable from "./VehiclesTable";

export default async function VehiclesPage() {
  const [vehicles, drivers, routes] = await Promise.all([
    prisma.vehicle.findMany({
      select: {
        id: true,
        plate: true,
        status: true,
        drivers: {
          select: {
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
          select: {
            route: {
              select: {
                id: true,
                name: true,
                description: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.findMany({
      where: {
        role: "CONDUCTOR",
        status: true,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.route.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <AdminLayout>
      <VehiclesTable vehicles={vehicles} drivers={drivers} routes={routes} />
    </AdminLayout>
  );
}
