import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                {
                    message: "El userId es obligatorio.",
                },
                {
                    status: 400,
                }
            );
        }

        const vehicles = await prisma.vehicle.findMany({
            where: {
                drivers: {
                    some: {
                        driverId: userId,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                plate: true,
                status: true,
                position: true,
                routes: {
                    select: {
                        route: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                routePath: true,
                                color: true,
                                active: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(vehicles);
    } catch (error) {
        console.error("Error obteniendo vehículos del usuario:", error);

        return NextResponse.json(
            {
                message: "No se pudieron obtener los vehículos.",
            },
            {
                status: 500,
            }
        );
    }
}