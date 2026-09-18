import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIO } from "@/lib/socket";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const {
            userId,
            vehicleId,
            routeId,
            lat,
            lng,
            speed,
            heading,
            accuracy,
            timestamp,
            appState,
        } = data;

        if (
            !userId ||
            !vehicleId ||
            !routeId ||
            typeof lat !== "number" ||
            typeof lng !== "number"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Datos de ubicación incompletos.",
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
                    where: {
                        driverId: userId,
                    },
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
            console.log("❌ Vehículo no encontrado");

            return NextResponse.json(
                {
                    success: false,
                    message: "Vehículo no encontrado.",
                },
                { status: 404 }
            );
        }

        const driverRelation = vehicle.drivers[0];

        if (!driverRelation) {
            console.log(
                "❌ El conductor no está asociado al vehículo."
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "El conductor no está asociado a este vehículo.",
                },
                { status: 403 }
            );
        }

        const driver = driverRelation.driver;

        const vehicleRoute = vehicle.routes[0];

        if (!vehicleRoute) {
            console.log(
                "❌ La ruta no está asignada al vehículo."
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "La ruta no está asignada al vehículo.",
                },
                { status: 400 }
            );
        }

        const route = vehicleRoute.route;

        if (vehicle.activeRouteId !== routeId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "El vehículo no tiene activa esta ruta.",
                },
                { status: 409 }
            );
        }

        if (vehicle.activeDriverId !== userId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "El vehículo ya está siendo utilizado por otro conductor.",
                },
                { status: 409 }
            );
        }

        if (vehicle.status !== "EN_RUTA") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "El vehículo no se encuentra actualmente en ruta.",
                },
                { status: 409 }
            );
        }

        const updatedVehicle = await prisma.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                position: `${lat},${lng}`,
            },
        });

        const monitoringVehicle = {
            id: updatedVehicle.id,
            code: updatedVehicle.id,
            routeId: route.id,
            plate: updatedVehicle.plate,
            driver: `${driver.name} ${driver.lastname}`,
            route: route.name,
            status: updatedVehicle.status,
            speed: speed ?? 0,
            position: [lat, lng] as [number, number],
            routePath: Array.isArray(route.routePath)
                ? route.routePath
                : [],
            updatedAt: timestamp ?? Date.now(),
            color: route.color,
            heading: heading ?? 0,
            accuracy: accuracy ?? null,
            appState: appState ?? null,
            activeRouteId: updatedVehicle.activeRouteId,
        };

        const io = getIO();

        if (io) {
            io.emit(
                "vehicle:position",
                monitoringVehicle
            );

        } else {
            console.log(
                "❌ Socket.IO NO está disponible."
            );
        }

        return NextResponse.json({
            success: true,
            vehicle: monitoringVehicle,
        });

    } catch (error) {
        console.error(
            "❌ Error procesando ubicación:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Error procesando la ubicación.",
            },
            { status: 500 }
        );
    }
}