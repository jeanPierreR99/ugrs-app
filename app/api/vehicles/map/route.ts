import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const vehicleRoutes = await prisma.vehicleRoute.findMany({
            include: {
                vehicle: {
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
                    },
                },
                route: {
                    select: {
                        id: true,
                        name: true,
                        routePath: true,
                        color: true,
                    },
                },
            },
        });

        const vehicles = vehicleRoutes.map((vehicleRoute) => {
            const vehicle = vehicleRoute.vehicle;
            const route = vehicleRoute.route;

            const driver = vehicle.drivers[0]?.driver;

            const position: [number, number] | null = vehicle.position
                ? vehicle.position.split(",").map(Number) as [number, number]
                : null;

            return {
                id: vehicle.id,
                code: vehicle.id,
                plate: vehicle.plate,
                driver: driver
                    ? `${driver.name} ${driver.lastname} `
                    : "Sin conductor",
                route: route.name,
                status: vehicle.status,
                speed: 0,
                position,
                routePath: Array.isArray(route.routePath)
                    ? route.routePath
                    : [],
                updatedAt: vehicle.updatedAt
                    ? new Date(vehicle.updatedAt).getTime()
                    : Date.now(),
                color: route.color,
                heading: 0,
                accuracy: null,
                appState: null,
            };
        });

        return NextResponse.json(vehicles);
    } catch (error) {
        console.error("Error obteniendo vehículos para monitoreo:", error);

        return NextResponse.json(
            {
                success: false,
                message: "No se pudieron obtener los vehículos.",
            },
            { status: 500 },
        );
    }
}
