import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Credenciales incorrectas" },
                { status: 401 }
            );
        }

        if (!user.status) {
            return NextResponse.json(
                { message: "El usuario está deshabilitado" },
                { status: 403 }
            );
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {
            return NextResponse.json(
                { message: "Credenciales incorrectas" },
                { status: 401 }
            );
        }

        const token = await createToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json({
            message: "Login exitoso",
            token,
            user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            },
        });

        response.cookies.set({
            name: "ugrs_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Error en login:", error);

        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}