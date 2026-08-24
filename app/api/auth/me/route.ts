import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("ugrs_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    message: "No autenticado",
                },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: payload.userId,
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                role: true,
                status: true,
            },
        });

        if (!user || !user.status) {
            return NextResponse.json(
                {
                    message: "Usuario no válido",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user,
        });
    } catch {
        return NextResponse.json(
            {
                message: "Sesión inválida o expirada",
            },
            { status: 401 }
        );
    }
}