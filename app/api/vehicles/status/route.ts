import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIO } from "@/lib/socket";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const {
            vehicleId,
            routeId,
            status,
        } = data;

        if (!vehicleId || !routeId || !status) {
            return NextResponse.json(
                {
                    success: false,
                    message: "vehicleId, routeId y status son obligatorios.",
                },
                { status: 400 }
            );
        }

        if (!["EN_RUTA", "DETENIDO", "FUERA_DE_SERVICIO"].includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Estado de vehículo no válido.",
                },
                { status: 400 }
            );
        }
        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: vehicleId,
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
                    where: {
                        routeId,
                    },
                    include: {
                        route: {
                            select: {
                                id: true,
                                name: true,
                                routePath: true,
                                color: true,
                            },
                        },
                    },
                },
            },
        });

        if (!vehicle) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vehículo no encontrado.",
                },
                { status: 404 }
            );
        }

        const vehicleRoute = vehicle.routes[0];

        if (!vehicleRoute) {
            return NextResponse.json(
                {
                    success: false,
                    message: "La ruta no está asignada al vehículo.",
                },
                { status: 400 }
            );
        }

        const updatedVehicle = await prisma.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                status,
                position: `${-12.593664},${-69.176848}`,
            },
        });

        const driver = vehicle.drivers[0]?.driver;

        const monitoringVehicle = {
            id: updatedVehicle.id,
            code: updatedVehicle.id,
            plate: updatedVehicle.plate,
            driver: driver
                ? `${driver.name} ${driver.lastname} `
                : "Sin conductor",
            route: vehicleRoute.route.name,
            status: updatedVehicle.status,
            speed: 0,
            position: [-12.593664, -69.176848] as [number, number],
            routePath: Array.isArray(vehicleRoute.route.routePath)
                ? vehicleRoute.route.routePath
                : [],
            updatedAt: Date.now(),
            color: vehicleRoute.route.color,
            heading: 0,
            accuracy: null,
            appState: null,
        };

        const io = getIO();

        if (io) {
            console.log("📡 Emitiendo vehicle:position...");

            io.emit("vehicle:position", monitoringVehicle);

            console.log("✅ Evento enviado por Socket.IO.");
        } else {
            console.log("❌ Socket.IO NO está disponible.");
        }

        return NextResponse.json({
            success: true,
            vehicle: monitoringVehicle,
        });
    } catch (error) {
        console.error("❌ Error actualizando estado:", error);

        return NextResponse.json(
            {
                success: false,
                message: "No se pudo actualizar el estado del vehículo.",
            },
            { status: 500 }
        );
    }
}

