import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const {
            userId,
            vehicleId,
            routeId,
        } = await request.json();

        if (!userId || !vehicleId || !routeId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Datos incompletos.",
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
                },

                routes: {
                    where: {
                        routeId,
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

        // Verificar que el conductor esté asignado
        if (vehicle.drivers.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "El conductor no está asociado a este vehículo.",
                },
                { status: 403 }
            );
        }

        // Verificar que la ruta esté asignada
        if (vehicle.routes.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "La ruta no está asignada al vehículo.",
                },
                { status: 400 }
            );
        }

        // =====================================================
        // CASO 1: EL VEHÍCULO YA ES DEL MISMO CONDUCTOR
        // =====================================================

        if (vehicle.activeDriverId === userId) {

            if (vehicle.activeRouteId !== routeId) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Ya tienes otra ruta activa con este vehículo.",
                    },
                    { status: 409 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "El vehículo ya está reservado para este conductor.",
            });
        }

        // =====================================================
        // CASO 2: OTRO CONDUCTOR YA LO TIENE
        // =====================================================

        if (
            vehicle.activeDriverId !== null ||
            vehicle.activeRouteId !== null
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "El vehículo ya está siendo utilizado por otro conductor.",
                },
                { status: 409 }
            );
        }

        // =====================================================
        // CASO 3: INTENTAR RESERVAR ATÓMICAMENTE
        // =====================================================

        const reservation = await prisma.vehicle.updateMany({
            where: {
                id: vehicleId,
                activeDriverId: null,
                activeRouteId: null,
            },
            data: {
                status: "EN_RUTA",
                activeDriverId: userId,
                activeRouteId: routeId,
            },
        });

        // =====================================================
        // OTRO CONDUCTOR GANÓ LA CARRERA
        // =====================================================

        if (reservation.count === 0) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "El vehículo acaba de ser ocupado por otro conductor.",
                },
                { status: 409 }
            );
        }

        // =====================================================
        // RESERVA EXITOSA
        // =====================================================

        return NextResponse.json({
            success: true,
            message: "Vehículo reservado correctamente.",
        });

    } catch (error) {

        console.error(
            "❌ Error reservando vehículo:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Error verificando la disponibilidad del vehículo.",
            },
            { status: 500 }
        );
    }
}