import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import RoutesForm from "./RoutesForm";

interface RoutePoint {
  lat: number;
  lng: number;
}

export default async function RoutesPage() {
  const routes = await prisma.route.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
      active: true,
      routePath: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const formattedRoutes = routes.map((route) => ({
    ...route,
    routePath: Array.isArray(route.routePath)
      ? route.routePath.map((point) => ({
          lat: Number((point as { lat: number }).lat),
          lng: Number((point as { lng: number }).lng),
        }))
      : [],
  }));

  return (
    <AdminLayout>
      <RoutesForm routes={formattedRoutes} />
    </AdminLayout>
  );
}
