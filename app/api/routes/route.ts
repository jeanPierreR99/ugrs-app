import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const routes = await prisma.route.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
            },
        });

        return NextResponse.json(routes);
    } catch (error) {
        console.error("Error obteniendo rutas:", error);

        return NextResponse.json(
            {
                message: "No se pudieron obtener las rutas.",
            },
            {
                status: 500,
            }
        );
    }
}