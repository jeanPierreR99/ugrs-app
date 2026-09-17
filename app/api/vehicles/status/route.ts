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

        const vehicleRoute = await prisma.vehicleRoute.findUnique({
            where: {
                vehicleId_routeId: {
                    vehicleId,
                    routeId,
                },
            },
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

        if (!vehicleRoute) {
            return NextResponse.json(
                {
                    success: false,
                    message: "El vehículo no tiene asignada esta ruta.",
                },
                { status: 404 }
            );
        }

        const vehicle = vehicleRoute.vehicle;
        const route = vehicleRoute.route;

        console.log("🚛 Vehículo encontrado:", {
            id: vehicle.id,
            plate: vehicle.plate,
        });

        const updatedVehicle = await prisma.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                status,
                activeRouteId: status === "EN_RUTA" ? routeId : null,
                position: `${-12.593664},${-69.176848}`,
            },
        });

        const driver = vehicle.drivers[0]?.driver;

        const monitoringVehicle = {
            id: updatedVehicle.id,
            code: updatedVehicle.id,
            plate: updatedVehicle.plate,
            driver: driver
                ? `${driver.name} ${driver.lastname}`
                : "Sin conductor",
            route: route.name,
            routeId: route.id,
            status: updatedVehicle.status,
            speed: 0,
            position: [
                -12.593664,
                -69.176848,
            ] as [number, number],
            routePath: Array.isArray(route.routePath)
                ? route.routePath
                : [],
            updatedAt: Date.now(),
            color: route.color,
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